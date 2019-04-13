import {processStereotypeDecorator} from './processStereotypeDecorator';
import {ComponentClass} from '@es-injection/metadata';

/**
 * Process a class stereotype decorator
 * @param componentClass Component class
 * @param stereotype     Stereotype
 * @param componentName  Component name
 * @param <T>            Component type
 */
function processClassStereotypeDecorator<T>(componentClass: ComponentClass<T>, stereotype: string, componentName?: string): void {
    processStereotypeDecorator(componentName, componentClass, stereotype);
}

export {
    processClassStereotypeDecorator
};
