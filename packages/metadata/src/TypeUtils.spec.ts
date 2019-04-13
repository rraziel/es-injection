import {ComponentClass} from './ComponentClass';
import {TypeUtils} from './TypeUtils';

describe('Type utility functions', () => {

    describe('can retrieve', () => {

        it('all classes', () => {
            // given
            class TestClass { }
            class TestDerivedClass extends TestClass { }
            class TestDerivedClass2 extends TestDerivedClass { }
            // when
            const classes: Array<ComponentClass<any>> = TypeUtils.getClasses(TestDerivedClass2);
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
            const ancestorClasses: Array<ComponentClass<any>> = TypeUtils.getAncestors(TestDerivedClass2);
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
            const methodNames: Array<string> = TypeUtils.getMethodNames(TestDerivedClass2);
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
            const methodNames: Array<string> = TypeUtils.getMethodNames(TestDerivedClass2, true);
            // then
            expect(methodNames).toBeDefined();
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
            const parentClass: ComponentClass<any>|undefined = TypeUtils.getParentClass(TestDerivedClass);
            // then
            expect(parentClass).toBe(TestClass);
        });

        it('multiple ancestors', () => {
            // given
            class TestClass { }
            class TestDerivedClass extends TestClass { }
            class TestDerivedClass2 extends TestDerivedClass { }
            // when
            const parentClass: ComponentClass<any> = TypeUtils.getParentClass(TestDerivedClass2)!;
            const ancestorClass: ComponentClass<any>|undefined = TypeUtils.getParentClass(parentClass);
            // then
            expect(parentClass).toBe(TestDerivedClass);
            expect(ancestorClass).toBe(TestClass);
        });

        it('no parent', () => {
            // given
            class TestClass { }
            // when
            const parentClass: ComponentClass<any>|undefined = TypeUtils.getParentClass(TestClass);
            // then
            expect(parentClass).toBeUndefined();
        });

    });

    describe('can detect', () => {

        it('array types', () => {
            // given
            const arrayClass: ComponentClass<any> = Array;
            const mapClass: ComponentClass<any> = Map;
            const stringClass: ComponentClass<any> = String;
            const numberClass: ComponentClass<any> = Number;
            // expect
            expect(TypeUtils.isArrayType(arrayClass)).toBe(true);
            expect(TypeUtils.isArrayType(mapClass)).toBe(false);
            expect(TypeUtils.isArrayType(stringClass)).toBe(false);
            expect(TypeUtils.isArrayType(numberClass)).toBe(false);
        });

        it('map types', () => {
            // given
            const arrayClass: ComponentClass<any> = Array;
            const mapClass: ComponentClass<any> = Map;
            const stringClass: ComponentClass<any> = String;
            const numberClass: ComponentClass<any> = Number;
            // expect
            expect(TypeUtils.isMapType(arrayClass)).toBe(false);
            expect(TypeUtils.isMapType(mapClass)).toBe(true);
            expect(TypeUtils.isMapType(stringClass)).toBe(false);
            expect(TypeUtils.isMapType(numberClass)).toBe(false);
        });

        it('string types', () => {
            // given
            const arrayClass: ComponentClass<any> = Array;
            const mapClass: ComponentClass<any> = Map;
            const stringClass: ComponentClass<any> = String;
            const numberClass: ComponentClass<any> = Number;
            // expect
            expect(TypeUtils.isStringType(arrayClass)).toBe(false);
            expect(TypeUtils.isStringType(mapClass)).toBe(false);
            expect(TypeUtils.isStringType(stringClass)).toBe(true);
            expect(TypeUtils.isStringType(numberClass)).toBe(false);
        });

        it('number types', () => {
            // given
            const arrayClass: ComponentClass<any> = Array;
            const mapClass: ComponentClass<any> = Map;
            const stringClass: ComponentClass<any> = String;
            const numberClass: ComponentClass<any> = Number;
            // expect
            expect(TypeUtils.isNumberType(arrayClass)).toBe(false);
            expect(TypeUtils.isNumberType(mapClass)).toBe(false);
            expect(TypeUtils.isNumberType(stringClass)).toBe(false);
            expect(TypeUtils.isNumberType(numberClass)).toBe(true);
        });

        it('promise objects', () => {
            // given
            const promise: Promise<boolean> = Promise.resolve(true);
            const nonPromise: boolean = true;
            // expect
            expect(TypeUtils.isPromise(promise)).toBe(true);
            expect(TypeUtils.isPromise(nonPromise)).toBe(false);
        });

    });

});
