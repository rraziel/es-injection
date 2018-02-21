
/**
 * Create a ComponentScan decorator, used to specify a list of components to be registered by a @Configuration-decorated class
 * @param annotatedClasses Annotated classes
 */
function ComponentScan(...annotatedClasses: Function[]): ClassDecorator {
    return () => {
        // TODO
    };
}

export {
    ComponentScan
};
