
/**
 * Method or property decorator
 */
type MethodOrPropertyDecorator = <T>(target: Object|Function, propertyKey: string|symbol, descriptor?: TypedPropertyDescriptor<T>) => void;

export {
    MethodOrPropertyDecorator
};
