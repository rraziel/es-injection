import {TypeUtils} from './TypeUtils';
import {ComponentClass} from './ComponentClass';

const DummyClass: ClassDecorator = () => { /* empty */ };
const DummyMethod: MethodDecorator = () => { /* empty */ };
const DummyProperty: PropertyDecorator = () => { /* empty */ };

describe('Type utility functions', () => {

    describe('can iterate', () => {

        it('over ancestors', () => {
            // given
            class TestClass { }
            class TestDerivedClass extends TestClass { }
            class TestDerivedClass2 extends TestDerivedClass { }
            let callback: () => void = jest.fn();
            // when
            TypeUtils.forEachAncestor(TestDerivedClass2, callback);
            // then
            expect(callback).toHaveBeenCalledTimes(2);
            expect(callback).toHaveBeenCalledWith(TestDerivedClass);
            expect(callback).toHaveBeenCalledWith(TestClass);
        });

        it('over all classes', () => {
            // given
            class TestClass { }
            class TestDerivedClass extends TestClass { }
            class TestDerivedClass2 extends TestDerivedClass { }
            let callback: () => void = jest.fn();
            // when
            TypeUtils.forEachClass(TestDerivedClass2, callback);
            // then
            expect(callback).toHaveBeenCalledTimes(3);
            expect(callback).toHaveBeenCalledWith(TestDerivedClass2);
            expect(callback).toHaveBeenCalledWith(TestDerivedClass);
            expect(callback).toHaveBeenCalledWith(TestClass);
        });

        it('over methods', () => {
            // given
            class TestClass { method(): void { /* empty */ }  }
            class TestDerivedClass extends TestClass { derivedmethod(): void { /* empty */ }  }
            class TestDerivedClass2 extends TestDerivedClass { derived2method(): void { /* empty */ } }
            let callback: () => void = jest.fn();
            // when
            TypeUtils.forEachMethod(TestDerivedClass2, callback);
            // then
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith('derived2method', TestDerivedClass2);
        });

        it('over all methods', () => {
            // given
            class TestClass { method(): void { /* empty */ }  }
            class TestDerivedClass extends TestClass { derivedmethod(): void { /* empty */ } }
            class TestDerivedClass2 extends TestDerivedClass { derived2method(): void { /* empty */ } derivedmethod(): void { super.derivedmethod(); } }
            let callback: () => void = jest.fn();
            // when
            TypeUtils.forEachMethod(TestDerivedClass2, callback, true);
            // then
            expect(callback).toHaveBeenCalledTimes(4);
            expect(callback).toHaveBeenCalledWith('derived2method', TestDerivedClass2);
            expect(callback).toHaveBeenCalledWith('derivedmethod', TestDerivedClass2);
            expect(callback).toHaveBeenCalledWith('derivedmethod', TestDerivedClass);
            expect(callback).toHaveBeenCalledWith('method', TestClass);
        });

    });

    describe('can retrieve parent class information when there is', () => {

        it('a single parent', () => {
            // given
            class TestClass { }
            class TestDerivedClass extends TestClass { }
            // when
            let parentClass: ComponentClass<any> = TypeUtils.getParentClass(TestDerivedClass);
            // then
            expect(parentClass).toBe(TestClass);
        });

        it('multiple ancestors', () => {
            // given
            class TestClass { }
            class TestDerivedClass extends TestClass { }
            class TestDerivedClass2 extends TestDerivedClass { }
            // when
            let parentClass: ComponentClass<any> = TypeUtils.getParentClass(TestDerivedClass2);
            let ancestorClass: ComponentClass<any> = TypeUtils.getParentClass(parentClass);
            // then
            expect(parentClass).toBe(TestDerivedClass);
            expect(ancestorClass).toBe(TestClass);
        });

        it('no parent', () => {
            // given
            class TestClass { }
            // when
            let parentClass: ComponentClass<any> = TypeUtils.getParentClass(TestClass);
            // then
            expect(parentClass).toBeUndefined();
        });

    });

    describe('can detect', () => {

        it('array types', () => {
            // given
            let arrayClass: ComponentClass<any> = Array;
            let mapClass: ComponentClass<any> = Map;
            let stringClass: ComponentClass<any> = String;
            let numberClass: ComponentClass<any> = Number;
            // expect
            expect(TypeUtils.isArray(arrayClass)).toBe(true);
            expect(TypeUtils.isArray(mapClass)).toBe(false);
            expect(TypeUtils.isArray(stringClass)).toBe(false);
            expect(TypeUtils.isArray(numberClass)).toBe(false);
        });

        it('map types', () => {
            // given
            let arrayClass: ComponentClass<any> = Array;
            let mapClass: ComponentClass<any> = Map;
            let stringClass: ComponentClass<any> = String;
            let numberClass: ComponentClass<any> = Number;
            // expect
            expect(TypeUtils.isMap(arrayClass)).toBe(false);
            expect(TypeUtils.isMap(mapClass)).toBe(true);
            expect(TypeUtils.isMap(stringClass)).toBe(false);
            expect(TypeUtils.isMap(numberClass)).toBe(false);
        });

        it('string types', () => {
            // given
            let arrayClass: ComponentClass<any> = Array;
            let mapClass: ComponentClass<any> = Map;
            let stringClass: ComponentClass<any> = String;
            let numberClass: ComponentClass<any> = Number;
            // expect
            expect(TypeUtils.isString(arrayClass)).toBe(false);
            expect(TypeUtils.isString(mapClass)).toBe(false);
            expect(TypeUtils.isString(stringClass)).toBe(true);
            expect(TypeUtils.isString(numberClass)).toBe(false);
        });

        it('number types', () => {
            // given
            let arrayClass: ComponentClass<any> = Array;
            let mapClass: ComponentClass<any> = Map;
            let stringClass: ComponentClass<any> = String;
            let numberClass: ComponentClass<any> = Number;
            // expect
            expect(TypeUtils.isNumber(arrayClass)).toBe(false);
            expect(TypeUtils.isNumber(mapClass)).toBe(false);
            expect(TypeUtils.isNumber(stringClass)).toBe(false);
            expect(TypeUtils.isNumber(numberClass)).toBe(true);
        });

    });

});
