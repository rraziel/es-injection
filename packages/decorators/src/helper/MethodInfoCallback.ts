import {MethodInfoBuilder} from '@es-injection/metadata';

/**
 * Method information callback
 * @param methodInfoBuilder Method information builder
 * @param parameterIndex    Parameter index
 */
type MethodInfoCallback = (methodInfoBuilder: MethodInfoBuilder, parameterIndex: number) => void;

export {
    MethodInfoCallback
};
