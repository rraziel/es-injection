import {ComponentFactory} from './component-factory';
import {ClassConstructor, TypeUtils} from '../utils';
import {ComponentInfo, DependencyInfo, getComponentInfo, getMethodInfo, getPropertyInfo, MethodInfo, MethodParameterInfo, PropertyInfo, ScopeType} from '../metadata';

/**
 * Ordered element
 */
interface OrderedElement<T extends DependencyInfo> {
    info?: T;
    name: string;
}

/**
 * Default component factory
 */
class DefaultComponentFactory implements ComponentFactory {
    private singletonComponents: Map<Function, Object> = new Map<Function, Object>();

    /**
     * Test whether the factory contains a component
     * @param componentName Component name
     * @return true if the factory contains the component
     */
    containsComponent(componentName: string): boolean {
        return false;
    }

    /**
     * Get a component
     * @param componentName  Component name or class
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instance
     */
    getComponent<T>(componentNameOrClass: ClassConstructor<T>|Function|string, componentClass?: ClassConstructor<T>|Function): T {
        let componentInstance: T;
        let componentName: string;
        let componentInfo: ComponentInfo;

        if (componentNameOrClass instanceof Function) {
            componentClass = componentNameOrClass;
        } else {
            componentName = componentNameOrClass;
        }

        componentInfo = getComponentInfo(componentClass);
        if (!componentInfo) {
            throw new Error('unknown component class ' + componentClass.name);
        }

        if (componentInfo.scope && componentInfo.scope as ScopeType === ScopeType.PROTOTYPE) {
            // TODO: return this.newInstance(componentClass, componentInfo);
            return null;
        }

        this.instantiateSingletonsIfNecessary(componentClass, componentInfo);

        if (componentInfo.stereotype === undefined) {
            if (componentInfo.implementations.length > 1) {
                let availableImplementations: string[] = componentInfo.implementations.map(implementation => implementation.name);
                throw new Error('multiple component instances found for type ' + componentClass.name + ': ' + availableImplementations.join(', '));
            }

            componentInstance = this.getComponent(componentName, componentInfo.implementations[0]);
        } else {
            componentInstance = <T> this.singletonComponents.get(componentClass);
        }

        if (componentInstance === undefined) {
            throw new Error('no component instance found for type ' + componentClass.name);
        }

        return componentInstance;
    }

    /**
     * Get a list of components
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instances
     */
    getComponents<T>(componentClass: ClassConstructor<T>): T[] {
        throw new Error('getComponents not implemented');
    }

    /**
     * Get a component's class
     * @param componentName Component name
     * @return Component class
     */
    getComponentClass(componentName: string): ClassConstructor<any> {
        return null;
    }

    /**
     * Register a component
     * @param component Component
     */
    registerComponent<T>(component: T): void {
        // TODO
    }

    /**
     * Register a component class
     * @param componentClass Component class
     * @param <T>            Component type
     */
    registerComponentClass<T>(componentClass: ClassConstructor<T>): void {
        // TODO
    }

    /**
     * Instantiate singletons if they have not been instantiated yet
     * @param componentClass Component class
     * @param componentInfo  Component info
     * @param <T>            Component type
     */
    private instantiateSingletonsIfNecessary<T>(componentClass: ClassConstructor<T>|Function, componentInfo: ComponentInfo): void {
        let componentInstance: T = <T> this.singletonComponents.get(componentClass);
        if (componentInstance) {
            return;
        }

        if (componentInfo.implementations) {
            componentInfo.implementations.forEach(implementationClass => {
                let implementationClassInfo: ComponentInfo = getComponentInfo(implementationClass);
                this.instantiateSingletonsIfNecessary(implementationClass, implementationClassInfo);
            });
        }

        if (componentInfo.stereotype !== undefined) {
            componentInstance = this.newInstance(<ClassConstructor<T>> componentClass, componentInfo);
            this.singletonComponents.set(componentClass, componentInstance);
        }
    }

    /**
     * Create a new component instance
     * @param componentClass Component class
     * @param componentInfo  Component information
     * @param <T>            Component type
     * @return New component instance
     */
    private newInstance<T>(componentClass: ClassConstructor<T>, componentInfo: ComponentInfo): T {
        let parameterClasses: ClassConstructor<any>[] = TypeUtils.getParameterClasses(componentClass);
        let methodInfo: MethodInfo = getMethodInfo(componentClass);
        let componentInstance: T = TypeUtils.instantiateClass(componentClass, (requiredClass, parameterIndex) => {
            let methodParameterInfo: MethodParameterInfo = methodInfo && methodInfo.parameters && methodInfo.parameters[parameterIndex];
            let requiredComponent: any;

            try {
                requiredComponent = this.getComponent(methodParameterInfo && methodParameterInfo.name, requiredClass);
            } catch (e) {
                if (!methodParameterInfo || !methodParameterInfo.optional) {
                    throw e;
                }
            }

            return requiredComponent;
        });

        this.injectProperties(componentClass, componentInfo, componentInstance);
        this.injectMethods(componentClass, componentInfo, componentInstance);

        return componentInstance;
    }

    /**
     * Inject properties
     * @param componentClass    Component class
     * @param componentInfo     Component information
     * @param componentInstance Component instance
     * @param <T>               Component type
     */
    private injectProperties<T>(componentClass: ClassConstructor<T>, componentInfo: ComponentInfo, componentInstance: T): void {
        if (!componentInfo.properties) {
            return;
        }

        this.buildOrderedElementList(componentInfo.properties, propertyName => getPropertyInfo(componentClass, propertyName))
            .forEach(sortedProperty => this.injectProperty(componentClass, componentInfo, componentInstance, sortedProperty.name, sortedProperty.info))
        ;
    }

    /**
     * Inject a property
     * @param componentClass    Component class
     * @param componentInfo     Component information
     * @param componentInstance Component instance
     * @param propertyName      Property name
     * @param <T>               Component type
     */
    private injectProperty<T>(componentClass: ClassConstructor<T>, componentInfo: ComponentInfo, componentInstance: T, propertyName: string, propertyInfo: PropertyInfo): void {
        let propertyClass: ClassConstructor<any> = TypeUtils.getPropertyClass(componentClass, propertyName);
        let propertyInstance: any;

        try {
            if (propertyInfo.name) {
                propertyInstance = this.getComponent(propertyInfo.name, propertyClass);
            } else {
                propertyInstance = this.getComponent(propertyClass);
            }
        } catch (e) {
            if (!propertyInfo.optional) {
                throw e;
            }
        }

        componentInstance[propertyName] = propertyInstance;
    }

    /**
     * Inject methods
     * @param componentClass    Component class
     * @param componentInfo     Component information
     * @param componentInstance Component instance
     * @param <T>               Component type
     */
    private injectMethods<T>(componentClass: ClassConstructor<T>, componentInfo: ComponentInfo, componentInstance: T): void {
        if (!componentInfo.methods) {
            return;
        }

        this.buildOrderedElementList(componentInfo.methods, methodName => getMethodInfo(componentClass, methodName))
            .forEach(sortedMethod => this.injectMethod(componentClass, componentInfo, componentInstance, sortedMethod.name, sortedMethod.info))
        ;
    }

    /**
     * Inject a method
     * @param componentClass    Component class
     * @param componentInfo     Component information
     * @param componentInstance Component instance
     * @param methodName        Method name
     * @param methodInfo        Method information
     * @param <T>               Component type
     */
    private injectMethod<T>(componentClass: ClassConstructor<T>, componentInfo: ComponentInfo, componentInstance: T, methodName: string, methodInfo: MethodInfo): void {
        let methodParameterClasses: ClassConstructor<any>[] = TypeUtils.getParameterClasses(componentClass, methodName);
        let methodParameters: any[] = [];

        methodParameterClasses.forEach((methodParameterClass, parameterIndex) => {
            let methodParameterInfo: MethodParameterInfo = methodInfo && methodInfo.parameters && methodInfo.parameters[parameterIndex];
            let methodParameter: any;

            try {
                methodParameter = this.getComponent(methodParameterInfo && methodParameterInfo.name, methodParameterClass);
            } catch (e) {
                if (!methodParameterInfo || !methodParameterInfo.optional) {
                    throw e;
                }
            }

            methodParameters.push(methodParameter);
        });

        componentInstance[methodName].apply(componentInstance, methodParameters);
    }

    /**
     * Build an ordered element list
     * @param elementNames Element names
     * @param infoResolver Information resolver
     * @param <T>          Dependency information type
     * @return Ordered element list
     */
    private buildOrderedElementList<T extends DependencyInfo>(elementNames: string[], infoResolver: (elementName: string) => T): OrderedElement<T>[] {
        return elementNames
            .map(elementName => <OrderedElement<T>> {
                info: infoResolver(elementName),
                name: elementName
            })
            .sort(DefaultComponentFactory.OrderPredicate)
        ;
    }

    /**
     * Order elements based on their Order decorator
     * @param lhs Left-hand element
     * @param rhs Right-hand element
     * @return Comparison result
     */
    private static OrderPredicate<T extends DependencyInfo>(lhs: OrderedElement<T>, rhs: OrderedElement<T>): number {
        let lhsOrder: number = lhs.info && lhs.info.order;
        let rhsOrder: number = rhs.info && rhs.info.order;

        if (lhsOrder < rhsOrder) {
            return -1;
        } else if (lhsOrder > rhsOrder) {
            return 1;
        } else if (lhs.name < rhs.name) {
            return -1;
        } else if (lhs.name > rhs.name) {
            return 1;
        } else {
            return 0;
        }
    }

}

export {
    DefaultComponentFactory
};
