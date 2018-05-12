import {ComponentFactory} from '../factory';
import {ClassConstructor} from 'es-decorator-utils';

/**
 * Application context
 */
abstract class ApplicationContext extends ComponentFactory {

    /**
     * Refresh the context
     * @return Promise that resolves once the context is refreshed
     */
    abstract refresh(): Promise<void>;

    /**
     * Close the context
     * @return Promise that resolves once the context is closed
     */
    abstract close(): Promise<void>;

}

export {
    ApplicationContext
};
