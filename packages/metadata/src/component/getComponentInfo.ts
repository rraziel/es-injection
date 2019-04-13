import {ComponentInfo} from './ComponentInfo';
import {ComponentInfoMetadata} from './ComponentInfoMetadata';
import {ComponentClass} from '../ComponentClass';
import 'reflect-metadata';

/**
 * Get component information
 * @param componentClass Component class
 * @param <T>            Component type
 * @return Component information
 */
function getComponentInfo<T>(componentClass: ComponentClass<T>): ComponentInfo|undefined {
    const componentInfo: ComponentInfo|undefined = Reflect.getOwnMetadata(ComponentInfoMetadata, componentClass);
    return componentInfo;
}

export {
    getComponentInfo
};
