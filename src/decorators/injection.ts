import {ComponentInfoBuilder, MethodInfoBuilder, PropertyInfoBuilder} from '../metadata';
import {ClassConstructor} from '../utils';

type ParameterOrPropertyDecorator = (target: Object|Function, propertyKey: string|symbol, parameterIndex?: number) => void;
type MethodOrPropertyDecorator = <T>(target: Object|Function, propertyKey: string|symbol, descriptor?: TypedPropertyDescriptor<T>) => void;
type PropertyInfoCallback = (propertyInfoBuilder: PropertyInfoBuilder) => void;
type MethodInfoCallback = (methodInfoBuilder: MethodInfoBuilder, parameterIndex: number) => void;

/**
 * Applied decorator parameters
 */
class AppliedDecoratorParameters {
    decoratorName: string;
    target: Object;
    propertyKey: string|symbol;
    parameterIndex: number;
    propertyInfoCallback: PropertyInfoCallback;
    methodInfoCallback: MethodInfoCallback;
}

/**
 * Apply a parameter or property decorator
 * @param parameters Applied decorator parameters
 */
function applyParameterOrPropertyDecorator(parameters: AppliedDecoratorParameters): void {
    let decoratorName: string = parameters.decoratorName;
    let target: Object = parameters.target;
    let propertyKey: string|symbol = parameters.propertyKey;
    let parameterIndex: number = parameters.parameterIndex;

    if (target instanceof Function && propertyKey !== undefined) {
        throw new Error('the @' + decoratorName + ' decorator cannot be applied to static method or property ' + target.name + '.' + <string> propertyKey);
    }

    if (parameterIndex === undefined) {
        let propertyInfoBuilder: PropertyInfoBuilder = PropertyInfoBuilder.of(target, propertyKey);
        parameters.propertyInfoCallback(propertyInfoBuilder);
    } else {
        let methodInfoBuilder: MethodInfoBuilder = MethodInfoBuilder.of(target, propertyKey);
        parameters.methodInfoCallback(methodInfoBuilder, parameterIndex);
    }
}

/**
 * Create a parameter or property decorator
 * @param decoratorName        Decorator name
 * @param propertyInfoCallback Property information callback
 * @return Decorator
 */
function createParameterOrPropertyDecorator(decoratorName: string, propertyInfoCallback: PropertyInfoCallback, methodInfoCallback: MethodInfoCallback): ParameterOrPropertyDecorator {
    return (target, propertyKey, parameterIndex?) => applyParameterOrPropertyDecorator({
        decoratorName: decoratorName,
        target: target,
        propertyKey: propertyKey,
        parameterIndex: parameterIndex,
        propertyInfoCallback: propertyInfoCallback,
        methodInfoCallback: methodInfoCallback
    });
}

/**
 * Create an ElementClass decorator, used to specify the class of element contained in a container
 * @param elementClass Element class
 */
function ElementClass(elementClass: Function): ParameterOrPropertyDecorator {
    return createParameterOrPropertyDecorator(
        'ElementClass',
        propertyInfoBuilder => propertyInfoBuilder.elementClass(<any> elementClass),
        (methodInfoBuilder, parameterIndex) => methodInfoBuilder.elementClass(parameterIndex, <any> elementClass)
    );
}

/**
 * Inject decorator, used to inject a dependency
 * @param target         Class constructor (static member) or prototype
 * @param propertyKey    Property key
 * @param parameterIndex Parameter index
 */
const Inject: MethodOrPropertyDecorator = (target, propertyKey, descriptor) => {
    if (descriptor === undefined) {
        PropertyInfoBuilder.of(target, propertyKey).inject();
    } else {
        MethodInfoBuilder.of(target, propertyKey).inject();
    }
};

/**
 * Create a Named decorator, used to inject a dependency by name
 * @param componentName Component name
 * @return Named decorator
 */
function Named(componentName: string): ParameterOrPropertyDecorator {
    return createParameterOrPropertyDecorator(
        'Named',
        propertyInfoBuilder => propertyInfoBuilder.name(componentName),
        (methodInfoBuilder, parameterIndex) => methodInfoBuilder.name(parameterIndex, componentName)
    );
}

/**
 * Optional decorator, used to mark a dependency as being optional
 * @param target         Class constructor (static member) or prototype
 * @param propertyKey    Property key
 * @param parameterIndex Parameter index
 */
const Optional: ParameterOrPropertyDecorator = (target, propertyKey, parameterIndex?) => applyParameterOrPropertyDecorator({
    decoratorName: 'Optional',
    target: target,
    propertyKey: propertyKey,
    parameterIndex: parameterIndex,
    propertyInfoCallback: propertyInfoBuilder => propertyInfoBuilder.optional(true),
    methodInfoCallback: methodInfoBuilder => methodInfoBuilder.optional(parameterIndex, true)
});

/**
 * Create an Order decorator, used to specify in which other injection is performed
 * @param index Index
 * @return Decorator
 */
function Order(index: number): MethodOrPropertyDecorator {
    return (target, propertyKey, descriptor) => {
        if (target instanceof Function) {
            throw new Error('@Order cannot be applied to static method or property ' + target.name + '.' + <string> propertyKey);
        }

        if (descriptor === undefined) {
            PropertyInfoBuilder.of(target, propertyKey).order(index);
        } else {
            MethodInfoBuilder.of(target, propertyKey).order(index);
        }
    };
}

/**
 * PostConstruct decorator, used to call methods after component construction has completed
 * @param target      Target
 * @param propertyKey Property key
 */
const PostConstruct: MethodDecorator = (target, propertyKey) => {
    if (target instanceof Function) {
        throw new Error('@PostConstruct cannot be used on static method ' + target.name + '.' + <string> propertyKey);
    }

    MethodInfoBuilder.of(target, propertyKey).postConstruct();
};

/**
 * PostConstruct decorator, used to call methods after component construction has completed
 * @param target      Target
 * @param propertyKey Property key
 */
const PreDestroy: MethodDecorator = (target, propertyKey) => {
    if (target instanceof Function) {
        throw new Error('@PreDestroy cannot be used on static method ' + target.name + '.' + <string> propertyKey);
    }

    MethodInfoBuilder.of(target, propertyKey).preDestroy();
};

export {
    ElementClass,
    Inject,
    Named,
    Optional,
    Order,
    PostConstruct,
    PreDestroy
};
