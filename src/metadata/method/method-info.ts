import {DependencyInfo} from '../dependency';

/**
 * Method information metadata
 */
const MethodInfoMetadata: Symbol = Symbol('es-injection:method');

/**
 * Method parameter information
 */
interface MethodParameterInfo extends DependencyInfo {
    parameterName?: string;
}

/**
 * Method information
 */
interface MethodInfo {
    parameters?: MethodParameterInfo[];
}

/**
 * Get method information
 * @param componentClass Component class
 * @param methodName     Method name
 * @return Property information
 */
function getMethodInfo<C extends Function>(componentClass: C, methodName: string): MethodInfo {
    let methodInfo: MethodInfo = Reflect.getMetadata(MethodInfoMetadata, componentClass, methodName);
    return methodInfo;
}

/**
 * Set method information
 * @param componentClass Component class
 * @param methodName     Method name
 * @param propertyInfo   Property information
 */
function setMethodInfo<C extends Function>(componentClass: C, methodName: string, methodInfo: MethodInfo): void {
    Reflect.defineMetadata(MethodInfoMetadata, methodInfo, componentClass, methodName);
}

export {
    getMethodInfo,
    MethodInfo,
    MethodParameterInfo,
    setMethodInfo
};
