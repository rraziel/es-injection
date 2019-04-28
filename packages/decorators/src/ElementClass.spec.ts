import {ElementClass} from './ElementClass';
import {getMethodInfo, getPropertyInfo, MethodInfo, PropertyInfo} from '@es-injection/metadata';

describe('@ElementClass decorator', () => {

    describe('can be applied to', () => {

        it('a property', () => {
            // given
            class TestClass {
                @ElementClass(String) private p: Array<string> = [];
                constructor() { this.p; }
            }
            // when
            const propertyInfo: PropertyInfo|undefined = getPropertyInfo(TestClass, 'p');
            // then
            expect(propertyInfo).toBeDefined();
            expect(propertyInfo!.elementClass).toBe(String);
        });

        it('a constructor parameter', () => {
            // given
            class TestClass {
                constructor(@ElementClass(String) p: Array<string>) { /* empty */ }
            }
            // when
            const methodInfo: MethodInfo|undefined = getMethodInfo(TestClass);
            // then
            expect(methodInfo).toBeDefined();
            expect(methodInfo!.parameters.length).toBe(1);
            expect(methodInfo!.parameters[0]).not.toBeNull();
            expect(methodInfo!.parameters[0]!.elementClass).toBe(String);
        });

        it('a method parameter', () => {
            // given
            class TestClass {
                method(@ElementClass(String) p: Array<string>): void { /* empty */ }
            }
            // when
            const methodInfo: MethodInfo|undefined = getMethodInfo(TestClass, 'method');
            // then
            expect(methodInfo).toBeDefined();
            expect(methodInfo!.parameters.length).toBe(1);
            expect(methodInfo!.parameters[0]).not.toBeNull();
        });

    });

    describe('throws an error when applied to', () => {

        it('a static method', () => {
            // expect
            expect(() => {
                class TestClass {
                    static method(@ElementClass(String) p: Array<string>): void { /* empty */ }
                }
                TestClass;
            }).toThrowError(/cannot be applied to static method or property TestClass\.method/);
        });

        it('a static property', () => {
            // expect
            expect(() => {
                class TestClass {
                    @ElementClass(String) private static p: Array<string>;
                    constructor() { TestClass.p; }
                }
                TestClass;
            }).toThrowError(/cannot be applied to static method or property TestClass\.p/);
        });

    });

});
