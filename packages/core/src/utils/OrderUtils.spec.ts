import {OrderUtils} from './OrderUtils';
import {OrderedElement} from './OrderedElement';
import {DependencyInfo} from '@es-injection/metadata';

describe('Order utility functions', () => {

    it('can order elements', () => {
        // given
        const elementNames: Array<string> = ['g', 'h', 'f', 'e', 'd', 'c', 'b', 'a', 'a'];
        // when
        const orderedElements: Array<OrderedElement<DependencyInfo>> = OrderUtils.buildOrderedElementList(elementNames, elementName => {
            let order: number|undefined;

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
        expect(orderedElements).toBeDefined();
        expect(orderedElements.length).toBe(9);
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
