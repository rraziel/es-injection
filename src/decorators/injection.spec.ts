import {Inject, Named, Order, PostConstruct, PreDestroy} from './injection';
import {getMethodInfo, getPropertyInfo, MethodInfo, MethodParameterInfo, PropertyInfo} from '../metadata';

describe('@Named decorator', () => {

    describe('can be applied to', () => {

        it('a property', () => {
            // given
            class TestClass {
                @Named('test-name') private p: string;
            }
            // when
            let propertyInfo: PropertyInfo = getPropertyInfo(TestClass, 'p');
            // then
            expect(propertyInfo).not.toBeUndefined();
            expect(propertyInfo.name).toEqual('test-name');
        });

        it('a constructor parameter', () => {
            // given
            class TestClass {
                constructor(@Named('test-name') p: string) { /* empty */ }
            }
            // when
            let methodInfo: MethodInfo = getMethodInfo(TestClass);
            // then
            expect(methodInfo).not.toBeUndefined();
            expect(methodInfo.parameters).not.toBeUndefined();
            expect(methodInfo.parameters.length).toEqual(1);
            expect(methodInfo.parameters[0]).not.toBeUndefined();
            expect(methodInfo.parameters[0].name).toEqual('test-name');
        });

        it('a method parameter', () => {
            // given
            class TestClass {
                method(@Named('test-name') p: string): void { /* empty */ }
            }
            // when
            let methodInfo: MethodInfo = getMethodInfo(TestClass, 'method');
            // then
            expect(methodInfo).not.toBeUndefined();
            expect(methodInfo.parameters).not.toBeUndefined();
            expect(methodInfo.parameters.length).toEqual(1);
            expect(methodInfo.parameters[0]).not.toBeUndefined();
            expect(methodInfo.parameters[0].name).toEqual('test-name');
        });

    });

    describe('throws an error when applied to', () => {

        it('a static method', () => {
            // expect
            expect(() => {
                class TestClass {
                    static method(@Named('test-name') p: string): void { /* empty */ }
                }
            }).toThrowError(/cannot be applied to static method or property TestClass\.method/);
        });

        it('a static property', () => {
            // expect
            expect(() => {
                class TestClass {
                    @Named('test-name') private static p: string;
                }
            }).toThrowError(/cannot be applied to static method or property TestClass\.p/);
        });

    });

});

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
