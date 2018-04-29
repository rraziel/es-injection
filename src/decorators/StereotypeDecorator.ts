import {ComponentInfoBuilder, Stereotype} from '../metadata';
import {NameUtils} from '../utils';
import {ClassConstructor, TypeUtils} from 'es-decorator-utils';

type ClassOrMethodStereotypeDecorator = <T>(target: Object|T, propertyKey?: string|symbol, descriptor?: TypedPropertyDescriptor<() => T>) => void;

/**
 * Decorator parameters
 */
interface DecoratorParameters<T> {
    propertyKey: string|symbol;
    descriptor: TypedPropertyDescriptor<T>;
    stereotype: Stereotype;
    componentName?: string;
    methodAllowed?: boolean;
}

/**
 * Stereotype decorator
 */
interface StereotypeDecorator {
    (componentName: string): ClassOrMethodStereotypeDecorator;
    <T extends Function>(target: T): void;
    <T>(target: Object, propertyKey: string|symbol, descriptor: TypedPropertyDescriptor<() => T>): void;
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
 * Process a class stereotype decorator
 * @param componentClass Component clas
 * @param stereotype     Stereotype
 * @param componentName  Component name
 */
function processClassStereotypeDecorator<T>(componentClass: ClassConstructor<T>, stereotype: Stereotype, componentName?: string): void {
    if (componentName === undefined) {
        componentName = NameUtils.buildComponentName(componentClass);
    }

    processStereotypeDecorator(componentName, componentClass, stereotype);
}

/**
 * Dispatch a method stereotype decorator
 * @param classPrototype      Class prototype
 * @param decoratorParameters Decorator parameters
 * @param <T>                 Method type
 */
function processMethodStereotypeDecorator<T>(classPrototype: Object, decoratorParameters: DecoratorParameters<T>): void {
    let classConstructor: ClassConstructor<any> = <ClassConstructor<any>> classPrototype.constructor;
    let componentClass: ClassConstructor<any> = TypeUtils.getReturnClass(classConstructor, decoratorParameters.propertyKey);
    let componentName: string = decoratorParameters.componentName;

    if (componentName === undefined) {
        componentName = NameUtils.buildComponentName(componentClass);
    }

    if (!decoratorParameters.methodAllowed) {
        // TODO
    }

    processStereotypeDecorator(componentName, componentClass, decoratorParameters.stereotype);
}

/**
 * Dispatch a stereotype decorator with an optional component name
 * @param target         Target
 * @param stereotype     Stereotype
 * @param componentName  Component name
 * @param propertyKey    Property key
 * @param descriptor     Descriptor
 * @param methodAllowed  true if the component can contain stereotype-decorated methods
 * @param <T>            Component type or method type
 */
function dispatchStereotypeDecoratorWithOptionalName<T>(target: Object|ClassConstructor<T>, stereotype: Stereotype, componentName?: string, propertyKey?: string|symbol, descriptor?: TypedPropertyDescriptor<T>, methodAllowed?: boolean): void {
    if (target instanceof Function) {
        if (propertyKey) {
            throw new Error('a component decorator cannot be used on a static method');
        }

        processClassStereotypeDecorator(target, stereotype, componentName);
    } else {
        let decoratorParameters: DecoratorParameters<T> = {
            propertyKey: propertyKey,
            descriptor: descriptor,
            stereotype: stereotype,
            componentName: componentName,
            methodAllowed: methodAllowed
        };

        processMethodStereotypeDecorator(target, decoratorParameters);
    }
}

/**
 * Dispatch stereotype decorator processor
 * @param targetOrComponentName Target or component name
 * @param stereotype            Stereotype
 * @param propertyKey           Property key
 * @param descriptor            Descriptor
 * @param methodAllowed         true if the component can contain stereotype-decorated methods
 * @param <T>                   Component type
 * @return Stereotype decorator
 */
function dispatchStereotypeDecorator<T>(targetOrComponentName: Object|ClassConstructor<T>|string, stereotype: Stereotype, propertyKey?: string|symbol, descriptor?: TypedPropertyDescriptor<T>, methodAllowed?: boolean): ClassOrMethodStereotypeDecorator|void {
    if (typeof(targetOrComponentName) === 'string') {
        let componentName: string = targetOrComponentName;
        return (target, namedPropertyKey, namedDescriptor) => dispatchStereotypeDecoratorWithOptionalName(target, stereotype, componentName, namedPropertyKey, namedDescriptor, methodAllowed);
    }

    dispatchStereotypeDecoratorWithOptionalName(targetOrComponentName, stereotype, undefined, propertyKey, descriptor, methodAllowed);
}

/**
 * Create a stereotype decorator
 * @param stereotype     Stereotype
 * @param methodAllowed  true if the component can contain stereotype-decorated methods
 * @return Stereotype decorator
 */
function createStereotypeDecorator(stereotype: Stereotype, methodAllowed?: boolean): StereotypeDecorator {
    return <StereotypeDecorator> ((target, propertyKey, descriptor) => dispatchStereotypeDecorator(target, stereotype, propertyKey, descriptor, methodAllowed));
}

export {
    ClassOrMethodStereotypeDecorator,
    StereotypeDecorator,
    createStereotypeDecorator
};
