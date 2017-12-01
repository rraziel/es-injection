import {ApplicationContext, ClassConstructor} from './application-context';

/**
 * Default application context implementation
 */
class DefaultApplicationContext implements ApplicationContext {

    /**
     * Get a component
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instance
     */
    getComponent<T>(componentClass: ClassConstructor<T>): T {
        return undefined;
    }
    
}

export {
    DefaultApplicationContext
};
