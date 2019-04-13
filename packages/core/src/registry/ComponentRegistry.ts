import {ClassConstructor, ComponentClass} from '@es-injection/metadata';

/**
 * Component registry
 */
abstract class ComponentRegistry {

    /**
     * Test whether the factory contains a component
     * @param componentName Component name
     * @return true if the factory contains the component
     */
    abstract containsComponent(componentName: string): boolean;

    /**
     * Test whether the factory contains a component class
     * @param componentClass Component class
     * @param <T>            Component type
     * @return true if the factory contains the component class
     */
    abstract containsComponentClass<T>(componentClass: ComponentClass<T>): boolean;

    /**
     * Get a component's class
     * @param componentName Component name
     * @return Component class
     */
    abstract getComponentClass(componentName: string): ClassConstructor<any>|undefined;

    /**
     * Get a component's name
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component name
     */
    abstract getComponentName<T>(componentClass: ComponentClass<T>): string|undefined;

    /**
     * Resolve a component class, i.e. get concrete component classes from a base class
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Resolved component classes
     */
    abstract resolveComponentClass<T>(componentClass: ComponentClass<T>): Set<ClassConstructor<T>>;

    /**
     * Register a component
     * @param componentName  Component name
     * @param componentClass Component class
     * @param <T>            Component type
     */
    abstract registerComponent<T>(componentName: string|undefined, componentClass: ClassConstructor<T>): void;

}

export {
    ComponentRegistry
};
