import {ComponentFactory} from './ComponentFactory';
import {ComponentFactorySettings} from './ComponentFactorySettings';
import {ClassUtils, OrderedElement, OrderUtils} from '../utils';
import {ComponentInfo, getComponentInfo, getMethodInfo, getPropertyInfo, MethodInfo, MethodParameterInfo, PropertyInfo, ScopeType} from '../metadata';
import {ClassConstructor, TypeUtils} from 'es-decorator-utils';

/**
 * Default component factory
 */
class DefaultComponentFactory implements ComponentFactory {
    private singletonComponents: Map<Function, Object> = new Map<Function, Object>();
    private componentClasses: ClassConstructor<any>[] = [];
    private componentNames: {[componentName: string]: ClassConstructor<any>} = {};
    private componentFactorySettings: ComponentFactorySettings;

    /**
     * Class constructor
     * @param componentFactorySettings Component factory settings
     */
    constructor(componentFactorySettings?: ComponentFactorySettings) {
        this.componentFactorySettings = componentFactorySettings;
    }

    /**
     * Set the available component classes
     * @param componentClasses Component classes
     */
    setComponentClasses(componentClasses: ClassConstructor<any>[]): void {
        this.componentNames = {};
        this.componentClasses = componentClasses;
        this.componentClasses.forEach(componentClass => this.componentNames[getComponentInfo(componentClass).name] = componentClass);
    }

    /**
     * Test whether the factory contains a component
     * @param componentName Component name
     * @return true if the factory contains the component
     */
    containsComponent(componentName: string): boolean {
        return !!(componentName in this.componentNames);
    }

    /**
     * Get a component
     * @param componentName  Component name or class
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instance
     */
    getComponent<T>(componentNameOrClass: ClassConstructor<T>|Function|string, componentClass?: ClassConstructor<T>|Function): T {
        let componentName: string;

        if (componentNameOrClass instanceof Function) {
            componentClass = componentNameOrClass;
        } else {
            componentName = componentNameOrClass;
        }

        return this.dispatchGetComponent(componentName, componentClass);
    }

    /**
     * Get a list of components
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instances
     */
    getComponents<T>(componentClass: ClassConstructor<T>): T[] {
        let componentInfo: ComponentInfo = getComponentInfo(componentClass);
        let implementationClasses: ClassConstructor<T>[] = componentInfo.implementations;

        if (!implementationClasses) {
            throw new Error('no implementation classes found for class ' + componentClass.name);
        }

        return implementationClasses
            .map(implementationClass => this.getComponent(implementationClass))
        ;
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
     * @param <T>       Component type
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
     * Get a component (implementation)
     * @param componentName  Component name
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instance
     */
    private dispatchGetComponent<T>(componentName: string, componentClass: ClassConstructor<T>|Function): T {
        let componentInfo: ComponentInfo = getComponentInfo(componentClass);
        if (!componentInfo) {
            throw new Error('unknown component class ' + componentClass.name);
        }

        if (componentInfo.scope && componentInfo.scope as ScopeType === ScopeType.PROTOTYPE) {
            return this.getPrototypeComponent(componentName, componentClass, componentInfo);
        } else {
            return this.getSingletonComponent(componentName, componentClass, componentInfo);
        }
    }

    /**
     * Get a prototype component
     * @param componentName  Component name
     * @param componentClass Component class
     * @param componentInfo  Component information
     * @param <T>            Component type
     * @return Component instance
     */
    private getPrototypeComponent<T>(componentName: string, componentClass: ClassConstructor<T>|Function, componentInfo: ComponentInfo): T {
        let componentInstance: T;
        // TODO: return this.newInstance(componentClass, componentInfo);
        return componentInstance;
    }

    /**
     * Get a singleton component
     * @param componentName  Component name
     * @param componentClass Component class
     * @param componentInfo  Component information
     * @param <T>            Component type
     * @return Component instance
     */
    private getSingletonComponent<T>(componentName: string, componentClass: ClassConstructor<T>|Function, componentInfo: ComponentInfo): T {
        let componentInstance: T;

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
        interface ComponentIterationInfo {
            componentClass: ClassConstructor<any>;
            componentInfo: ComponentInfo;
        }

        let componentInstance: T = this.instantiateClass(componentClass);
        let componentIteratorInfos: Array<ComponentIterationInfo> = [{
            componentClass: componentClass,
            componentInfo: componentInfo
        }];

        TypeUtils.forEachAncestor(componentClass, baseComponentClass => {
            let baseComponentInfo: ComponentInfo = getComponentInfo(baseComponentClass);
            componentIteratorInfos.push({
                componentClass: baseComponentClass,
                componentInfo: baseComponentInfo
            });
        });

        componentIteratorInfos.reverse().forEach(it => {
            let itClass: ClassConstructor<any> = it.componentClass;
            let itInfo: ComponentInfo = it.componentInfo;

            this.injectProperties(itClass, itInfo, componentInstance);
            this.injectMethods(itClass, itInfo, componentInstance);
            this.callPostConstructMethods(itClass, itInfo, componentInstance);
        });

        return componentInstance;
    }

    /**
     * Instantiate a component class
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instance
     */
    private instantiateClass<T>(componentClass: ClassConstructor<T>): T {
        let constructorInfo: MethodInfo = getMethodInfo(componentClass);
        let componentInstance: T = ClassUtils.instantiateClass(componentClass, (requiredClass, parameterIndex) => this.resolveMethodDependency(constructorInfo, requiredClass, parameterIndex));
        return componentInstance;
    }

    /**
     * Resolve a method dependency
     * @param methodInfo     Method information
     * @param requiredClass  Required class
     * @param parameterIndex Parameter index
     * @param <T>            Required type
     * @return Dependency instance
     */
    private resolveMethodDependency<T>(methodInfo: MethodInfo, requiredClass: ClassConstructor<T>, parameterIndex: number): T {
        let methodParameterInfo: MethodParameterInfo = methodInfo && methodInfo.parameters && methodInfo.parameters[parameterIndex];

        try {
            if (TypeUtils.isArray(requiredClass)) {
                return this.resolveMethodArrayDependency(methodParameterInfo, requiredClass);
            } else {
                return this.resolveMethodInstanceDependency(methodParameterInfo, requiredClass);
            }
        } catch (e) {
            return this.buildUnresolvedMethodDependency(e, methodParameterInfo, requiredClass);
        }
    }

    /**
     * Resolve a constructor dependency instance
     * @param methodParameterInfo Method parameter information
     * @param requiredClass       Required class
     * @param <T>                 Required type
     * @return Dependency instance
     */
    private resolveMethodInstanceDependency<T>(methodParameterInfo: MethodParameterInfo, requiredClass: ClassConstructor<T>): T {
        return this.getComponent(methodParameterInfo && methodParameterInfo.name, requiredClass);
    }

    /**
     * Resolve a constructor dependency array
     * @param methodParameterInfo Method parameter information
     * @param requiredClass       Required class
     * @param <T>                 Required type
     * @return Dependency array instance
     */
    private resolveMethodArrayDependency<T>(methodParameterInfo: MethodParameterInfo, requiredClass: ClassConstructor<T>): T {
        if (!methodParameterInfo.elementClass) {
            throw new Error('injected array parameter without any element class information (missing @ElementClass decorator)');
        }

        return <any> this.getComponents(methodParameterInfo.elementClass);
    }

    /**
     * Build an unresolved constructor dependency
     * @param methodParameterInfo Method parameter information
     * @param requiredClass       Required class
     * @param <T>                 Required type
     * @return Unresolved dependency
     */
    private buildUnresolvedMethodDependency<T>(e: any, methodParameterInfo: MethodParameterInfo, requiredClass: ClassConstructor<T>): T {
        if (!methodParameterInfo || !methodParameterInfo.optional) {
            throw e;
        }

        if (TypeUtils.isArray(requiredClass)) {
            return <any> [];
        }

        return undefined;
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

        OrderUtils.buildOrderedElementList(componentInfo.properties, propertyName => getPropertyInfo(componentClass, propertyName))
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
        let methodNames: Array<string> = [];

        TypeUtils.forEachMethod(componentClass, methodName => methodNames.push(methodName));

        OrderUtils.buildOrderedElementList(methodNames, methodName => getMethodInfo(componentClass, methodName))
            .filter(sortedMethod => sortedMethod.info && !sortedMethod.info.postConstruct)
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
            let methodParameter: any = this.resolveMethodDependency(methodInfo, methodParameterClass, parameterIndex);
            methodParameters.push(methodParameter);
        });
        /*    let methodParameterInfo: MethodParameterInfo = methodInfo && methodInfo.parameters && methodInfo.parameters[parameterIndex];
            let methodParameter: any;

           try {
                methodParameter = this.getComponent(methodParameterInfo && methodParameterInfo.name, methodParameterClass);
            } catch (e) {
                if (!methodParameterInfo || !methodParameterInfo.optional) {
                    throw e;
                }
            }

            methodParameters.push(methodParameter);
        });*/

        componentInstance[methodName].apply(componentInstance, methodParameters);
    }

    /**
     * Call methods annotated with @PostConstruct
     * @param componentClass    Component class
     * @param componentInfo     Component information
     * @param componentInstance Component type
     */
    private callPostConstructMethods<T>(componentClass: ClassConstructor<T>, componentInfo: ComponentInfo, componentInstance: T): void {
        let methodNames: Array<string> = [];

        TypeUtils.forEachMethod(componentClass, methodName => methodNames.push(methodName));

        OrderUtils.buildOrderedElementList(methodNames, methodName => getMethodInfo(componentClass, methodName))
            .filter(sortedMethod => sortedMethod.info && sortedMethod.info.postConstruct === true)
            .forEach(sortedMethod => this.callPostConstructMethod(componentClass, componentInfo, componentInstance, sortedMethod.name, sortedMethod.info))
        ;
    }

    /**
     * Call a method annotated with @PostConstruct
     * @param componentClass    Component class
     * @param componentInfo     Component information
     * @param componentInstance Component instance
     * @param methodName        Method name
     * @param methodInfo        Method information
     * @param <T>               Component type
     */
    private callPostConstructMethod<T>(componentClass: ClassConstructor<T>, componentInfo: ComponentInfo, componentInstance: T, methodName: string, methodInfo: MethodInfo): void {
        componentInstance[methodName].apply(componentInstance); // TODO: handle methods that return a promise
    }

}

export {
    DefaultComponentFactory
};
