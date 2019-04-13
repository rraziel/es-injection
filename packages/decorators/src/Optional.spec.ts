import {Optional} from './Optional';
import {getMethodInfo, getPropertyInfo, MethodInfo, PropertyInfo} from '@es-injection/metadata';

describe('@Optional decorator', () => {

    describe('can be applied to', () => {

        it('a property', () => {
            // given
            class TestClass {
                @Optional private p: string|undefined = 'test';
                constructor() { this.p; }
            }
            // when
            const propertyInfo: PropertyInfo|undefined = getPropertyInfo(TestClass, 'p');
            // then
            expect(propertyInfo).toBeDefined();
            expect(propertyInfo!.optional).toBe(true);
        });

        it('a constructor parameter', () => {
            // given
            class TestClass {
                constructor(@Optional p: string|undefined) { /* empty */ }
            }
            // when
            const methodInfo: MethodInfo|undefined = getMethodInfo(TestClass);
            // then
            expect(methodInfo).toBeDefined();
            expect(methodInfo!.parameters.length).toBe(1);
            expect(methodInfo!.parameters[0]).not.toBeNull();
            expect(methodInfo!.parameters[0]!.optional).toBe(true);
        });

        it('a method parameter', () => {
            // given
            class TestClass {
                method(@Optional p: string|undefined): void { /* empty */ }
            }
            // when
            const methodInfo: MethodInfo|undefined = getMethodInfo(TestClass, 'method');
            // then
            expect(methodInfo).toBeDefined();
            expect(methodInfo!.parameters.length).toBe(1);
            expect(methodInfo!.parameters[0]).not.toBeNull();
            expect(methodInfo!.parameters[0]!.optional).toBe(true);
        });

    });

    describe('throws an error when applied to', () => {

        it('a static method', () => {
            // expect
            expect(() => {
                class TestClass {
                    static method(@Optional p: string|undefined): void { /* empty */ }
                }
                TestClass;
            }).toThrowError(/cannot be applied to static method or property TestClass\.method/);
        });

        it('a static property', () => {
            // expect
            expect(() => {
                class TestClass {
                    @Optional private static p: string|undefined;
                    constructor() { TestClass.p; }
                }
                TestClass;
            }).toThrowError(/cannot be applied to static method or property TestClass\.p/);
        });

    });

});
