import {ApplicationContext} from './ApplicationContext';
import {ApplicationContextSettings} from './ApplicationContextSettings';
import {DefaultComponentFactory} from '../factory';
import {getComponentInfo, ComponentInfo} from '../metadata';
import {StereotypeUtils} from '../utils';
import {ClassConstructor} from 'es-decorator-utils';

/**
 * Application context accepting annotated configuration classes as input
 */
class AnnotationConfigApplicationContext extends DefaultComponentFactory implements ApplicationContext {

    /**
     * Class constructor
     * @param applicationContextSettings Application context settings
     * @param configurationClasses       Configuration classes
     */
    constructor(applicationContextSettings?: ApplicationContextSettings, ...configurationClasses: ClassConstructor<any>[]) {
        super(applicationContextSettings);
        this.register(...configurationClasses);
    }

    /**
     * Refresh the context
     * @return Promise that resolves once the context is refreshed
     */
    async refresh(): Promise<void> {
        // TODO: instantiate all configured components that are singletons
    }

    /**
     * Close the context
     * @return Promise that resolves once the context is closed
     */
    async close(): Promise<void> {
        // TODO: "destroy" (i.e. call @PreDestroy) for all instantiated beans
    }

    /**
     * Register configuration classes
     * @param configurationClasses Configuration classes
     */
    register(...configurationClasses: ClassConstructor<any>[]): void {
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

        this.registerComponentClass(configurationClass);
    }

}

export {
    AnnotationConfigApplicationContext
};
