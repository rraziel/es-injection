import {ComponentFactory} from './ComponentFactory';
import {ComponentFactorySettings} from './ComponentFactorySettings';
import {ComponentInfo, DependencyInfo, getComponentInfo, getMethodInfo, getPropertyInfo, MethodInfo, MethodParameterInfo, PropertyInfo, ScopeType} from '../metadata';
import {ClassConstructor, ComponentClass, InjectedProperty, InjectionTarget, InjectionUtils, InvocationUtils, OrderedElement, OrderUtils, TypeUtils} from '../utils';

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
        this.settings = componentFactorySettings;
    }

    /**
     * Create a new component instance
     * @param componentClass Component class
     * @param componentInfo  Component information
     * @param <T>            Component type
     * @return New component instance
     */
    async newInstance<T>(componentClass: ComponentClass<T>): Promise<T> {
        let componentInstance: T = await this.instantiateComponent(componentClass);
        let targets: Array<InjectionTarget<T>> = TypeUtils.getClasses(componentClass)
            .map(baseComponentClass => new InjectionTarget(baseComponentClass, getComponentInfo(baseComponentClass), componentInstance))
            .reverse()
        ;

        for (let target of targets) {
            await this.initializeInstance(target);
        }

        return componentInstance;
    }

    /**
     * Instantiate a component
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Promise that resolves to a component instance
     */
    private instantiateComponent<T>(componentClass: ComponentClass<T>): Promise<T> {
        let constructorInfo: MethodInfo = getMethodInfo(componentClass);
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
    private async cleanupInstance<T>(target: InjectionTarget<T>): Promise<void> {
        await this.callLifecycleMethods(target, methodInfo => methodInfo.preDestroy === true);
    }

    /**
     * Resolve a method dependency
     * @param methodInfo     Method information
     * @param requiredClass  Required class
     * @param parameterIndex Parameter index
     * @param <T>            Required type
     * @return Promise that resolves to the method dependency
     */
    private resolveMethodDependency<T>(methodInfo: MethodInfo, requiredClass: ComponentClass<T>, parameterIndex: number): Promise<T> {
        let methodParameterInfo: MethodParameterInfo = methodInfo && methodInfo.parameters && methodInfo.parameters[parameterIndex];
        return this.resolveDependency(methodParameterInfo, requiredClass);
    }

    /**
     * Resolve a dependency
     * @param dependencyInfo Dependency information
     * @param requiredClass  Required class
     * @param <T>            Required type
     * @return Promise that resolves to the dependency
     */
    private async resolveDependency<T>(dependencyInfo: DependencyInfo, requiredClass: ComponentClass<T>): Promise<T> {
        try {
            if (TypeUtils.isArrayType(requiredClass)) {
                return this.resolveArrayDependency(dependencyInfo) as  any as T;
            } else if (TypeUtils.isMapType(requiredClass)) {
                return this.resolveMapDependency(dependencyInfo) as any as T;
            } else {
                return this.resolveInstanceDependency(dependencyInfo, requiredClass);
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
        return this.settings.resolvers.component(componentClass, dependencyInfo && dependencyInfo.name);
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

        return this.settings.resolvers.array(dependencyInfo.elementClass);
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

        return this.settings.resolvers.map(dependencyInfo.elementClass);
    }

    /**
     * Build an unresolved dependency
     * @param dependencyInfo Dependency information
     * @param componentClass Component class
     * @param e              Thrown exception
     * @param <T>            Component type
     * @return Unresolved dependency
     */
    private buildUnresolvedDependency<T>(dependencyInfo: DependencyInfo, componentClass: ComponentClass<T>, e: any): T {
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
     * Inject properties
     * @param target Target object
     * @param <T>    Component type
     * @return Promise that resolves once all properties have been injected
     */
    private async injectProperties<T>(target: InjectionTarget<T>): Promise<void> {
        if (!target.info.properties) {
            return;
        }

        let injectedProperties: Array<InjectedProperty> = OrderUtils.buildOrderedElementList(target.info.properties, propertyName => getPropertyInfo(target.class, propertyName))
            .map(orderedPropertyInfo => new InjectedProperty(orderedPropertyInfo.name, orderedPropertyInfo.info))
        ;

        for (let injectedProperty of injectedProperties) {
            await InjectionUtils.injectProperty(target, injectedProperty, async (componentClass, componentName) => {
                try {
                    return await this.settings.resolvers.component(componentClass, componentName);
                } catch (e) {
                    if (!injectedProperty.info.optional) {
                        throw e;
                    }

                    return undefined;
                }
            });
        }
    }

    /**
     * Inject methods
     * @param target Injection target
     * @param <T>    Component type
     * @return Promise that resolves once all injection methods have been called
     */
    private async injectMethods<T>(target: InjectionTarget<T>): Promise<void> {
        let orderedMethodInfos: Array<OrderedElement<MethodInfo>>;
        let methodNames: Array<string> = TypeUtils.getMethodNames(target.class);

        orderedMethodInfos = OrderUtils.buildOrderedElementList(methodNames, methodName => getMethodInfo(target.class, methodName))
            .filter(sortedMethod => sortedMethod.info && !sortedMethod.info.postConstruct && !sortedMethod.info.preDestroy)
        ;

        for (let orderedMethodInfo of orderedMethodInfos) {
            await InjectionUtils.injectMethod(target, orderedMethodInfo.name, (parameterClass, parameterIndex) => this.resolveMethodDependency(orderedMethodInfo.info, parameterClass, parameterIndex));
        }
    }

    /**
     * Call lifecycle methods, i.e. methods annotated with @PostConstruct or @PreDestroy
     * @param target Injection target
     * @preturn Promise that resolves once all methods have been called
     */
    private async callLifecycleMethods<T>(target: InjectionTarget<T>, filter: (methodInfo: MethodInfo) => boolean): Promise<void> {
        let methodNames: Array<string> = TypeUtils.getMethodNames(target.class);

        methodNames = OrderUtils.buildOrderedElementList(methodNames, methodName => getMethodInfo(target.class, methodName))
            .filter(sortedMethod => sortedMethod.info && filter(sortedMethod.info))
            .map(orderedMethodInfo => orderedMethodInfo.name)
        ;

        for (let methodName of methodNames) {
            await InvocationUtils.waitForResult(target.instance, methodName);
        }
    }

}

export {
    DefaultComponentFactory
};
