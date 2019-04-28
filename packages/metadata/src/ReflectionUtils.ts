import {ComponentClass} from './ComponentClass';

/**
 * Reflection utility functions
 */
class ReflectionUtils {
    private static readonly METADATAKEY_PARAMETERTYPES: string = 'design:paramtypes';
    private static readonly METADATAKEY_RETURNTYPE: string = 'design:returntype';
    private static readonly METADATAKEY_TYPE: string = 'design:type';

    /**
     * Get a property class
     * @param componentClass Component class
     * @param propertyName   Property name
     * @param <T>            Component type
     * @return Property class
     */
    static getPropertyClass<T>(componentClass: ComponentClass<T>, propertyName: string|symbol): ComponentClass<any> {
        let propertyClass: ComponentClass<any> = Reflect.getMetadata(ReflectionUtils.METADATAKEY_TYPE, componentClass.prototype, propertyName);
        return propertyClass;
    }

    /**
     * Get a method parameter class
     * @param componentClass Component class
     * @param methodName     Method name
     * @param parameterIndex Parameter index
     * @param <T>            Component type
     * @return Parameter class
     */
    static getParameterClass<T>(componentClass: ComponentClass<T>, methodName: string|undefined, parameterIndex: number): ComponentClass<any> {
        let parameterClasses: ComponentClass<any>[] = ReflectionUtils.getParameterClasses(componentClass, methodName);
        return parameterClasses && parameterClasses[parameterIndex];
    }

    /**
     * Get method parameters classes
     * @param componentClass  Type class
     * @param methodName      Method name
     * @param <T>             Component type
     * @return List of parameter classes
     */
    static getParameterClasses<T>(componentClass: ComponentClass<T>, methodName?: string|symbol): Array<ComponentClass<any>> {
        let parameterClasses: Array<ComponentClass<any>>;

        if (methodName === undefined) {
            parameterClasses = Reflect.getMetadata(ReflectionUtils.METADATAKEY_PARAMETERTYPES, componentClass);
        } else {
            parameterClasses = Reflect.getMetadata(ReflectionUtils.METADATAKEY_PARAMETERTYPES, componentClass.prototype, methodName);
        }

        return parameterClasses;
    }

    /**
     * Get a method's return class
     * @param typeClass  Type class
     * @param methodName Method name
     * @param <T>        Type
     * @return Method return class
     */
    static getReturnClass<T>(typeClass: ComponentClass<T>, methodName: string|symbol): ComponentClass<any>|undefined {
        return Reflect.getMetadata(ReflectionUtils.METADATAKEY_RETURNTYPE, typeClass.prototype, methodName);
    }

}

export {
    ReflectionUtils
};
