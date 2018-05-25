import {ConditionContext} from './ConditionContext';
import {ComponentClass} from '../utils';

/**
 * Condition
 */
type Condition = <T>(conditionContext: ConditionContext, componentClass: ComponentClass<T>) => Promise<boolean>|boolean;

export {
    Condition
};
