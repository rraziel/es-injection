import {ApplicationContext} from './application-context';
import {DefaultComponentFactory} from '../factory';
import {ClassConstructor} from '../utils';

/**
 * Application context accepting annotated classes as input
 */
class AnnotationConfigApplicationContext extends DefaultComponentFactory implements ApplicationContext {

    /**
     * Class constructor
     * @param annotatedClasses Annotated classes
     */
    constructor(...annotatedClasses: ClassConstructor<any>[]) {
        super();
        this.register(...annotatedClasses);
    }

    /**
     * Register annotated classes
     * @param annotatedClasses Annotated classes
     */
    register(...annotatedClasses: ClassConstructor<any>[]): void {
        annotatedClasses.forEach(annotatedClass => this.registerAnnotatedClass(annotatedClass));
    }

    /**
     * Register an annotated class
     * @param annotatedClass Annotated class
     */
    private registerAnnotatedClass<T>(annotatedClass: ClassConstructor<T>): void {
        this.registerComponentClass(annotatedClass);
    }

}

export {
    AnnotationConfigApplicationContext
};
