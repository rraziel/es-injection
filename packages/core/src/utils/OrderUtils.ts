import {OrderedElement} from './OrderedElement';
import {DependencyInfo} from '@es-injection/metadata';

/**
 * Order utility functions
 */
class OrderUtils {

    /**
     * Build an ordered element list
     * @param elementNames Element names
     * @param infoResolver Information resolver
     * @param <T>          Dependency information type
     * @return Ordered element list
     */
    static buildOrderedElementList<T extends DependencyInfo>(elementNames: Array<string>, infoResolver: (elementName: string) => T|undefined): Array<OrderedElement<T>> {
        return elementNames
            .map(elementName => new OrderedElement<T>(elementName, infoResolver(elementName)))
            .sort(OrderUtils.OrderPredicate)
        ;
    }

    /**
     * Order elements based on their Order decorator
     * @param lhs Left-hand element
     * @param rhs Right-hand element
     * @return Comparison result
     */
    private static OrderPredicate<T extends DependencyInfo>(lhs: OrderedElement<T>, rhs: OrderedElement<T>): number {
        const lhsOrder: number = OrderUtils.getOrder(lhs.info);
        const rhsOrder: number = OrderUtils.getOrder(rhs.info);
        let result: number;

        if (lhsOrder < rhsOrder) {
            result = -1;
        } else if (lhsOrder > rhsOrder) {
            result = 1;
        } else if (lhs.name < rhs.name) {
            result = -1;
        } else if (lhs.name > rhs.name) {
            result = 1;
        } else {
            result = 0;
        }

        return result;
    }

    /**
     * Get the order value used to sort a dependency
     * @param dependencyInfo Dependency information
     * @return Order
     */
    private static getOrder(dependencyInfo: DependencyInfo|undefined): number {
        return (dependencyInfo && dependencyInfo.order) || Number.MAX_VALUE;
    }

}

export {
    OrderUtils
};
