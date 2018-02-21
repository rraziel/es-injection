import {ComponentInfoBuilder, Stereotype} from '../metadata';
import {ClassConstructor, NameUtils} from '../utils';

/**
 * Stereotype decorator
 */
interface StereotypeDecorator {
    <F extends Function>(target: F): void|F;
    (componentName: string): ClassDecorator;
}

/**
 * Process a stereotype decorator
 * @param componentName  Component name
 * @param componentClass Component class
 * @param stereotype     Stereotype
 * @param <T>            Component type
 */
function processStereotypeDecorator<T>(componentName: string, componentClass: ClassConstructor<T>, stereotype: Stereotype): void {
    ComponentInfoBuilder.of(componentClass)
        .name(componentName)
        .stereotype(stereotype)
    ;
}
     
/**
 * Dispatch stereotype decorator processor
 * @param stereotype Stereotype
 * @param <T>        Component type
 * @return Stereotype decorator
 */
function dispatchStereotypeDecorator<T>(componentName: ClassConstructor<T>|string, stereotype: Stereotype): ClassDecorator {
    if (componentName instanceof Function) {
        let actualComponentName: string = NameUtils.buildComponentName(componentName);
        processStereotypeDecorator(actualComponentName, componentName, stereotype);
    } else {
        return target => {
            let componentClass: ClassConstructor<any> = <ClassConstructor<any>> <any> target;
            processStereotypeDecorator(componentName, componentClass, stereotype);
        };
    }
}

/**
 * Create a stereotype decorator
 * @param stereotype Stereotype
 * @return Stereotype decorator
 */
function createStereotypeDecorator(stereotype: Stereotype): StereotypeDecorator {
    return componentName => dispatchStereotypeDecorator(componentName, stereotype);
}

export {
    createStereotypeDecorator,
    StereotypeDecorator
};
