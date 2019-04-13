import {MethodInfoBuilder} from '@es-injection/metadata';

/**
 * PostConstruct decorator, used to call methods after component construction has completed
 * @param target      Target
 * @param propertyKey Property key
 */
const PreDestroy: MethodDecorator = (target, propertyKey) => {
    if (target instanceof Function) {
        throw new Error(`@PreDestroy cannot be used on static method ${target.name}.${propertyKey as string}`);
    }

    MethodInfoBuilder.of(target, propertyKey).preDestroy();
};

export {
    PreDestroy
};
