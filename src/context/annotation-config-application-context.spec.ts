import {AnnotationConfigApplicationContext} from './annotation-config-application-context';
import {ApplicationContext} from './application-context';
import {Configuration} from '../decorators';

describe('Annotation configuration application context', () => {
    let applicationContext: AnnotationConfigApplicationContext;

    beforeEach(() => {
        applicationContext = new AnnotationConfigApplicationContext();
    });

    describe('can register', () => {

        it('a simple configuration class', () => {
            // given
            @Configuration
            class TestConfiguration {}
            // when
            applicationContext.register(TestConfiguration);
            // then
            // TODO
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
