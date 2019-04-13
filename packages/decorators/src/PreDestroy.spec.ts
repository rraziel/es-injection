import {PreDestroy} from './PreDestroy';
import {getMethodInfo, MethodInfo} from '@es-injection/metadata';

describe('@PreDestroy decorator', () => {

    it('can be applied to a method', () => {
        // given
        class TestClass {
            @PreDestroy
            method(): void { /* empty */ }
        }
        // when
        const methodInfo: MethodInfo|undefined = getMethodInfo(TestClass, 'method');
        // then
        expect(methodInfo).toBeDefined();
        expect(methodInfo!.preDestroy).toBe(true);
    });

    it('throws an error when applied to a static method', () => {
        // expect
        expect(() => {
            class TestClass {
                @PreDestroy
                static method(): void { /* empty */ }
            }
            TestClass;
        }).toThrowError(/cannot be used on static method/);
    });

});
