import {DefaultComponentFactory} from './DefaultComponentFactory';
import {Component, ElementClass, Inject, Order} from '../decorators';

let n: number = 0;

abstract class TestBaseDependencyClass { }
@Component
class TestDependencyClass extends TestBaseDependencyClass { orderCount: number = n++; }
@Component
class TestDependencyClass2 extends TestBaseDependencyClass { orderCount: number = n++; }
@Component
class TestDependencyClass3 extends TestBaseDependencyClass { orderCount: number = n++; }

describe('Default component factory', () => {
    let componentFactory: DefaultComponentFactory;

    beforeEach(() => {
        componentFactory = new DefaultComponentFactory({});
    });

    describe('can retrieve', () => {

        it('a simple component', () => {
            // given
            @Component
            class TestClass { }
            // when
            let component: TestClass = componentFactory.getComponent(TestClass);
            // then
            expect(component).not.toBeUndefined();
            expect(component).toBeInstanceOf(TestClass);
        });

        describe('a component holding injected constructor parameters', () => {

            it('with no extra decorators', () => {
                // given
                @Component
                class TestClass {
                    constructor(public p: TestDependencyClass) { /* empty */ }
                }
                // when
                let component: TestClass = componentFactory.getComponent(TestClass);
                // then
                expect(component).not.toBeUndefined();
                expect(component).toBeInstanceOf(TestClass);
                expect(component.p).toBeInstanceOf(TestDependencyClass);
            });

            it('with an injected array', () => {
                // given
                @Component
                class TestClass {
                    constructor(@ElementClass(TestBaseDependencyClass) public l: TestBaseDependencyClass[]) { /* empty */ }
                }
                // when
                let component: TestClass = componentFactory.getComponent(TestClass);
                let dependency1: TestDependencyClass = componentFactory.getComponent(TestDependencyClass);
                let dependency2: TestDependencyClass2 = componentFactory.getComponent(TestDependencyClass2);
                let dependency3: TestDependencyClass3 = componentFactory.getComponent(TestDependencyClass3);
                // then
                expect(component).not.toBeUndefined();
                expect(component).toBeInstanceOf(TestClass);
                expect(component.l).not.toBeUndefined();
                expect(component.l.length).toEqual(3);
                expect(component.l).toContain(dependency1);
                expect(component.l).toContain(dependency2);
                expect(component.l).toContain(dependency3);
            });

        });

        describe('a component holding injected method parameters', () => {

            it('with no extra decorators', () => {
                // given
                @Component
                class TestClass {
                    p: TestDependencyClass;
                    @Inject method(p: TestDependencyClass): void { this.p = p; }
                }
                // when
                let component: TestClass = componentFactory.getComponent(TestClass);
                // then
                expect(component).not.toBeUndefined();
                expect(component).toBeInstanceOf(TestClass);
                expect(component.p).toBeInstanceOf(TestDependencyClass);
            });

            it('with a set order', () => {
                // given
                @Component
                class TestClass {
                    p0: TestDependencyClass;
                    p1: TestDependencyClass2;
                    p2: TestDependencyClass3;
                    @Inject @Order(4) method0(p0: TestDependencyClass): void { this.p0 = p0; }
                    @Inject @Order(2) method1(p1: TestDependencyClass2): void { this.p1 = p1; }
                    @Inject @Order(7) method2(p2: TestDependencyClass3): void { this.p2 = p2; }
                }
                // when
                let component: TestClass = componentFactory.getComponent(TestClass);
                // then
                expect(component).not.toBeUndefined();
                expect(component).toBeInstanceOf(TestClass);
                expect(component.p0).toBeInstanceOf(TestDependencyClass);
                expect(component.p1).toBeInstanceOf(TestDependencyClass2);
                expect(component.p2).toBeInstanceOf(TestDependencyClass3);
                expect(component.p1.orderCount).toBeLessThan(component.p0.orderCount);
                expect(component.p0.orderCount).toBeLessThan(component.p2.orderCount);
            });

        });

        describe('a component holding injected properties', () => {

            it('with no extra decorators', () => {
                // given
                @Component
                class TestClass {
                    @Inject p: TestDependencyClass;
                }
                // when
                let component: TestClass = componentFactory.getComponent(TestClass);
                // then
                expect(component).not.toBeUndefined();
                expect(component).toBeInstanceOf(TestClass);
                expect(component.p).toBeInstanceOf(TestDependencyClass);
            });

            it('with a set order', () => {
                // given
                @Component
                class TestClass {
                    @Inject @Order(4) p0: TestDependencyClass;
                    @Inject @Order(2) p1: TestDependencyClass2;
                    @Inject @Order(7) p2: TestDependencyClass3;
                }
                // when
                let component: TestClass = componentFactory.getComponent(TestClass);
                // then
                expect(component).not.toBeUndefined();
                expect(component).toBeInstanceOf(TestClass);
                expect(component.p0).toBeInstanceOf(TestDependencyClass);
                expect(component.p1).toBeInstanceOf(TestDependencyClass2);
                expect(component.p2).toBeInstanceOf(TestDependencyClass3);
                expect(component.p1.orderCount).toBeLessThan(component.p0.orderCount);
                expect(component.p0.orderCount).toBeLessThan(component.p2.orderCount);
            });

        });

        describe('a derived component', () => {

            it('with no extra decorators', () => {
                // given
                abstract class TestClass { }
                @Component
                class TestDerivedClass extends TestClass { }
                // when
                let component: TestClass = componentFactory.getComponent(TestClass);
                // then
                expect(component).not.toBeUndefined();
                expect(component).toBeInstanceOf(TestClass);
            });

        });

    });

    describe('throws an exception when', () => {

        it('attempting to get a component using a class that is not decorated', () => {
            // given
            class TestClass { }
            // expect
            expect(() => componentFactory.getComponent(TestClass)).toThrowError(/unknown component class/);
        });

        it('attempting to get a component that has multiple implementations', () => {
            // given
            abstract class TestClass { }
            @Component
            class TestDerivedClass1 extends TestClass { }
            @Component
            class TestDerivedClass2 extends TestClass { }
            // expect
            expect(() => componentFactory.getComponent(TestClass)).toThrowError(/multiple component instances found for type/);
        });

    });

});
