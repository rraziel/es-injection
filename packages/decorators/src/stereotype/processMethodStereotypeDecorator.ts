import {DecoratorParameters} from './DecoratorParameters';
import {processStereotypeDecorator} from './processStereotypeDecorator';
import {ClassConstructor, ComponentClass} from '@es-injection/metadata';
import {ReflectionUtils} from '@es-injection/metadata';

/**
 * Dispatch a method stereotype decorator
 * @param classPrototype      Class prototype
 * @param decoratorParameters Decorator parameters
 * @param <T>                 Method type
 */
function processMethodStereotypeDecorator<T>(classPrototype: Object, decoratorParameters: DecoratorParameters<T>): void {
    const componentConstructor: ClassConstructor<any> = classPrototype.constructor as ClassConstructor<any>;
    const componentClass: ComponentClass<any> = ReflectionUtils.getReturnClass(componentConstructor, decoratorParameters.propertyKey)!;
    const componentName: string|undefined = decoratorParameters.componentName;

    if (!decoratorParameters.definition) {
        // TODO
    }

    processStereotypeDecorator(componentName, componentClass, decoratorParameters.stereotype);
}

export {
    processMethodStereotypeDecorator
};
