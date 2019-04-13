import {DecoratorParameters} from './DecoratorParameters';
import {dispatchStereotypeDecorator} from './dispatchStereotypeDecorator';
import {StereotypeDecorator} from './StereotypeDecorator';
import {StereotypeDefinition} from './StereotypeDefinition';

/**
 * Create a stereotype decorator
 * @param stereotype    Stereotype
 * @param stereotypeDefinition true if the component can contain stereotype-decorated methods
 * @return Stereotype decorator
 */
function createStereotypeDecorator(stereotype: string, stereotypeDefinition?: StereotypeDefinition): StereotypeDecorator {
    return (<T>(target: Object|T, propertyKey: string|symbol, descriptor: TypedPropertyDescriptor<() => T>) => {
        const decoratorParameters: DecoratorParameters<any> = new DecoratorParameters(propertyKey, descriptor, stereotype);
        decoratorParameters.definition = stereotypeDefinition;
        return dispatchStereotypeDecorator(target, decoratorParameters);
    }) as StereotypeDecorator;
}

export {
    createStereotypeDecorator
};
