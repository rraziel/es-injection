import {DefaultComponentFactory} from './DefaultComponentFactory';
import {Component, ElementClass, Inject, Order, PostConstruct, Scope} from '../decorators';
import {ScopeType} from '../metadata';

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
                    l: TestBaseDependencyClass[];
                    constructor(@ElementClass(TestBaseDependencyClass) l: TestBaseDependencyClass[]) { this.l = l; }
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

            it('with an injected array', () => {
                // given
                @Component
                class TestClass {
                    l: TestBaseDependencyClass[];
                    @Inject method(@ElementClass(TestBaseDependencyClass) l: TestBaseDependencyClass[]) { this.l = l; }
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

            it('with a set order', () => {
                // given
                @Component
                class TestClass {
                    deps: Array<any> = [];
                    @Inject @Order(4) method0(p0: TestDependencyClass): void { this.deps.push(p0); }
                    @Inject @Order(2) method1(p1: TestDependencyClass2): void { this.deps.push(p1); }
                    @Inject @Order(7) method2(p2: TestDependencyClass3): void { this.deps.push(p2); }
                }
                // when
                let component: TestClass = componentFactory.getComponent(TestClass);
                // then
                expect(component).not.toBeUndefined();
                expect(component).toBeInstanceOf(TestClass);
                expect(component.deps.length).toBe(3);
                expect(component.deps[0]).toBeInstanceOf(TestDependencyClass2);
                expect(component.deps[1]).toBeInstanceOf(TestDependencyClass);
                expect(component.deps[2]).toBeInstanceOf(TestDependencyClass3);
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

    describe('handles a component\'s lifecycle', () => {

        it('calls methods with a @PostConstruct annotation after construction', () => {
            // given
            @Component
            class TestClass {
                method1Called: boolean = false;
                method2Called: boolean = false;
                method3Called: boolean = false;
                @PostConstruct
                testMethod1(): void { this.method1Called = true; }
                @PostConstruct
                testMethod2(): void { this.method2Called = true; }
                testMethod3(): void { this.method3Called = true; }
            }
            // when
            let component: TestClass = componentFactory.getComponent(TestClass);
            // then
            expect(component).not.toBeUndefined();
            expect(component.method1Called).toBe(true);
            expect(component.method2Called).toBe(true);
            expect(component.method3Called).toBe(false);
        });

    });

    describe('handles prototype components', () => {

        it('creates a new instance for each requested component', () => {
            // given
            @Component
            @Scope(ScopeType.PROTOTYPE)
            class TestPrototype { value: number = n++; }
            @Component
            class TestClass {
                instances: Array<TestPrototype>;
                @Inject
                testMethod(instance1: TestPrototype, instance2: TestPrototype, instance3: TestPrototype): void {
                    this.instances = [instance1, instance2, instance3];
                }
            }
            // when
            let component: TestClass = componentFactory.getComponent(TestClass);
            // then
            expect(component).not.toBeUndefined();
            expect(component.instances[0]).not.toBeUndefined();
            expect(component.instances[1]).not.toBeUndefined();
            expect(component.instances[2]).not.toBeUndefined();
            expect(component.instances[0].value).not.toBe(component.instances[1].value);
            expect(component.instances[0].value).not.toBe(component.instances[2].value);
            expect(component.instances[1].value).not.toBe(component.instances[2].value);
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
