import {ApplicationContext} from './ApplicationContext';
import {ApplicationContextSettings} from './ApplicationContextSettings';
import {Component} from '../decorators';
import {ComponentFactory, DefaultComponentFactory} from '../factory';
import {getComponentInfo, ComponentInfo} from '../metadata';
import {StereotypeUtils} from '../utils';
import {ClassConstructor} from 'es-decorator-utils';

/**
 * Application context accepting annotated configuration classes as input
 */
@Component
class AnnotationConfigApplicationContext extends ApplicationContext {
    private componentFactory: DefaultComponentFactory;

    /**
     * Class constructor
     * @param applicationContextSettings Application context settings
     * @param configurationClasses       Configuration classes
     */
    constructor(applicationContextSettings?: ApplicationContextSettings, ...configurationClasses: Array<ClassConstructor<any>>) {
        super();
        this.componentFactory = new DefaultComponentFactory(applicationContextSettings);
        this.componentFactory.registerComponent(this);
        this.register(...configurationClasses);
    }

    /**
     * Refresh the context
     * @return Promise that resolves once the context is refreshed
     */
    async refresh(): Promise<void> {
        await this.componentFactory.start();
    }

    /**
     * Close the context
     * @return Promise that resolves once the context is closed
     */
    async close(): Promise<void> {
        await this.componentFactory.stop();
    }

    /**
     * Test whether the factory contains a component
     * @param componentName Component name
     * @return true if the factory contains the component
     */
    containsComponent(componentName: string): boolean {
        return this.componentFactory.containsComponent(componentName);
    }

    /**
     * Get a component
     * @param componentName  Component name or class
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instance
     */
    async getComponent<T>(componentNameOrClass: ClassConstructor<T>|Function|string, componentClass?: ClassConstructor<T>|Function): Promise<T> {
        return this.componentFactory.getComponent(componentNameOrClass, componentClass);
    }

    /**
     * Get a list of components
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Promise that resolves to the list of component instances
     */
    getComponents<T>(componentClass: ClassConstructor<T>): Promise<Array<T>> {
        return this.componentFactory.getComponents(componentClass);
    }

    /**
     * Get a component's class
     * @param componentName Component name
     * @return Component class
     */
    getComponentClass(componentName: string): ClassConstructor<any> {
        return this.componentFactory.getComponentClass(componentName);
    }

    /**
     * Register configuration classes
     * @param configurationClasses Configuration classes
     */
    register(...configurationClasses: Array<ClassConstructor<any>>): void {
        configurationClasses.forEach(annotatedClass => this.registerAnnotatedClass(annotatedClass));
    }

    /**
     * Register an annotated class
     * @param configurationClass Configuration class
     */
    private registerAnnotatedClass<T>(configurationClass: ClassConstructor<T>): void {
        let componentInfo: ComponentInfo = getComponentInfo(configurationClass);
        if (!StereotypeUtils.isConfiguration(configurationClass)) {
            throw new Error('unable to register ' + configurationClass.name + ': not marked with @Configuration');
        }

        this.componentFactory.registerComponentClass(configurationClass);
    }

}

export {
    AnnotationConfigApplicationContext
};
