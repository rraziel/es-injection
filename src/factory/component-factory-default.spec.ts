import {DefaultComponentFactory} from './component-factory-default';
import {Component} from '../decorators';

describe('Default component factory', () => {
    let componentFactory: DefaultComponentFactory;

    beforeEach(() => {
        componentFactory = new DefaultComponentFactory();
    });

    it('can retrieve a component', () => {
        // given
        @Component
        class TestClass { }
        // when
        let component: TestClass = componentFactory.getComponent(TestClass);
        // then
        expect(component).not.toBeUndefined();
        expect(component).toBeInstanceOf(TestClass);
    });

    describe('throws an exception when', () => {

        it('attempting to get a component using a class that is not decorated', () => {
            // given
            class TestClass { }
            // expect
            expect(() => componentFactory.getComponent(TestClass)).toThrowError(/unknown component class/);
        });

    });

});
