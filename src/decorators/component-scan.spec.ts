import {ComponentScan} from './component-scan';
import {Component} from './stereotypes';
import {ComponentInfo, getComponentInfo} from '../metadata';

describe('@ComponentScan decorator', () => {

    it('can set scanned components for a configuration', () => {
        // given
        @Component
        class TestComponent { }
        @ComponentScan(TestComponent)
        class TestConfiguration { }
        // when
        let componentInfo: ComponentInfo = getComponentInfo(TestConfiguration);
        // then
        expect(componentInfo).not.toBeUndefined();
        expect(componentInfo.scannedComponents).not.toBeUndefined();
        expect(componentInfo.scannedComponents.length).toEqual(1);
        expect(componentInfo.scannedComponents[0]).toEqual(TestComponent);
    });

    it('throws an exception when a scanned class is not an actual component', () => {
        // given
        class TestComponent { }
        // expect
        expect(() => {
            @ComponentScan(TestComponent)
            class TestConfiguration { }
        }).toThrowError(/invalid @ComponentScan/);
    });

});
