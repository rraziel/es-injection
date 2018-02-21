
type MethodOrPropertyDecorator = <T>(target: Object|Function, propertyKey: string|symbol, descriptor?: TypedPropertyDescriptor<T>) => void;
type ParameterOrPropertyDecorator = (target: Object|Function, propertyKey: string|symbol, parameterIndex?: number) => void;

export {
    MethodOrPropertyDecorator,
    ParameterOrPropertyDecorator
};
