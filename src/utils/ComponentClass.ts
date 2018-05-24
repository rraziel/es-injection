import {ClassConstructor} from './ClassConstructor';

/**
 * Component class
 */
type ComponentClass<T> = ClassConstructor<T>|Function;

export {
    ComponentClass
};
