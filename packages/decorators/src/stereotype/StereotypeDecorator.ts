import {ClassOrMethodStereotypeDecorator} from './ClassOrMethodStereotypeDecorator';

/**
 * Stereotype decorator
 */
interface StereotypeDecorator {
    (componentName: string): ClassOrMethodStereotypeDecorator;
    <T extends Function>(target: T): void;
    <T>(target: Object, propertyKey: string|symbol, descriptor: TypedPropertyDescriptor<() => T>): void;
}

export {
    StereotypeDecorator
};
