import {ClassConstructor, Factory} from './factory';

/**
 * Default factory
 */
class DefaultFactory implements Factory {

    /**
     * Create an instance
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Instance
     */
    createInstance<T>(componentClass: ClassConstructor<T>): T {
        return null;
    }

}

export {
    DefaultFactory
};
