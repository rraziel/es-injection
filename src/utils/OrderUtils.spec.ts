import {OrderUtils} from './OrderUtils';
import {OrderedElement} from './OrderedElement';
import {DependencyInfo} from '../metadata';

describe('Order utility functions', () => {

    it('can order elements', () => {
        // given
        let elementNames: string[] = ['g', 'h', 'f', 'e', 'd', 'c', 'b', 'a', 'a'];
        // when
        let orderedElements: Array<OrderedElement<DependencyInfo>> = OrderUtils.buildOrderedElementList(elementNames, elementName => {
            let order: number;

            switch (elementName) {
            case 'b':
            case 'f':
            case 'g':
            case 'h':
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
        expect(orderedElements[0].name).toBe('d');
        expect(orderedElements[1].name).toBe('b');
        expect(orderedElements[2].name).toBe('f');
        expect(orderedElements[3].name).toBe('g');
        expect(orderedElements[4].name).toBe('h');
        expect(orderedElements[5].name).toBe('c');
        expect(orderedElements[6].name).toBe('a');
        expect(orderedElements[7].name).toBe('a');
        expect(orderedElements[8].name).toBe('e');
    });

});
