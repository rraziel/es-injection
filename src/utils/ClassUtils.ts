import {ClassConstructor, TypeUtils} from 'es-decorator-utils';

type DependencyResolver = (requiredClass: ClassConstructor<any>, parameterIndex: number) => any;

/**
 * Class utility functions
 */
class ClassUtils {

    /**
     * Instantiate a class
     * @param typeClass Type class
     * @param resolver  Resolver
     * @return Instance
     */
    static instantiateClass<T>(typeClass: ClassConstructor<T>, resolver: DependencyResolver): T {
        let parameterClasses: ClassConstructor<any>[] = TypeUtils.getParameterClasses(typeClass);
        let parameters: any[] = [];

        if (parameterClasses) {
            parameterClasses.forEach((parameterClass, parameterIndex) => parameters.push(resolver(parameterClass, parameterIndex)));
        }

        return new typeClass(... parameters);
    }

}

export {
    DependencyResolver,
    ClassUtils
};
