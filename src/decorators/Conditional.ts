import {Condition, ComponentInfoBuilder} from '../metadata';

/**
 * Create a Conditional decorator, used to specify the conditions that have to be met for a component to be registered
 * @param conditions List of conditions
 * @return Conditional decorator
 */
function Conditional(...conditions: Array<Condition>): ClassDecorator {
    return target => {
        ComponentInfoBuilder.of(target).conditional(...conditions);
    };
}

export {
    Conditional
};
