import {ClassConstructor, TypeUtils} from 'es-decorator-utils';

type DependencyResolver = (requiredClass: ClassConstructor<any>, parameterIndex: number) => Promise<any>;

/**
 * Class utility functions
 */
class ClassUtils {

    /**
     * Instantiate a class
     * @param typeClass Type class
     * @param resolver  Resolver
     * @param <T>       Type
     * @return Instance
     */
    static async instantiateClass<T>(typeClass: ClassConstructor<T>, resolver: DependencyResolver): Promise<T> {
        let parameterClasses: ClassConstructor<any>[] = TypeUtils.getParameterClasses(typeClass);
        let parameters: Array<any> = [];

        if (parameterClasses) {
            let parameterPromises: Array<Promise<any>> = parameterClasses.map((parameterClass, parameterIndex) => resolver(parameterClass, parameterIndex));
            parameters = await Promise.all(parameterPromises);
        }

        return new typeClass(... parameters);
    }

}

export {
    DependencyResolver,
    ClassUtils
};
