import {Conditional} from './Conditional';
import {ComponentClass, ComponentInfo, Condition, ConditionContext, getComponentInfo} from '@es-injection/metadata';

describe('@Conditional decorator', () => {

    it('can be set', () => {
        // given
        const condition1: Condition = <T>(conditionContext: ConditionContext, componentClass: ComponentClass<T>) => false;
        const condition2: Condition = <T>(conditionContext: ConditionContext, componentClass: ComponentClass<T>) => false;
        @Conditional(condition1, condition2)
        class TestComponent { }
        // when
        const componentInfo: ComponentInfo|undefined = getComponentInfo(TestComponent);
        // then
        expect(componentInfo).toBeDefined();
        expect(componentInfo!.conditions.length).toBe(2);
        expect(componentInfo!.conditions[0]).toBe(condition1);
        expect(componentInfo!.conditions[1]).toBe(condition2);
    });

});
