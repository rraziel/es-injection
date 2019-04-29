import {ComponentFactory} from './ComponentFactory';
import {ComponentFactorySettings} from './ComponentFactorySettings';
import {ComponentClass, DependencyInfo, getComponentInfo, getMethodInfo, getPropertyInfo, MethodInfo, MethodParameterInfo, PropertyInfo} from '@es-injection/metadata';
import {InjectedProperty, InjectionTarget, InjectionUtils, InvocationUtils, OrderedElement, OrderUtils} from '../utils';
import {ComponentInfo, TypeUtils} from '@es-injection/metadata';

/**
 * Default component factory
 */
class DefaultComponentFactory extends ComponentFactory {
    private readonly settings: ComponentFactorySettings;

    /**
     * Class constructor
     * @param componentFactorySettings Component factory settings
     */
    constructor(componentFactorySettings?: ComponentFactorySettings) {
        super();
        this.settings = componentFactorySettings || new ComponentFactorySettings();
    }

    /**
     * Create a new component instance
     * @param componentClass Component class
     * @param componentInfo  Component information
     * @param <T>            Component type
     * @return New component instance
     */
    async newInstance<T>(componentClass: ComponentClass<T>): Promise<T> {
        const componentInstance: T = await this.instantiateComponent(componentClass);
        const targets: Array<InjectionTarget<T>> = this.buildInjectionTargets(componentClass, componentInstance);TypeUtils.getClasses(componentClass);

        for (const target of targets) {
            await this.initializeInstance(target);
        }

        return componentInstance;
    }

    /**
     * Build an injection target for each class in the class hierarchy
     * @param componentClass    Component class
     * @param componentInstance Component instance
     * @param <T>               Component type
     * @return List of injection targets
     */
    private buildInjectionTargets<T>(componentClass: ComponentClass<T>, componentInstance: T): Array<InjectionTarget<T>> {
        return TypeUtils.getClasses(componentClass)
            .map(baseComponentClass => this.buildInjectionTarget(baseComponentClass, componentInstance))
            .reverse()
        ;
    }

    /**
     * Build an injection target for a base component class
     * @param baseComponentClass Base component class
     * @param componentInstance  Component instance
     * @param <T>                Base component type
     * @return Injection target
     */
    private buildInjectionTarget<T>(baseComponentClass: ComponentClass<T>, componentInstance: T): InjectionTarget<T> {
        const componentInfo: ComponentInfo|undefined = getComponentInfo(baseComponentClass);
        if (!componentInfo) {
            throw new Error(`base component class ${baseComponentClass.name} has no component information`);
        }

        return new InjectionTarget(baseComponentClass, componentInfo, componentInstance);
    }

    /**
     * Instantiate a component
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Promise that resolves to a component instance
     */
    private instantiateComponent<T>(componentClass: ComponentClass<T>): Promise<T> {
        const constructorInfo: MethodInfo = getMethodInfo(componentClass)!;
        return InjectionUtils.injectConstructor(componentClass, (requiredClass, parameterIndex) => this.resolveMethodDependency(constructorInfo, requiredClass, parameterIndex));
    }

    /**
     * Initialize a new instance, injecting its properties and methods, then calling its post construction methods
     * @param target Injection target
     * @param <T>    Component type
     * @return Promise that resolves once the new instance has been initialized
     */
    private async initializeInstance<T>(target: InjectionTarget<T>): Promise<void> {
        await this.injectProperties(target);
        await this.injectMethods(target);
        await this.callLifecycleMethods(target, methodInfo => methodInfo.postConstruct === true);
    }

    /**
     * Cleanup an instance, calling its pre destruction methods
     * @param target Injection target
     * @param <T>    Component type
     * @return Promise that resolves on the instance has been cleaned up
     */
    /*private async cleanupInstance<T>(target: InjectionTarget<T>): Promise<void> {
        await this.callLifecycleMethods(target, methodInfo => methodInfo.preDestroy === true);
    }*/

    /**
     * Inject properties
     * @param target Target object
     * @param <T>    Component type
     * @return Promise that resolves once all properties have been injected
     */
    private async injectProperties<T>(target: InjectionTarget<T>): Promise<void> {
        if (!target.info.properties) {
            return;
        }

        const injectedProperties: Array<InjectedProperty> = OrderUtils.buildOrderedElementList(target.info.properties, propertyName => getPropertyInfo(target.class, propertyName)!)
            .map(orderedPropertyInfo => new InjectedProperty(orderedPropertyInfo.name, orderedPropertyInfo.info!))
        ;

        for (const injectedProperty of injectedProperties) {
            await InjectionUtils.injectProperty(target, injectedProperty, async (componentClass, componentName) => this.resolvePropertyDependency(injectedProperty.info, componentClass));
        }
    }

    /**
     * Resolve a property dependency
     * @param propertyInfo  Property information
     * @param requiredClass Required class
     * @param <T>           Required type
     * @return Promise that resolves to the property dependency
     */
    private resolvePropertyDependency<T>(propertyInfo: PropertyInfo, requiredClass: ComponentClass<T>): Promise<T|undefined> {
        return this.resolveDependency(propertyInfo, requiredClass);
    }

    /**
     * Inject methods
     * @param target Injection target
     * @param <T>    Component type
     * @return Promise that resolves once all injection methods have been called
     */
    private async injectMethods<T>(target: InjectionTarget<T>): Promise<void> {
        const methodNames: Array<string> = TypeUtils.getMethodNames(target.class);
        const orderedMethodInfos: Array<OrderedElement<MethodInfo>> = OrderUtils.buildOrderedElementList(methodNames, methodName => getMethodInfo(target.class, methodName)!)
            .filter(sortedMethod => sortedMethod.info && !sortedMethod.info.postConstruct && !sortedMethod.info.preDestroy)
        ;

        for (const orderedMethodInfo of orderedMethodInfos) {
            await InjectionUtils.injectMethod(target, orderedMethodInfo.name, (parameterClass, parameterIndex) => this.resolveMethodDependency(orderedMethodInfo.info!, parameterClass, parameterIndex));
        }
    }

    /**
     * Resolve a method dependency
     * @param methodInfo     Method information
     * @param requiredClass  Required class
     * @param parameterIndex Parameter index
     * @param <T>            Required type
     * @return Promise that resolves to the method dependency
     */
    private resolveMethodDependency<T>(methodInfo: MethodInfo, requiredClass: ComponentClass<T>, parameterIndex: number): Promise<T|undefined> {
        const methodParameterInfo: MethodParameterInfo|null = methodInfo ? methodInfo.parameters[parameterIndex] : null;
        return this.resolveDependency(methodParameterInfo!, requiredClass);
    }

    /**
     * Resolve a dependency
     * @param dependencyInfo Dependency information or null f
     * @param requiredClass  Required class
     * @param <T>            Required type
     * @return Promise that resolves to the dependency
     */
    private async resolveDependency<T>(dependencyInfo: DependencyInfo, requiredClass: ComponentClass<T>): Promise<T|undefined> {
        try {
            if (TypeUtils.isArrayType(requiredClass)) {
                return await this.resolveArrayDependency(dependencyInfo) as any as T;
            } else if (TypeUtils.isMapType(requiredClass)) {
                return await this.resolveMapDependency(dependencyInfo) as any as T;
            } else {
                return await this.resolveInstanceDependency(dependencyInfo, requiredClass);
            }
        } catch (e) {
            return this.buildUnresolvedDependency(dependencyInfo, requiredClass, e);
        }
    }

    /**
     * Resolve a method instance dependency
     * @param dependencyInfo Method parameter information
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Dependency instance
     */
    private resolveInstanceDependency<T>(dependencyInfo: DependencyInfo, componentClass: ComponentClass<T>): Promise<T> {
        return this.settings.resolvers!.component(componentClass, dependencyInfo && dependencyInfo.name);
    }

    /**
     * Resolve a method array dependency
     * @param dependencyInfo Dependency information
     * @param <T>            Component type
     * @return Dependency array instance
     */
    private resolveArrayDependency<T>(dependencyInfo: DependencyInfo): Promise<Array<T>> {
        if (!dependencyInfo.elementClass) {
            throw new Error('injected array parameter without any element class information (missing @ElementClass decorator)');
        }

        return this.settings.resolvers!.array(dependencyInfo.elementClass);
    }

    /**
     * Resolve a map dependency
     * @param dependencyInfo Dependency information
     * @param <T>            Component type
     * @return Promise that resolves to a map instance
     */
    private resolveMapDependency<T>(dependencyInfo: DependencyInfo): Promise<Map<string, T>> {
        if (!dependencyInfo.elementClass) {
            throw new Error('injected map parameter without any element class information (missing @ElementClass decorator)');
        }

        return this.settings.resolvers!.map(dependencyInfo.elementClass);
    }

    /**
     * Build an unresolved dependency
     * @param dependencyInfo Dependency information
     * @param componentClass Component class
     * @param e              Thrown exception
     * @param <T>            Component type
     * @return Unresolved dependency
     */
    private buildUnresolvedDependency<T>(dependencyInfo: DependencyInfo, componentClass: ComponentClass<T>, e: any): T|undefined {
        if (!dependencyInfo || !dependencyInfo.optional) {
            throw e;
        }

        if (TypeUtils.isArrayType(componentClass)) {
            return <any> [];
        }

        if (TypeUtils.isMapType(componentClass)) {
            return <any> new Map<string, any>();
        }

        return undefined;
    }

    /**
     * Call lifecycle methods, i.e. methods annotated with @PostConstruct or @PreDestroy
     * @param target Injection target
     * @preturn Promise that resolves once all methods have been called
     */
    private async callLifecycleMethods<T>(target: InjectionTarget<T>, filter: (methodInfo: MethodInfo) => boolean): Promise<void> {
        const methodNames: Array<string> = TypeUtils.getMethodNames(target.class);
        const orderedMethodNames: Array<string> = OrderUtils.buildOrderedElementList(methodNames, methodName => getMethodInfo(target.class, methodName))
            .filter(sortedMethod => sortedMethod.info && filter(sortedMethod.info))
            .map(orderedMethodInfo => orderedMethodInfo.name)
        ;

        for (let methodName of orderedMethodNames) {
            await InvocationUtils.waitForResult(target.instance, methodName);
        }
    }

}

export {
    DefaultComponentFactory
};
