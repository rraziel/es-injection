import {DependencyInfo} from '../metadata';

/**
 * Ordered element
 */
class OrderedElement<T extends DependencyInfo> {
    info?: T;
    name: string;
}

export {
    OrderedElement
};
