import {Value} from './Value';
import {getMethodInfo, getPropertyInfo, MethodInfo, PropertyInfo} from '../metadata';

describe('@Value decorator', () => {

    describe('can be applied to', () => {

        it('a property', () => {
            // given
            class TestClass {
                @Value('test-name') private p: string;
            }
            // when
            let propertyInfo: PropertyInfo = getPropertyInfo(TestClass, 'p');
            // then
            expect(propertyInfo).not.toBeUndefined();
            expect(propertyInfo.value).toEqual('test-name');
        });

        it('a constructor parameter', () => {
            // given
            class TestClass {
                constructor(@Value('test-name') p: string) { /* empty */ }
            }
            // when
            let methodInfo: MethodInfo = getMethodInfo(TestClass);
            // then
            expect(methodInfo).not.toBeUndefined();
            expect(methodInfo.parameters).not.toBeUndefined();
            expect(methodInfo.parameters.length).toEqual(1);
            expect(methodInfo.parameters[0]).not.toBeUndefined();
            expect(methodInfo.parameters[0].value).toEqual('test-name');
        });

        it('a method parameter', () => {
            // given
            class TestClass {
                method(@Value('test-name') p: string): void { /* empty */ }
            }
            // when
            let methodInfo: MethodInfo = getMethodInfo(TestClass, 'method');
            // then
            expect(methodInfo).not.toBeUndefined();
            expect(methodInfo.parameters).not.toBeUndefined();
            expect(methodInfo.parameters.length).toEqual(1);
            expect(methodInfo.parameters[0]).not.toBeUndefined();
            expect(methodInfo.parameters[0].value).toEqual('test-name');
        });

    });

    describe('throws an error when applied to', () => {

        it('a static method', () => {
            // expect
            expect(() => {
                class TestClass {
                    static method(@Value('test-name') p: string): void { /* empty */ }
                }
            }).toThrowError(/cannot be applied to static method or property TestClass\.method/);
        });

        it('a static property', () => {
            // expect
            expect(() => {
                class TestClass {
                    @Value('test-name') private static p: string;
                }
            }).toThrowError(/cannot be applied to static method or property TestClass\.p/);
        });

    });

});
