import {ComponentClass} from '@es-injection/metadata';

/**
 * Map resolver
 * @param componentClass Component class
 * @param <T>            Component type
 * @return Promise that resolves to a map of instances
 */
type MapResolver = <T>(componentClass: ComponentClass<T>) => Promise<Map<string, T>>;

export {
    MapResolver
};
