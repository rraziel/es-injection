import {AppliedDecoratorParameters} from './AppliedDecoratorParameters';
import {MethodInfoBuilder, PropertyInfoBuilder} from '@es-injection/metadata';

/**
 * Apply a parameter or property decorator
 * @param parameters Applied decorator parameters
 */
function applyParameterOrPropertyDecorator(parameters: AppliedDecoratorParameters): void {
    const decoratorName: string = parameters.decoratorName;
    const target: Object = parameters.target;
    const propertyKey: string|symbol = parameters.propertyKey;
    const parameterIndex: number|undefined = parameters.parameterIndex;

    if (target instanceof Function && propertyKey !== undefined) {
        throw new Error(`the @${decoratorName} decorator cannot be applied to static method or property ${target.name}.${propertyKey as string}`);
    }

    if (parameterIndex === undefined) {
        const propertyInfoBuilder: PropertyInfoBuilder = PropertyInfoBuilder.of(target, propertyKey);
        parameters.propertyInfoCallback(propertyInfoBuilder);
    } else {
        const methodInfoBuilder: MethodInfoBuilder = MethodInfoBuilder.of(target, propertyKey);
        parameters.methodInfoCallback(methodInfoBuilder, parameterIndex);
    }
}

export {
    applyParameterOrPropertyDecorator
};
