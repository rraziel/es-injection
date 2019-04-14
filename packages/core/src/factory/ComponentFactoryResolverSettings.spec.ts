import {ComponentFactoryResolverSettings} from './ComponentFactoryResolverSettings';
import {ArrayResolver, ComponentResolver, ConstantResolver, MapResolver} from './resolver';

describe('Component factory resolver settings', () => {

    it('properly store constructor arguments', () => {
        // given
        const arrayResolver: ArrayResolver = async<T> () => new Array<T>();
        const componentResolver: ComponentResolver = async<T> () => null as any as T;
        const constantResolver: ConstantResolver = async<T> () => null as any as T;
        const mapResolver: MapResolver = async<T> () => new Map<string, T>();
        // when
        const componentFactoryResolverSettings: ComponentFactoryResolverSettings = new ComponentFactoryResolverSettings(componentResolver, arrayResolver, mapResolver, constantResolver);
        // then
        expect(componentFactoryResolverSettings.array).toBe(arrayResolver);
        expect(componentFactoryResolverSettings.component).toBe(componentResolver);
        expect(componentFactoryResolverSettings.constant).toBe(constantResolver);
        expect(componentFactoryResolverSettings.map).toBe(mapResolver);
    });

});
