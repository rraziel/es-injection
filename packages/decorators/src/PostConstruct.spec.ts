import {PostConstruct} from './PostConstruct';
import {getMethodInfo, MethodInfo} from '@es-injection/metadata';

describe('@PostConstruct decorator', () => {

    it('can be applied to a method', () => {
        // given
        class TestClass {
            @PostConstruct
            method(): void { /* empty */ }
        }
        // when
        const methodInfo: MethodInfo|undefined = getMethodInfo(TestClass, 'method');
        // then
        expect(methodInfo).toBeDefined();
        expect(methodInfo!.postConstruct).toBe(true);
    });

    it('throws an error when applied to a static method', () => {
        // expect
        expect(() => {
            class TestClass {
                @PostConstruct
                static method(): void { /* empty */ }
            }
            TestClass;
        }).toThrowError(/cannot be used on static method/);
    });

});
