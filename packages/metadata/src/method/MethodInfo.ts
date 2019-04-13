import {DependencyInfo} from '../dependency';
import {ComponentClass} from '../ComponentClass';
import 'reflect-metadata';

/**
 * Method information metadata
 */
const MethodInfoMetadata: Symbol = Symbol('es-injection:method');

/**
 * Method parameter information
 */
class MethodParameterInfo extends DependencyInfo {

}

/**
 * Method information
 */
class MethodInfo extends DependencyInfo {
    readonly parameters: Array<MethodParameterInfo|null> = [];
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
function getMethodInfo<T>(componentClass: ComponentClass<T>, methodName?: string|symbol): MethodInfo|undefined {
    let methodInfo: MethodInfo|undefined;

    if (methodName) {
        methodInfo = Reflect.getOwnMetadata(MethodInfoMetadata, componentClass, methodName);
    } else {
        methodInfo = Reflect.getOwnMetadata(MethodInfoMetadata, componentClass);
    }

    return methodInfo;
}

/**
 * Set method information
 * @param componentClass Component class
 * @param methodName     Method name
 * @param methodInfo     Method information
 * @param <T>            Component type
 */
function setMethodInfo<T>(componentClass: ComponentClass<T>, methodName: string|symbol, methodInfo: MethodInfo): void {
    Reflect.defineMetadata(MethodInfoMetadata, methodInfo, componentClass, methodName);
}

export {
    MethodParameterInfo,
    MethodInfo,
    getMethodInfo,
    setMethodInfo
};
