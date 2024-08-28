define([
    'jscore/core',
    'networkobjectlib/regions/nodeDetails/NodeDetails',
    'networkobjectlib/regions/nodeDetails/NodeDetailsView'
], function(core, NodeDetails, View) {

    describe('NodeDetails', function() {
        var sandbox,
            classUnderTest;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            classUnderTest = new NodeDetails();
            classUnderTest.view = sinon.createStubInstance(View);
        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();
        });

        describe('showWidgets', function() {
            it('Should show the widget with key-value pair', function() {
                var widget1 = sinon.createStubInstance(core.Widget);
                var widget2 = sinon.createStubInstance(core.Widget);

                classUnderTest.showWidgets([widget1,widget2]);

                expect(classUnderTest.widgets.length).to.equal(2);
                expect(widget1.attachTo.calledOnce).to.be.true;
                expect(widget2.attachTo.calledOnce).to.be.true;

            });

        });

        describe('clearWidgets', function() {
            it('Should clear widgets', function() {
                var widget1 = sinon.createStubInstance(core.Widget);
                var widget2 = sinon.createStubInstance(core.Widget);

                classUnderTest.widgets.push(widget1, widget2);

                expect(classUnderTest.widgets.length).to.equal(2);

                classUnderTest.clearWidgets();

                expect(classUnderTest.widgets.length).to.equal(0);
                expect(widget1.destroy.calledOnce).to.be.true;
                expect(widget2.destroy.calledOnce).to.be.true;

            });

        });

        describe('showError', function() {
            it('Should show the widget error', function() {
                var header = 'Error';
                var description = 'Attributes not found';
                sandbox.stub(classUnderTest, 'showWidgets');

                classUnderTest.showError(header, description);

                expect(classUnderTest.showWidgets.callCount).to.equal(1);

            });

        });
    });
});
