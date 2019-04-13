
/**
 * Parameter or property decorator
 */
type ParameterOrPropertyDecorator = (target: Object|Function, propertyKey: string|symbol, parameterIndex?: number) => void;

export {
    ParameterOrPropertyDecorator
};
