import {DependencyInfo} from '../dependency';
import 'reflect-metadata';

/**
 * Method information metadata
 */
const MethodInfoMetadata: Symbol = Symbol('es-injection:method');

/**
 * Method parameter information
 */
interface MethodParameterInfo extends DependencyInfo {

}

/**
 * Method information
 */
interface MethodInfo extends DependencyInfo {
    parameters?: MethodParameterInfo[];
    postConstruct?: boolean;
    preDestroy?: boolean;
}

/**
 * Get method information
 * @param componentClass Component class
 * @param methodName     Method name
 * @return Method information
 */
function getMethodInfo<C extends Function>(componentClass: C, methodName?: string): MethodInfo {
    let methodInfo: MethodInfo = Reflect.getOwnMetadata(MethodInfoMetadata, componentClass, methodName);
    return methodInfo;
}

/**
 * Set method information
 * @param componentClass Component class
 * @param methodName     Method name
 * @param methodInfo     Method information
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
