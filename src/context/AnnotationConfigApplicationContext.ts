import {ApplicationContextSettings} from './ApplicationContextSettings';
import {DefaultApplicationContext} from './DefaultApplicationContext';
import {ComponentFactory} from '../factory';
import {getComponentInfo, ComponentInfo} from '../metadata';
import {ComponentRegistry} from '../registry';
import {ClassConstructor, StereotypeUtils, TypeUtils} from '../utils';

/**
 * Application context accepting annotated configuration classes as input
 */
class AnnotationConfigApplicationContext extends DefaultApplicationContext {

    /**
     * Class constructor
     * @param applicationContextSettings Application context settings
     * @param componentRegistry          Component registry
     * @param componentFactory           Component factory
     */
    constructor(applicationContextSettings?: ApplicationContextSettings, componentRegistry?: ComponentRegistry, componentFactory?: ComponentFactory) {
        super(applicationContextSettings, componentRegistry, componentFactory);
    }

    /**
     * Register configuration classes
     * @param configurationClasses Configuration classes
     */
    async registerConfiguration(...configurationClasses: Array<ClassConstructor<any>>): Promise<void> {
        configurationClasses.forEach(annotatedClass => this.registerConfigurationClass(annotatedClass));
    }

    /**
     * Register an annotated configuration class
     * @param configurationClassOrPromise Configuration class or promise that resolves to a configuration class
     * @param <T>                         Configuration type
     */
    private async registerConfigurationClass<T>(configurationClassOrPromise: ClassConstructor<T>|Promise<ClassConstructor<T>>): Promise<void> {
        let configurationClass: ClassConstructor<T>;

        if (TypeUtils.isPromise(configurationClassOrPromise)) {
            try {
                configurationClass = await (configurationClassOrPromise as Promise<ClassConstructor<T>>);
            } catch (e) {
                console.warn('Unable to register configuration class', e);
                return;
            }
        } else {
            configurationClass = configurationClassOrPromise as ClassConstructor<T>;
        }

        if (!StereotypeUtils.isConfiguration(configurationClass)) {
            throw new Error(`class ${configurationClass.name} cannot be used as a configuration class as it lacks a @Configuration decorator`);
        }

        const componentInfo: ComponentInfo = getComponentInfo(configurationClass);

        this.componentRegistry.registerComponent(componentInfo.name, configurationClass);
        this.registerImports(configurationClass, componentInfo);
        this.registerScannedComponents(configurationClass, componentInfo);
    }

    /**
     * Register a configuration class' imported configuration
     * @param configurationClass Configuration class
     * @param componentInfo      Component information
     * @param <T>                Configuration type
     */
    private registerImports<T>(configurationClass: ClassConstructor<T>, componentInfo: ComponentInfo): void {
        if (!componentInfo.importedConfigurations) {
            return;
        }

        componentInfo.importedConfigurations.forEach(importedConfiguration => this.registerConfigurationClass(importedConfiguration));
    }

    /**
     * Register a configuration class' scanned components
     * @param configurationClass Configuration class
     * @param componentInfo      Component information
     * @param <T>                Configuration type
     */
    private registerScannedComponents<T>(configurationClass: ClassConstructor<T>, componentInfo: ComponentInfo): void {
        if (!componentInfo.scannedComponents) {
            return;
        }

        componentInfo.scannedComponents.forEach(scannedComponentClass => this.registerComponentClass(scannedComponentClass));
    }

}

export {
    AnnotationConfigApplicationContext
};
