import {ComponentInfoBuilder} from '../metadata';
import {ClassConstructor} from '../utils';

/**
 * Create a ComponentScan decorator, used to specify a list of components to be registered by a @Configuration-decorated class
 * @param annotatedClasses Annotated classes
 */
function ComponentScan(...annotatedClasses: Array<ClassConstructor<any>>): ClassDecorator {
    return target => {
        ComponentInfoBuilder.of(target).componentScan(...annotatedClasses);
    };
}

export {
    ComponentScan
};
