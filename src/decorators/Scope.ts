import {ComponentInfoBuilder, ScopeType} from '../metadata';

/**
 * Scope decorator, used to specify the type of scope used for the component
 * @param scopeType Scope type
 * @return Class decorator
 */
function Scope(scopeType: ScopeType): ClassDecorator {
    return target => {
        ComponentInfoBuilder.of(target).scope(scopeType);
    };
}

export {
    Scope
};
