import {ComponentScan} from './ComponentScan';
import {Component} from './Stereotypes';
import {ComponentInfo, getComponentInfo} from '@es-injection/metadata';

describe('@ComponentScan decorator', () => {

    it('can set scanned components for a configuration class', () => {
        // given
        @Component
        class TestComponent { }
        @ComponentScan(TestComponent)
        class TestConfiguration { }
        // when
        const componentInfo: ComponentInfo|undefined = getComponentInfo(TestConfiguration);
        // then
        expect(componentInfo).toBeDefined();
        expect(componentInfo!.scannedComponents.length).toBe(1);
        expect(componentInfo!.scannedComponents[0]).toBe(TestComponent);
    });

    it('throws an exception when a scanned class is not an actual component class', () => {
        // given
        class TestComponent { }
        // expect
        expect(() => {
            @ComponentScan(TestComponent)
            class TestConfiguration { }
            TestConfiguration;
        }).toThrowError(/invalid @ComponentScan/);
    });

});
