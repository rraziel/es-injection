
/**
 * Class constructor
 */
type ClassConstructor<T> = new (...args: any[]) => T;

/**
 * Factory
 */
interface Factory {

    /**
     * Create an instance
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Instance
     */
    createInstance<T>(componentClass: ClassConstructor<T>): T;

}

export {
    ClassConstructor,
    Factory
};
