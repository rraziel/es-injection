import {ComponentClass} from '../../utils';

/**
 * Dependency information
 */
interface DependencyInfo {
    name?: string;
    value?: string;
    optional?: boolean;
    order?: number;
    elementClass?: ComponentClass<any>;
}

export {
    DependencyInfo
};
