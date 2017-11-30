
type ClassConstructorTypeFromType<T> = new (...args: any[]) => T;

/**
 * Application context
 */
interface ApplicationContext {

    /**
     * Get a component
     * @param componentClass Component class constructor
     * @param <T>            Component type
     * @return Component instance
     */
    getComponent<T>(componentClass: ClassConstructorTypeFromType<T>): T;

}

export {
    ApplicationContext
};
