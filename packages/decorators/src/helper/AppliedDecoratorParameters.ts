import {MethodInfoCallback} from './MethodInfoCallback';
import {PropertyInfoCallback} from './PropertyInfoCallback';

/**
 * Applied decorator parameters
 */
class AppliedDecoratorParameters {
    decoratorName: string;
    target: Object;
    propertyKey: string|symbol;
    parameterIndex?: number;
    propertyInfoCallback: PropertyInfoCallback;
    methodInfoCallback: MethodInfoCallback;

    /**
     * Class constructor
     * @param decoratorName        Decorator name
     * @param target               Target
     * @param propertyKey          Property key
     * @param parameterIndex       Parameter index (only for method parameter decorators)
     * @param propertyInfoCallback Property information callback
     * @param methodInfoCallback   Method information callback
     */
    constructor(decoratorName: string, target: Object, propertyKey: string|symbol, parameterIndex: number|undefined, propertyInfoCallback: PropertyInfoCallback, methodInfoCallback: MethodInfoCallback) {
        this.decoratorName = decoratorName;
        this.target = target;
        this.propertyKey = propertyKey;
        this.parameterIndex = parameterIndex;
        this.propertyInfoCallback = propertyInfoCallback;
        this.methodInfoCallback = methodInfoCallback;
    }

}

export {
    AppliedDecoratorParameters
};
