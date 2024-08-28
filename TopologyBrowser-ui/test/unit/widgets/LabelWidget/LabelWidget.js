define([
    'topologybrowser/widgets/LabelWidget/LabelWidget',
    'topologybrowser/widgets/LabelWidget/LabelWidgetView'
], function(LabelWidget, View) {
    'use strict';

    describe('SupervisionLabelWidget', function() {
        var sandbox, viewStub, supervisionLabelWidget, setStyleStub, setWidthStub;

        beforeEach(function() {
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });
            viewStub = new View();
            setStyleStub = sandbox.stub();
            setWidthStub = sandbox.stub();
            sandbox.stub(viewStub, 'getLabel').returns({
                setText: setStyleStub
            });
            viewStub.setWidth = setWidthStub;
            supervisionLabelWidget = new LabelWidget({
                label: '',
                width: '100px'
            });
            supervisionLabelWidget.view = viewStub;
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('onViewReady', function() {
            it('Should call the setLabel and setWidth functions', function() {
                // Setup
                supervisionLabelWidget.setLabel = sandbox.spy();
                supervisionLabelWidget.setWidth = sandbox.spy();

                // Run
                supervisionLabelWidget.onViewReady();

                // Assert
                expect(supervisionLabelWidget.setLabel.callCount).to.equal(1);
                expect(supervisionLabelWidget.setWidth.callCount).to.equal(1);
            });
        });

        describe('setLabel', function() {
            it('Should call the view to set the label', function() {
                // Setup
                var label = 'label';

                // Run
                supervisionLabelWidget.setLabel(label);

                // Assert
                expect(setStyleStub.callCount).to.equal(1);
                expect(setStyleStub.calledWith(label)).to.be.true;
            });
        });

        describe('setWidth', function() {
            it('Should call the view to set the width', function() {
                // Setup
                var width = '400px';

                // Run
                supervisionLabelWidget.setWidth(width);

                // Assert
                expect(setWidthStub.callCount).to.equal(1);
                expect(setWidthStub.calledWith(width)).to.be.true;
            });
        });
    });
});
