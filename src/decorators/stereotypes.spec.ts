import {Component, Controller, Repository, Service} from './Stereotypes';
import {StereotypeDecorator} from './StereotypeDecorator';
import {ComponentInfo, ComponentInfoBuilder, getComponentInfo, ScopeType, Stereotype} from '../metadata';

class DecoratorInfo {
    name: string;
    decorator: StereotypeDecorator;
    stereotype: Stereotype;
}

function createStereotypeSpecification(decoratorInfo: DecoratorInfo): void {
    let name: string = decoratorInfo.name;
    let decorator: StereotypeDecorator = decoratorInfo.decorator;
    let stereotype: Stereotype = decoratorInfo.stereotype;

    describe('@' + name + ' decorator', () => {

        describe('can register', () => {

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

    });

}

const decoratorInfos: DecoratorInfo[] = [
    {name: 'Component', decorator: Component, stereotype: Stereotype.COMPONENT},
    {name: 'Controller', decorator: Controller, stereotype: Stereotype.CONTROLLER},
    {name: 'Repository', decorator: Repository, stereotype: Stereotype.REPOSITORY},
    {name: 'Service', decorator: Service, stereotype: Stereotype.SERVICE}
];
decoratorInfos.forEach(createStereotypeSpecification);
