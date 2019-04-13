import {AppliedDecoratorParameters} from './AppliedDecoratorParameters';
import {applyParameterOrPropertyDecorator} from './applyParameterOrPropertyDecorator';
import {MethodInfoCallback} from './MethodInfoCallback';
import {ParameterOrPropertyDecorator} from './ParameterOrPropertyDecorator';
import {PropertyInfoCallback} from './PropertyInfoCallback';

/**
 * Create a parameter or property decorator
 * @param decoratorName        Decorator name
 * @param propertyInfoCallback Property information callback
 * @return Decorator
 */
function createParameterOrPropertyDecorator(decoratorName: string, propertyInfoCallback: PropertyInfoCallback, methodInfoCallback: MethodInfoCallback): ParameterOrPropertyDecorator {
    return (target, propertyKey, parameterIndex?) => applyParameterOrPropertyDecorator(new AppliedDecoratorParameters(
        decoratorName,
        target,
        propertyKey,
        parameterIndex,
        propertyInfoCallback,
        methodInfoCallback
    ));
}

export {
    createParameterOrPropertyDecorator
};
