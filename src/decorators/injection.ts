import {ComponentInfoBuilder, MethodInfoBuilder, PropertyInfoBuilder} from '../metadata';

type ParameterOrPropertyDecorator = (target: Object|Function, propertyKey: string|symbol, parameterIndex?: number) => void;
type MethodOrPropertyDecorator = <T>(target: Object|Function, propertyKey: string|symbol, descriptor: TypedPropertyDescriptor<T>) => void;
type PropertyInfoCallback = (propertyInfoBuilder: PropertyInfoBuilder, propertyClass: Function) => void;
type MethodInfoCallback = (methodInfoBuilder: MethodInfoBuilder, parameterIndex: number, parameterClass: Function) => void;

const METADATAKEY_PARAMETERTYPES: string = 'design:paramtypes';
const METADATAKEY_TYPE: string = 'design:type';

/**
 * Inject decorator, used to inject a dependency
 * @param target         Class constructor (static member) or prototype
 * @param propertyKey    Property key
 * @param parameterIndex Parameter index
 */
const Inject: MethodOrPropertyDecorator = (target, propertyKey, descriptor) => {
    if (descriptor === undefined) {
        console.log('inject property', target, propertyKey);
    } else {
        console.log('inject method', target, propertyKey, descriptor);
    }
};

/**
 * Get a parameter class
 * @param target         Target
 * @param propertyKey    Property key
 * @param parameterIndex Parameter index
 * @return Parameter class
 */
function getParameterClass(target: Object, propertyKey: string|symbol, parameterIndex: number): Function {
    let parameterClasses: Function[] = Reflect.getMetadata(METADATAKEY_PARAMETERTYPES, target, propertyKey);
    return parameterClasses[parameterIndex];
}

/**
 * Get a property class
 * @param target      Target
 * @param propertyKey Property key
 * @return Property class
 */
function getPropertyClass(target: Object, propertyKey: string|symbol): Function {
    let propertyClass: Function = Reflect.getMetadata(METADATAKEY_TYPE, target, propertyKey);
    return propertyClass;
}

/**
 * Create a parameter or property decorator
 * @param decoratorName        Decorator name
 * @param propertyInfoCallback Property information callback
 * @return Decorator
 */
function createParameterOrPropertyDecorator(decoratorName: string, propertyInfoCallback: PropertyInfoCallback, methodInfoCallback: MethodInfoCallback): ParameterOrPropertyDecorator {
    return (target, propertyKey, parameterIndex?) => {
        if (target instanceof Function) {
            throw new Error('the @' + decoratorName + ' decorator cannot be applied to a static method or property');
        }

        if (parameterIndex === undefined) {
            let propertyInfoBuilder: PropertyInfoBuilder = PropertyInfoBuilder.of(target, propertyKey);
            let propertyClass: Function = getPropertyClass(target, propertyKey);
            propertyInfoCallback(propertyInfoBuilder, propertyClass);
        } else {
            let methodInfoBuilder: MethodInfoBuilder = MethodInfoBuilder.of(target, propertyKey);
            let parameterClass: Function = getParameterClass(target, propertyKey, parameterIndex);
            methodInfoCallback(methodInfoBuilder, parameterIndex, parameterClass);
        }
    };
}

/**
 * Create a Named decorator, used to inject a dependency by name
 * @param componentName Component name
 * @return Named decorator
 */
function Named(componentName: string): ParameterOrPropertyDecorator {
    return createParameterOrPropertyDecorator(
        'Named',
        (propertyInfoBuilder, propertyClass) => propertyInfoBuilder.name(componentName).class(propertyClass),
        (methodInfoBuilder, parameterIndex, parameterClass) => methodInfoBuilder.name(parameterIndex, componentName).class(0, parameterClass)
    );
}

/**
 * Optional decorator, used to mark a dependency as being optional
 * @param target         Class constructor (static member) or prototype
 * @param propertyKey    Property key
 * @param parameterIndex Parameter index
 */
const Optional: ParameterDecorator|PropertyDecorator = (target, propertyKey, parameterIndex?) => {
    if (parameterIndex === undefined) {
        console.log('optional property', target, propertyKey);
    } else {
        console.log('optional parameter', target, propertyKey, parameterIndex);
    }
};

/**
 * Create an Order decorator, used to specify in which other injection is performed
 * @param index Index
 * @return Decorator
 */
function Order(index: number): ParameterDecorator|PropertyDecorator|MethodDecorator {
    return () => {
        console.log('Order ' + index);
    };
}

/**
 * PostConstruct decorator, used to call methods after component construction has completed
 * @param target      Target
 * @param propertyKey Property key
 */
const PostConstruct: MethodDecorator = (target, propertyKey) => {
    // Registry.registerPostConstructMethod(target, <string> propertyKey);
};

/**
 * PostConstruct decorator, used to call methods after component construction has completed
 * @param target      Target
 * @param propertyKey Property key
 */
const PreDestroy: MethodDecorator = (target, propertyKey) => {
    // Registry.registerPreDestroyMethod(target, <string> propertyKey);
};

export {
    Inject,
    Named,
    Optional,
    Order,
    PostConstruct,
    PreDestroy
};
