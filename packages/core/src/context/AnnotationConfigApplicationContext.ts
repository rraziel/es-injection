import {ApplicationContextSettings} from './ApplicationContextSettings';
import {DefaultApplicationContext} from './DefaultApplicationContext';
import {ComponentFactory} from '../factory';
import {ComponentRegistry} from '../registry';
import {ClassConstructor, ComponentInfo, getComponentInfo, TypeUtils} from '@es-injection/metadata';

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
    async registerConfiguration(...configurationClasses: Array<ClassConstructor<any>|Promise<ClassConstructor<any>>>): Promise<void> {
        for (const configurationClassOrPromise of configurationClasses) {
            await this.registerConfigurationClass(configurationClassOrPromise);
        }
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
                return;
            }
        } else {
            configurationClass = configurationClassOrPromise as ClassConstructor<T>;
        }

        const componentInfo: ComponentInfo = this.getConfigurationComponentInfo(configurationClass);

        this.componentRegistry.registerComponent(componentInfo.name, configurationClass);
        await this.registerImports(configurationClass, componentInfo);
        this.registerScannedComponents(configurationClass, componentInfo);
    }

    /**
     * Get component information for a configuration class, throwing an error if the component is unknown or not a configuration class
     * @param configurationClass Configuration class
     * @param <T>                Configuration type
     * @return Component information
     */
    private getConfigurationComponentInfo<T>(configurationClass: ClassConstructor<T>): ComponentInfo {
        const componentInfo: ComponentInfo|undefined = getComponentInfo(configurationClass);
        if (componentInfo === undefined || componentInfo.stereotype === undefined) {
            throw new Error(`class ${configurationClass.name} cannot be used as a configuration class as it lacks a @Configuration decorator`);
        }

        if (componentInfo.stereotype !== 'CONFIGURATION') {
            const stereotypeDecoratorName: string = `@${componentInfo.stereotype.charAt(0).toUpperCase()}${componentInfo.stereotype.substr(1).toLowerCase()}`;
            throw new Error(`class ${configurationClass.name} cannot be used as a configuration class as it has a ${stereotypeDecoratorName} a @Configuration decorator`);
        }

        return componentInfo;
    }

    /**
     * Register a configuration class' imported configuration
     * @param configurationClass Configuration class
     * @param componentInfo      Component information
     * @param <T>                Configuration type
     * @return Promise that resolves once the imports are registered
     */
    private async registerImports<T>(_configurationClass: ClassConstructor<T>, componentInfo: ComponentInfo): Promise<void> {
        for (const importedConfiguration of componentInfo.importedConfigurations) {
            await this.registerConfigurationClass(importedConfiguration);
        }
    }

    /**
     * Register a configuration class' scanned components
     * @param configurationClass Configuration class
     * @param componentInfo      Component information
     * @param <T>                Configuration type
     */
    private registerScannedComponents<T>(_configurationClass: ClassConstructor<T>, componentInfo: ComponentInfo): void {
        for (const scannedComponentClass of componentInfo.scannedComponents) {
            this.registerComponentClass(scannedComponentClass);
        }
    }

}

export {
    AnnotationConfigApplicationContext
};
