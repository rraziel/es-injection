import {ComponentClass} from './ComponentClass';
import {ReflectionUtils} from './ReflectionUtils';

const DummyClass: ClassDecorator = () => { /* empty */ };
const DummyMethod: MethodDecorator = () => { /* empty */ };
const DummyProperty: PropertyDecorator = () => { /* empty */ };

describe('Reflection utility functions', () => {

    it('can get a property class', () => {
        // given
        class TestPropertyClass { }
        class TestClass {
            @DummyProperty prop1!: number;
            @DummyProperty prop2!: string;
            @DummyProperty prop3!: TestPropertyClass;
        }
        // when
        const prop1Class: ComponentClass<any> = ReflectionUtils.getPropertyClass(TestClass, 'prop1');
        const prop2Class: ComponentClass<any> = ReflectionUtils.getPropertyClass(TestClass, 'prop2');
        const prop3Class: ComponentClass<any> = ReflectionUtils.getPropertyClass(TestClass, 'prop3');
        // then
        expect(prop1Class).toBe(Number);
        expect(prop2Class).toBe(String);
        expect(prop3Class).toBe(TestPropertyClass);
    });

    it('can get a constructor parameter class', () => {
        // given
        class TestParameterClass { }
        @DummyClass
        class TestClass {
            constructor(p0: number, p1: string, p2: TestParameterClass) { /* empty */ }
        }
        // when
        const param0Class: ComponentClass<any> = ReflectionUtils.getParameterClass(TestClass, undefined, 0);
        const param1Class: ComponentClass<any> = ReflectionUtils.getParameterClass(TestClass, undefined, 1);
        const param2Class: ComponentClass<any> = ReflectionUtils.getParameterClass(TestClass, undefined, 2);
        // then
        expect(param0Class).toBe(Number);
        expect(param1Class).toBe(String);
        expect(param2Class).toBe(TestParameterClass);
    });

    it('can get a method parameter class', () => {
        // given
        class TestParameterClass { }
        class TestClass {
            @DummyMethod method(p0: number, p1: string, p2: TestParameterClass): void { /* empty */ }
        }
        // when
        const param0Class: ComponentClass<any> = ReflectionUtils.getParameterClass(TestClass, 'method', 0);
        const param1Class: ComponentClass<any> = ReflectionUtils.getParameterClass(TestClass, 'method', 1);
        const param2Class: ComponentClass<any> = ReflectionUtils.getParameterClass(TestClass, 'method', 2);
        // then
        expect(param0Class).toBe(Number);
        expect(param1Class).toBe(String);
        expect(param2Class).toBe(TestParameterClass);
    });

    it('can get a method return class', () => {
        // given
        class TestReturnClass { }
        class TestClass {
            @DummyMethod method(): TestReturnClass { return null as any; }
        }
        // when
        const returnClass: ComponentClass<any>|undefined = ReflectionUtils.getReturnClass(TestClass, 'method');
        // then
        expect(returnClass).toBe(TestReturnClass);
    });

});
