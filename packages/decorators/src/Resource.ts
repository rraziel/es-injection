import {MethodOrPropertyDecorator} from './helper';
import {MethodInfoBuilder, PropertyInfoBuilder} from '@es-injection/metadata';

/**
 * Resource decorator, used to inject a named dependency; equivalent of using Inject and Named
 * @param target      Class constructor (static member) or prototype
 * @param propertyKey Property key
 * @param descriptor  Descriptor
 */
const Resource: MethodOrPropertyDecorator = (target, propertyKey, descriptor) => {
    if (descriptor === undefined) {
        PropertyInfoBuilder.of(target, propertyKey).inject();
    } else {
        MethodInfoBuilder.of(target, propertyKey).inject();
    }
};

export {
    Resource
};
