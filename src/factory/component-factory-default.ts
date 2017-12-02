import {ComponentFactory} from './component-factory';
import {ClassConstructor, TypeUtils} from '../utils';
import {ComponentInfo, getComponentInfo, ScopeType} from '../metadata';

/**
 * Default component factory
 */
class DefaultComponentFactory implements ComponentFactory {
    private singletonComponents: Map<Function, Object> = new Map<Function, Object>();

    /**
     * Test whether the factory contains a component
     * @param componentName Component name
     * @return true if the factory contains the component
     */
    containsComponent(componentName: string): boolean {
        return false;
    }

    /**
     * Get a component
     * @param componentName  Component name or class
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instance
     */
    getComponent<T>(componentNameOrClass: ClassConstructor<T>|string, componentClass?: ClassConstructor<T>): T {
        let componentInstance: T;
        let componentName: string;
        let componentInfo: ComponentInfo;

        if (componentNameOrClass instanceof Function) {
            componentClass = componentNameOrClass;
        } else {
            componentName = componentNameOrClass;
        }

        componentInfo = getComponentInfo(componentClass);
        if (!componentInfo) {
            throw new Error('unknown component class ' + componentClass.name);
        }

        if (componentInfo.scope && componentInfo.scope as ScopeType === ScopeType.PROTOTYPE) {
            return this.newInstance(componentClass, componentInfo);
        }

        this.instantiateSingletonsIfNecessary(componentClass, componentInfo);

        return <T> this.singletonComponents.get(componentClass);
    }

    /**
     * Get a list of components
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instances
     */
    getComponents<T>(componentClass: ClassConstructor<T>): T[] {
        throw new Error('getComponents not implemented');
    }

    /**
     * Get a component's class
     * @param componentName Component name
     * @return Component class
     */
    getComponentClass(componentName: string): ClassConstructor<any> {
        return null;
    }

    /**
     * Register a component
     * @param component Component
     */
    registerComponent<T>(component: T): void {
        // TODO
    }

    /**
     * Register a component class
     * @param componentClass Component class
     * @param <T>            Component type
     */
    registerComponentClass<T>(componentClass: ClassConstructor<T>): void {
        // TODO
    }

    /**
     * Instantiate singletons if they have not been instantiated yet
     * @param componentClass Component class
     * @param componentInfo  Component info
     * @param <T>            Component type
     */
    private instantiateSingletonsIfNecessary<T>(componentClass: ClassConstructor<T>, componentInfo: ComponentInfo): void {
        let componentInstance: T = <T> this.singletonComponents.get(componentClass);
        if (componentInstance) {
            return;
        }

        if (componentInfo.implementations) {
            componentInfo.implementations.forEach(implementationClass => {
                console.log('implementation: ' + implementationClass.name);
                let implementationClassInfo: ComponentInfo = getComponentInfo(implementationClass);
                this.instantiateSingletonsIfNecessary(implementationClass, implementationClassInfo);
            });
        }

        if (componentInfo.stereotype !== undefined) {
            componentInstance = this.newInstance(componentClass, componentInfo);
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
    private newInstance<T>(componentClass: ClassConstructor<T>, componentInfo: ComponentInfo): T {
        let parameterClasses: ClassConstructor<any>[] = TypeUtils.getParameterClasses(componentClass);
        let componentInstance: T = TypeUtils.instantiateClass(componentClass, (requiredClass, parameterIndex) => {
            console.log('requires ' + requiredClass.name);
        });

        this.injectProperties(componentClass, componentInfo, componentInstance);
        this.injectMethods(componentClass, componentInfo, componentInstance);

        return componentInstance;
    }

    /**
     * Inject properties
     * @param componentClass    Component class
     * @param componentInfo     Component information
     * @param componentInstance Component instance
     * @param <T>               Component type
     */
    private injectProperties<T>(componentClass: ClassConstructor<T>, componentInfo: ComponentInfo, componentInstance: T): void {
        // TODO
    }

    /**
     * Inject methods
     * @param componentClass    Component class
     * @param componentInfo     Component information
     * @param componentInstance Component instance
     * @param <T>               Component type
     */
    private injectMethods<T>(componentClass: ClassConstructor<T>, componentInfo: ComponentInfo, componentInstance: T): void {
        // TODO
    }

}

export {
    DefaultComponentFactory
};
