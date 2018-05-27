import {ComponentRegistry} from './ComponentRegistry';
import {ClassConstructor, ComponentClass, TypeUtils} from '../utils';

/**
 * Default component registry
 */
class DefaultComponentRegistry extends ComponentRegistry {
    private readonly componentClasses: Set<ComponentClass<any>> = new Set<ComponentClass<any>>();
    private readonly componentsByName: Map<string, ClassConstructor<any>> = new Map<string, ClassConstructor<any>>();
    private readonly componentNamesByClass: Map<ClassConstructor<any>, string> = new Map<ClassConstructor<any>, string>();
    private readonly componentImplsByClass: Map<ComponentClass<any>, Set<ClassConstructor<any>>> = new Map<ComponentClass<any>, Set<ClassConstructor<any>>>();

    /**
     * Test whether the factory contains a component
     * @param componentName Component name
     * @return true if the factory contains the component
     */
    containsComponent(componentName: string): boolean {
        return this.componentsByName.has(componentName);
    }

    /**
     * Test whether the factory contains a component class
     * @param componentClass Component class
     * @param <T>            Component type
     * @return true if the factory contains the component class
     */
    containsComponentClass<T>(componentClass: ComponentClass<T>): boolean {
        return this.componentClasses.has(componentClass);
    }

    /**
     * Get a component's class
     * @param componentName Component name
     * @return Component class
     */
    getComponentClass(componentName: string): ClassConstructor<any> {
        return this.componentsByName.get(componentName);
    }

    /**
     * Get a component's name
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component name
     */
    getComponentName<T>(componentClass: ComponentClass<T>): string {
        return this.componentNamesByClass.get(componentClass as ClassConstructor<T>);
    }

    /**
     * Resolve a component class, i.e. get concrete component classes from a base class
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Resolved component classes
     */
    resolveComponentClass<T>(componentClass: ComponentClass<T>): Set<ClassConstructor<T>> {
        return this.componentImplsByClass.get(componentClass);
    }

    /**
     * Register a component
     * @param componentName  Component name
     * @param componentClass Component class
     * @param <T>            Component type
     */
    registerComponent<T>(componentName: string, componentClass: ClassConstructor<T>): void {
        let componentClassConstructor: ClassConstructor<T> = componentClass as ClassConstructor<T>;
        TypeUtils.getClasses(componentClass).forEach(baseComponentClass => this.registerBaseComponentClass(baseComponentClass, componentClass));
        this.componentsByName.set(componentName, componentClassConstructor);
        this.componentNamesByClass.set(componentClassConstructor, componentName);
    }

    /**
     * Register a base component class
     * @param baseComponentClass Base component class
     * @param componentClass     Component class
     * @param <T>                Component type
     */
    private registerBaseComponentClass<T>(baseComponentClass: ComponentClass<any>, componentClass: ClassConstructor<T>): void {
        let componentImplClasses: Set<ClassConstructor<any>> = this.componentImplsByClass.get(baseComponentClass);
        if (!componentImplClasses) {
            componentImplClasses = new Set<ClassConstructor<any>>();
            this.componentImplsByClass.set(baseComponentClass, componentImplClasses);
        }

        this.componentClasses.add(baseComponentClass);
        componentImplClasses.add(componentClass);
    }

}

export {
    DefaultComponentRegistry
};
