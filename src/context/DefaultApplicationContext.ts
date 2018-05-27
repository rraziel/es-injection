import {ApplicationContext} from './ApplicationContext';
import {ApplicationContextSettings} from './ApplicationContextSettings';
import {ApplicationContextState} from './ApplicationContextState';
import {ComponentFactory, DefaultComponentFactory} from '../factory';
import {ComponentInfo, getComponentInfo, ScopeType} from '../metadata';
import {ComponentRegistry, DefaultComponentRegistry} from '../registry';
import {ClassConstructor, ComponentClass} from '../utils';

/**
 * Default application context
 */
class DefaultApplicationContext extends ApplicationContext {
    private readonly singletonComponents: Map<ClassConstructor<any>, Object> = new Map<ClassConstructor<any>, Object>();
    private state: ApplicationContextState;

    protected readonly componentRegistry: ComponentRegistry;
    protected readonly componentFactory: ComponentFactory;
    protected readonly settings: ApplicationContextSettings;

    /**
     * Class constructor
     * @param applicationContextSettings Application context settings
     * @param componentRegistry          Component registry
     * @param componentFactory           Component factory
     */
    constructor(applicationContextSettings?: ApplicationContextSettings, componentRegistry?: ComponentRegistry, componentFactory?: ComponentFactory) {
        super();
        this.settings = applicationContextSettings || {};
        this.settings.resolvers = this.settings.resolvers || {
            array: componentClass => this.getComponents(componentClass),
            component: (componentClass, componentName) => this.resolveComponent(componentClass, componentName),
            constant: null,
            map: null
        };
        this.componentRegistry = componentRegistry ? componentRegistry : new DefaultComponentRegistry();
        this.componentFactory = componentFactory ? componentFactory : new DefaultComponentFactory(this.settings);
        this.state = ApplicationContextState.INITIALIZING;
    }

    /**
     * Register a component class
     * @param componentClass Component class
     * @param <T>            Component type
     */
    registerComponentClass<T>(componentClass: ClassConstructor<T>): void {
        if (this.state !== ApplicationContextState.INITIALIZING) {
            throw new Error(`class ${componentClass.name} cannot be registered after the context initialization phase`);
        }

        let componentInfo: ComponentInfo = getComponentInfo(componentClass);
        if (!componentInfo || componentInfo.stereotype === undefined) {
            throw new Error(`class ${componentClass.name} does not appear to be a component`);
        }

        this.componentRegistry.registerComponent(componentInfo.name, componentClass);
        if (!componentInfo.scope || componentInfo.scope === ScopeType.SINGLETON) {
            this.singletonComponents.set(componentClass, null);
        }
    }

    /**
     * Start the context
     * @return Promise that resolves once the context is started
     */
    async start(): Promise<void> {
        this.state = ApplicationContextState.STARTING;
        await this.instantiateSingletons();
        this.state = ApplicationContextState.STARTED;
    }

    /**
     * Stop the context
     * @return Promise that resolves once the context is stopped
     */
    async stop(): Promise<void> {
        this.state = ApplicationContextState.STOPPING;
        // TODO: call PreDestroy on all instances
        this.state = ApplicationContextState.STOPPED;
    }

    /**
     * Get a component
     * @param componentName  Component name or class
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instance
     */
    async getComponent<T>(componentClass: ComponentClass<T>): Promise<T> {
        if (this.state !== ApplicationContextState.STARTED && this.state !== ApplicationContextState.STARTING) {
            throw new Error(`unable to retrieve a ${componentClass.name} component: the context is not started`);
        }

        if (componentClass === ApplicationContext) {
            return this as any as T;
        }

        if (!this.componentRegistry.containsComponentClass(componentClass)) {
            throw new Error(`component class ${componentClass.name} has not been registered in this context`);
        }

        let componentName: string = this.componentRegistry.getComponentName(componentClass);
        if (!componentName) {
            componentClass = this.resolveSingleComponentClass(componentClass);
            componentName = this.componentRegistry.getComponentName(componentClass);
        }

        return this.doGetComponent(componentName, componentClass);
    }

    /**
     * Get a component by name
     * @param componentName  Component name
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Promise that resolves to the component instance
     */
    async getComponentByName<T>(componentName: string, componentClass?: ComponentClass<T>): Promise<T> {
        return this.doGetComponent(componentName, componentClass);
    }

    /**
     * Get a list of components
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Promise that resolves to the list of component instances
     */
    async getComponents<T>(componentClass: ComponentClass<T>): Promise<Array<T>> {
        if (!this.componentRegistry.containsComponentClass(componentClass)) {
            throw new Error(`component class ${componentClass.name} has not been registered in this context`);
        }

        let implementationClasses: Set<ClassConstructor<T>> = this.componentRegistry.resolveComponentClass(componentClass);
        let promises: Array<Promise<T>>;

        if (!implementationClasses) {
            throw new Error(`no implementation classes have been registered for class ${componentClass.name}`);
        }

        promises = Array.from(implementationClasses)
            .map(implementationClass => this.getComponent(implementationClass))
        ;

        return await Promise.all(promises);
    }

    /**
     * Get a component
     * @param componentName  Component name
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instance
     */
    private async doGetComponent<T>(componentName: string, componentClass: ComponentClass<T>): Promise<T> {
        let actualComponentClass: ComponentClass<T> = this.componentRegistry.getComponentClass(componentName);
        let componentInfo: ComponentInfo;

        if (!actualComponentClass) {
            throw new Error(`component ${componentName} has not been registered in this context`);
        }

        if (componentClass && componentClass !== actualComponentClass) {
            throw new Error(`component ${componentName}'s type is not ${componentClass} (actual class: ${actualComponentClass})`);
        }

        componentInfo = getComponentInfo(componentClass);
        if (componentInfo.scope === ScopeType.PROTOTYPE) {
            return await this.componentFactory.newInstance(componentClass);
        } else {
            return this.singletonComponents.get(componentClass as ClassConstructor<T>) as T;
        }
    }

    /**
     * Resolve a component
     * @param componentClass Component class
     * @param componentName  Component name
     * @param <T>            Component type
     * @return Promise that resolves to the component
     */
    private resolveComponent<T>(componentClass: ComponentClass<T>, componentName?: string): Promise<T> {
        if (componentName) {
            return this.getComponentByName(componentName, componentClass);
        } else {
            return this.getComponent(componentClass);
        }
    }

    /**
     * Resolve a single concrete component class, i.e. an implementation from a base class
     * @param componentClass Component class
     * @return Single concrete component class
     */
    private resolveSingleComponentClass<T>(componentClass: ComponentClass<T>): ClassConstructor<T> {
        let implementationClasses: Set<ClassConstructor<T>> = this.componentRegistry.resolveComponentClass(componentClass);
        if (implementationClasses && implementationClasses.size > 1) {
            let implementationClassNames: string = Array.from(implementationClasses).map(implementationClass => implementationClass.name).join(', ');
            throw new Error(`component class ${componentClass.name} has more than one registered implementation: ${implementationClassNames}`);
        }

        return implementationClasses && implementationClasses.values().next().value;
    }

    /**
     * Instantiate all singletons
     * @return Promise that resolves once all singletons have been instantiated
     */
    private async instantiateSingletons(): Promise<void> {
        for (let componentClass of this.singletonComponents.keys()) {
            await this.instantiateSingleton(componentClass);
        }
    }

    /**
     * Instantiate a singleton, if it has not already been instantiated
     * @param componentClass Component class
     * @param <T>            Component type
     */
    private async instantiateSingleton<T>(componentClass: ClassConstructor<T>): Promise<void> {
        let componentInstance: T = await this.componentFactory.newInstance(componentClass);
        this.singletonComponents.set(componentClass, componentInstance);
    }

}

export {
    DefaultApplicationContext
};
