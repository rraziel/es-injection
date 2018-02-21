
/**
 * Create an Import decorator, used to specify a set of configuration classes (classes decorated with @Configuration) to import
 * @param configurationClasses Configuration classes
 */
function Import(...configurationClasses: Function[]): ClassDecorator {
    return null;
}

export {
    Import
};
