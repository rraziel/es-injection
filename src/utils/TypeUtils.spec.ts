import {TypeUtils} from './TypeUtils';
import {ComponentClass} from './ComponentClass';

const DummyClass: ClassDecorator = () => { /* empty */ };
const DummyMethod: MethodDecorator = () => { /* empty */ };
const DummyProperty: PropertyDecorator = () => { /* empty */ };

describe('Type utility functions', () => {

    describe('can retrieve', () => {

        it('all classes', () => {
            // given
            class TestClass { }
            class TestDerivedClass extends TestClass { }
            class TestDerivedClass2 extends TestDerivedClass { }
            // when
            let classes: Array<ComponentClass<any>> = TypeUtils.getClasses(TestDerivedClass2);
            // then
            expect(classes).not.toBeUndefined();
            expect(classes.length).toBe(3);
            expect(classes[0]).toBe(TestDerivedClass2);
            expect(classes[1]).toBe(TestDerivedClass);
            expect(classes[2]).toBe(TestClass);
        });

        it('ancestors', () => {
            // given
            class TestClass { }
            class TestDerivedClass extends TestClass { }
            class TestDerivedClass2 extends TestDerivedClass { }
            // when
            let ancestorClasses: Array<ComponentClass<any>> = TypeUtils.getAncestors(TestDerivedClass2);
            // then
            expect(ancestorClasses).not.toBeUndefined();
            expect(ancestorClasses.length).toBe(2);
            expect(ancestorClasses[0]).toBe(TestDerivedClass);
            expect(ancestorClasses[1]).toBe(TestClass);
        });

        it('method names for a specific class', () => {
            // given
            class TestClass { method(): void { /* empty */ }  }
            class TestDerivedClass extends TestClass { derivedmethod(): void { /* empty */ }  }
            class TestDerivedClass2 extends TestDerivedClass { derived2method(): void { /* empty */ } }
            // when
            let methodNames: Array<string> = TypeUtils.getMethodNames(TestDerivedClass2);
            // then
            expect(methodNames).not.toBeUndefined();
            expect(methodNames.length).toBe(1);
            expect(methodNames[0]).toBe('derived2method');
        });

        it('method names for all classes', () => {
            // given
            class TestClass { method(): void { /* empty */ }  }
            class TestDerivedClass extends TestClass { derivedmethod(): void { /* empty */ } }
            class TestDerivedClass2 extends TestDerivedClass { derived2method(): void { /* empty */ } derivedmethod(): void { super.derivedmethod(); } }
            // when
            let methodNames: Array<string> = TypeUtils.getMethodNames(TestDerivedClass2, true);
            // then
            expect(methodNames).not.toBeUndefined();
            expect(methodNames.length).toBe(4);
            expect(methodNames[0]).toBe('derived2method');
            expect(methodNames[1]).toBe('derivedmethod');
            expect(methodNames[2]).toBe('derivedmethod'); // TODO: do we really want duplicates?
            expect(methodNames[3]).toBe('method');
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
