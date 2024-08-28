define([
    'networkobjectlib/utils/Filters',
    'test/resources/mockJSON/ENodeBFunctionRegionData',
    'test/resources/mockJSON/YANGRegionData'
], function(Filters, mockENodeBFunction, mockYANG) {
    'use strict';

    describe('utils/Filters', function() {
        var sandbox;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('filterFormAttribute()', function() {

            beforeEach(function() {
                //sandbox.spy(Validator, 'isNull');
            });
            it('Should filter correctly for simple and complex types for correct keys', function() {
                mockENodeBFunction.forEach(function(attribute)  {
                    var response = Filters.filterFormAttribute(attribute.key.substring(0, 3), attribute);
                    expect(response).to.equal(true);
                });
            });
            it('Should not filter for simple and complex types with wrong keys', function() {
                mockENodeBFunction.forEach(function(attribute)  {
                    var response = Filters.filterFormAttribute('ng'+attribute.key.substring(0, 3), attribute);
                    expect(response).to.equal(false);
                });
            });
            it('Should filter correctly for simple and complex types for correct keys', function() {
                mockYANG.forEach(function(attribute)  {
                    var response = Filters.filterFormAttribute(attribute.key.substring(0, 3), attribute);
                    expect(response).to.equal(true);
                    if (attribute.cases && attribute.cases.length) {
                        attribute.cases.forEach(function(caseObj) {
                            var yangSearchKey = caseObj.name;
                            response = Filters.filterFormAttribute(yangSearchKey.substring(0, 3), attribute);
                            expect(response).to.equal(true);
                        });
                    }
                });
            });
            it('Should not filter for simple and complex types with wrong keys', function() {
                mockYANG.forEach(function(attribute)  {
                    var response = Filters.filterFormAttribute('ng'+attribute.key.substring(0, 3), attribute);
                    expect(response).to.equal(false);
                    if (attribute.cases && attribute.cases.length) {
                        attribute.cases.forEach(function(caseObj) {
                            var yangSearchKey = caseObj.name;
                            response = Filters.filterFormAttribute('ng'+yangSearchKey.substring(0, 3), attribute);
                            expect(response).to.equal(false);
                        });
                    }
                });
            });


        });
    });
});
