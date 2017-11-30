import {Registry} from './registry';

describe('Registry', () => {

    describe('can generate a component name', () => {

        it('with capitalized characters', () => {
            // given
            class TestCapitalizedClassName { }
            // when
            let componentName = Registry.buildComponentName(TestCapitalizedClassName);
            // then
            expect(componentName).toEqual('testCapitalizedClassName');
        });

        it('with consecutive uppercase characters', () => {
            // given
            class TESTConsecutiveUPPERCASEClassNAME { }
            // when
            let componentName = Registry.buildComponentName(TESTConsecutiveUPPERCASEClassNAME);
            // then
            expect(componentName).toEqual('testConsecutiveUppercaseClassName');
        });

    });

});
