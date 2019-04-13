import {Component, Configuration, Controller, Repository, Service} from './Stereotypes';
import {StereotypeDecorator} from './stereotype';
import {ComponentInfo, getComponentInfo} from '@es-injection/metadata';

/**
 * Decorator information
 */
class DecoratorInfo {
    readonly name: string;
    readonly decorator: StereotypeDecorator;
    readonly stereotype: string;
    readonly classOnly: boolean;

    /**
     * Class constructor
     * @param name        Name
     * @param decorator   Decorator
     * @param stereotype  Stereotype
     * @param allowMethod Allow method
     */
    constructor(name: string, decorator: StereotypeDecorator, stereotype: string, allowMethod: boolean) {
        this.name = name;
        this.decorator = decorator;
        this.stereotype = stereotype;
        this.classOnly = allowMethod;
    }

}

function createStereotypeSpecification(decoratorInfo: DecoratorInfo): void {
    const name: string = decoratorInfo.name;
    const decorator: StereotypeDecorator = decoratorInfo.decorator;
    const stereotype: string = decoratorInfo.stereotype;
    const classOnly: boolean = decoratorInfo.classOnly;

    describe(`@${name} decorator`, () => {

        describe('can directly register a class as', () => {

            it('an unnamed component', () => {
                // given
                @decorator
                class TestComponent { }
                // when
                const componentInfo: ComponentInfo|undefined = getComponentInfo(TestComponent);
                // then
                expect(componentInfo).toBeDefined();
                expect(componentInfo!.name).toBeUndefined();
                expect(componentInfo!.stereotype).toBe(stereotype);
            });

            it('a named component', () => {
                // given
                @decorator('test-name')
                class TestComponent { }
                // when
                const componentInfo: ComponentInfo|undefined = getComponentInfo(TestComponent);
                // then
                expect(componentInfo).toBeDefined();
                expect(componentInfo!.name).toBe('test-name');
                expect(componentInfo!.stereotype).toBe(stereotype);
            });

        });

        describe('can register a class through a factory method as', () => {

            it('an unnamed component', () => {
                // given
                class TestComponent { }
                @Configuration
                class TestConfiguration {
                    @decorator
                    method(): TestComponent { return new TestComponent(); }
                }
                TestConfiguration;
                // when
                const componentInfo: ComponentInfo|undefined = getComponentInfo(TestComponent);
                // then
                expect(componentInfo).toBeDefined();
                expect(componentInfo!.name).toBeUndefined();
                expect(componentInfo!.stereotype).toBe(stereotype);
            });

            it('an unnamed component', () => {
                // given
                class TestComponent { }
                @Configuration
                class TestConfiguration {
                    @decorator('test-name')
                    method(): TestComponent { return new TestComponent(); }
                }
                TestConfiguration;
                // when
                const componentInfo: ComponentInfo|undefined = getComponentInfo(TestComponent);
                // then
                expect(componentInfo).toBeDefined();
                expect(componentInfo!.name).toBe('test-name');
                expect(componentInfo!.stereotype).toBe(stereotype);
            });

        });

        describe('throws an exception when', () => { // Method descriptors are evaluated before class descriptors, thus the current detection method cannot work
            if (!classOnly) {
                it('applied to a static method', () => {
                    // given
                    class TestComponent { }
                    // expect
                    expect(() => {
                        @Configuration
                        class TestConfiguration {
                            @decorator
                            static method(): TestComponent { return new TestComponent(); }
                        }
                        TestConfiguration;
                    }).toThrowError('a component decorator cannot be used on a static method');
                });

                it.skip('applied to a method of a class that is not a @Configuration class', () => {
                    // given
                    class TestComponent { }
                    // expect
                    expect(() => {
                        class TestConfiguration {
                            @decorator
                            method(): TestComponent { return new TestComponent(); }
                        }
                        TestConfiguration;
                    }).toThrowError('class TestConfiguration must be a @Configuration class in order for its methods to declare components');
                });
            } else {
                it.skip('applied to a method', () => {
                    // expect
                    expect(() => {
                        class TestComponent {
                            @decorator
                            method(): TestComponent|undefined { return undefined; }
                        }
                        TestComponent;
                    }).toThrowError('the decorator can only be placed on a class');
                });
            }
        });

    });

}

[
    new DecoratorInfo('Component', Component, 'COMPONENT', false),
    new DecoratorInfo('Configuration', Configuration, 'CONFIGURATION', true),
    new DecoratorInfo('Controller', Controller, 'CONTROLLER', false),
    new DecoratorInfo('Repository', Repository, 'REPOSITORY', false),
    new DecoratorInfo('Service', Service, 'SERVICE', false)
].forEach(createStereotypeSpecification);
