import {ComponentInfoBuilder, ScopeType, Stereotype} from '../metadata';
import {ClassConstructor, NameUtils} from '../utils';
import {ComponentRegistry} from '../registry';

interface StereotypeDecorator {
    <F extends Function>(target: F): void|F;
    (componentName: string): ClassDecorator;
}

/**
 * Process a stereotype decorator
 * @param stereotype Stereotype
 * @param <T>        Component type
 * @return Stereotype decorator
 */
function processStereotypeDecorator<T>(componentName: ClassConstructor<T>|string, stereotype: Stereotype): ClassDecorator {
    if (componentName instanceof Function) {
        ComponentInfoBuilder.of(componentName)
            .name(NameUtils.buildComponentName(componentName))
            .stereotype(stereotype)
        ;

        ComponentRegistry.registerComponentClass(componentName);
    } else {
        return target => {
            let componentClass: ClassConstructor<any> = <ClassConstructor<any>> <any> target;

            ComponentInfoBuilder.of(componentClass)
                .name(componentName)
                .stereotype(stereotype)
            ;

            ComponentRegistry.registerComponentClass(componentClass);
        };
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
    return target => {
        ComponentInfoBuilder.of(<ClassConstructor<any>> <any> target).scope(scopeType);
    };
}

export {
    Component,
    Controller,
    Repository,
    Scope,
    Service,
    StereotypeDecorator
};
