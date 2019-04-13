import {ComponentClass} from './ComponentClass';

/**
 * Type utility functions
 */
class TypeUtils {
    private static readonly PROPERTYNAME_CONSTRUCTOR: string = 'constructor';
    private static readonly TYPE_FUNCTION: string = 'function';

    /**
     * Get method names
     * @param componentClass   Component class
     * @param includeAncestors true if ancestor class methods must be iterated over
     * @param <T>              Component type
     * @return List of method names
     */
    static getMethodNames<T>(componentClass: ComponentClass<T>, includeAncestors?: boolean): Array<string> {
        let methodNames: Array<string>;

        methodNames = Object.getOwnPropertyNames(componentClass.prototype)
            .filter(propertyName => TypeUtils.isMethodProperty(componentClass, propertyName))
        ;

        if (includeAncestors) {
            TypeUtils.getAncestors(componentClass)
                .map(ancestorClass => TypeUtils.getMethodNames(ancestorClass))
                .forEach(ancestorMethodNames => methodNames.push(...ancestorMethodNames))
            ;
        }

        return methodNames;
    }

    /**
     * Get the parent class
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Parent class
     */
    static getParentClass<T>(componentClass: ComponentClass<T>): ComponentClass<any>|undefined {
        const parentClass: ComponentClass<T> = Object.getPrototypeOf(componentClass.prototype).constructor;
        if (parentClass === Object) {
            return undefined;
        }

        return parentClass;
    }

    /**
     * Get classes
     * @param componentClass Component class
     * @param <T>            Component type
     * @return List of classes
     */
    static getClasses<T>(componentClass: ComponentClass<T>): Array<ComponentClass<any>> {
        const classes: Array<ComponentClass<any>> = [componentClass];
        const ancestorClasses: Array<ComponentClass<any>> = TypeUtils.getAncestors(componentClass);
        classes.push(...ancestorClasses);
        return classes;
    }

    /**
     * Get ancestor classes
     * @param componentClass Component class
     * @param <T>            Component type
     * @return List of ancestor classes
     */
    static getAncestors<T>(componentClass: ComponentClass<T>): Array<ComponentClass<any>> {
        const ancestors: Array<ComponentClass<any>> = [];
        let it: ComponentClass<any>|undefined;

        for (it = TypeUtils.getParentClass(componentClass); it; it = TypeUtils.getParentClass(it)) {
            ancestors.push(it);
        }

        return ancestors;
    }

    /**
     * Test whether a type is an array
     * @param typeClass Type class
     * @param <T>       Type
     * @return true if the type is an array
     */
    static isArrayType<T>(typeClass: ComponentClass<T>): boolean {
        return typeClass === Array;
    }

    /**
     * Test whether a type is a map
     * @param typeClass Type class
     * @param <T>       Type
     * @return true if the type is a map
     */
    static isMapType<T>(typeClass: ComponentClass<T>): boolean {
        return typeClass === Map;
    }

    /**
     * Test whether a type is a string
     * @param typeClass Type class
     * @param <T>       Type
     * @return true if the type is an string
     */
    static isStringType<T>(typeClass: ComponentClass<T>): boolean {
        return typeClass === String;
    }

    /**
     * Test whether a type is a number
     * @param typeClass Type class
     * @param <T>       Type
     * @return true if the type is a number
     */
    static isNumberType<T>(typeClass: ComponentClass<T>): boolean {
        return typeClass === Number;
    }

    /**
     * Test whether an object appears to be a promise
     * @param obj Object
     * @return true if the object appears to be a promise
     */
    static isPromise<T>(obj: T): boolean {
        return typeof (obj as any).then === TypeUtils.TYPE_FUNCTION;
    }

    /**
     * Test whether a property is a method
     * @param componentClass Component class
     * @param propertyName   Property name
     * @param <T>            Component type
     * @return true if the property is a method
     */
    private static isMethodProperty<T>(componentClass: ComponentClass<T>, propertyName: string): boolean {
        const property: any = componentClass.prototype[propertyName];
        return typeof(property) === TypeUtils.TYPE_FUNCTION && propertyName !== TypeUtils.PROPERTYNAME_CONSTRUCTOR;
    }

}

export {
    TypeUtils
};
