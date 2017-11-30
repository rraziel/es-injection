import {getMethodInfo, MethodInfo, MethodParameterInfo, setMethodInfo} from './method-info';

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
     * Set a parameter name
     * @param parameterIndex Parameter index
     * @param parameterName  Parameter name
     * @return this
     */
    name(parameterIndex: number, parameterName: string): MethodInfoBuilder {
        return this.update(methodInfo => this.getMethodParameterInfo(methodInfo, parameterIndex).name = parameterName);
    }

    /**
     * Set a parameter class
     * @param parameterIndex Parameter index
     * @param parameterClass Parameter class
     * @return this
     */
    class(parameterIndex: number, parameterClass: Function): MethodInfoBuilder {
        return this.update(methodInfo => this.getMethodParameterInfo(methodInfo, parameterIndex).type = parameterClass);
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
        setMethodInfo(this.target.constructor, <string> this.propertyKey, methodInfo);
        return this;
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
