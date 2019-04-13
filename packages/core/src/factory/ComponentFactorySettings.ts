import {ComponentFactoryResolverSettings} from './ComponentFactoryResolverSettings';

/**
 * Component factory settings
 */
class ComponentFactorySettings {
    alwaysInjectConstructors?: boolean;
    guessInjectedComponentNames?: boolean;
    resolvers?: ComponentFactoryResolverSettings;
}

export {
    ComponentFactorySettings
};
