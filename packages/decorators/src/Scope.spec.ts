import {Scope} from './Scope';
import {ComponentInfo, getComponentInfo, ScopeType} from '@es-injection/metadata';

describe('@Scope decorator', () => {

    describe('can be used to set a component scope to', () => {

        it('prototype', () => {
            // given
            @Scope(ScopeType.PROTOTYPE)
            class TestComponent { }
            // when
            const componentInfo: ComponentInfo|undefined = getComponentInfo(TestComponent);
            // then
            expect(componentInfo).toBeDefined();
            expect(componentInfo!.scope).toBe(ScopeType.PROTOTYPE);
        });

        it('singleton', () => {
            // given
            @Scope(ScopeType.SINGLETON)
            class TestComponent { }
            // when
            const componentInfo: ComponentInfo|undefined = getComponentInfo(TestComponent);
            // then
            expect(componentInfo).toBeDefined();
            expect(componentInfo!.scope).toBe(ScopeType.SINGLETON);
        });

    });

});
