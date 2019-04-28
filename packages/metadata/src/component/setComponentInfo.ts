import {ComponentInfo} from './ComponentInfo';
import {ComponentInfoMetadata} from './ComponentInfoMetadata';
import {ComponentClass} from '../ComponentClass';

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
    setComponentInfo
};
