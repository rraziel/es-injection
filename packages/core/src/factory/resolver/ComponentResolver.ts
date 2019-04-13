import {ComponentClass} from '@es-injection/metadata';

/**
 * Component resolver
 * @param componentClass Component class
 * @param componentName  Component name
 * @param <T>            Component type
 * @return Promise that resolves to the component instance
 */
type ComponentResolver = <T>(componentClass: ComponentClass<T>, componentName?: string) => Promise<T>;

export {
    ComponentResolver
};
