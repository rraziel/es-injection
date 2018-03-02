import {createParameterOrPropertyDecorator, ParameterOrPropertyDecorator} from './helper';

/**
 * Create an ElementClass decorator, used to specify the class of element contained in a container
 * @param elementClass Element class
 */
function ElementClass(elementClass: Function): ParameterOrPropertyDecorator {
    return createParameterOrPropertyDecorator(
        'ElementClass',
        propertyInfoBuilder => propertyInfoBuilder.elementClass(<any> elementClass),
        (methodInfoBuilder, parameterIndex) => methodInfoBuilder.elementClass(parameterIndex, <any> elementClass)
    );
}

export {
    ElementClass
};
