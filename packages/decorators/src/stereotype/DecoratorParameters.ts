import {StereotypeDefinition} from './StereotypeDefinition';

/**
 * Decorator parameters
 */
class DecoratorParameters<T> {
    propertyKey: string|symbol;
    descriptor: TypedPropertyDescriptor<T>;
    stereotype: string;
    componentName?: string;
    definition?: StereotypeDefinition;

    /**
     * Class constructor
     * @param propertyKey Property key
     * @param descriptor  Descriptor
     * @param stereotype  Stereotype
     */
    constructor(propertyKey: string|symbol, descriptor: TypedPropertyDescriptor<T>, stereotype: string) {
        this.propertyKey = propertyKey;
        this.descriptor = descriptor;
        this.stereotype = stereotype;
    }

}

export {
    DecoratorParameters
};
