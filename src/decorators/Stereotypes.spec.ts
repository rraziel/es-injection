import {Component, Configuration, Controller, Repository, Service} from './Stereotypes';
import {StereotypeDecorator} from './StereotypeDecorator';
import {ComponentInfo, ComponentInfoBuilder, getComponentInfo, ScopeType, Stereotype} from '../metadata';

class DecoratorInfo {
    name: string;
    decorator: StereotypeDecorator;
    stereotype: Stereotype;
    allowMethod: boolean;
}

function createStereotypeSpecification(decoratorInfo: DecoratorInfo): void {
    let name: string = decoratorInfo.name;
    let decorator: StereotypeDecorator = decoratorInfo.decorator;
    let stereotype: Stereotype = decoratorInfo.stereotype;
    let allowMethod: boolean = decoratorInfo.allowMethod;

    describe('@' + name + ' decorator', () => {

        describe('can directly register a class as', () => {

            it('an unnamed component', () => {
                // given
                @decorator
                class TestComponent { }
                // when
                let componentInfo: ComponentInfo = getComponentInfo(TestComponent);
                // then
                expect(componentInfo).not.toBeUndefined();
                expect(componentInfo.name).toEqual('testComponent');
                expect(componentInfo.stereotype).toEqual(stereotype);
            });

            it('a named component', () => {
                // given
                @decorator('test-name')
                class TestComponent { }
                // when
                let componentInfo: ComponentInfo = getComponentInfo(TestComponent);
                // then
                expect(componentInfo).not.toBeUndefined();
                expect(componentInfo.name).toEqual('test-name');
                expect(componentInfo.stereotype).toEqual(stereotype);
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
                // when
                let componentInfo: ComponentInfo = getComponentInfo(TestComponent);
                // then
                expect(componentInfo).not.toBeUndefined();
                expect(componentInfo.name).toEqual('testComponent');
                expect(componentInfo.stereotype).toEqual(stereotype);
            });

            it('an unnamed component', () => {
                // given
                class TestComponent { }
                @Configuration
                class TestConfiguration {
                    @decorator('test-name')
                    method(): TestComponent { return new TestComponent(); }
                }
                // when
                let componentInfo: ComponentInfo = getComponentInfo(TestComponent);
                // then
                expect(componentInfo).not.toBeUndefined();
                expect(componentInfo.name).toEqual('test-name');
                expect(componentInfo.stereotype).toEqual(stereotype);
            });

        });

        describe.skip('throws an exception when', () => { // Method descriptors are evaluated before class descriptors, thus the current detection method cannot work
            if (allowMethod) {
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
                    }).toThrow(/cannot be used on a static method/);
                });

                it('applied to a method of a class that is not a @Configuration class', () => {
                    // given
                    class TestComponent { }
                    // expect
                    expect(() => {
                        class TestConfiguration {
                            @decorator
                            method(): TestComponent { return new TestComponent(); }
                        }
                    }).toThrow(/class TestConfiguration must be a @Configuration class in order for its methods to declare components/);
                });
            } else {
                it('applied to a method', () => {
                    // expect
                    expect(() => {
                        class TestComponent {
                            @decorator
                            method(): TestComponent { return undefined; }
                        }
                    }).toThrow(/the decorator can only be placed on a class/);
                });
            }
        });

    });

}

const decoratorInfos: DecoratorInfo[] = [
    {name: 'Component', decorator: Component, stereotype: Stereotype.COMPONENT, allowMethod: true},
    {name: 'Configuration', decorator: Configuration, stereotype: Stereotype.CONFIGURATION, allowMethod: false},
    {name: 'Controller', decorator: Controller, stereotype: Stereotype.CONTROLLER, allowMethod: true},
    {name: 'Repository', decorator: Repository, stereotype: Stereotype.REPOSITORY, allowMethod: true},
    {name: 'Service', decorator: Service, stereotype: Stereotype.SERVICE, allowMethod: true}
];
decoratorInfos.forEach(createStereotypeSpecification);
