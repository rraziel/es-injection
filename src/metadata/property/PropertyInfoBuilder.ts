import {getPropertyInfo, PropertyInfo, setPropertyInfo} from './PropertyInfo';
import {ComponentInfoBuilder} from '../component';
import {ClassConstructor} from '../../utils';

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
     * Mark the property for injection
     * @return this
     */
    inject(): PropertyInfoBuilder {
        ComponentInfoBuilder.of(<ClassConstructor<any>> this.target.constructor).property(<string> this.propertyKey);
        return this.update(() => { /* empty */ });
    }

    /**
     * Set the element class for a container type
     * @param elementClass Element class
     * @param <T>          Element type
     * @return this
     */
    elementClass<T>(elementClass: ClassConstructor<T>): PropertyInfoBuilder {
        return this.update(propertyInfo => propertyInfo.elementClass = elementClass);
    }

    /**
     * Set the dependency name
     * @param dependencyName Dependency name
     * @return this
     */
    name(dependencyName: string): PropertyInfoBuilder {
        return this.update(propertyInfo => propertyInfo.name = dependencyName);
    }

    /**
     * Set the value name
     * @param valueName Dependency value name
     * @return this
     */
    value(valueName: string): PropertyInfoBuilder {
        return this.update(propertyInfo => propertyInfo.value = valueName);
    }

    /**
     * Set whether the dependency is optional
     * @param optional true if the dependency is optional
     * @return this
     */
    optional(optional: boolean): PropertyInfoBuilder {
        return this.update(propertyInfo => propertyInfo.optional = optional);
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
