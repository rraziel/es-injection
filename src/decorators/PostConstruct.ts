import {MethodInfoBuilder} from '../metadata';

/**
 * PostConstruct decorator, used to call methods after component construction has completed
 * @param target      Target
 * @param propertyKey Property key
 */
const PostConstruct: MethodDecorator = (target, propertyKey) => {
    if (target instanceof Function) {
        throw new Error('@PostConstruct cannot be used on static method ' + target.name + '.' + <string> propertyKey);
    }

    MethodInfoBuilder.of(target, propertyKey).postConstruct();
};

export {
    PostConstruct
};
