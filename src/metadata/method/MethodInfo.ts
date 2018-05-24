import {DependencyInfo} from '../dependency';
import {ComponentClass} from '../../utils';
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
 * @param <T>            Component type
 * @return Method information
 */
function getMethodInfo<T>(componentClass: ComponentClass<T>, methodName?: string): MethodInfo {
    let methodInfo: MethodInfo = Reflect.getOwnMetadata(MethodInfoMetadata, componentClass, methodName);
    return methodInfo;
}

/**
 * Set method information
 * @param componentClass Component class
 * @param methodName     Method name
 * @param methodInfo     Method information
 * @param <T>            Component type
 */
function setMethodInfo<T>(componentClass: ComponentClass<T>, methodName: string, methodInfo: MethodInfo): void {
    Reflect.defineMetadata(MethodInfoMetadata, methodInfo, componentClass, methodName);
}

export {
    MethodParameterInfo,
    MethodInfo,
    getMethodInfo,
    setMethodInfo
};
