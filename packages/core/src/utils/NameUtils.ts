import {ComponentClass} from '@es-injection/metadata';

/**
 * Name utility functions
 */
class NameUtils {
    private static readonly REGEXP_COMPONENTNAME_SPLIT: RegExp = /([A-Z]+|[A-Z]?[a-z]+)(?=[A-Z]|\b)/;
    private static readonly REGEXP_COMPONENTNAME_PATTERN: RegExp = /(?:^\w|[A-Z]|\b\w)/g;
    private static readonly REGEXP_COMPONENTNAME_LCFIRST: RegExp = /^[A-Z]{1}/;

    /**
     * Generate a component name from a class
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component name
     */
    static buildComponentName<T>(componentClass: ComponentClass<T>): string {
        const className: string = componentClass.name;
        const componentName: string = className.split(NameUtils.REGEXP_COMPONENTNAME_SPLIT)
            .map(namePart => namePart.replace(NameUtils.REGEXP_COMPONENTNAME_PATTERN, (c, i) => i === 0 ? c.toUpperCase() : c.toLowerCase()))
            .join('')
        ;

        return componentName.replace(NameUtils.REGEXP_COMPONENTNAME_LCFIRST, c => c.toLowerCase());
    }

}

export {
    NameUtils
};
