import {ClassConstructor} from './ClassConstructor';
import {ComponentClass} from './ComponentClass';
import {InjectedProperty} from './InjectedProperty';
import {InjectionTarget} from './InjectionTarget';
import {InvocationUtils} from './InvocationUtils';
import {ReflectionUtils} from './ReflectionUtils';

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
    static async injectConstructor<T>(componentClass: ComponentClass<T>, resolver?: <P>(parameterClass: ComponentClass<P>, parameterIndex: number) => Promise<P>): Promise<T> {
        let componentConstructor: ClassConstructor<T> = componentClass as ClassConstructor<T>;
        let parameterClasses: ComponentClass<any>[] = ReflectionUtils.getParameterClasses(componentClass);
        let parameters: Array<any> = [];

        if (parameterClasses) {
            let parameterPromises: Array<Promise<any>> = parameterClasses.map((parameterClass, parameterIndex) => resolver(parameterClass, parameterIndex));
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
    static async injectProperty<T>(target: InjectionTarget<T>, injectedProperty: InjectedProperty, resolver: <P>(componentClass: ComponentClass<P>, componentName?: string) => Promise<P>): Promise<void> {
        let propertyClass: ComponentClass<any> = ReflectionUtils.getPropertyClass(target.class, injectedProperty.name);
        let propertyName: string = injectedProperty.name;
        let propertyInstance: any = await resolver(propertyClass, injectedProperty.info.name);
        target.instance[propertyName] = propertyInstance;
    }

    /**
     * Inject a method
     * @param target     Target object
     * @param methodName Method name
     * @param resolver   Resolver
     * @param <T>        Component type
     * @return Promise that resolves once the injection method has been called
     */
    static async injectMethod<T>(target: InjectionTarget<T>, methodName: string, resolver: <P>(parameterClass: ComponentClass<P>, parameterIndex: number) => Promise<P>): Promise<void> {
        let methodParameterClasses: Array<ComponentClass<any>> = ReflectionUtils.getParameterClasses(target.class, methodName);
        let methodParameters: Array<any>;

        if (methodParameterClasses) {
            let methodParameterPromises: Array<Promise<any>> = methodParameterClasses.map((methodParameterClass, i) => resolver(methodParameterClass, i));
            methodParameters = await Promise.all(methodParameterPromises);
        } else {
            methodParameters = [];
        }

        await InvocationUtils.waitForResult(target.instance, methodName, ...methodParameters);
    }

}

export {
    InjectionUtils
};
