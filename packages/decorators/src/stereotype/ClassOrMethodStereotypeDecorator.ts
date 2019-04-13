
/**
 * Class or method stereotype decorator
 * @param <T> Target type
 */
type ClassOrMethodStereotypeDecorator = <T>(target: Object|T, propertyKey?: string|symbol, descriptor?: TypedPropertyDescriptor<() => T>) => void;

export {
    ClassOrMethodStereotypeDecorator
};
