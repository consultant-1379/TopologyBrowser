define([
    'topologybrowser/widgets/Supervision/SupervisionWidgetView'
], function(View) {
    'use strict';

    describe('SupervisionWidgetView', function() {
        var sandbox, findStub, view;

        beforeEach(function() {
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });
            findStub = sandbox.stub();
            view = new View();
            sandbox.stub(view, 'getElement').returns({
                find: findStub
            });
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('getInfoValue()', function() {
            it('Should return the element', function() {
                // Run
                view.getInfoValue();

                // Assert
                expect(findStub.calledWith('.eaTopologyBrowser-clear-button')).to.be.true;
            });
        });

        describe('getProgress()', function() {
            it('Should return the element', function() {
                // Run
                view.getProgress();

                // Assert
                expect(findStub.calledWith('.eaTopologyBrowser-getProgressBar')).to.be.true;
            });
        });

        describe('getEmptyMessage()', function() {
            it('Should return the element', function() {
                // Run
                view.getEmptyMessage();

                // Assert
                expect(findStub.calledWith('.eaTopologyBrowser-getEmptyMessage')).to.be.true;
            });
        });
    });
});
