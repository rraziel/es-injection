import {MethodOrPropertyDecorator} from './helper';
import {MethodInfoBuilder, PropertyInfoBuilder} from '@es-injection/metadata';

/**
 * Inject decorator, used to inject a dependency
 * @param target      Class constructor (static member) or prototype
 * @param propertyKey Property key
 * @param descriptor  Descriptor
 */
const Inject: MethodOrPropertyDecorator = (target, propertyKey, descriptor) => {
    if (descriptor === undefined) {
        PropertyInfoBuilder.of(target, propertyKey).inject();
    } else {
        MethodInfoBuilder.of(target, propertyKey).inject();
    }
};

export {
    Inject
};
