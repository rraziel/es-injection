import {ComponentFactory} from '../factory';
import {ComponentRegistry} from '../registry';
import {ClassConstructor, ComponentClass} from '../utils';

/**
 * Application context
 */
abstract class ApplicationContext {

    /**
     * Register a component class
     * @param componentClass Component class
     * @param <T>            Component type
     */
    abstract registerComponentClass<T>(componentClass: ClassConstructor<T>): void;

    /**
     * Start the context
     * @return Promise that resolves once the context is started
     */
    abstract start(): Promise<void>;

    /**
     * Stop the context
     * @return Promise that resolves once the context is stopped
     */
    abstract stop(): Promise<void>;

    /**
     * Get a component
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Promise that resolves to the component instance
     */
    abstract getComponent<T>(componentClass: ComponentClass<T>): Promise<T>;

    /**
     * Get a component by name
     * @param componentName  Component name
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Promise that resolves to the component instance
     */
    abstract getComponentByName<T>(componentName: string, componentClass?: ComponentClass<T>): Promise<T>;

    /**
     * Get a list of components
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Promise that resolves to the list of component instances
     */
    abstract getComponents<T>(componentClass: ComponentClass<T>): Promise<Array<T>>;

    /**
     * Get a map of components where the key is the component name
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Promise that resolves to the map of component instances
     */
    abstract getNamedComponents<T>(componentClass: ComponentClass<T>): Promise<Map<string, T>>;

}

export {
    ApplicationContext
};
