import {Conditional} from './Conditional';
import {ComponentInfo, Condition, ConditionContext, getComponentInfo} from '../metadata';
import {ComponentClass} from '../utils';

describe('@Conditional decorator', () => {

    it('can be set', () => {
        // given
        const condition1: Condition = <T>(conditionContext: ConditionContext, componentClass: ComponentClass<T>) => false;
        const condition2: Condition = <T>(conditionContext: ConditionContext, componentClass: ComponentClass<T>) => false;
        @Conditional(condition1, condition2)
        class TestComponent { }
        // when
        let componentInfo: ComponentInfo = getComponentInfo(TestComponent);
        // then
        expect(componentInfo).not.toBeUndefined();
        expect(componentInfo.conditions).not.toBeUndefined();
        expect(componentInfo.conditions.length).toBe(2);
        expect(componentInfo.conditions[0]).toBe(condition1);
        expect(componentInfo.conditions[1]).toBe(condition2);
    });

});
