import {ClassConstructor} from '../ClassConstructor';
import {ComponentClass} from '../ComponentClass';
import {ComponentInfo} from './ComponentInfo';
import {getComponentInfo} from './getComponentInfo';
import {setComponentInfo} from './setComponentInfo';
import {Condition} from '../Condition';
import {ScopeType} from '../ScopeType';
import {TypeUtils} from '../TypeUtils';

/**
 * Component information builder
 * @param <T> Component type
 */
class ComponentInfoBuilder<T> {
    private static readonly STEREOTYPE_CONFIGURATION = 'CONFIGURATION';

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
    name(name: string): this {
        return this.update(componentInfo => componentInfo.name = name);
    }

    /**
     * Set the stereotype
     * @param stereotype Stereotype
     * @return this
     */
    stereotype(stereotype: string): this {
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
        return this.update(componentInfo => componentInfo.properties.push(propertyName));
    }

    /**
     * Set the scanned components
     * @param annotatedClasses Annotated component classes
     * @return this
     */
    componentScan(...annotatedClasses: Array<ClassConstructor<any>>): this {
        return this.update(componentInfo => {
            annotatedClasses.forEach(annotatedClass => {
                const annotatedClassInfo: ComponentInfo|undefined = getComponentInfo(annotatedClass);
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
    conditional(...conditions: Condition[]): this {
        return this.update(componentInfo => componentInfo.conditions.push(...conditions));
    }

    /**
     * Set the imported configuration classes
     * @param configurationClassesOrPromises List of annotated configuration classes or promises to configuration classes
     * @return this
     */
    import(...configurationClassesOrPromises: Array<ClassConstructor<any>|Promise<ClassConstructor<any>>>): this {
        return this.update(componentInfo => {
            configurationClassesOrPromises.forEach(configurationClassOrPromise => {
                let configurationClassPromise: Promise<ClassConstructor<any>>;

                if (!TypeUtils.isPromise(configurationClassOrPromise)) {
                    const configurationClass: ClassConstructor<any> = configurationClassOrPromise as ClassConstructor<any>;
                    const annotatedClassInfo: ComponentInfo|undefined = getComponentInfo(configurationClass);
                    if (!annotatedClassInfo || annotatedClassInfo.stereotype !== ComponentInfoBuilder.STEREOTYPE_CONFIGURATION) {
                        throw new Error(`invalid @Import: class ${configurationClass.name} is not a configuration class`);
                    }

                    configurationClassPromise = Promise.resolve(configurationClass);
                } else {
                    configurationClassPromise = configurationClassOrPromise as Promise<ClassConstructor<any>>;
                }

                componentInfo.importedConfigurations.push(configurationClassPromise);
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
        const componentInfo: ComponentInfo = getComponentInfo(componentClass) || new ComponentInfo();
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
        this.updateClass(baseClass, componentInfo => componentInfo.implementations.push(this.componentClass as ClassConstructor<T>));
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
