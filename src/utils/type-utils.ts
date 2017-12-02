import {ClassConstructor} from './class-constructor';
import 'reflect-metadata';

/**
 * Type utility functions
 */
class TypeUtils {
    static METHODNAME_CONSTRUCTOR: string = 'constructor';
    static METADATAKEY_PARAMETERTYPES: string = 'design:paramtypes';
    static METADATAKEY_TYPE: string = 'design:type';

    /**
     * Get a property class
     * @param typeClass    Type class
     * @param propertyName Property name
     * @param <T>          Type
     * @return Property class
     */
    static getPropertyClass<T>(typeClass: ClassConstructor<T>, propertyName: string): ClassConstructor<any> {
        let propertyClass: ClassConstructor<any> = Reflect.getMetadata(TypeUtils.METADATAKEY_TYPE, typeClass.prototype, propertyName);
        return propertyClass;
    }

    /**
     * Get a method parameter class
     * @param target         Type class
     * @param methodName     Method name
     * @param parameterIndex Parameter index
     * @param <T>            Type
     * @return Parameter class
     */
    static getParameterClass<T>(typeClass: ClassConstructor<T>, methodName: string, parameterIndex: number): ClassConstructor<any> {
        let parameterClasses: ClassConstructor<any>[] = this.getParameterClasses(typeClass, methodName);
        return parameterClasses && parameterClasses[parameterIndex];
    }

    /**
     * Get method parameters classes
     * @param typeClass  Type class
     * @param methodName Method name
     * @param <T>        Type
     * @return List of parameter classes
     */
    static getParameterClasses<T>(typeClass: ClassConstructor<T>, methodName: string): ClassConstructor<any>[] {
        let parameterClasses: ClassConstructor<any>[];

        if (methodName === TypeUtils.METHODNAME_CONSTRUCTOR) {
            parameterClasses = Reflect.getMetadata(TypeUtils.METADATAKEY_PARAMETERTYPES, typeClass);
        } else {
            parameterClasses = Reflect.getMetadata(TypeUtils.METADATAKEY_PARAMETERTYPES, typeClass.prototype, methodName);
        }

        return parameterClasses;
    }

    /**
     * Apply a callback to each base class
     * @param typeClass Type class
     * @param callback  Callback
     * @param <T>       Type
     */
    static forEachBaseClass<T>(typeClass: ClassConstructor<T>, callback: (baseType: ClassConstructor<any>) => void): void {
        let it: ClassConstructor<any>;

        for (it = TypeUtils.getParentClass(typeClass); it; it = TypeUtils.getParentClass(it)) {
            callback(it);
        }
    }

    /**
     * Get a parent class (prototype inheritance)
     * @param typeClass Type class
     * @param <T>       Type
     * @return Parent class
     */
    static getParentClass<T>(typeClass: ClassConstructor<T>): ClassConstructor<any> {
        let parentClass: ClassConstructor<T> = Object.getPrototypeOf(typeClass.prototype).constructor;
        if (parentClass === <ClassConstructor<any>> Object) {
            return undefined;
        }

        return parentClass;
    }

}

export {
    TypeUtils
};
