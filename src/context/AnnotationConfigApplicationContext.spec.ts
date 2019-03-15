import {AnnotationConfigApplicationContext} from './AnnotationConfigApplicationContext';
import {ApplicationContext} from './ApplicationContext';
import {Component, ComponentScan, Configuration, Import} from '../decorators';
import {ComponentFactory} from '../factory';
import {ComponentRegistry} from '../registry';
import {createMockInstance} from 'jest-create-mock-instance';

describe('Annotation configuration application context', () => {
    let applicationContext: AnnotationConfigApplicationContext;
    let componentFactory: jest.Mocked<ComponentFactory>;
    let componentRegistry: jest.Mocked<ComponentRegistry>;

    beforeEach(() => {
        componentFactory = createMockInstance(ComponentFactory as any);
        componentRegistry = createMockInstance(ComponentRegistry as any);
        componentRegistry.registerComponent = jest.fn();
        applicationContext = new AnnotationConfigApplicationContext({}, componentRegistry, componentFactory);
    });

    describe('can register', () => {

        it('a simple configuration class', () => {
            // given
            @Configuration
            class TestConfiguration { }
            // when
            applicationContext.registerConfiguration(TestConfiguration);
            // then
            expect(componentRegistry.registerComponent).toHaveBeenCalledTimes(1);
            expect(componentRegistry.registerComponent).toHaveBeenCalledWith('testConfiguration', TestConfiguration);
        });

        it('a simple configuration class with a name', () => {
            // given
            @Configuration('test-configuration')
            class TestConfiguration { }
            // when
            applicationContext.registerConfiguration(TestConfiguration);
            // then
            expect(componentRegistry.registerComponent).toHaveBeenCalledTimes(1);
            expect(componentRegistry.registerComponent).toHaveBeenCalledWith('test-configuration', TestConfiguration);
        });

        it('a configuration class with scanned components', () => {
            // given
            @Component
            class ScannedComponent { }
            @Configuration
            @ComponentScan(ScannedComponent)
            class TestConfiguration { }
            // when
            applicationContext.registerConfiguration(TestConfiguration);
            // then
            expect(componentRegistry.registerComponent).toHaveBeenCalledTimes(2);
            expect(componentRegistry.registerComponent).toHaveBeenCalledWith('scannedComponent', ScannedComponent);
            expect(componentRegistry.registerComponent).toHaveBeenCalledWith('testConfiguration', TestConfiguration);
        });

        it('a configuration class with imported configuration classes', () => {
            // given
            @Component
            class ScannedComponent { }
            @Configuration
            @ComponentScan(ScannedComponent)
            class ImportedConfiguration { }
            @Configuration
            @Import(ImportedConfiguration)
            class TestConfiguration { }
            // when
            applicationContext.registerConfiguration(TestConfiguration);
            // then
            expect(componentRegistry.registerComponent).toHaveBeenCalledTimes(3);
            expect(componentRegistry.registerComponent).toHaveBeenCalledWith('scannedComponent', ScannedComponent);
            expect(componentRegistry.registerComponent).toHaveBeenCalledWith('importedConfiguration', ImportedConfiguration);
            expect(componentRegistry.registerComponent).toHaveBeenCalledWith('testConfiguration', TestConfiguration);
        });

    });

    describe('throws an exception when', () => {

        it('registering a class that is not a configuration class', () => {
            // given
            class TestConfiguration { }
            // expect
            expect(() => applicationContext.registerConfiguration(TestConfiguration)).toThrowError('class TestConfiguration cannot be used as a configuration class as it lacks a @Configuration decorator');
        });

    });

});
