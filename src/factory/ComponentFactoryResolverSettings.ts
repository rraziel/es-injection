import {ClassConstructor, ComponentClass} from '../utils';

/**
 * Component factory resolver settings
 */
class ComponentFactoryResolverSettings {
    component: <T>(componentClass: ComponentClass<T>, componentName?: string) => Promise<T>;
    array: <T>(componentClass: ComponentClass<T>) => Promise<Array<T>>;
    map: <T>(componentClass: ComponentClass<T>) => Promise<Map<string, T>>;
    constant: <T>(constantName: string, expectedClass: ClassConstructor<T>) => Promise<T>;
}

export {
    ComponentFactoryResolverSettings
};
