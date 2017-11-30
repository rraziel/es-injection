import {ComponentInfo, ComponentInfoBuilder, ScopeType, Stereotype} from '../metadata';

interface StereotypeDecorator {
    <F extends Function>(target: F): void|F;
    (componentName: string): ClassDecorator;
}

/**
 * Process a stereotype decorator
 * @param stereotype Stereotype
 * @return Stereotype decorator
 */
function processStereotypeDecorator<F extends Function>(componentName: F|string, stereotype: Stereotype): ClassDecorator {
    if (componentName instanceof Function) {
        ComponentInfoBuilder.of(componentName).stereotype(stereotype);
    } else {
        return target => { ComponentInfoBuilder.of(target).name(componentName).stereotype(stereotype); };
    }
}

/**
 * Create a stereotype decorator
 * @param stereotype Stereotype
 * @return Stereotype decorator
 */
function createStereotypeDecorator(stereotype: Stereotype): StereotypeDecorator {
    return componentName => processStereotypeDecorator(componentName, stereotype);
}

const Component: StereotypeDecorator = createStereotypeDecorator(Stereotype.COMPONENT);
const Controller: StereotypeDecorator = createStereotypeDecorator(Stereotype.CONTROLLER);
const Repository: StereotypeDecorator = createStereotypeDecorator(Stereotype.REPOSITORY);
const Service: StereotypeDecorator = createStereotypeDecorator(Stereotype.SERVICE);

/**
 * Scope decorator, used to specify the type of scope used for the component
 * @param scopeType Scope type
 * @return Class decorator
 */
function Scope(scopeType: ScopeType): ClassDecorator {
    return target => { ComponentInfoBuilder.of(target).scope(scopeType); };
}

export {
    Component,
    Controller,
    Repository,
    Scope,
    Service,
    StereotypeDecorator
};
