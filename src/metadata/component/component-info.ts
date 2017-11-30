import {ScopeType} from '../scope-type';
import {Stereotype} from '../stereotype';
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
}

/**
 * Get component information
 * @param componentClass Component class
 * @return Component information
 */
function getComponentInfo<C extends Function>(componentClass: C): ComponentInfo {
    let componentInfo: ComponentInfo = Reflect.getMetadata(ComponentInfoMetadata, componentClass);
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
