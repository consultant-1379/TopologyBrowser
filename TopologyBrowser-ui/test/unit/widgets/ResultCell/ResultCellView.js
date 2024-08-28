define([
    'topologybrowser/widgets/ResultCell/ResultCellView'
], function(View) {
    'use strict';

    describe('ResultCellView', function() {
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

        describe('getCaption()', function() {
            it('Should return the element', function() {
                // Run
                view.getCaption();

                // Assert
                expect(findStub.calledWith('.eaTopologyBrowser-wResultCell-caption')).to.be.true;
            });
        });

        describe('getIcon()', function() {
            it('Should return the element', function() {
                // Run
                view.getIcon();

                // Assert
                expect(findStub.calledWith('.eaTopologyBrowser-wResultCell-icon')).to.be.true;
            });
        });
    });
});
