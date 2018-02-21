import {ParameterOrPropertyDecorator} from './types';
import {applyParameterOrPropertyDecorator} from './helper';

/**
 * Optional decorator, used to mark a dependency as being optional
 * @param target         Class constructor (static member) or prototype
 * @param propertyKey    Property key
 * @param parameterIndex Parameter index
 */
const Optional: ParameterOrPropertyDecorator = (target, propertyKey, parameterIndex?) => applyParameterOrPropertyDecorator({
    decoratorName: 'Optional',
    target: target,
    propertyKey: propertyKey,
    parameterIndex: parameterIndex,
    propertyInfoCallback: propertyInfoBuilder => propertyInfoBuilder.optional(true),
    methodInfoCallback: methodInfoBuilder => methodInfoBuilder.optional(parameterIndex, true)
});

export {
    Optional
};
