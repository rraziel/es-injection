import {OrderedElement, OrderUtils} from './order-utils';
import {DependencyInfo} from '../metadata';

describe('Order utility functions', () => {

    it('can order elements', () => {
        // given
        let elementNames: string[] = ['f', 'e', 'd', 'c', 'b', 'a'];
        // when
        let orderedElements: OrderedElement<DependencyInfo>[] = OrderUtils.buildOrderedElementList(elementNames, elementName => {
            let order: number;

            switch (elementName) {
            case 'b':
            case 'f':
                order = 2;
                break;
            case 'c':
                order = 3;
                break;
            case 'd':
                order = 1;
                break;
            default:
                break;
            }

            return {
                order: order
            };
        });
        // then
        expect(orderedElements).not.toBeUndefined();
        expect(orderedElements[0].name).toEqual('d');
        expect(orderedElements[1].name).toEqual('b');
        expect(orderedElements[2].name).toEqual('f');
        expect(orderedElements[3].name).toEqual('c');
        expect(orderedElements[4].name).toEqual('a');
        expect(orderedElements[5].name).toEqual('e');
    });

});
