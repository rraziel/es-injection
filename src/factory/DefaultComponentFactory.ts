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
    private componentClasses: Set<ClassConstructor<any>> = new Set<ClassConstructor<any>>();
    private componentNames: Map<string, ClassConstructor<any>> = new Map<string, ClassConstructor<any>>();
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
        this.componentNames.clear();
        this.componentClasses.clear();
        componentClasses.forEach(componentClass => this.componentClasses.add(componentClass));
        this.componentClasses.forEach(componentClass => this.componentNames.set(getComponentInfo(componentClass).name, componentClass));
    }

    /**
     * Test whether the factory contains a component
     * @param componentName Component name
     * @return true if the factory contains the component
     */
    containsComponent(componentName: string): boolean {
        return this.componentNames.has(componentName);
    }

    /**
     * Get a component
     * @param componentName  Component name or class
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instance
     */
    async getComponent<T>(componentNameOrClass: ClassConstructor<T>|Function|string, componentClass?: ClassConstructor<T>|Function): Promise<T> {
        let componentName: string;

        if (componentNameOrClass instanceof Function) {
            componentClass = componentNameOrClass;
        } else {
            componentName = componentNameOrClass;
        }

        return await this.dispatchGetComponent(componentName, componentClass);
    }

    /**
     * Get a list of components
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instances
     */
    async getComponents<T>(componentClass: ClassConstructor<T>): Promise<Array<T>> {
        let componentInfo: ComponentInfo = getComponentInfo(componentClass);
        let implementationClasses: ClassConstructor<T>[] = componentInfo.implementations;
        let promises: Array<Promise<T>>;

        if (!implementationClasses) {
            throw new Error('no implementation classes found for class ' + componentClass.name);
        }

        promises = implementationClasses
            .map(implementationClass => this.getComponent(implementationClass))
        ;

        return await Promise.all(promises);
    }

    /**
     * Get a component's class
     * @param componentName Component name
     * @return Component class
     */
    getComponentClass(componentName: string): ClassConstructor<any> {
        return this.componentNames.get(componentName);
    }

    /**
     * Register a component
     * @param component Component
     * @param <T>       Component type
     */
    registerComponent<T>(component: T): void {
        let componentClass: ClassConstructor<T> = Object.getPrototypeOf(component).constructor;
        TypeUtils.forEachClass(componentClass, typeClass => this.singletonComponents.set(typeClass, component));
        this.registerComponentClass(componentClass);
    }

    /**
     * Register a component class
     * @param componentClass Component class
     * @param <T>            Component type
     */
    registerComponentClass<T>(componentClass: ClassConstructor<T>): void {
        TypeUtils.forEachClass(componentClass, typeClass => this.componentClasses.add(typeClass));
    }

    /**
     * Start the factory, instantiating all registered singleton components
     */
    async start(): Promise<void> {
        // TODO
    }

    /**
     * Stop the factory, destroying all instantiated components
     */
    async stop(): Promise<void> {
        // TODO
    }

    /**
     * Get a component (implementation)
     * @param componentName  Component name
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instance
     */
    private async dispatchGetComponent<T>(componentName: string, componentClass: ClassConstructor<T>|Function): Promise<T> {
        this.validateRegisteredComponent(componentName, componentClass);

        let componentInfo: ComponentInfo = getComponentInfo(componentClass);
        if (!componentInfo) {
            throw new Error('unknown component class ' + componentClass.name + ' (no metadata)');
        }

        if ((componentInfo.scope as ScopeType) === ScopeType.PROTOTYPE) {
            return await this.getPrototypeComponent(componentName, componentClass, componentInfo);
        } else {
            return await this.getSingletonComponent(componentName, componentClass, componentInfo);
        }
    }

    /**
     * Test whether a component has been registered within the factory
     * @param componentName  Component name
     * @param componentClass Component class
     */
    private validateRegisteredComponent<T>(componentName: string, componentClass: ClassConstructor<T>|Function): void {
        if (!this.componentClasses.has(<ClassConstructor<T>> componentClass)) {
            throw new Error('unknown component class ' + componentClass.name + ' (unregistered)');
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
    private async getPrototypeComponent<T>(componentName: string, componentClass: ClassConstructor<T>|Function, componentInfo: ComponentInfo): Promise<T> {
        let componentInstance: T = await this.newInstance(<ClassConstructor<T>> componentClass, componentInfo);
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
    private async getSingletonComponent<T>(componentName: string, componentClass: ClassConstructor<T>|Function, componentInfo: ComponentInfo): Promise<T> {
        let componentInstance: T;

        await this.instantiateSingletonsIfNecessary(componentClass, componentInfo);

        if (componentInfo.stereotype === undefined) {
            if (componentInfo.implementations.length > 1) {
                let availableImplementations: string[] = componentInfo.implementations.map(implementation => implementation.name);
                throw new Error('multiple component instances found for type ' + componentClass.name + ': ' + availableImplementations.join(', '));
            }

            componentInstance = await this.getComponent(componentName, componentInfo.implementations[0]);
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
    private async instantiateSingletonsIfNecessary<T>(componentClass: ClassConstructor<T>|Function, componentInfo: ComponentInfo): Promise<void> {
        let componentInstance: T = <T> this.singletonComponents.get(componentClass);
        if (componentInstance) {
            return;
        }

        if (componentInfo.implementations) {
            let promises: Promise<void>[] = componentInfo.implementations.map(implementationClass => {
                let implementationClassInfo: ComponentInfo = getComponentInfo(implementationClass);
                return this.instantiateSingletonsIfNecessary(implementationClass, implementationClassInfo);
            });

            await Promise.all(promises);
        }

        if (componentInfo.stereotype !== undefined) {
            componentInstance = await this.newInstance(<ClassConstructor<T>> componentClass, componentInfo);
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
    private async newInstance<T>(componentClass: ClassConstructor<T>, componentInfo: ComponentInfo): Promise<T> {
        interface ComponentIterationInfo {
            componentClass: ClassConstructor<any>;
            componentInfo: ComponentInfo;
        }

        let componentInstance: T = await this.instantiateClass(componentClass);
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

        for (let it of componentIteratorInfos.reverse()) {
            await this.prepareNewInstance(it.componentClass, it.componentInfo, componentInstance);
        }

        return componentInstance;
    }

    /**
     * Prepare a new instance, injecting its properties and methods, then calling its post construction methods
     * @param componentClass    Component class
     * @param componentInfo     Component info
     * @param componentInstance Component instance
     * @param <T>               Component type
     * @return Promise that resolves once the new instance is prepared
     */
    private async prepareNewInstance<T>(componentClass: ClassConstructor<any>, componentInfo: ComponentInfo, componentInstance: T): Promise<void> {
        await this.injectProperties(componentClass, componentInfo, componentInstance);
        await this.injectMethods(componentClass, componentInfo, componentInstance);
        await this.callPostConstructMethods(componentClass, componentInfo, componentInstance);
    }

    /**
     * Instantiate a component class
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instance
     */
    private async instantiateClass<T>(componentClass: ClassConstructor<T>): Promise<T> {
        let constructorInfo: MethodInfo = getMethodInfo(componentClass);
        let componentInstance: T = await ClassUtils.instantiateClass(componentClass, async (requiredClass, parameterIndex) => {
            return await this.resolveMethodDependency(constructorInfo, requiredClass, parameterIndex);
        });

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
    private async resolveMethodDependency<T>(methodInfo: MethodInfo, requiredClass: ClassConstructor<T>, parameterIndex: number): Promise<T> {
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
    private resolveMethodInstanceDependency<T>(methodParameterInfo: MethodParameterInfo, requiredClass: ClassConstructor<T>): Promise<T> {
        return this.getComponent(methodParameterInfo && methodParameterInfo.name, requiredClass);
    }

    /**
     * Resolve a constructor dependency array
     * @param methodParameterInfo Method parameter information
     * @param requiredClass       Required class
     * @param <T>                 Required type
     * @return Dependency array instance
     */
    private resolveMethodArrayDependency<T>(methodParameterInfo: MethodParameterInfo, requiredClass: ClassConstructor<T>): Promise<T> {
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
     * @return Promise that resolves once all properties have been injected
     */
    private async injectProperties<T>(componentClass: ClassConstructor<T>, componentInfo: ComponentInfo, componentInstance: T): Promise<void> {
        if (!componentInfo.properties) {
            return;
        }

        let orderedPropertyInfos: Array<OrderedElement<PropertyInfo>>;

        orderedPropertyInfos = OrderUtils.buildOrderedElementList(componentInfo.properties, propertyName => getPropertyInfo(componentClass, propertyName));

        for (let orderedPropertyInfo of orderedPropertyInfos) {
            await this.injectProperty(componentClass, componentInfo, componentInstance, orderedPropertyInfo.name, orderedPropertyInfo.info);
        }
    }

    /**
     * Inject a property
     * @param componentClass    Component class
     * @param componentInfo     Component information
     * @param componentInstance Component instance
     * @param propertyName      Property name
     * @param propertyInfo      Property info
     * @param <T>               Component type
     * @return Promise that resolves once the property has been injected
     */
    private async injectProperty<T>(componentClass: ClassConstructor<T>, componentInfo: ComponentInfo, componentInstance: T, propertyName: string, propertyInfo: PropertyInfo): Promise<void> {
        let propertyClass: ClassConstructor<any> = TypeUtils.getPropertyClass(componentClass, propertyName);
        let propertyInstance: any;

        try {
            if (propertyInfo.name) {
                propertyInstance = await this.getComponent(propertyInfo.name, propertyClass);
            } else {
                propertyInstance = await this.getComponent(propertyClass);
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
     * @return Promise that resolves once all injection methods have been called
     */
    private async injectMethods<T>(componentClass: ClassConstructor<T>, componentInfo: ComponentInfo, componentInstance: T): Promise<void> {
        let orderedMethodInfos: Array<OrderedElement<MethodInfo>>;
        let methodNames: Array<string> = [];

        TypeUtils.forEachMethod(componentClass, methodName => methodNames.push(methodName));

        orderedMethodInfos = OrderUtils.buildOrderedElementList(methodNames, methodName => getMethodInfo(componentClass, methodName))
            .filter(sortedMethod => sortedMethod.info && !sortedMethod.info.postConstruct)
        ;

        for (let orderedMethodInfo of orderedMethodInfos) {
            await this.injectMethod(componentClass, componentInfo, componentInstance, orderedMethodInfo.name, orderedMethodInfo.info);
        }
    }

    /**
     * Inject a method
     * @param componentClass    Component class
     * @param componentInfo     Component information
     * @param componentInstance Component instance
     * @param methodName        Method name
     * @param methodInfo        Method information
     * @param <T>               Component type
     * @return Promise that resolves once the injection method has been called
     */
    private async injectMethod<T>(componentClass: ClassConstructor<T>, componentInfo: ComponentInfo, componentInstance: T, methodName: string, methodInfo: MethodInfo): Promise<void> {
        let methodParameterClasses: Array<ClassConstructor<any>> = TypeUtils.getParameterClasses(componentClass, methodName);
        let methodParameters: Array<any> = [];
        let methodResult: Promise<void>;

        if (methodParameterClasses) {
            for (let i: number = 0; i !== methodParameterClasses.length; ++i) {
                let methodParameterClass: ClassConstructor<any> = methodParameterClasses[i];
                let methodParameter: any = await this.resolveMethodDependency(methodInfo, methodParameterClass, i);
                methodParameters.push(methodParameter);
            }
        }

        await this.callPotentiallyAsynchronousMethod(componentInstance, methodName, methodParameters);
    }

    /**
     * Call methods annotated with @PostConstruct
     * @param componentClass    Component class
     * @param componentInfo     Component information
     * @param componentInstance Component type
     * @preturn Promise that resolves once all post construction methods have been called
     */
    private async callPostConstructMethods<T>(componentClass: ClassConstructor<T>, componentInfo: ComponentInfo, componentInstance: T): Promise<void> {
        let orderedMethodInfos: Array<OrderedElement<MethodInfo>>;
        let methodNames: Array<string> = [];

        TypeUtils.forEachMethod(componentClass, methodName => methodNames.push(methodName));

        orderedMethodInfos = OrderUtils.buildOrderedElementList(methodNames, methodName => getMethodInfo(componentClass, methodName))
            .filter(sortedMethod => sortedMethod.info && sortedMethod.info.postConstruct === true)
        ;

        for (let orderedMethodInfo of orderedMethodInfos) {
            await this.callPostConstructMethod(componentClass, componentInfo, componentInstance, orderedMethodInfo.name, orderedMethodInfo.info);
        }
    }

    /**
     * Call a method annotated with @PostConstruct
     * @param componentClass    Component class
     * @param componentInfo     Component information
     * @param componentInstance Component instance
     * @param methodName        Method name
     * @param methodInfo        Method information
     * @param <T>               Component type
     * @return Promise that resolves once the post construction method has been called
     */
    private async callPostConstructMethod<T>(componentClass: ClassConstructor<T>, componentInfo: ComponentInfo, componentInstance: T, methodName: string, methodInfo: MethodInfo): Promise<void> {
        let methodResult: Promise<void>;

        await this.callPotentiallyAsynchronousMethod(componentInstance, methodName);
    }

    /**
     * Call a method and wait for it to complete if it is asynchronous
     * @param instance         Instance
     * @param methodName       Method name
     * @param methodParameters Method parameters
     * @return Promise that resolves once the method has been called
     */
    private async callPotentiallyAsynchronousMethod<T>(instance: T, methodName: string, methodParameters?: Array<any>): Promise<void> {
        let methodResult: Promise<void>;

        methodResult = instance[methodName].apply(instance, methodParameters);
        if (methodResult) {
            await methodResult;
        }
    }

}

export {
    DefaultComponentFactory
};
