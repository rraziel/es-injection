import {InjectedProperty} from './InjectedProperty';
import {InjectionTarget} from './InjectionTarget';
import {InvocationUtils} from './InvocationUtils';
import {ClassConstructor, ComponentClass} from '@es-injection/metadata';
import {ReflectionUtils} from '@es-injection/metadata';

/**
 * Injection utility functions
 */
class InjectionUtils {

    /**
     * Inject a constructor
     * @param componentClass Component class
     * @param resolver       Resolver
     * @param <T>            Component type
     * @return Constructed instance
     */
    static async injectConstructor<T>(componentClass: ComponentClass<T>, resolver?: <P>(parameterClass: ComponentClass<P>, parameterIndex: number) => Promise<P|undefined>): Promise<T> {
        const componentConstructor: ClassConstructor<T> = componentClass as ClassConstructor<T>;
        const parameterClasses: ComponentClass<any>[] = ReflectionUtils.getParameterClasses(componentClass);
        let parameters: Array<any> = [];

        if (parameterClasses) {
            const parameterPromises: Array<Promise<any>> = parameterClasses.map((parameterClass, parameterIndex) => resolver!(parameterClass, parameterIndex));
            parameters = await Promise.all(parameterPromises);
        }

        return new componentConstructor(... parameters);
    }

    /**
     * Inject a property
     * @param target           Target object
     * @param injectedProperty Injected property
     * @param resolver         Component resolver
     * @param <T>              Component type
     * @return Promise that resolves once the property has been injected
     */
    static async injectProperty<T>(target: InjectionTarget<T>, injectedProperty: InjectedProperty, resolver: <P>(componentClass: ComponentClass<P>, componentName?: string) => Promise<P|undefined>): Promise<void> {
        const propertyClass: ComponentClass<any> = ReflectionUtils.getPropertyClass(target.class, injectedProperty.name);
        const propertyName: string = injectedProperty.name;
        const propertyInstance: any = await resolver(propertyClass, injectedProperty.info.name);
        (target.instance as any)[propertyName] = propertyInstance;
    }

    /**
     * Inject a method
     * @param target     Target object
     * @param methodName Method name
     * @param resolver   Resolver
     * @param <T>        Component type
     * @return Promise that resolves once the injection method has been called
     */
    static async injectMethod<T>(target: InjectionTarget<T>, methodName: string, resolver: <P>(parameterClass: ComponentClass<P>, parameterIndex: number) => Promise<P|undefined>): Promise<void> {
        const methodParameterClasses: Array<ComponentClass<any>> = ReflectionUtils.getParameterClasses(target.class, methodName);
        const methodParameterPromises: Array<Promise<any>> = methodParameterClasses.map((methodParameterClass, i) => resolver(methodParameterClass, i));
        const methodParameters: Array<any> = await Promise.all(methodParameterPromises);
        await InvocationUtils.waitForResult(target.instance, methodName, ...methodParameters);
    }

}

export {
    InjectionUtils
};
