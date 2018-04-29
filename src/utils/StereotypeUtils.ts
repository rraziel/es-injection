import {getComponentInfo, ComponentInfo, Stereotype} from '../metadata';
import {ClassConstructor} from 'es-decorator-utils';

/**
 * Stereotype utility functions
 */
class StereotypeUtils {

    /**
     * Test whether a component has a component stereotype
     * @param componentClass Component class
     * @param <T>            Component type
     * @return true if the component has a component stereotype
     */
    static isComponent<T>(componentClass: ClassConstructor<T>): boolean {
        return StereotypeUtils.getStereotype(componentClass) === Stereotype.COMPONENT;
    }

    /**
     * Test whether a component has a configuration stereotype
     * @param componentClass Component class
     * @param <T>            Component type
     * @return true if the component has a configuration stereotype
     */
    static isConfiguration<T>(componentClass: ClassConstructor<T>): boolean {
        return StereotypeUtils.getStereotype(componentClass) === Stereotype.CONFIGURATION;
    }

    /**
     * Test whether a component has a controller stereotype
     * @param componentClass Component class
     * @param <T>            Component type
     * @return true if the component has a controller stereotype
     */
    static isController<T>(componentClass: ClassConstructor<T>): boolean {
        return StereotypeUtils.getStereotype(componentClass) === Stereotype.CONTROLLER;
    }

    /**
     * Test whether a component has a repository stereotype
     * @param componentClass Component class
     * @param <T>            Component type
     * @return true if the component has a repository stereotype
     */
    static isRepository<T>(componentClass: ClassConstructor<T>): boolean {
        return StereotypeUtils.getStereotype(componentClass) === Stereotype.REPOSITORY;
    }

    /**
     * Test whether a component has a service stereotype
     * @param componentClass Component class
     * @param <T>            Component type
     * @return true if the component has a service stereotype
     */
    static isService<T>(componentClass: ClassConstructor<T>): boolean {
        return StereotypeUtils.getStereotype(componentClass) === Stereotype.SERVICE;
    }

    /**
     * Get a component stereotype
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component stereotype
     */
    static getStereotype<T>(componentClass: ClassConstructor<T>): Stereotype {
        let componentInfo: ComponentInfo = getComponentInfo(componentClass);
        return componentInfo && componentInfo.stereotype;
    }

}

export {
    StereotypeUtils
};
