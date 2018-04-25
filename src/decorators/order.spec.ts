import {Order} from './Order';
import {getMethodInfo, getPropertyInfo, MethodInfo, PropertyInfo} from '../metadata';

describe('@Order decorator', () => {

    describe('can be applied to', () => {

        it('a method', () => {
            // given
            class TestClass {
                @Order(42)
                method(): void { /* empty */ }
            }
            // when
            let methodInfo: MethodInfo = getMethodInfo(TestClass, 'method');
            // then
            expect(methodInfo).not.toBeUndefined();
            expect(methodInfo.order).toEqual(42);
        });

        it('a property', () => {
            // given
            class TestClass {
                @Order(42)
                private property: string;
            }
            // when
            let propertyInfo: PropertyInfo = getPropertyInfo(TestClass, 'property');
            // then
            expect(propertyInfo).not.toBeUndefined();
            expect(propertyInfo.order).toEqual(42);
        });

    });

    describe('throws an error when applied to', () => {

        it('a static method', () => {
            // expect
            expect(() => {
                class TestClass {
                    @Order(42)
                    static method(): void { /* empty */ }
                }
            }).toThrowError(/cannot be applied to static method or property TestClass\.method/);
        });

        it('a static property', () => {
            // expect
            expect(() => {
                class TestClass {
                    @Order(42)
                    static property: string;
                }
            }).toThrowError(/cannot be applied to static method or property TestClass\.property/);
        });

    });

});
