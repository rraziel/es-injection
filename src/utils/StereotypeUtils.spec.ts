import {StereotypeUtils} from './StereotypeUtils';
import {Component, Configuration, Controller, Repository, Service} from '../decorators';
import {Stereotype} from '../metadata';

describe('Stereotype utility functions', () => {

    it('can get a component stereotype', () => {
        // given
        @Component
        class TestClass { }
        // expect
        expect(StereotypeUtils.getStereotype(TestClass)).toEqual(Stereotype.COMPONENT);
    });

    it('returns undefined for classes that are not components', () => {
        // given
        class TestClass { }
        // expect
        expect(StereotypeUtils.getStereotype(TestClass)).toBeUndefined();
    });

    describe('can test whether a component is a', () => {

        it('component', () => {
            // given
            @Component
            class TestClass { }
            class TestClass2 { }
            // expect
            expect(StereotypeUtils.isComponent(TestClass)).toEqual(true);
            expect(StereotypeUtils.isComponent(TestClass2)).toEqual(false);
        });

        it('configuration', () => {
            // given
            @Configuration
            class TestClass { }
            class TestClass2 { }
            // expect
            expect(StereotypeUtils.isConfiguration(TestClass)).toEqual(true);
            expect(StereotypeUtils.isConfiguration(TestClass2)).toEqual(false);
        });

        it('controller', () => {
            // given
            @Controller
            class TestClass { }
            class TestClass2 { }
            // expect
            expect(StereotypeUtils.isController(TestClass)).toEqual(true);
            expect(StereotypeUtils.isController(TestClass2)).toEqual(false);
        });

        it('repository', () => {
            // given
            @Repository
            class TestClass { }
            class TestClass2 { }
            // expect
            expect(StereotypeUtils.isRepository(TestClass)).toEqual(true);
            expect(StereotypeUtils.isRepository(TestClass2)).toEqual(false);
        });

        it('service', () => {
            // given
            @Service
            class TestClass { }
            class TestClass2 { }
            // expect
            expect(StereotypeUtils.isService(TestClass)).toEqual(true);
            expect(StereotypeUtils.isService(TestClass2)).toEqual(false);
        });

    });

});
