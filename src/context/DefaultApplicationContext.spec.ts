import {DefaultApplicationContext} from './DefaultApplicationContext';
import {ApplicationContext} from './ApplicationContext';
import {Component, Scope} from '../decorators';
import {ScopeType} from '../metadata';
import {ComponentRegistry} from '../registry';
import {ComponentFactory} from '../factory';
import {ClassConstructor} from '../utils';
import {createMockInstance} from 'jest-create-mock-instance';

describe('Default application context', () => {
    let applicationContext: DefaultApplicationContext;
    let componentRegistry: jest.Mocked<ComponentRegistry>;
    let componentFactory: jest.Mocked<ComponentFactory>;

    beforeEach(() => {
        componentFactory = createMockInstance(ComponentFactory);
        componentFactory.newInstance = jest.fn();
        componentRegistry = createMockInstance(ComponentRegistry);
        componentRegistry.registerComponent = jest.fn();
        componentRegistry.containsComponentClass = jest.fn();
        componentRegistry.containsComponentClass.mockReturnValue(true);
        componentRegistry.getComponentName = jest.fn(componentClass => componentClass.name);
        componentRegistry.getComponentClass = jest.fn();
        componentRegistry.resolveComponentClass = jest.fn();
        applicationContext = new DefaultApplicationContext({}, componentRegistry, componentFactory);
    });

    describe('returns pre-defined components', () => {

        it('itself as the application context component', async () => {
            // given
            await applicationContext.start();
            // when
            let applicationContextComponent: ApplicationContext = await applicationContext.getComponent(ApplicationContext);
            // then
            expect(applicationContextComponent).toBe(applicationContext);
        });

    });

    describe('can be used to obtain components', () => {

        it('re-uses the same instance for singleton-scoped components', async () => {
            // given
            @Component
            @Scope(ScopeType.SINGLETON)
            class TestSingleton { }
            componentRegistry.getComponentClass.mockImplementation(componentName => TestSingleton);
            componentFactory.newInstance.mockImplementationOnce(() => new TestSingleton());
            applicationContext.registerComponentClass(TestSingleton);
            await applicationContext.start();
            // when
            let singleton1: TestSingleton = await applicationContext.getComponent(TestSingleton);
            let singleton2: TestSingleton = await applicationContext.getComponent(TestSingleton);
            // then
            expect(singleton1).not.toBeUndefined();
            expect(singleton2).not.toBeUndefined();
            expect(singleton1).toBe(singleton2);
        });

        it('creates a new instance for prototype-scoped components', async () => {
            // given
            @Component
            @Scope(ScopeType.PROTOTYPE)
            class TestPrototype { }
            componentRegistry.getComponentClass.mockImplementation(componentName => TestPrototype);
            componentFactory.newInstance.mockImplementation(() => new TestPrototype());
            applicationContext.registerComponentClass(TestPrototype);
            await applicationContext.start();
            // when
            let prototype1: TestPrototype = await applicationContext.getComponent(TestPrototype);
            let prototype2: TestPrototype = await applicationContext.getComponent(TestPrototype);
            // then
            expect(prototype1).not.toBeUndefined();
            expect(prototype2).not.toBeUndefined();
            expect(prototype1).not.toBe(prototype2);
        });

    });

    describe('throws an exception when', () => {

        it('registering a component after the context has started', async () => {
            // given
            @Component
            class TestClass { }
            await applicationContext.start();
            // expect
            expect(() => applicationContext.registerComponentClass(TestClass)).toThrowError('class TestClass cannot be registered after the context initialization phase');
        });

        it('registering a component that is not decorated', () => {
            // given
            class TestClass { }
            // expect
            expect(() => applicationContext.registerComponentClass(TestClass)).toThrowError('class TestClass does not appear to be a component');
        });

        it('registering a component base class', () => {
            // given
            class TestClass { }
            @Component
            class TestDerivedClass extends TestClass { }
            // expect
            expect(() => applicationContext.registerComponentClass(TestClass)).toThrowError('class TestClass does not appear to be a component');
        });

        it('attempting to get a component before the context has started', () => {
            // given
            class TestClass { }
            // expect
            expect(applicationContext.getComponent(TestClass)).rejects.toThrowError('unable to retrieve a TestClass component: the context is not started');
        });

        it('attempting to get a component using a class that is not registered', async () => {
            // given
            class TestClass { }
            await applicationContext.start();
            componentRegistry.containsComponentClass.mockReturnValueOnce(false);
            // expect
            expect(applicationContext.getComponent(TestClass)).rejects.toThrowError('component class TestClass has not been registered in this context');
        });

        it('attempting to get a component that has multiple implementations', async () => {
            // given
            abstract class TestClass { }
            @Component
            class TestDerivedClass1 extends TestClass { }
            @Component
            class TestDerivedClass2 extends TestClass { }
            componentRegistry.resolveComponentClass.mockReturnValueOnce(new Set([TestDerivedClass1, TestDerivedClass2]));
            componentRegistry.getComponentClass.mockReturnValueOnce(TestClass);
            componentRegistry.getComponentName.mockReturnValueOnce(undefined);
            // when
            applicationContext.registerComponentClass(TestDerivedClass1);
            applicationContext.registerComponentClass(TestDerivedClass2);
            await applicationContext.start();
            // expect
            expect(componentRegistry.registerComponent).toHaveBeenCalledTimes(2);
            expect(componentRegistry.registerComponent).toHaveBeenCalledWith('testDerivedClass1', TestDerivedClass1);
            expect(componentRegistry.registerComponent).toHaveBeenCalledWith('testDerivedClass2', TestDerivedClass2);
            expect(applicationContext.getComponent(TestClass)).rejects.toThrowError('component class TestClass has more than one registered implementation: TestDerivedClass1, TestDerivedClass2');
        });

    });

});
