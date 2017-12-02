import {ClassConstructor} from '../utils';

/**
 * Component factory
 */
interface ComponentFactory {

    /**
     * Test whether the factory contains a component
     * @param componentName Component name
     * @return true if the factory contains the component
     */
    containsComponent(componentName: string): boolean;

    /**
     * Get a component
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instance
     */
    getComponent<T>(componentClass: ClassConstructor<T>): T;

    /**
     * Get a component
     * @param componentName  Component name
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instance
     */
    getComponent<T>(componentName: string, componentClass?: ClassConstructor<T>): T;

    /**
     * Get a list of components
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instances
     */
    getComponents<T>(componentClass: ClassConstructor<T>): T[];

    /**
     * Get a component's class
     * @param componentName Component name
     * @return Component class
     */
    getComponentClass(componentName: string): ClassConstructor<any>;

}

export {
    ClassConstructor,
    ComponentFactory
};
