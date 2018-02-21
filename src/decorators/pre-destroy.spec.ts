import {PreDestroy} from './pre-destroy';
import {getMethodInfo, MethodInfo} from '../metadata';

describe('@PreDestroy decorator', () => {

    it('can be applied to a method', () => {
        // given
        class TestClass {
            @PreDestroy
            method(): void { /* empty */ }
        }
        // when
        let methodInfo: MethodInfo = getMethodInfo(TestClass, 'method');
        // then
        expect(methodInfo).not.toBeUndefined();
        expect(methodInfo.preDestroy).toEqual(true);
    });

    it('throws an error when applied to a static method', () => {
        // expect
        expect(() => {
            class TestClass {
                @PreDestroy
                static method(): void { /* empty */ }
            }
        }).toThrowError(/cannot be used on static method/);
    });

});
