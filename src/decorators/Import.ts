import {ComponentInfoBuilder} from '../metadata';
import {ClassConstructor} from '../utils';

/**
 * Create an Import decorator, used to specify a set of configuration classes (classes decorated with @Configuration) to import
 * @param configurationClasses Configuration classes
 * @return Import decorator
 */
function Import(...configurationClasses: Array<ClassConstructor<any>|Promise<ClassConstructor<any>>>): ClassDecorator {
    return target => {
        ComponentInfoBuilder.of(target).import(...configurationClasses);
    };
}

export {
    Import
};
