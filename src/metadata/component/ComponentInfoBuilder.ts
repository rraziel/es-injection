import {ComponentInfo, getComponentInfo, setComponentInfo} from './ComponentInfo';
import {Condition} from '../Condition';
import {ScopeType} from '../ScopeType';
import {Stereotype} from '../Stereotype';
import {ClassConstructor, ComponentClass, TypeUtils} from '../../utils';

/**
 * Component information builder
 * @param <T> Component type
 */
class ComponentInfoBuilder<T> {
    private readonly componentClass: ComponentClass<T>;

    /**
     * Class constructor
     * @param componentClass Component class
     */
    private constructor(componentClass: ComponentClass<T>) {
        this.componentClass = componentClass;
        this.registerBaseClasses();
    }

    /**
     * Set the name
     * @param name Name
     * @return this
     */
    name(name: string): ComponentInfoBuilder<T> {
        return this.update(componentInfo => componentInfo.name = name);
    }

    /**
     * Set the stereotype
     * @param stereotype Stereotype
     * @return this
     */
    stereotype(stereotype: Stereotype): ComponentInfoBuilder<T> {
        return this.update(componentInfo => componentInfo.stereotype = stereotype);
    }

    /**
     * Set the scope
     * @param scope Scope
     * @return this
     */
    scope(scope: ScopeType): this {
        return this.update(componentInfo => componentInfo.scope = scope);
    }

    /**
     * Mark a property for injection
     * @param propertyName Property name
     * @return this
     */
    property(propertyName: string): this {
        return this.update(componentInfo => {
            componentInfo.properties = componentInfo.properties || [];
            componentInfo.properties.push(propertyName);
        });
    }

    /**
     * Set the scanned components
     * @param annotatedClasses Annotated component classes
     * @return this
     */
    componentScan(...annotatedClasses: Array<ClassConstructor<any>>): this {
        return this.update(componentInfo => {
            componentInfo.scannedComponents = componentInfo.scannedComponents || [];
            annotatedClasses.forEach(annotatedClass => {
                let annotatedClassInfo: ComponentInfo = getComponentInfo(annotatedClass);
                if (!annotatedClassInfo) {
                    throw new Error(`invalid @ComponentScan: class ${annotatedClass.name} is not a component class`);
                }

                componentInfo.scannedComponents.push(annotatedClass);
            });
        });
    }

    /**
     * Set the conditions on a component instantiation
     * @param conditions Conditions
     * @return this
     */
    conditional(...conditions: Condition[]): ComponentInfoBuilder<T> {
        return this.update(componentInfo => {
            componentInfo.conditions = componentInfo.conditions || [];
            componentInfo.conditions.push(...conditions);
        });
    }

    /**
     * Set the imported configuration classes
     * @param configurationClassesOrPromises List of annotated configuration classes or promises to configuration classes
     * @return this
     */
    import(...configurationClassesOrPromises: Array<ClassConstructor<any>|Promise<ClassConstructor<any>>>): this {
        return this.update(componentInfo => {
            componentInfo.importedConfigurations = componentInfo.importedConfigurations || [];
            configurationClassesOrPromises.forEach(configurationClassOrPromise => {
                if (!TypeUtils.isPromise(configurationClassOrPromise)) {
                    const configurationClass: ClassConstructor<any> = configurationClassOrPromise as ClassConstructor<any>;
                    const annotatedClassInfo: ComponentInfo = getComponentInfo(configurationClass);
                    if (!annotatedClassInfo || annotatedClassInfo.stereotype !== Stereotype.CONFIGURATION) {
                        throw new Error(`invalid @Import: class ${configurationClass.name} is not a configuration class`);
                    }
                }

                componentInfo.importedConfigurations.push(configurationClassOrPromise);
            });
        });
    }

    /**
     * Manipulate component information
     * @param callback Callback
     * @return this
     */
    private update(callback: (componentInfo: ComponentInfo) => void): this {
        return this.updateClass(this.componentClass, callback);
    }

    /**
     * Manipulate component information for a specific target
     * @param componentClass Component class
     * @param callback       Callback
     * @param <T2>           Component type
     * @return this
     */
    private updateClass<T2>(componentClass: ComponentClass<T2>, callback: (componentInfo: ComponentInfo) => void): this {
        let componentInfo: ComponentInfo = getComponentInfo(componentClass) || {};
        callback(componentInfo);
        setComponentInfo(componentClass, componentInfo);
        return this;
    }

    /**
     * Register base classes
     */
    private registerBaseClasses(): void {
        TypeUtils.getAncestors(this.componentClass).forEach(baseClass => this.registerBaseClass(baseClass)); // TODO: check this is not an abstract class
    }

    /**
     * Register a base class
     * @param baseClass Base class
     * @param <U>       Base type
     */
    private registerBaseClass<U>(baseClass: ComponentClass<U>): void {
        this.updateClass(baseClass, componentInfo => {
            componentInfo.implementations = componentInfo.implementations || [];
            componentInfo.implementations.push(this.componentClass as ClassConstructor<T>);
        });
    }

    /**
     * Get a component information builder for the specified class
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component information builder
     */
    static of<T>(componentClass: ComponentClass<T>): ComponentInfoBuilder<T> {
        return new ComponentInfoBuilder(componentClass);
    }

}

export {
    ComponentInfoBuilder
};
