import {ClassOrMethodStereotypeDecorator} from './ClassOrMethodStereotypeDecorator';
import {DecoratorParameters} from './DecoratorParameters';
import {dispatchStereotypeDecoratorWithOptionalName} from './dispatchStereotypeDecoratorWithOptionalName';
import {ComponentClass} from '@es-injection/metadata';

/**
 * Dispatch stereotype decorator processor
 * @param targetOrComponentName Target or component name
 * @param decoratorParameters   Decorator parameters
 * @param <T>                   Component type
 * @return Stereotype decorator
 */
function dispatchStereotypeDecorator<T>(targetOrComponentName: Object|ComponentClass<T>|string, decoratorParameters: DecoratorParameters<T>): ClassOrMethodStereotypeDecorator|void {
    if (typeof(targetOrComponentName) === 'string') {
        return (target, namedPropertyKey, namedDescriptor) => {
            decoratorParameters.componentName = targetOrComponentName;
            decoratorParameters.propertyKey = namedPropertyKey!;
            decoratorParameters.descriptor = <TypedPropertyDescriptor<any>> namedDescriptor;
            dispatchStereotypeDecoratorWithOptionalName(target, decoratorParameters);
        };
    }

    dispatchStereotypeDecoratorWithOptionalName(targetOrComponentName, decoratorParameters);
}

export {
    dispatchStereotypeDecorator
};
