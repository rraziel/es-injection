import {ComponentInfo, getComponentInfo, setComponentInfo} from './component-info';
import {ScopeType} from '../scope-type';
import {Stereotype} from '../stereotype';
import {ClassConstructor, TypeUtils} from '../../utils';

/**
 * Component information builder
 * @param <T> Component type
 */
class ComponentInfoBuilder<T> {
    private componentClass: ClassConstructor<T>;

    /**
     * Class constructor
     * @param componentClass Component class
     */
    private constructor(componentClass: ClassConstructor<T>) {
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
    scope(scope: ScopeType): ComponentInfoBuilder<T> {
        return this.update(componentInfo => componentInfo.scope = scope);
    }

    /**
     * Mark a method for injection
     * @param methodName Method name
     * @return this
     */
    method(methodName: string): ComponentInfoBuilder<T> {
        return this.update(componentInfo => {
            componentInfo.methods = componentInfo.methods || [];
            componentInfo.methods.push(methodName);
        });
    }

    /**
     * Mark a property for injection
     * @param propertyName Property name
     * @return this
     */
    property(propertyName: string): ComponentInfoBuilder<T> {
        return this.update(componentInfo => {
            componentInfo.properties = componentInfo.properties || [];
            componentInfo.properties.push(propertyName);
        });
    }

    /**
     * Set the scanned components
     * @param annotatedClasses Annotated component clases
     * @return this
     */
    componentScan(...annotatedClasses: ClassConstructor<any>[]): ComponentInfoBuilder<T> {
        return this.update(componentInfo => {
            componentInfo.scannedComponents = componentInfo.scannedComponents || [];
            annotatedClasses.forEach(annotatedClass => {
                let annotatedClassInfo: ComponentInfo = getComponentInfo(annotatedClass);
                if (!annotatedClassInfo) {
                    throw new Error(' invalid @ComponentScan: class ' + annotatedClass.name + ' is not a component');
                }

                componentInfo.scannedComponents.push(annotatedClass);
            });
        });
    }

    /**
     * Manipulate component information
     * @param callback Callback
     * @return this
     */
    private update(callback: (componentInfo: ComponentInfo) => void): ComponentInfoBuilder<T> {
        return this.updateClass(this.componentClass, callback);
    }

    /**
     * Manipulate component information for a specific target
     * @param componentClass Component class
     * @param callback       Callback
     * @param <T2>           Component type
     * @return this
     */
    private updateClass<T2>(componentClass: ClassConstructor<T2>, callback: (componentInfo: ComponentInfo) => void): ComponentInfoBuilder<T> {
        let componentInfo: ComponentInfo = getComponentInfo(componentClass) || {};
        callback(componentInfo);
        setComponentInfo(componentClass, componentInfo);
        return this;
    }

    /**
     * Register base classes
     */
    private registerBaseClasses(): void {
        TypeUtils.forEachBaseClass(this.componentClass, baseClass => this.registerBaseClass(baseClass));
    }

    /**
     * Register a base class
     * @param baseClass Base class
     * @param <U>       Base type
     */
    private registerBaseClass<U>(baseClass: ClassConstructor<U>): void {
        this.updateClass(baseClass, componentInfo => {
            componentInfo.implementations = componentInfo.implementations || [];
            componentInfo.implementations.push(this.componentClass);
        });
    }

    /**
     * Get a component information builder for the specified class
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component information builder
     */
    static of<T>(componentClass: ClassConstructor<T>): ComponentInfoBuilder<T> {
        return new ComponentInfoBuilder(componentClass);
    }

}

export {
    ComponentInfoBuilder
};
