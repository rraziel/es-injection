import {ComponentFactory} from '../factory';

/**
 * Application context
 */
interface ApplicationContext extends ComponentFactory {

    /**
     * Refresh the context
     * @return Promise that resolves once the context is refreshed
     */
    refresh(): Promise<void>;

    /**
     * Close the context
     * @return Promise that resolves once the context is closed
     */
    close(): Promise<void>;

}

export {
    ApplicationContext
};
