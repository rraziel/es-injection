import {ComponentInfo, getComponentInfo, setComponentInfo} from './component-info';
import {ScopeType} from '../scope-type';
import {Stereotype} from '../stereotype';

/**
 * Component information builder
 * @param <C> Constructor type
 */
class ComponentInfoBuilder<C extends Function> {
    private target: C;

    /**
     * Class constructor
     * @param target Target
     */
    private constructor(target: C) {
        this.target = target;
    }

    /**
     * Set the name
     * @param name Name
     * @return this
     */
    name(name: string): ComponentInfoBuilder<C> {
        return this.update(componentInfo => componentInfo.name = name);
    }

    /**
     * Set the stereotype
     * @param stereotype Stereotype
     * @return this
     */
    stereotype(stereotype: Stereotype): ComponentInfoBuilder<C> {
        return this.update(componentInfo => componentInfo.stereotype = stereotype);
    }

    /**
     * Set the scope
     * @param scope Scope
     * @return this
     */
    scope(scope: ScopeType): ComponentInfoBuilder<C> {
        return this.update(componentInfo => componentInfo.scope = scope);
    }

    /**
     * Manipulate a component information
     * @param callback Callback
     * @return this
     */
    private update(callback: (componentInfo: ComponentInfo) => void): ComponentInfoBuilder<C> {
        let componentInfo: ComponentInfo = getComponentInfo(this.target) || {};
        callback(componentInfo);
        setComponentInfo(this.target, componentInfo);
        return this;
    }

    /**
     * Get a component information builder for the specified class
     * @param target Class constructor
     * @param <C>    Class constructor type
     * @return Component information builder
     */
    static of<C extends Function>(target: C): ComponentInfoBuilder<C> {
        return new ComponentInfoBuilder(target);
    }

}

export {
    ComponentInfoBuilder
};
