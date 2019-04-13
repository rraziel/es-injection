import {DecoratorParameters} from './DecoratorParameters';
import {processClassStereotypeDecorator} from './processClassStereotypeDecorator';
import {processMethodStereotypeDecorator} from './processMethodStereotypeDecorator';
import {ComponentClass} from '@es-injection/metadata';

/**
 * Dispatch a stereotype decorator with an optional component name
 * @param target              Target
 * @param decoratorParameters Decorator parameters
 * @param <T>                 Component type or method type
 */
function dispatchStereotypeDecoratorWithOptionalName<T>(target: Object|ComponentClass<T>, decoratorParameters: DecoratorParameters<T>): void {
    if (target instanceof Function) {
        if (decoratorParameters.propertyKey) {
            throw new Error(`a component decorator cannot be used on a static method (${target.name}.${decoratorParameters.propertyKey as string}`);
        }

        processClassStereotypeDecorator(target, decoratorParameters.stereotype, decoratorParameters.componentName);
    } else {
        processMethodStereotypeDecorator(target, decoratorParameters);
    }
}

export {
    dispatchStereotypeDecoratorWithOptionalName
};
