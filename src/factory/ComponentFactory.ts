import {ComponentClass} from '../utils';

/**
 * Component factory
 */
abstract class ComponentFactory {

    /**
     * Create a new component instance
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Promise that resolves to a new component instance
     */
    abstract newInstance<T>(componentClass: ComponentClass<T>): Promise<T>;

}

export {
    ComponentFactory
};
