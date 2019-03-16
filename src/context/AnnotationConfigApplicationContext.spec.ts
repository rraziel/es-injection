import {AnnotationConfigApplicationContext} from './AnnotationConfigApplicationContext';
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

    describe('can register a configuration class', () => {

        it('with no extra information', async () => {
            // given
            @Configuration
            class TestConfiguration { }
            // when
            await applicationContext.registerConfiguration(TestConfiguration);
            // then
            expect(componentRegistry.registerComponent).toHaveBeenCalledTimes(1);
            expect(componentRegistry.registerComponent).toHaveBeenCalledWith('testConfiguration', TestConfiguration);
        });

        it('with a name', async () => {
            // given
            @Configuration('test-configuration')
            class TestConfiguration { }
            // when
            await applicationContext.registerConfiguration(TestConfiguration);
            // then
            expect(componentRegistry.registerComponent).toHaveBeenCalledTimes(1);
            expect(componentRegistry.registerComponent).toHaveBeenCalledWith('test-configuration', TestConfiguration);
        });

        it('with scanned components', async () => {
            // given
            @Component
            class ScannedComponent { }
            @Configuration
            @ComponentScan(ScannedComponent)
            class TestConfiguration { }
            // when
            await applicationContext.registerConfiguration(TestConfiguration);
            // then
            expect(componentRegistry.registerComponent).toHaveBeenCalledTimes(2);
            expect(componentRegistry.registerComponent).toHaveBeenCalledWith('scannedComponent', ScannedComponent);
            expect(componentRegistry.registerComponent).toHaveBeenCalledWith('testConfiguration', TestConfiguration);
        });

        it('with imported configuration classes', async () => {
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
            await applicationContext.registerConfiguration(TestConfiguration);
            // then
            expect(componentRegistry.registerComponent).toHaveBeenCalledTimes(3);
            expect(componentRegistry.registerComponent).toHaveBeenCalledWith('scannedComponent', ScannedComponent);
            expect(componentRegistry.registerComponent).toHaveBeenCalledWith('importedConfiguration', ImportedConfiguration);
            expect(componentRegistry.registerComponent).toHaveBeenCalledWith('testConfiguration', TestConfiguration);
        });

        it('with imported configuration classes as promises', async () => {
            // given
            @Component
            class ScannedComponent { }
            @Configuration
            @ComponentScan(ScannedComponent)
            class ImportedConfiguration { }
            @Configuration
            @Import(Promise.resolve(ImportedConfiguration))
            class TestConfiguration { }
            // when
            await applicationContext.registerConfiguration(TestConfiguration);
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
            expect(applicationContext.registerConfiguration(TestConfiguration)).rejects.toThrowError('class TestConfiguration cannot be used as a configuration class as it lacks a @Configuration decorator');
        });

    });

});
