import {createParameterOrPropertyDecorator, ParameterOrPropertyDecorator} from './helper';

/**
 * Create a Named decorator, used to inject a dependency by name
 * @param componentName Component name
 * @return Named decorator
 */
function Named(componentName: string): ParameterOrPropertyDecorator {
    return createParameterOrPropertyDecorator(
        'Named',
        propertyInfoBuilder => propertyInfoBuilder.name(componentName),
        (methodInfoBuilder, parameterIndex) => methodInfoBuilder.name(parameterIndex, componentName)
    );
}

export {
    Named
};
