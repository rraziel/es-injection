import {getMethodInfo, MethodInfo, MethodParameterInfo, setMethodInfo} from './method-info';
import {ComponentInfoBuilder} from '../component';
import {ClassConstructor} from '../../utils';

/**
 * Method information builder
 */
class MethodInfoBuilder {
    private target: Object;
    private propertyKey: string|symbol;

    /**
     * Class constructor
     * @param target      Target
     * @param propertyKey Property key
     */
    private constructor(target: Object, propertyKey: string|symbol) {
        this.target = target;
        this.propertyKey = propertyKey;
    }

    /**
     * Mark the method for injection
     * @return this
     */
    inject(): MethodInfoBuilder {
        ComponentInfoBuilder.of(<ClassConstructor<any>> this.target.constructor).method(<string> this.propertyKey);
        return this.update(() => { /* empty */ });
    }

    /**
     * Set a parameter's element class
     * @param parameterIndex Parameter index
     * @param elementClass   Element class
     * @param <T>            Element type
     */
    elementClass<T>(parameterIndex: number, elementClass: ClassConstructor<T>): MethodInfoBuilder {
        return this.updateParameter(parameterIndex, methodParameterInfo => methodParameterInfo.elementClass = elementClass);
    }

    /**
     * Set a parameter name
     * @param parameterIndex Parameter index
     * @param parameterName  Parameter name
     * @return this
     */
    name(parameterIndex: number, parameterName: string): MethodInfoBuilder {
        return this.updateParameter(parameterIndex, methodParameterInfo => methodParameterInfo.name = parameterName);
    }

    /**
     * Set whether the dependency is optional
     * @param optional true if the dependency is optional
     * @return this
     */
    optional(parameterIndex: number, optional: boolean): MethodInfoBuilder {
        return this.updateParameter(parameterIndex, methodParameterInfo => methodParameterInfo.optional = optional);
    }

    /**
     * Mark a method as being used for post-construction
     */
    postConstruct(): MethodInfoBuilder {
        return this.update(methodInfo => methodInfo.postConstruct = true);
    }

    /**
     * Mark a method as being used for pre-destruction
     * @return this
     */
    preDestroy(): MethodInfoBuilder {
        return this.update(methodInfo => methodInfo.preDestroy = true);
    }

    /**
     * Set the order index for the method
     * @param index Index
     * @return this
     */
    order(index: number): MethodInfoBuilder {
        return this.update(methodInfo => methodInfo.order = index);
    }

    /**
     * Get a method parameter's information
     * @param methodInfo     Method information
     * @param parameterIndex Parameter index
     * @return Method parameter information
     */
    private getMethodParameterInfo(methodInfo: MethodInfo, parameterIndex: number): MethodParameterInfo {
        methodInfo.parameters = methodInfo.parameters || [];

        while (!(parameterIndex < methodInfo.parameters.length)) {
            methodInfo.parameters.push(null);
        }

        return methodInfo.parameters[parameterIndex] = methodInfo.parameters[parameterIndex] || {};
    }

    /**
     * Manipulate a method information
     * @param callback Callback
     * @return this
     */
    private update(callback: (methodInfo: MethodInfo) => void): MethodInfoBuilder {
        let methodInfo: MethodInfo = getMethodInfo(this.target.constructor, <string> this.propertyKey) || {};
        callback(methodInfo);
        setMethodInfo(this.propertyKey ? this.target.constructor : <Function> this.target, <string> this.propertyKey, methodInfo);
        return this;
    }

    /**
     * Manipulate a method parameter information
     * @param parameterIndex Parameter index
     * @param callback       Calback
     * @return this
     */
    private updateParameter(parameterIndex: number, callback: (methodParameterInfo: MethodParameterInfo) => void): MethodInfoBuilder {
        return this.update(methodInfo => callback(this.getMethodParameterInfo(methodInfo, parameterIndex)));
    }

    /**
     * Get a method information builder for the specified class method
     * @param target      Class prototype
     * @param propertyKey Property key
     * @return Method information builder
     */
    static of(target: Object, propertyKey: string|symbol): MethodInfoBuilder {
        return new MethodInfoBuilder(target, propertyKey);
    }

}

export {
    MethodInfoBuilder
};
