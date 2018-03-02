import {ClassConstructor} from '../../utils';

/**
 * Dependency information
 */
interface DependencyInfo {
    name?: string;
    value?: string;
    optional?: boolean;
    order?: number;
    elementClass?: ClassConstructor<any>;
}

export {
    DependencyInfo
};
