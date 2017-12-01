
type ClassConstructor<T> = new (...args: any[]) => T;

/**
 * Application context
 */
interface ApplicationContext {

    /**
     * Get a component
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instance
     */
    getComponent<T>(componentClass: ClassConstructor<T>): T;

}

export {
    ApplicationContext,
    ClassConstructor
};
