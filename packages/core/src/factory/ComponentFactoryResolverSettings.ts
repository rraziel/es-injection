import {ArrayResolver, ComponentResolver, ConstantResolver, MapResolver} from './resolver';

/**
 * Component factory resolver settings
 */
class ComponentFactoryResolverSettings {
    component: ComponentResolver;
    array: ArrayResolver;
    map: MapResolver;
    constant: ConstantResolver;

    /**
     * Class constructor
     * @param componentResolver Component resolver
     * @param arrayResolver     Array resolver
     * @param mapResolver       Map resolver
     * @param constantResolver  Constant resolver
     */
    constructor(componentResolver: ComponentResolver, arrayResolver: ArrayResolver, mapResolver: MapResolver, constantResolver: ConstantResolver) {
        this.component = componentResolver;
        this.array = arrayResolver;
        this.map = mapResolver;
        this.constant = constantResolver;
    }

}

export {
    ComponentFactoryResolverSettings
};
