define([
    'networkobjectlib/regions/moTypeDetails/MoTypeDetails',
    'networkobjectlib/regions/moTypeDetails/MoTypeDetailsView',
    'networkobjectlib/widgets/NodeDetailsForm/NodeDetailsForm',
    'networkobjectlib/widgets/NodePropertyList/NodePropertyList',
    'networkobjectlib/widgets/NonPersistentAttrForm/NonPersistentAttrForm',
], function(MoTypeDetails, View, NodeDetailsForm, NodePropertyList, NonPersistentAttrForm) {

    describe('MoTypeDetailsNew', function() {
        var sandbox, classUnderTest;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();

            classUnderTest = new MoTypeDetails();
            classUnderTest.view = sinon.createStubInstance(View);
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('filterAttributes', function() {
            var selectedNodeProperties;

            beforeEach(function() {
                selectedNodeProperties = {
                    name: '1',
                    type: 'EUtranCellFDD',
                    attributes: [
                        { key: 'collectLogsStatus', value: 'Enabled' },
                        { key: 'collectTraceStatus', value: null },
                        { key: 'dlAccGbrAdmThresh', value: 1000 }
                    ],
                    nonPersistentAttributes: [
                        { key: 'collectLogsStatus', value: 'Enabled' },
                        { key: 'collectTraceStatus', value: null },
                        { key: 'collectTraceStatus1', value: null },
                        { key: 'dlAccGbrAdmThresh', value: 1000 }
                    ]
                };
                classUnderTest.selectedNodeProperties = selectedNodeProperties;

                sandbox.stub(classUnderTest, 'createNodePropertyList');
                sandbox.stub(classUnderTest, 'createNonPersistentAttrList');
                sandbox.stub(classUnderTest, 'updateFilterCounter');
                sandbox.stub(classUnderTest, 'updateFilterAllAttributes');
            });

            it('Should create a new node Property List with filtered List',function() {
                classUnderTest.nodePropertyList = sinon.createStubInstance(NodePropertyList);
                classUnderTest.nonPersistentExpanded = true;

                var expectedArgument = {
                    name: '1',
                    type: 'EUtranCellFDD',
                    attributes: [
                        { key: 'collectLogsStatus', value: 'Enabled' },
                        { key: 'collectTraceStatus', value: null }
                    ],
                    nonPersistentAttributes: [
                        { key: 'collectLogsStatus', value: 'Enabled' },
                        { key: 'collectTraceStatus', value: null },
                        { key: 'collectTraceStatus1', value: null }
                    ]
                };
                var expectedFiltered = expectedArgument.attributes.length + expectedArgument.nonPersistentAttributes.length;
                var expectedTotal = selectedNodeProperties.attributes.length + selectedNodeProperties.nonPersistentAttributes.length;

                classUnderTest.filterAttributes('collect');

                expect(classUnderTest.createNodePropertyList.args[0][0]).to.deep.equal(expectedArgument);
                expect(classUnderTest.updateFilterCounter.calledWith(expectedFiltered, expectedTotal)).to.be.true;
            });

            it('Should create an empty Property List when no matching elements',function() {
                classUnderTest.nodePropertyList = sinon.createStubInstance(NodePropertyList);
                classUnderTest.nonPersistentExpanded = true;

                var expectedArgument = {
                    name: '1',
                    type: 'EUtranCellFDD',
                    attributes: [],
                    nonPersistentAttributes: []
                };
                var expectedFiltered = expectedArgument.attributes.length + expectedArgument.nonPersistentAttributes.length;
                var expectedTotal = selectedNodeProperties.attributes.length + selectedNodeProperties.nonPersistentAttributes.length;

                classUnderTest.filterAttributes('NonMatchingFilter');

                expect(classUnderTest.createNodePropertyList.args[0][0]).to.deep.equal(expectedArgument);
                expect(classUnderTest.updateFilterCounter.calledWith(expectedFiltered, expectedTotal)).to.equal(true);

            });

            it('Should update node form list with filtered list',function() {
                classUnderTest.formWidget = sinon.createStubInstance(NodeDetailsForm);

                classUnderTest.filterAttributes('collect');

                expect(classUnderTest.updateFilterAllAttributes.calledWith('collect')).to.be.true;
            });
        });

        describe('updateFilterAllAttributes', function() {
            beforeEach(function() {
                classUnderTest.formWidget = sinon.createStubInstance(NodeDetailsForm);
                classUnderTest.nonPersistentAttrform = sinon.createStubInstance(NonPersistentAttrForm);
                classUnderTest.formWidget.updateFiltering = sinon.stub().returns({ filtered: 2, total: 10});
                classUnderTest.nonPersistentAttrform.updateFiltering = sinon.stub().returns({ filtered: 5, total: 5});

                sandbox.stub(classUnderTest, 'updateFilterCounter');
            });

            it('Should filter persistent and non-persistent in edit mode and update counter',function() {
                classUnderTest.nonPersistentExpanded = true;

                classUnderTest.updateFilterAllAttributes('collect');

                expect(classUnderTest.formWidget.updateFiltering.calledOnce).to.be.true;
                expect(classUnderTest.nonPersistentAttrform.updateFiltering.calledOnce).to.be.true;
                expect(classUnderTest.updateFilterCounter.calledWith(7, 15)).to.be.true;
            });
        });
    });
});
