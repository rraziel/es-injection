import {NameUtils} from './name-utils';

describe('Name utility functions', () => {

    describe('can generate a component name', () => {

        it('with capitalized characters', () => {
            // given
            class TestCapitalizedClassName { }
            // when
            let componentName = NameUtils.buildComponentName(TestCapitalizedClassName);
            // then
            expect(componentName).toEqual('testCapitalizedClassName');
        });

        it('with consecutive uppercase characters', () => {
            // given
            class TESTConsecutiveUPPERCASEClassNAME { }
            // when
            let componentName = NameUtils.buildComponentName(TESTConsecutiveUPPERCASEClassNAME);
            // then
            expect(componentName).toEqual('testConsecutiveUppercaseClassName');
        });

    });

});
