import {DependencyInfo} from '@es-injection/metadata';

/**
 * Ordered element
 */
class OrderedElement<T extends DependencyInfo> {
    readonly name: string;
    readonly info: T|undefined;

    /**
     * Class constructor
     * @param name Name
     * @param info Information
     */
    constructor(name: string, info?: T) {
        this.name = name;
        this.info = info;
    }

}

export {
    OrderedElement
};
