import {ComponentClass} from '@es-injection/metadata';

/**
 * Array resolver
 * @param componentClass Component class
 * @param <T>            Component type
 * @return Promise that resolves to an array of instances
 */
type ArrayResolver = <T>(componentClass: ComponentClass<T>) => Promise<Array<T>>;

export {
    ArrayResolver
};
