import {DependencyInfo} from '../dependency';
import 'reflect-metadata';

/**
 * Property information metadata
 */
const PropertyInfoMetadata: Symbol = Symbol('es-injection:property');

/**
 * Property information
 */
interface PropertyInfo extends DependencyInfo {

}

/**
 * Get property information
 * @param componentClass Component class
 * @param propertyName   Property name
 * @param <C>            Component class type
 * @return Property information
 */
function getPropertyInfo<C extends Function>(componentClass: C, propertyName: string): PropertyInfo {
    let propertyInfo: PropertyInfo = Reflect.getOwnMetadata(PropertyInfoMetadata, componentClass, propertyName);
    return propertyInfo;
}

/**
 * Set property information
 * @param componentClass Component class
 * @param propertyName   Property name
 * @param propertyInfo   Property information
 * @param <C>            Component class type
 */
function setPropertyInfo<C extends Function>(componentClass: C, propertyName: string, propertyInfo: PropertyInfo): void {
    Reflect.defineMetadata(PropertyInfoMetadata, propertyInfo, componentClass, propertyName);
}

export {
    PropertyInfo,
    PropertyInfoMetadata,
    getPropertyInfo,
    setPropertyInfo
};
