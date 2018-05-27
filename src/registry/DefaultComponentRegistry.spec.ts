import {DefaultComponentRegistry} from './DefaultComponentRegistry';
import {ClassConstructor} from '../utils';

describe('Default component registry', () => {
    let componentRegistry: DefaultComponentRegistry;

    beforeEach(() => {
        componentRegistry = new DefaultComponentRegistry();
    });

    it('can test whether a component is registered', () => {
        // given
        class TestClass { }
        componentRegistry.registerComponent('test', TestClass);
        // expect
        expect(componentRegistry.containsComponent('test')).toBe(true);
        expect(componentRegistry.containsComponentClass(TestClass)).toBe(true);
    });

    it('can get a component name from a component class', () => {
        // given
        class TestClass { }
        componentRegistry.registerComponent('test', TestClass);
        // when
        let componentName: string = componentRegistry.getComponentName(TestClass);
        // then
        expect(componentName).toBe('test');
    });

    it('can get a component class from a component name', () => {
        // given
        class TestClass { }
        componentRegistry.registerComponent('test', TestClass);
        // when
        let componentClass: ClassConstructor<TestClass> = componentRegistry.getComponentClass('test');
        // then
        expect(componentClass).toBe(TestClass);
    });

    it('supports class hierarchies', () => {
        // given
        abstract class TestClass { }
        class TestDerivedClass extends TestClass { }
        // when
        componentRegistry.registerComponent('test', TestDerivedClass);
        // then
        expect(componentRegistry.containsComponentClass(TestClass)).toBe(true);
        expect(componentRegistry.containsComponentClass(TestDerivedClass)).toBe(true);
    });

    it('can resolve a component class', () => {
        // given
        abstract class TestClass { }
        class TestDerivedClass extends TestClass { }
        class TestDerivedClass2 extends TestDerivedClass { }
        componentRegistry.registerComponent('test', TestDerivedClass);
        componentRegistry.registerComponent('test2', TestDerivedClass2);
        // when
        let implementationClasses: Set<ClassConstructor<TestClass>> = componentRegistry.resolveComponentClass(TestClass);
        // then
        expect(implementationClasses).not.toBeUndefined();
        expect(implementationClasses.size).toBe(2);
        expect(implementationClasses).toContain(TestDerivedClass);
        expect(implementationClasses).toContain(TestDerivedClass2);
    });

});
