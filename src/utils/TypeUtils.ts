import {ComponentClass} from './ComponentClass';

type DependencyResolver = (requiredClass: ComponentClass<any>, parameterIndex: number) => any;

/**
 * Type utility functions
 */
class TypeUtils {

    /**
     * Apply a callback to each method
     * @param componentClass   Component class
     * @param callback         Callback
     * @param includeAncestors true if ancestor class methods must be iterated over
     * @param <T>              Component type
     */
    static forEachMethod<T>(componentClass: ComponentClass<T>, callback: (methodName: string, typeClass: ComponentClass<any>) => void, includeAncestors?: boolean): void {
        Object.getOwnPropertyNames(componentClass.prototype)
            .filter(propertyName => {
                let property: any = componentClass.prototype[propertyName];
                return typeof(property) === 'function' && propertyName !== 'constructor';
            })
            .forEach(methodName => callback(methodName, componentClass))
        ;

        if (includeAncestors) {
            TypeUtils.forEachAncestor(componentClass, ancestorClass => TypeUtils.forEachMethod(ancestorClass, callback));
        }
    }

    /**
     * Iterate over ancestor classes
     * @param componentClass Component class
     * @param callback       Callback
     * @param <T>            Component type
     */
    static forEachAncestor<T>(componentClass: ComponentClass<T>, callback: (ancestorClass: ComponentClass<any>) => void): void {
        let it: ComponentClass<any>;

        for (it = TypeUtils.getParentClass(componentClass); it; it = TypeUtils.getParentClass(it)) {
            callback(it);
        }
    }

    /**
     * Iterator over all classes
     * @param componentClass Component class
     * @param callback       Callback
     * @param <T>            Component type
     */
    static forEachClass<T>(componentClass: ComponentClass<T>, callback: (typeClass: ComponentClass<any>) => void): void {
        callback(componentClass);
        TypeUtils.forEachAncestor(componentClass, callback);
    }

    /**
     * Get a parent class (prototype inheritance)
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Parent class
     */
    static getParentClass<T>(componentClass: ComponentClass<T>): ComponentClass<any> {
        let parentClass: ComponentClass<T> = Object.getPrototypeOf(componentClass.prototype).constructor;
        if (parentClass === Object) {
            return undefined;
        }

        return parentClass;
    }

    /**
     * Test whether a type is an array
     * @param typeClass Type class
     * @param <T>       Type
     * @return true if the type is an array
     */
    static isArray<T>(typeClass: ComponentClass<T>): boolean {
        return typeClass === Array;
    }

    /**
     * Test whether a type is a map
     * @param typeClass Type class
     * @param <T>       Type
     * @return true if the type is a map
     */
    static isMap<T>(typeClass: ComponentClass<T>): boolean {
        return typeClass === Map;
    }

    /**
     * Test whether a type is a string
     * @param typeClass Type class
     * @param <T>       Type
     * @return true if the type is an string
     */
    static isString<T>(typeClass: ComponentClass<T>): boolean {
        return typeClass === String;
    }

    /**
     * Test whether a type is a number
     * @param typeClass Type class
     * @param <T>       Type
     * @return true if the type is a number
     */
    static isNumber<T>(typeClass: ComponentClass<T>): boolean {
        return typeClass === Number;
    }

}

export {
    DependencyResolver,
    TypeUtils
};
