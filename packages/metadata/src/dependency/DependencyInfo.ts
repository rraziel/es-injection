import {ComponentClass} from '../ComponentClass';

/**
 * Dependency information
 */
class DependencyInfo {
    name?: string;
    value?: string;
    optional?: boolean;
    order?: number;
    elementClass?: ComponentClass<any>;
}

export {
    DependencyInfo
};
