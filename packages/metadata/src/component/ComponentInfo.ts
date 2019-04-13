import {ClassConstructor} from '../ClassConstructor';
import {Condition} from '../Condition';
import {ScopeType} from '../ScopeType';

/**
 * Component info
 */
class ComponentInfo {
    readonly implementations: Array<ClassConstructor<any>> = [];
    readonly properties: Array<string> = [];
    readonly conditions: Array<Condition> = [];
    readonly importedConfigurations: Array<Promise<ClassConstructor<any>>> = [];
    readonly scannedComponents: Array<ClassConstructor<any>> = [];
    name?: string;
    scope?: ScopeType;
    stereotype?: string;
}

export {
    ComponentInfo
};
