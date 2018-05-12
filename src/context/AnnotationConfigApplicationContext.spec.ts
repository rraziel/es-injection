import {AnnotationConfigApplicationContext} from './AnnotationConfigApplicationContext';
import {ApplicationContext} from './ApplicationContext';
import {Configuration} from '../decorators';

describe('Annotation configuration application context', () => {
    let applicationContext: AnnotationConfigApplicationContext;

    beforeEach(() => {
        applicationContext = new AnnotationConfigApplicationContext({});
    });

    describe.skip('can register', () => {

        it('a simple configuration class', () => {
            // given
            @Configuration
            class TestConfiguration {}
            // expect
            expect(() => applicationContext.register(TestConfiguration)).not.toThrow();
        });

    });

    it.only('returns itself as the application context component', async () => {
        // given
        applicationContext.refresh();
        // when
        let applicationContextComponent: ApplicationContext = await applicationContext.getComponent(ApplicationContext);
        // then
        expect(applicationContextComponent).toBe(applicationContext);
    });

    describe.skip('throws an exception when', () => {

        it('registering a class that is not a configuration class', () => {
            // given
            class TestConfiguration { }
            // expect
            expect(() => applicationContext.register(TestConfiguration)).toThrowError(/unable to register/);
        });

    });

});
