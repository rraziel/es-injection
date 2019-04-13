import {Order} from './Order';
import {getMethodInfo, getPropertyInfo, MethodInfo, PropertyInfo} from '@es-injection/metadata';

describe('@Order decorator', () => {

    describe('can be applied to', () => {

        it('a method', () => {
            // given
            class TestClass {
                @Order(42)
                method(): void { /* empty */ }
            }
            // when
            const methodInfo: MethodInfo|undefined = getMethodInfo(TestClass, 'method');
            // then
            expect(methodInfo).toBeDefined();
            expect(methodInfo!.order).toBe(42);
        });

        it('a property', () => {
            // given
            class TestClass {
                @Order(42)
                private property: string = 'test';
                constructor() { this.property; }
            }
            // when
            const propertyInfo: PropertyInfo|undefined = getPropertyInfo(TestClass, 'property');
            // then
            expect(propertyInfo).toBeDefined();
            expect(propertyInfo!.order).toBe(42);
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
                TestClass;
            }).toThrowError(/cannot be applied to static method or property TestClass\.method/);
        });

        it('a static property', () => {
            // expect
            expect(() => {
                class TestClass {
                    @Order(42)
                    static property: string;
                }
                TestClass;
            }).toThrowError(/cannot be applied to static method or property TestClass\.property/);
        });

    });

});
