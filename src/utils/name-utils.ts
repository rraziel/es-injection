import {ClassConstructor} from './class-constructor';

/**
 * Name utility functions
 */
class NameUtils {
    private static REGEXP_COMPONENTNAME_SPLIT: RegExp = /([A-Z]+|[A-Z]?[a-z]+)(?=[A-Z]|\b)/;
    private static REGEXP_COMPONENTNAME_PATTERN: RegExp = /(?:^\w|[A-Z]|\b\w)/g;
    private static REGEXP_COMPONENTNAME_LCFIRST: RegExp = /^[A-Z]{1}/;

    /**
     * Generate a component name from a class
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component name
     */
    static buildComponentName<T>(componentClass: ClassConstructor<T>): string {
        let componentName: string = '';
        let className: string = componentClass.name;
        let matches: string[] = className.split(NameUtils.REGEXP_COMPONENTNAME_SPLIT);

        for (let match of matches) {
            componentName += match.replace(NameUtils.REGEXP_COMPONENTNAME_PATTERN, (c, i) => i === 0 ? c.toUpperCase() : c.toLowerCase());
        }

        componentName = componentName.replace(NameUtils.REGEXP_COMPONENTNAME_LCFIRST, c => c.toLowerCase());

        return componentName;
    }

}

export {
    NameUtils
};
