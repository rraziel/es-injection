import {ConditionContext} from './ConditionContext';
import {ClassConstructor} from '../utils';

type Condition = <T>(conditionContext: ConditionContext, componentClass: ClassConstructor<T>) => boolean;

export {
    Condition
};
