import {DependencyInfo} from '../metadata';

/**
 * Ordered element
 */
interface OrderedElement<T extends DependencyInfo> {
    info?: T;
    name: string;
}

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
    static buildOrderedElementList<T extends DependencyInfo>(elementNames: string[], infoResolver: (elementName: string) => T): OrderedElement<T>[] {
        return elementNames
            .map(elementName => <OrderedElement<T>> {
                info: infoResolver(elementName),
                name: elementName
            })
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
        let lhsOrder: number = OrderUtils.getOrder(lhs.info);
        let rhsOrder: number = OrderUtils.getOrder(rhs.info);
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
    private static getOrder(dependencyInfo: DependencyInfo): number {
        return (dependencyInfo && dependencyInfo.order) || Number.MAX_VALUE;
    }

}

export {
    OrderedElement,
    OrderUtils
};
