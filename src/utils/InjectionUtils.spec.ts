import {InjectionUtils} from './InjectionUtils';

const DummyClass: ClassDecorator = () => { /* empty */ };

describe('Injection utility functions', () => {

    describe('can inject a constructor', () => {

        it('with no parameters', async () => {
            // given
            class TestClass {
                constructor() { /* empty */ }
            }
            // when
            let instance: TestClass = await InjectionUtils.injectConstructor(TestClass);
            // then
            expect(instance).not.toBeUndefined();
            expect(instance).toBeInstanceOf(TestClass);
        });

        it('with parameters', async () => {
            // given
            class TestParameterClass { }
            @DummyClass
            class TestClass {
                constructor(public p0: number, public p1: string, public p2: TestParameterClass) { /* empty */ }
            }
            // when
            let instance: TestClass = await InjectionUtils.injectConstructor(TestClass, async (requiredClass, parameterIndex): Promise<any> => {
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
