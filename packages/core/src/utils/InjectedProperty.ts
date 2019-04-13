import {PropertyInfo} from '@es-injection/metadata';

/**
 * Injected property
 */
class InjectedProperty {
    readonly name: string;
    readonly info: PropertyInfo;

    /**
     * Class constructor
     * @param propertyName Property name
     * @param propertyInfo Property info
     */
    constructor(propertyName: string, propertyInfo: PropertyInfo) {
        this.name = propertyName;
        this.info = propertyInfo;
    }

}

export {
    InjectedProperty
};
