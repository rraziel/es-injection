import {Condition, ComponentInfoBuilder} from '../metadata';
import {ClassConstructor} from 'es-decorator-utils';

/**
 * Create a Conditional decorator, used to specify the conditions that have to be met for a component to be registered
 * @param conditions List of conditions
 * @return Conditional decorator
 */
function Conditional(...conditions: Condition[]): ClassDecorator {
    return target => {
        ComponentInfoBuilder.of(<ClassConstructor<any>> <any> target).conditional(...conditions);
    };
}

export {
    Conditional
};
