import {Scope} from './scope';
import {ComponentInfo, getComponentInfo, ScopeType} from '../metadata';

describe('@Scope decorator', () => {

    describe('can be used to set a component scope to', () => {

        it('prototype', () => {
            // given
            @Scope(ScopeType.PROTOTYPE)
            class TestComponent { }
            // when
            let componentInfo: ComponentInfo = getComponentInfo(TestComponent);
            // then
            expect(componentInfo).not.toBeUndefined();
            expect(componentInfo.scope).toEqual(ScopeType.PROTOTYPE);
        });

        it('singleton', () => {
            // given
            @Scope(ScopeType.SINGLETON)
            class TestComponent { }
            // when
            let componentInfo: ComponentInfo = getComponentInfo(TestComponent);
            // then
            expect(componentInfo).not.toBeUndefined();
            expect(componentInfo.scope).toEqual(ScopeType.SINGLETON);
        });

    });

});
