import {ClassUtils} from './ClassUtils';

const DummyClass: ClassDecorator = () => { /* empty */ };

describe('Classs utility functions', () => {

    describe('can instantiate a class', () => {

        it('with no constructor parameters', async () => {
            // given
            class TestClass {
                constructor() { /* empty */ }
            }
            // when
            let instance: TestClass = await ClassUtils.instantiateClass(TestClass, null);
            // then
            expect(instance).not.toBeUndefined();
            expect(instance).toBeInstanceOf(TestClass);
        });

        it('with constructor parameters', async () => {
            // given
            class TestParameterClass { }
            @DummyClass
            class TestClass {
                constructor(public p0: number, public p1: string, public p2: TestParameterClass) { /* empty */ }
            }
            // when
            let instance: TestClass = await ClassUtils.instantiateClass(TestClass, async (requiredClass, parameterIndex) => {
                if (parameterIndex === 0 && requiredClass === Number) {
                    return 123;
                } else if (parameterIndex === 1 && requiredClass === String) {
                    return 'test-value';
                } else if (parameterIndex === 2 && requiredClass === TestParameterClass) {
                    return new TestParameterClass();
                } else {
                    throw new Error('unexpected required class ' + requiredClass.name + ' for constructor parameter at index ' + parameterIndex);
                }
            });
            // then
            expect(instance).not.toBeUndefined();
            expect(instance).toBeInstanceOf(TestClass);
            expect(instance.p0).toEqual(123);
            expect(instance.p1).toEqual('test-value');
            expect(instance.p2).toBeInstanceOf(TestParameterClass);
        });

    });

});
