import {MethodOrPropertyDecorator} from './types';
import {MethodInfoBuilder, PropertyInfoBuilder} from '../metadata';

/**
 * Create an Order decorator, used to specify in which other injection is performed
 * @param index Index
 * @return Decorator
 */
function Order(index: number): MethodOrPropertyDecorator {
    return (target, propertyKey, descriptor) => {
        if (target instanceof Function) {
            throw new Error('@Order cannot be applied to static method or property ' + target.name + '.' + <string> propertyKey);
        }

        if (descriptor === undefined) {
            PropertyInfoBuilder.of(target, propertyKey).order(index);
        } else {
            MethodInfoBuilder.of(target, propertyKey).order(index);
        }
    };
}

export {
    Order
};
