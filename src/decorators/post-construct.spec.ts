import {PostConstruct} from './post-construct';
import {getMethodInfo, MethodInfo} from '../metadata';

describe('@PostConstruct decorator', () => {

    it('can be applied to a method', () => {
        // given
        class TestClass {
            @PostConstruct
            method(): void { /* empty */ }
        }
        // when
        let methodInfo: MethodInfo = getMethodInfo(TestClass, 'method');
        // then
        expect(methodInfo).not.toBeUndefined();
        expect(methodInfo.postConstruct).toEqual(true);
    });

    it('throws an error when applied to a static method', () => {
        // expect
        expect(() => {
            class TestClass {
                @PostConstruct
                static method(): void { /* empty */ }
            }
        }).toThrowError(/cannot be used on static method/);
    });

});
