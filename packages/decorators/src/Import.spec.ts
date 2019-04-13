import {Import} from './Import';
import {Configuration} from './Stereotypes';
import {ComponentInfo, getComponentInfo} from '@es-injection/metadata';

describe('@Import decorator', () => {

    it('can set imported configurations for a configuration class', async () => {
        // given
        @Configuration
        class TestImportedConfiguration { }
        @Import(TestImportedConfiguration)
        class TestConfiguration { }
        // when
        const componentInfo: ComponentInfo|undefined = getComponentInfo(TestConfiguration);
        // then
        expect(componentInfo).toBeDefined();
        expect(componentInfo!.importedConfigurations.length).toBe(1);
        expect(await componentInfo!.importedConfigurations[0]).toBe(TestImportedConfiguration);
    });

    it('throws an exception when an imported class is not an actual configuration class', () => {
        // given
        class TestImportedConfiguration { }
        // expect
        expect(() => {
            @Import(TestImportedConfiguration)
            class TestConfiguration { }
            TestConfiguration;
        }).toThrowError(`invalid @Import: class ${TestImportedConfiguration.name} is not a configuration class`);
    });

});
