import {InvocationUtils} from './InvocationUtils';

class TestClass {
    synchronousMethod(): string { return 'test'; }
    synchronousMethod2(...p: Array<string>): string { return p.join(','); }
    asynchronousMethod(): Promise<string> { return new Promise(resolve => resolve('test')); }
    asynchronousMethod2(...p: Array<string>): Promise<string> { return new Promise(resolve => resolve(p.join(','))); }
}

describe('Invocation utility functions', () => {

    describe('can wait for', () => {

        it('a synchronous function', async () => {
            // given
            let testClass: TestClass = new TestClass();
            // when
            let result: string = await InvocationUtils.waitForResult(testClass, 'synchronousMethod');
            // then
            expect(result).toBe('test');
        });

        it('a synchronous function with parameters', async () => {
            // given
            let testClass: TestClass = new TestClass();
            // when
            let result: string = await InvocationUtils.waitForResult(testClass, 'synchronousMethod2', 'test', 'p2', 'p3');
            // then
            expect(result).toBe('test,p2,p3');
        });

        it('an asynchronous function', async () => {
            // given
            let testClass: TestClass = new TestClass();
            // when
            let result: string = await InvocationUtils.waitForResult(testClass, 'asynchronousMethod');
            // then
            expect(result).toBe('test');
        });

        it('an asynchronous function with parameters', async () => {
            // given
            let testClass: TestClass = new TestClass();
            // when
            let result: string = await InvocationUtils.waitForResult(testClass, 'asynchronousMethod2', 'test', 'p2', 'p3');
            // then
            expect(result).toBe('test,p2,p3');
        });

    });

});
