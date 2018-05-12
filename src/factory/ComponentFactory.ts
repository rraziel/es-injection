import {ClassConstructor} from 'es-decorator-utils';

/**
 * Component factory
 */
abstract class ComponentFactory {

    /**
     * Test whether the factory contains a component
     * @param componentName Component name
     * @return true if the factory contains the component
     */
    abstract containsComponent(componentName: string): boolean;

    /**
     * Get a component
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Promise that resolves to the component instance
     */
    abstract getComponent<T>(componentClass: ClassConstructor<T>): Promise<T>;

    /**
     * Get a component
     * @param componentName  Component name
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Promise that resolves to the component instance
     */
    abstract getComponent<T>(componentName: string, componentClass?: ClassConstructor<T>): Promise<T>;

    /**
     * Get a list of components
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Promise that resolves to the list of component instances
     */
    abstract getComponents<T>(componentClass: ClassConstructor<T>): Promise<Array<T>>;

    /**
     * Get a component's class
     * @param componentName Component name
     * @return Component class
     */
    abstract getComponentClass(componentName: string): ClassConstructor<any>;

}

export {
    ComponentFactory
};
