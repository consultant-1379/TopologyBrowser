define([
    'topologybrowser/widgets/ResultCell/ResultCell',
    'topologybrowser/widgets/ResultCell/ResultCellView'
], function(ResultCell, View) {
    'use strict';

    describe('ResultCell', function() {
        var sandbox, resultCell, viewStub, setModifierStub, setStyleStub, addEventHandlerStub;

        beforeEach(function() {
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });

            setModifierStub = sandbox.stub();
            setStyleStub = sandbox.stub();
            addEventHandlerStub = sandbox.stub();
            viewStub = new View();
            sandbox.stub(viewStub, 'getIcon').returns({
                setModifier: setModifierStub,
                setStyle: setStyleStub,
                addEventHandler: addEventHandlerStub
            });

            resultCell = new ResultCell();
            resultCell.view = viewStub;
            resultCell.options = {
                row: {
                    options: {
                        model: {
                            eventbus: {
                                publish: sandbox.stub()
                            }
                        }
                    }
                }
            };
            resultCell.getRow = function() {
                return {
                    getIndex: function() {
                        return 1;
                    }
                };
            };
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('setValue', function() {
            it('Should set the values', function() {
                // Run
                resultCell.setValue();

                // Assert
                expect(setModifierStub.callCount).to.equal(1);
                expect(setStyleStub.callCount).to.equal(3);
                expect(addEventHandlerStub.callCount).to.equal(1);
            });
        });

        describe('removeNode', function() {
            it('Should publish an supervision:resultCell:removeCell event with the row data', function() {
                // Run
                resultCell.removeNode();

                // Assert
                expect(resultCell.options.row.options.model.eventbus.publish.callCount).to.equal(1);
                expect(resultCell.options.row.options.model.eventbus.publish.calledWith('supervision:resultCell:removeCell', 1)).to.be.true;
            });
        });
    });
});
