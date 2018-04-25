import {AnnotationConfigApplicationContext} from './AnnotationConfigApplicationContext';
import {ApplicationContext} from './ApplicationContext';
import {Configuration} from '../decorators';

describe('Annotation configuration application context', () => {
    let applicationContext: AnnotationConfigApplicationContext;

    beforeEach(() => {
        applicationContext = new AnnotationConfigApplicationContext({});
    });

    describe('can register', () => {

        it('a simple configuration class', () => {
            // given
            @Configuration
            class TestConfiguration {}
            // expect
            expect(() => applicationContext.register(TestConfiguration)).not.toThrow();
        });

    });

    describe('throws an exception when', () => {

        it('registering a class that is not a configuration class', () => {
            // given
            class TestConfiguration { }
            // expect
            expect(() => applicationContext.register(TestConfiguration)).toThrowError(/unable to register/);
        });

    });

});
