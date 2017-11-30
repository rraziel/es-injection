import {Named} from './injection';
import {getMethodInfo, getPropertyInfo, MethodInfo, MethodParameterInfo, PropertyInfo} from '../metadata';

class DummyType { }

describe('@Named decorator', () => {

    describe('can be applied to', () => {

        it('a property', () => {
            // given
            class TestClass {
                @Named('test-name')
                private field: DummyType;
            }
            // when
            let propertyInfo: PropertyInfo = getPropertyInfo(TestClass, 'field');
            // then
            expect(propertyInfo).not.toBeUndefined();
            expect(propertyInfo.name).toEqual('test-name');
            expect(propertyInfo.type).toEqual(DummyType);
        });

        it('a method parameter', () => {
            // given
            class TestClass {
                method(@Named('test-name') parameter: DummyType): void { /* empty */ }
            }
            // when
            let methodInfo: MethodInfo = getMethodInfo(TestClass, 'method');
            // then
            expect(methodInfo).not.toBeUndefined();
            expect(methodInfo.parameters).not.toBeUndefined();
            expect(methodInfo.parameters.length).toEqual(1);
            expect(methodInfo.parameters[0]).not.toBeUndefined();
            expect(methodInfo.parameters[0].name).toEqual('test-name');
            expect(methodInfo.parameters[0].type).toEqual(DummyType);
        });

    });

});
