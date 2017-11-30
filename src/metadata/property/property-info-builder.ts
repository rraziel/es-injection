import {getPropertyInfo, PropertyInfo, setPropertyInfo} from './property-info';
import {classFromPrototype} from '../helper';

/**
 * Property information builder
 */
class PropertyInfoBuilder {
    private target: Object;
    private propertyKey: string|symbol;

    /**
     * Class constructor
     * @param target      Target
     * @param propertyKey Property key
     */
    private constructor(target: Object, propertyKey: string|symbol) {
        this.target = target;
        this.propertyKey = propertyKey;
    }

    /**
     * Set the name
     * @param propertyName Property name
     * @return this
     */
    name(propertyName: string): PropertyInfoBuilder {
        return this.update(propertyInfo => propertyInfo.name = propertyName);
    }

    /**
     * Set the class
     * @param propertyClass Property class
     * @param <C>           Property type
     * @return this
     */
    class<C extends Function>(propertyClass: C): PropertyInfoBuilder {
        return this.update(propertyInfo => propertyInfo.type = propertyClass);
    }

    /**
     * Set the order index
     * @param index Index
     * @return this
     */
    order(index: number): PropertyInfoBuilder {
        return this.update(propertyInfo => propertyInfo.order = index);
    }

    /**
     * Manipulate a property information
     * @param callback Callback
     * @return this
     */
    private update(callback: (propertyInfo: PropertyInfo) => void): PropertyInfoBuilder {
        let propertyInfo: PropertyInfo = getPropertyInfo(this.target.constructor, <string> this.propertyKey) || {};
        callback(propertyInfo);
        setPropertyInfo(this.target.constructor, <string> this.propertyKey, propertyInfo);
        return this;
    }

    /**
     * Get a property information builder for the specified class property
     * @param target      Class prototype
     * @param propertyKey Property key
     * @return Property information builder
     */
    static of(target: Object, propertyKey: string|symbol): PropertyInfoBuilder {
        return new PropertyInfoBuilder(target, propertyKey);
    }

}

export {
    PropertyInfoBuilder
};
