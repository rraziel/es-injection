import {Condition} from '../Condition';
import {ScopeType} from '../ScopeType';
import {Stereotype} from '../Stereotype';
import {ClassConstructor, ComponentClass} from '../../utils';
import 'reflect-metadata';

/**
 * Component information metadata
 */
const ComponentInfoMetadata: Symbol = Symbol('es-injection:component');

/**
 * Component info
 */
interface ComponentInfo {
    name?: string;
    scope?: ScopeType;
    stereotype?: Stereotype;
    implementations?: Array<ClassConstructor<any>>;
    properties?: Array<string>;
    conditions?: Array<Condition>;
    importedConfigurations?: Array<ClassConstructor<any>>;
    scannedComponents?: Array<ClassConstructor<any>>;
}

/**
 * Get component information
 * @param componentClass Component class
 * @param <T>            Component type
 * @return Component information
 */
function getComponentInfo<T>(componentClass: ComponentClass<T>): ComponentInfo {
    let componentInfo: ComponentInfo = Reflect.getOwnMetadata(ComponentInfoMetadata, componentClass);
    return componentInfo;
}

/**
 * Set component information
 * @param componentClass Component class
 * @param componentInfo  Component information
 * @param <T>            Component type
 */
function setComponentInfo<T>(componentClass: ComponentClass<T>, componentInfo: ComponentInfo): void {
    Reflect.defineMetadata(ComponentInfoMetadata, componentInfo, componentClass);
}

export {
    ComponentInfo,
    getComponentInfo,
    setComponentInfo
};
