import {PropertyInfoBuilder} from '@es-injection/metadata';

/**
 * Property information callback
 * @param propertyInfoBuilder Property information builder
 */
type PropertyInfoCallback = (propertyInfoBuilder: PropertyInfoBuilder) => void;

export {
    PropertyInfoCallback
};
