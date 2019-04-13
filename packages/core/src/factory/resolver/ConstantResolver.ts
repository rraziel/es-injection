import {ClassConstructor} from '@es-injection/metadata';

/**
 * Constant resolver
 * @param constantName  Constant name
 * @param expectedClass Expected class
 * @param <T>           Expected type
 * @return Promise that resolves to the constant
 */
type ConstantResolver = <T>(constantName: string, expectedClass: ClassConstructor<T>) => Promise<T>;

export {
    ConstantResolver
};
