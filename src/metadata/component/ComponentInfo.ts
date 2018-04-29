import {Condition} from '../Condition';
import {ScopeType} from '../ScopeType';
import {Stereotype} from '../Stereotype';
import {ClassConstructor} from 'es-decorator-utils';
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
    implementations?: ClassConstructor<any>[];
    properties?: string[];
    methods?: string[]; // TODO: remove and instead enumerate methods looking for metadata
    conditions?: Condition[];
    importedConfigurations?: ClassConstructor<any>[];
    scannedComponents?: ClassConstructor<any>[];
}

/**
 * Get component information
 * @param componentClass Component class
 * @return Component information
 */
function getComponentInfo<C extends Function>(componentClass: C): ComponentInfo {
    let componentInfo: ComponentInfo = Reflect.getOwnMetadata(ComponentInfoMetadata, componentClass);
    return componentInfo;
}

/**
 * Set component information
 * @param componentClass Component class
 * @param componentInfo  Component information
 */
function setComponentInfo<C extends Function>(componentClass: C, componentInfo: ComponentInfo): void {
    Reflect.defineMetadata(ComponentInfoMetadata, componentInfo, componentClass);
}

export {
    ComponentInfo,
    getComponentInfo,
    setComponentInfo
};
