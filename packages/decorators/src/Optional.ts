import {applyParameterOrPropertyDecorator, AppliedDecoratorParameters, ParameterOrPropertyDecorator} from './helper';

/**
 * Optional decorator, used to mark a dependency as being optional
 * @param target         Class constructor (static member) or prototype
 * @param propertyKey    Property key
 * @param parameterIndex Parameter index
 */
const Optional: ParameterOrPropertyDecorator = (target, propertyKey, parameterIndex?) => applyParameterOrPropertyDecorator(new AppliedDecoratorParameters(
    'Optional',
    target,
    propertyKey,
    parameterIndex,
    propertyInfoBuilder => propertyInfoBuilder.optional(true),
    (methodInfoBuilder, methodParameterIndex) => methodInfoBuilder.optional(methodParameterIndex, true)
));

export {
    Optional
};
