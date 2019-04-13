import {Named} from './Named';
import {getMethodInfo, getPropertyInfo, MethodInfo, PropertyInfo} from '@es-injection/metadata';

describe('@Named decorator', () => {

    describe('can be applied to', () => {

        it('a property', () => {
            // given
            class TestClass {
                @Named('test-name') private p: string = 'test';
                constructor() { this.p; }
            }
            // when
            const propertyInfo: PropertyInfo|undefined = getPropertyInfo(TestClass, 'p');
            // then
            expect(propertyInfo).toBeDefined();
            expect(propertyInfo!.name).toBe('test-name');
        });

        it('a constructor parameter', () => {
            // given
            class TestClass {
                constructor(@Named('test-name') p: string) { /* empty */ }
            }
            // when
            const methodInfo: MethodInfo|undefined = getMethodInfo(TestClass);
            // then
            expect(methodInfo).toBeDefined();
            expect(methodInfo!.parameters.length).toBe(1);
            expect(methodInfo!.parameters[0]).not.toBeNull();
            expect(methodInfo!.parameters[0]!.name).toBe('test-name');
        });

        it('a method parameter', () => {
            // given
            class TestClass {
                method(@Named('test-name') p: string): void { /* empty */ }
            }
            // when
            const methodInfo: MethodInfo|undefined = getMethodInfo(TestClass, 'method');
            // then
            expect(methodInfo).toBeDefined();
            expect(methodInfo!.parameters.length).toBe(1);
            expect(methodInfo!.parameters[0]).not.toBeNull();
            expect(methodInfo!.parameters[0]!.name).toBe('test-name');
        });

    });

    describe('throws an error when applied to', () => {

        it('a static method', () => {
            // expect
            expect(() => {
                class TestClass {
                    static method(@Named('test-name') p: string): void { /* empty */ }
                }
                TestClass;
            }).toThrowError(/cannot be applied to static method or property TestClass\.method/);
        });

        it('a static property', () => {
            // expect
            expect(() => {
                class TestClass {
                    @Named('test-name') private static p: string;
                    constructor() { TestClass.p; }
                }
                TestClass;
            }).toThrowError(/cannot be applied to static method or property TestClass\.p/);
        });

    });

});
