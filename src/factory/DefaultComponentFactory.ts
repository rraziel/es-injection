import {ComponentFactory} from './ComponentFactory';
import {ComponentFactorySettings} from './ComponentFactorySettings';
import {ComponentInfo, getComponentInfo, getMethodInfo, getPropertyInfo, MethodInfo, MethodParameterInfo, PropertyInfo, ScopeType} from '../metadata';
import {ClassConstructor, ComponentClass, InjectedProperty, InjectionTarget, InjectionUtils, InvocationUtils, OrderedElement, OrderUtils, TypeUtils} from '../utils';

/**
 * Default component factory
 */
class DefaultComponentFactory implements ComponentFactory {
    private singletonComponents: Map<Function, Object> = new Map<Function, Object>();
    private componentClasses: Set<ComponentClass<any>> = new Set<ComponentClass<any>>();
    private componentNames: Map<string, ClassConstructor<any>> = new Map<string, ClassConstructor<any>>();
    private componentFactorySettings: ComponentFactorySettings;

    /**
     * Class constructor
     * @param componentFactorySettings Component factory settings
     */
    constructor(componentFactorySettings?: ComponentFactorySettings) {
        this.componentFactorySettings = componentFactorySettings;
    }

    /**
     * Test whether the factory contains a component
     * @param componentName Component name
     * @return true if the factory contains the component
     */
    containsComponent(componentName: string): boolean {
        return this.componentNames.has(componentName);
    }

    /**
     * Get a component
     * @param componentName  Component name or class
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instance
     */
    async getComponent<T>(componentNameOrClass: ComponentClass<T>|string, componentClass?: ComponentClass<T>): Promise<T> {
        let componentName: string;

        if (componentNameOrClass instanceof Function) {
            componentClass = componentNameOrClass;
        } else {
            componentName = componentNameOrClass;
        }

        return await this.dispatchGetComponent(componentName, componentClass);
    }

    /**
     * Get a list of components
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instances
     */
    async getComponents<T>(componentClass: ComponentClass<T>): Promise<Array<T>> {
        let componentInfo: ComponentInfo = getComponentInfo(componentClass);
        let implementationClasses: Array<ClassConstructor<T>> = componentInfo.implementations;
        let promises: Array<Promise<T>>;

        if (!implementationClasses) {
            throw new Error('no implementation classes found for class ' + componentClass.name);
        }

        promises = implementationClasses
            .map(implementationClass => this.getComponent(implementationClass))
        ;

        return await Promise.all(promises);
    }

    /**
     * Get a component's class
     * @param componentName Component name
     * @return Component class
     */
    getComponentClass(componentName: string): ClassConstructor<any> {
        return this.componentNames.get(componentName);
    }

    /**
     * Register a component
     * @param component Component
     * @param <T>       Component type
     */
    registerComponent<T>(component: T): void {
        let componentClass: ClassConstructor<T> = Object.getPrototypeOf(component).constructor;
        TypeUtils.forEachClass(componentClass, typeClass => this.singletonComponents.set(typeClass, component));
        this.registerComponentClass(componentClass);
    }

    /**
     * Register a component class
     * @param componentClass Component class
     * @param <T>            Component type
     */
    registerComponentClass<T>(componentClass: ClassConstructor<T>): void {
        TypeUtils.forEachClass(componentClass, typeClass => this.componentClasses.add(typeClass));
    }

    /**
     * Start the factory, instantiating all registered singleton components
     */
    async start(): Promise<void> {
        // TODO
    }

    /**
     * Stop the factory, destroying all instantiated components
     */
    async stop(): Promise<void> {
        // TODO
    }

    /**
     * Get a component (implementation)
     * @param componentName  Component name
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instance
     */
    private async dispatchGetComponent<T>(componentName: string, componentClass: ComponentClass<T>): Promise<T> {
        this.validateRegisteredComponent(componentName, componentClass);

        let componentInfo: ComponentInfo = getComponentInfo(componentClass);
        if (!componentInfo) {
            throw new Error('unknown component class ' + componentClass.name + ' (no metadata)');
        }

        if ((componentInfo.scope as ScopeType) === ScopeType.PROTOTYPE) {
            return await this.getPrototypeComponent(componentName, componentClass, componentInfo);
        } else {
            return await this.getSingletonComponent(componentName, componentClass, componentInfo);
        }
    }

    /**
     * Test whether a component has been registered within the factory
     * @param componentName  Component name
     * @param componentClass Component class
     * @param <T>            Component type
     */
    private validateRegisteredComponent<T>(componentName: string, componentClass: ComponentClass<T>): void {
        if (!this.componentClasses.has(componentClass)) {
            throw new Error('unknown component class ' + componentClass.name + ' (unregistered)');
        }
    }

    /**
     * Get a prototype component
     * @param componentName  Component name
     * @param componentClass Component class
     * @param componentInfo  Component information
     * @param <T>            Component type
     * @return Component instance
     */
    private async getPrototypeComponent<T>(componentName: string, componentClass: ComponentClass<T>, componentInfo: ComponentInfo): Promise<T> {
        return await this.newInstance(componentClass, componentInfo);
    }

    /**
     * Get a singleton component
     * @param componentName  Component name
     * @param componentClass Component class
     * @param componentInfo  Component information
     * @param <T>            Component type
     * @return Component instance
     */
    private async getSingletonComponent<T>(componentName: string, componentClass: ComponentClass<T>, componentInfo: ComponentInfo): Promise<T> {
        let componentInstance: T;

        await this.instantiateSingletonsIfNecessary(componentClass, componentInfo); // TODO: move to refresh

        if (componentInfo.stereotype === undefined) {
            if (componentInfo.implementations.length > 1) {
                let availableImplementations: string[] = componentInfo.implementations.map(implementation => implementation.name);
                throw new Error('multiple component instances found for type ' + componentClass.name + ': ' + availableImplementations.join(', '));
            }

            componentInstance = await this.getComponent(componentName, componentInfo.implementations[0]);
        } else {
            componentInstance = <T> this.singletonComponents.get(componentClass);
        }

        if (componentInstance === undefined) {
            throw new Error('no component instance found for type ' + componentClass.name);
        }

        return componentInstance;
    }

    /**
     * Instantiate singletons if they have not been instantiated yet
     * @param componentClass Component class
     * @param componentInfo  Component info
     * @param <T>            Component type
     */
    private async instantiateSingletonsIfNecessary<T>(componentClass: ComponentClass<T>, componentInfo: ComponentInfo): Promise<void> {
        let componentInstance: T = <T> this.singletonComponents.get(componentClass);
        if (componentInstance) {
            return;
        }

        if (componentInfo.implementations) {
            let promises: Promise<void>[] = componentInfo.implementations.map(implementationClass => {
                let implementationClassInfo: ComponentInfo = getComponentInfo(implementationClass);
                return this.instantiateSingletonsIfNecessary(implementationClass, implementationClassInfo);
            });

            await Promise.all(promises);
        }

        if (componentInfo.stereotype !== undefined) {
            componentInstance = await this.newInstance(componentClass, componentInfo);
            this.singletonComponents.set(componentClass, componentInstance);
        }
    }

    /**
     * Create a new component instance
     * @param componentClass Component class
     * @param componentInfo  Component information
     * @param <T>            Component type
     * @return New component instance
     */
    private async newInstance<T>(componentClass: ComponentClass<T>, componentInfo: ComponentInfo): Promise<T> {
        interface ComponentIterationInfo {
            componentClass: ComponentClass<any>;
            componentInfo: ComponentInfo;
        }

        let componentInstance: T = await this.instantiateClass(componentClass);
        let componentIteratorInfos: Array<ComponentIterationInfo> = [{
            componentClass: componentClass,
            componentInfo: componentInfo
        }];

        TypeUtils.forEachAncestor(componentClass, baseComponentClass => {
            let baseComponentInfo: ComponentInfo = getComponentInfo(baseComponentClass);
            componentIteratorInfos.push({
                componentClass: baseComponentClass,
                componentInfo: baseComponentInfo
            });
        });

        for (let it of componentIteratorInfos.reverse()) {
            let target: InjectionTarget<T> = new InjectionTarget(it.componentClass, it.componentInfo, componentInstance);
            await this.prepareNewInstance(target);
        }

        return componentInstance;
    }

    /**
     * Prepare a new instance, injecting its properties and methods, then calling its post construction methods
     * @param target Injection target
     * @param <T>    Component type
     * @return Promise that resolves once the new instance is prepared
     */
    private async prepareNewInstance<T>(target: InjectionTarget<T>): Promise<void> {
        await this.injectProperties(target);
        await this.injectMethods(target);
        await this.callLifecycleMethods(target, methodInfo => methodInfo.postConstruct === true);
    }

    /**
     * Instantiate a component class
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instance
     */
    private async instantiateClass<T>(componentClass: ComponentClass<T>): Promise<T> {
        let constructorInfo: MethodInfo = getMethodInfo(componentClass);
        return await InjectionUtils.injectConstructor(componentClass, (requiredClass, parameterIndex) => this.resolveMethodDependency(constructorInfo, requiredClass, parameterIndex));
    }

    /**
     * Resolve a method dependency
     * @param methodInfo     Method information
     * @param requiredClass  Required class
     * @param parameterIndex Parameter index
     * @param <T>            Required type
     * @return Dependency instance
     */
    private async resolveMethodDependency<T>(methodInfo: MethodInfo, requiredClass: ComponentClass<T>, parameterIndex: number): Promise<T> {
        let methodParameterInfo: MethodParameterInfo = methodInfo && methodInfo.parameters && methodInfo.parameters[parameterIndex];

        try {
            if (TypeUtils.isArray(requiredClass)) {
                return this.resolveMethodArrayDependency(methodParameterInfo, requiredClass);
            } else {
                return this.resolveMethodInstanceDependency(methodParameterInfo, requiredClass);
            }
        } catch (e) {
            return this.buildUnresolvedMethodDependency(e, methodParameterInfo, requiredClass);
        }
    }

    /**
     * Resolve a constructor dependency instance
     * @param methodParameterInfo Method parameter information
     * @param requiredClass       Required class
     * @param <T>                 Required type
     * @return Dependency instance
     */
    private resolveMethodInstanceDependency<T>(methodParameterInfo: MethodParameterInfo, requiredClass: ComponentClass<T>): Promise<T> {
        return this.getComponent(methodParameterInfo && methodParameterInfo.name, requiredClass);
    }

    /**
     * Resolve a constructor dependency array
     * @param methodParameterInfo Method parameter information
     * @param requiredClass       Required class
     * @param <T>                 Required type
     * @return Dependency array instance
     */
    private resolveMethodArrayDependency<T>(methodParameterInfo: MethodParameterInfo, requiredClass: ComponentClass<T>): Promise<T> {
        if (!methodParameterInfo.elementClass) {
            throw new Error('injected array parameter without any element class information (missing @ElementClass decorator)');
        }

        return <any> this.getComponents(methodParameterInfo.elementClass);
    }

    /**
     * Build an unresolved constructor dependency
     * @param methodParameterInfo Method parameter information
     * @param requiredClass       Required class
     * @param <T>                 Required type
     * @return Unresolved dependency
     */
    private buildUnresolvedMethodDependency<T>(e: any, methodParameterInfo: MethodParameterInfo, requiredClass: ComponentClass<T>): T {
        if (!methodParameterInfo || !methodParameterInfo.optional) {
            throw e;
        }

        if (TypeUtils.isArray(requiredClass)) {
            return <any> [];
        }

        if (TypeUtils.isMap(requiredClass)) {
            return <any> {};
        }

        return undefined;
    }

    /**
     * Inject properties
     * @param target Target object
     * @param <T>    Component type
     * @return Promise that resolves once all properties have been injected
     */
    private async injectProperties<T>(target: InjectionTarget<T>): Promise<void> {
        if (!target.info.properties) {
            return;
        }

        let injectedProperties: Array<InjectedProperty> = OrderUtils.buildOrderedElementList(target.info.properties, propertyName => getPropertyInfo(target.class, propertyName))
            .map(orderedPropertyInfo => new InjectedProperty(orderedPropertyInfo.name, orderedPropertyInfo.info))
        ;

        for (let injectedProperty of injectedProperties) {
            await InjectionUtils.injectProperty(target, injectedProperty, (componentClass, componentName) => {
                if (componentName) {
                    return this.getComponent(componentName, componentClass);
                } else {
                    return this.getComponent(componentClass);
                }
            });
        }
    }

    /**
     * Inject methods
     * @param target Injection target
     * @param <T>    Component type
     * @return Promise that resolves once all injection methods have been called
     */
    private async injectMethods<T>(target: InjectionTarget<T>): Promise<void> {
        let orderedMethodInfos: Array<OrderedElement<MethodInfo>>;
        let methodNames: Array<string> = [];

        TypeUtils.forEachMethod(target.class, methodName => methodNames.push(methodName));

        orderedMethodInfos = OrderUtils.buildOrderedElementList(methodNames, methodName => getMethodInfo(target.class, methodName))
            .filter(sortedMethod => sortedMethod.info && !sortedMethod.info.postConstruct && !sortedMethod.info.preDestroy)
        ;

        for (let orderedMethodInfo of orderedMethodInfos) {
            await InjectionUtils.injectMethod(target, orderedMethodInfo.name, (parameterClass, parameterIndex) => this.resolveMethodDependency(orderedMethodInfo.info, parameterClass, parameterIndex));
        }
    }

    /**
     * Call lifecycle methods, i.e. annotated with @PostConstruct or @PreDestroy
     * @param target Injection target
     * @preturn Promise that resolves once all methods have been called
     */
    private async callLifecycleMethods<T>(target: InjectionTarget<T>, filter: (methodInfo: MethodInfo) => boolean): Promise<void> {
        let methodNames: Array<string> = [];

        TypeUtils.forEachMethod(target.class, methodName => methodNames.push(methodName));

        methodNames = OrderUtils.buildOrderedElementList(methodNames, methodName => getMethodInfo(target.class, methodName))
            .filter(sortedMethod => sortedMethod.info && filter(sortedMethod.info))
            .map(orderedMethodInfo => orderedMethodInfo.name)
        ;

        for (let methodName of methodNames) {
            await InvocationUtils.waitForResult(target.instance, methodName);
        }
    }

}

export {
    DefaultComponentFactory
};
