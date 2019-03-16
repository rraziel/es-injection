import {Import} from './Import';
import {Configuration} from './Stereotypes';
import {ComponentInfo, getComponentInfo} from '../metadata';

describe('@Import decorator', () => {

    it('can set imported configurations for a configuration class', () => {
        // given
        @Configuration
        class TestImportedConfiguration { }
        @Import(TestImportedConfiguration)
        class TestConfiguration { }
        // when
        let componentInfo: ComponentInfo = getComponentInfo(TestConfiguration);
        // then
        expect(componentInfo).not.toBeUndefined();
        expect(componentInfo.importedConfigurations).not.toBeUndefined();
        expect(componentInfo.importedConfigurations.length).toEqual(1);
        expect(componentInfo.importedConfigurations[0]).toEqual(TestImportedConfiguration);
    });

    it('throws an exception when an imported class is not an actual configuration class', () => {
        // given
        class TestImportedConfiguration { }
        // expect
        expect(() => {
            @Import(TestImportedConfiguration)
            class TestConfiguration { }
        }).toThrowError(`invalid @Import: class ${TestImportedConfiguration.name} is not a configuration class`);
    });

});
