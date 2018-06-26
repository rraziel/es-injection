import {AnnotationConfigApplicationContext, Component, ComponentScan, Configuration, Import, Inject, Named, PostConstruct} from '.';

describe('Integration tests', () => {

    it.skip('perform basic operations', async () => {
        // given
        @Component
        class TestDependencyClass {
            value: number;
        }

        @Component
        class TestOtherDependencyClass {
            value: number;
        }

        @Configuration
        @ComponentScan(TestDependencyClass, TestOtherDependencyClass)
        class TestDependentConfiguration {

        }

        abstract class TestClass {
            otherDependency: TestOtherDependencyClass;

            @Inject
            setDependencyClass(otherDependency: TestOtherDependencyClass): void {
                this.otherDependency = otherDependency;
                this.otherDependency.value = 21;
            }

            abstract getValue(): number;

        }

        @Component
        class TestDerivedClass extends TestClass {
            testDependency: TestDependencyClass;

            @Inject
            setDependencyClass(testDependency: TestDependencyClass): void {
                this.testDependency = testDependency;
            }

            @PostConstruct
            initialize(): void {
                this.testDependency.value = 42;
            }

            getValue(): number {
                return this.testDependency.value;
            }

        }

        @Component
        class TestOtherClass {
            @Inject
            @Named('testDerivedClass')
            testClass: TestClass;

            getValue(): number {
                return this.testClass.getValue();
            }
        }

        @Configuration
        @Import(TestDependentConfiguration)
        @ComponentScan(TestDerivedClass, TestOtherClass)
        class TestConfiguration {

        }

        // when
        let applicationContext: AnnotationConfigApplicationContext;
        let testClass: TestClass;
        let testOtherClass: TestOtherClass;

        applicationContext = new AnnotationConfigApplicationContext();
        applicationContext.registerConfiguration(TestConfiguration);
        await applicationContext.start();

        testClass = await applicationContext.getComponent(TestClass);
        testOtherClass = await applicationContext.getComponent(TestOtherClass);

        // then
        expect(testClass).not.toBeUndefined();
        expect(testClass).toBeInstanceOf(TestDerivedClass);
        expect(testClass.otherDependency).toBeInstanceOf(TestOtherDependencyClass);
        expect(testClass.otherDependency.value).toBe(21);
        expect(testClass.getValue()).toBe(42);
    });

});
