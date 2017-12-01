import {Stereotype} from './stereotype';
import {ScopeType} from './scope-type';

/**
 * Registry
 */
class Registry {

    /**
     * Register a class
     * @param classConstructor Class constructor
     * @param stereotype       Stereotype
     * @param componentName    Component name
     * @param <T>              Class constructor type
     */
    static registerClass<F extends Function>(classConstructor: F, stereotype: Stereotype, componentName?: string): void {
        if (!componentName) {
            componentName = Registry.buildComponentName(classConstructor);
        }
    }

    /**
     * Generate a component name from a class constructor
     * @param classConstructor Class constructor
     * @param <F>              Class constructor type
     * @return Component name
     */
    static buildComponentName<F extends Function>(classConstructor: F): string {
        let componentName: string = '';
        let className: string = classConstructor.name;
        let matches: string[] = className.split(/([A-Z]+|[A-Z]?[a-z]+)(?=[A-Z]|\b)/);

        for (let match of matches) {
            componentName += match.replace(/(?:^\w|[A-Z]|\b\w)/g, (c, i) => i === 0 ? c.toUpperCase() : c.toLowerCase());
        }

        componentName = componentName.replace(/^[A-Z]{1}/, c => c.toLowerCase());

        return componentName;
    }

    /**
     * Test whether a string is lowercase
     * @param str String
     * @return true if the string is lowercase
     */
    static isLowerCase(str: string): boolean {
        return str === str.toLowerCase();
    }

}

export {
    Registry
};
