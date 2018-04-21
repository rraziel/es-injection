import {ApplicationContext} from './application-context';
import {ApplicationContextSettings} from './application-context-settings';
import {DefaultComponentFactory} from '../factory';
import {getComponentInfo, ComponentInfo} from '../metadata';
import {ClassConstructor, StereotypeUtils} from '../utils';

/**
 * Application context accepting annotated configuration classes as input
 */
class AnnotationConfigApplicationContext extends DefaultComponentFactory implements ApplicationContext {

    /**
     * Class constructor
     * @param applicationContextSettings Application context settings
     * @param configurationClasses       Configuration classes
     */
    constructor(applicationContextSettings: ApplicationContextSettings, ...configurationClasses: ClassConstructor<any>[]) {
        super(applicationContextSettings);
        this.register(...configurationClasses);
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
