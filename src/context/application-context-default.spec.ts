import {DefaultApplicationContext} from './application-context-default';
import {ApplicationContext} from './application-context';
import {Component} from '../decorators';

describe('Default application context', () => {
    let applicationContext: ApplicationContext;

    beforeEach(() => {
        applicationContext = new DefaultApplicationContext();
    });

    it('can retrieve a component', () => {
        // given
        @Component
        class TestClass { }
        // when
        let component: TestClass = applicationContext.getComponent(TestClass);
        // then
        expect(component).not.toBeUndefined();
        expect(component).toBeInstanceOf(TestClass);
    });

});
