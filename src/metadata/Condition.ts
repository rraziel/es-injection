import {ConditionContext} from './ConditionContext';
import {ClassConstructor} from '../utils';

/**
 * Condition
 */
type Condition = <T>(conditionContext: ConditionContext, componentClass: ClassConstructor<T>) => Promise<boolean>|boolean;

export {
    Condition
};
