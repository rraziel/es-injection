import {ClassConstructor} from '../utils';

/**
 * Component registry
 */
class ComponentRegistry {
    private static componentClasses: ClassConstructor<any>[] = [];

    /**
     * Register a component class
     * @param componentClass Component class
     * @param <T>            Component type
     */
    static registerComponentClass<T>(componentClass: ClassConstructor<T>): void {
        ComponentRegistry.componentClasses.push(componentClass);
    }

    /**
     * Get the list of registered component classes
     * @param filter Filter function
     * @return List of component classes
     */
    static getComponentClasses(filter: (componentClass: ClassConstructor<any>) => boolean): ClassConstructor<any>[] {
        return ComponentRegistry.componentClasses.filter(componentClass => filter(componentClass));
    }

}

export {
    ComponentRegistry
};
