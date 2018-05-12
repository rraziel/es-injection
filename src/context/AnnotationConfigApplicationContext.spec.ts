import {AnnotationConfigApplicationContext} from './AnnotationConfigApplicationContext';
import {ApplicationContext} from './ApplicationContext';
import {Component, ComponentScan, Configuration, Import} from '../decorators';

describe('Annotation configuration application context', () => {
    let applicationContext: AnnotationConfigApplicationContext;

    beforeEach(() => {
        applicationContext = new AnnotationConfigApplicationContext({});
    });

    describe('can register', () => {

        it('a simple configuration class', () => {
            // given
            @Configuration
            class TestConfiguration { }
            // expect
            expect(() => applicationContext.register(TestConfiguration)).not.toThrow();
        });

        it('a configuration class with scanned components', async () => {
            // given
            @Component
            class ScannedComponent { }
            @Configuration
            @ComponentScan(ScannedComponent)
            class TestConfiguration { }
            applicationContext.register(TestConfiguration);
            await applicationContext.refresh();
            // when
            let scannedComponent: ScannedComponent = applicationContext.getComponent(ScannedComponent);
            // then
            expect(scannedComponent).not.toBeUndefined();
        });

        it('a configuration class with imported configuration classes', async () => {
            // given
            @Component
            class ScannedComponent { }
            @Configuration
            @ComponentScan(ScannedComponent)
            class ImportedConfiguration { }
            @Configuration
            @Import(ImportedConfiguration)
            class TestConfiguration { }
            applicationContext.register(TestConfiguration);
            await applicationContext.refresh();
            // when
            let scannedComponent: ScannedComponent = applicationContext.getComponent(ScannedComponent);
            // then
            expect(scannedComponent).not.toBeUndefined();
        });

    });

    it('returns itself as the application context component', async () => {
        // given
        await applicationContext.refresh();
        // when
        let applicationContextComponent: ApplicationContext = await applicationContext.getComponent(ApplicationContext);
        // then
        expect(applicationContextComponent).toBe(applicationContext);
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
