import {ComponentClass, ComponentInfoBuilder} from '@es-injection/metadata';

/**
 * Process a stereotype decorator
 * @param componentName  Component name
 * @param componentClass Component class
 * @param stereotype     Stereotype
 * @param <T>            Component type
 */
function processStereotypeDecorator<T>(componentName: string|undefined, componentClass: ComponentClass<T>, stereotype: string): void {
    const builder: ComponentInfoBuilder<T> = ComponentInfoBuilder
        .of(componentClass)
        .stereotype(stereotype)
    ;

    if (componentName) {
        builder.name(componentName);
    }
}

export {
    processStereotypeDecorator
};
