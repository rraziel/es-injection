import {ConditionContext} from './ConditionContext';
import {ClassConstructor} from 'es-decorator-utils';

type Condition = <T>(conditionContext: ConditionContext, componentClass: ClassConstructor<T>) => boolean;

export {
    Condition
};
