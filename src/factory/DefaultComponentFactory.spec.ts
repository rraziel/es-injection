import {DefaultComponentFactory} from './DefaultComponentFactory';
import {ComponentFactoryResolverSettings} from './ComponentFactoryResolverSettings';
import {Component, ElementClass, Inject, Order, PostConstruct, Scope} from '../decorators';
import {ScopeType} from '../metadata';
import {createMockInstance} from 'jest-create-mock-instance';

abstract class TestBaseDependencyClass { }
@Component
class TestDependencyClass extends TestBaseDependencyClass { }

describe('Default component factory', () => {
    let componentFactory: DefaultComponentFactory;
    let resolvers: jest.Mocked<ComponentFactoryResolverSettings>;

    beforeEach(() => {
        resolvers = createMockInstance(ComponentFactoryResolverSettings);
        resolvers.array = jest.fn();
        resolvers.component = jest.fn();
        resolvers.constant = jest.fn();
        resolvers.map = jest.fn();
        componentFactory = new DefaultComponentFactory({
            resolvers: resolvers
        });
    });

    describe('can instantiate', () => {

        it('a simple component', async () => {
            // given
            @Component
            class TestClass { }
            // when
            let component: TestClass = await componentFactory.newInstance(TestClass);
            // then
            expect(component).not.toBeUndefined();
            expect(component).toBeInstanceOf(TestClass);
        });

        describe('a component holding injected constructor parameters', () => {

            it('with no extra decorators', async () => {
                // given
                @Component
                class TestClass {
                    p: TestDependencyClass;
                    constructor(p: TestDependencyClass) { this.p = p; }
                }
                resolvers.component.mockImplementationOnce(async componentClass => (componentClass === TestDependencyClass) && new TestDependencyClass());
                // when
                let component: TestClass = await componentFactory.newInstance(TestClass);
                // then
                expect(resolvers.component).toHaveBeenCalledTimes(1);
                expect(component).toBeInstanceOf(TestClass);
                expect(component.p).toBeInstanceOf(TestDependencyClass);
            });

            it.skip('with an injected array', async () => {
                // given
                @Component
                class TestClass {
                    l: Array<TestDependencyClass>;
                    constructor(@ElementClass(TestDependencyClass) l: Array<TestBaseDependencyClass>) { this.l = l; }
                }
                resolvers.array.mockImplementationOnce(async componentClass => (componentClass === TestDependencyClass) && [new TestDependencyClass(), new TestDependencyClass()]);
                // when
                let component: TestClass = await componentFactory.newInstance(TestClass);
                // then
                expect(resolvers.array).toHaveBeenCalledTimes(1);
                expect(component).not.toBeUndefined();
                expect(component).toBeInstanceOf(TestClass);
                expect(component.l).not.toBeUndefined();
                expect(component.l.length).toBe(2);
                expect(component.l[0]).toBeInstanceOf(TestDependencyClass);
                expect(component.l[1]).toBeInstanceOf(TestDependencyClass);
            });

            it.skip('with an injected map', async () => {
                // given
                @Component
                class TestClass {
                    m: Map<string, TestDependencyClass>;
                    constructor(@ElementClass(TestDependencyClass) m: Map<string, TestDependencyClass>) { this.m = m; }
                }
                resolvers.map.mockImplementationOnce(async componentClass => (componentClass === TestDependencyClass) && new Map<string, TestDependencyClass>([
                    ['test1', new TestDependencyClass()],
                    ['test2', new TestDependencyClass()]
                ]));
                // when
                let component: TestClass = await componentFactory.newInstance(TestClass);
                // then
                expect(resolvers.map).toHaveBeenCalledTimes(1);
                expect(component).not.toBeUndefined();
                expect(component).toBeInstanceOf(TestClass);
                expect(component.m).not.toBeUndefined();
                expect(component.m.size).toBe(2);
                expect(component.m.get('test1')).toBeInstanceOf(TestDependencyClass);
                expect(component.m.get('test2')).toBeInstanceOf(TestDependencyClass);
            });

        });

        describe('a component holding injected method parameters', () => {

            it('with no extra decorators', async () => {
                // given
                @Component
                class TestClass {
                    p: TestDependencyClass;
                    @Inject method(p: TestDependencyClass): void { this.p = p; }
                }
                resolvers.component.mockImplementationOnce(async componentClass => (componentClass === TestDependencyClass) && new TestDependencyClass());
                // when
                let component: TestClass = await componentFactory.newInstance(TestClass);
                // then
                expect(resolvers.component).toHaveBeenCalledTimes(1);
                expect(component).toBeInstanceOf(TestClass);
                expect(component.p).toBeInstanceOf(TestDependencyClass);
            });

            it.skip('with an injected array', async () => {
                // given
                @Component
                class TestClass {
                    l: Array<TestDependencyClass>;
                    @Inject method(@ElementClass(TestDependencyClass) l: Array<TestBaseDependencyClass>) { this.l = l; }
                }
                resolvers.array.mockImplementationOnce(async componentClass => (componentClass === TestDependencyClass) && [new TestDependencyClass(), new TestDependencyClass()]);
                // when
                let component: TestClass = await componentFactory.newInstance(TestClass);
                // then
                expect(resolvers.array).toHaveBeenCalledTimes(1);
                expect(component).not.toBeUndefined();
                expect(component).toBeInstanceOf(TestClass);
                expect(component.l).not.toBeUndefined();
                expect(component.l.length).toBe(2);
                expect(component.l[0]).toBeInstanceOf(TestDependencyClass);
                expect(component.l[1]).toBeInstanceOf(TestDependencyClass);
            });

            it.skip('with an injected map', async () => {
                // given
                @Component
                class TestClass {
                    m: Map<string, TestDependencyClass>;
                    @Inject method(@ElementClass(TestDependencyClass) m: Map<string, TestDependencyClass>) { this.m = m; }
                }
                resolvers.map.mockImplementationOnce(async componentClass => (componentClass === TestDependencyClass) && new Map<string, TestDependencyClass>([
                    ['test1', new TestDependencyClass()],
                    ['test2', new TestDependencyClass()]
                ]));
                // when
                let component: TestClass = await componentFactory.newInstance(TestClass);
                // then
                expect(resolvers.map).toHaveBeenCalledTimes(1);
                expect(component).not.toBeUndefined();
                expect(component).toBeInstanceOf(TestClass);
                expect(component.m).not.toBeUndefined();
                expect(component.m.size).toBe(2);
                expect(component.m.get('test1')).toBeInstanceOf(TestDependencyClass);
                expect(component.m.get('test2')).toBeInstanceOf(TestDependencyClass);
            });

            it('with a set order', async () => {
                // given
                @Component
                class TestClass {
                    p0: TestDependencyClass;
                    p1: TestDependencyClass;
                    p2: TestDependencyClass;
                    @Inject @Order(4) method0(p0: TestDependencyClass): void { this.p0 = p0; }
                    @Inject @Order(2) method1(p1: TestDependencyClass): void { this.p1 = p1; }
                    @Inject @Order(7) method2(p2: TestDependencyClass): void { this.p2 = p2; }
                }
                let instances: Array<TestDependencyClass> = [new TestDependencyClass(), new TestDependencyClass(), new TestDependencyClass()];
                let i: number = 0;
                resolvers.component.mockImplementation(async componentClass => (componentClass === TestDependencyClass) && instances[i++]);
                // when
                let component: TestClass = await componentFactory.newInstance(TestClass);
                // then
                expect(resolvers.component).toHaveBeenCalledTimes(3);
                expect(component).toBeInstanceOf(TestClass);
                expect(component.p0).toBe(instances[1]);
                expect(component.p1).toBe(instances[0]);
                expect(component.p2).toBe(instances[2]);
            });

        });

        describe('a component holding injected properties', () => {

            it('with no extra decorators', async () => {
                // given
                @Component
                class TestClass {
                    @Inject p: TestDependencyClass;
                }
                resolvers.component.mockImplementationOnce(async componentClass => (componentClass === TestDependencyClass) && new TestDependencyClass());
                // when
                let component: TestClass = await componentFactory.newInstance(TestClass);
                // then
                expect(resolvers.component).toHaveBeenCalledTimes(1);
                expect(component).not.toBeUndefined();
                expect(component).toBeInstanceOf(TestClass);
                expect(component.p).toBeInstanceOf(TestDependencyClass);
            });

            it.skip('with an injected array', async () => {
                // given
                @Component
                class TestClass {
                    @Inject @ElementClass(TestDependencyClass)
                    l: Array<TestDependencyClass>;
                }
                resolvers.array.mockImplementationOnce(async componentClass => (componentClass === TestDependencyClass) && [new TestDependencyClass(), new TestDependencyClass()]);
                // when
                let component: TestClass = await componentFactory.newInstance(TestClass);
                // then
                expect(resolvers.array).toHaveBeenCalledTimes(1);
                expect(component).not.toBeUndefined();
                expect(component).toBeInstanceOf(TestClass);
                expect(component.l).not.toBeUndefined();
                expect(component.l.length).toBe(2);
                expect(component.l[0]).toBeInstanceOf(TestDependencyClass);
                expect(component.l[1]).toBeInstanceOf(TestDependencyClass);
            });

            it.skip('with an injected map', async () => {
                // given
                @Component
                class TestClass {
                    @Inject @ElementClass(TestDependencyClass)
                    m: Map<string, TestDependencyClass>;
                }
                resolvers.map.mockImplementationOnce(async componentClass => (componentClass === TestDependencyClass) && new Map<string, TestDependencyClass>([
                    ['test1', new TestDependencyClass()],
                    ['test2', new TestDependencyClass()]
                ]));
                // when
                let component: TestClass = await componentFactory.newInstance(TestClass);
                // then
                expect(resolvers.map).toHaveBeenCalledTimes(1);
                expect(component).not.toBeUndefined();
                expect(component).toBeInstanceOf(TestClass);
                expect(component.m).not.toBeUndefined();
                expect(component.m.size).toBe(2);
                expect(component.m.get('test1')).toBeInstanceOf(TestDependencyClass);
                expect(component.m.get('test2')).toBeInstanceOf(TestDependencyClass);
            });

            it('with a set order', async () => {
                // given
                @Component
                class TestClass {
                    @Inject @Order(4) p0: TestDependencyClass;
                    @Inject @Order(2) p1: TestDependencyClass;
                    @Inject @Order(7) p2: TestDependencyClass;
                }
                let instances: Array<TestDependencyClass> = [new TestDependencyClass(), new TestDependencyClass(), new TestDependencyClass()];
                let i: number = 0;
                resolvers.component.mockImplementation(async componentClass => (componentClass === TestDependencyClass) && instances[i++]);
                // when
                let component: TestClass = await componentFactory.newInstance(TestClass);
                // then
                expect(resolvers.component).toHaveBeenCalledTimes(3);
                expect(component).not.toBeUndefined();
                expect(component).toBeInstanceOf(TestClass);
                expect(component.p0).toBe(instances[1]);
                expect(component.p1).toBe(instances[0]);
                expect(component.p2).toBe(instances[2]);
            });

        });

    });

    describe('handles a component\'s lifecycle', () => {

        it('calls methods with a @PostConstruct annotation after construction', async () => {
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
            let component: TestClass = await componentFactory.newInstance(TestClass);
            // then
            expect(component).not.toBeUndefined();
            expect(component.method1Called).toBe(true);
            expect(component.method2Called).toBe(true);
            expect(component.method3Called).toBe(false);
        });

    });

});
