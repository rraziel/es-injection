import {ParameterOrPropertyDecorator} from './types';
import {createParameterOrPropertyDecorator} from './helper';

/**
 * Create a Value decorator, used to inject a constant by name
 * @param valueName Value name
 * @return Value decorator
 */
function Value(valueName: string): ParameterOrPropertyDecorator {
    return createParameterOrPropertyDecorator(
        'Value',
        propertyInfoBuilder => propertyInfoBuilder.value(valueName),
        (methodInfoBuilder, parameterIndex) => methodInfoBuilder.value(parameterIndex, valueName)
    );
}

export {
    Value
};
