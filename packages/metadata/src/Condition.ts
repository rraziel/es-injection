import {ComponentClass} from './ComponentClass';
import {ConditionContext} from './ConditionContext';

/**
 * Condition
 */
type Condition = <T>(conditionContext: ConditionContext, componentClass: ComponentClass<T>) => Promise<boolean>|boolean;

export {
    Condition
};
