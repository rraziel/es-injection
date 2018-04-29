import {ComponentInfoBuilder} from '../metadata';
import {ClassConstructor} from 'es-decorator-utils';

/**
 * Create a ComponentScan decorator, used to specify a list of components to be registered by a @Configuration-decorated class
 * @param annotatedClasses Annotated classes
 */
function ComponentScan(...annotatedClasses: ClassConstructor<any>[]): ClassDecorator {
    return target => {
        ComponentInfoBuilder.of(<ClassConstructor<any>> <any> target).componentScan(...annotatedClasses);
    };
}

export {
    ComponentScan
};
