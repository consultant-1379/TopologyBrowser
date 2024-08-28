define([
    'networkobjectlib/widgets/fdnPath/FDNPath',
], function(FDNPath) {
    'use strict';

    describe('widgets/FDNPath', function() {
        var sandbox,
            widget;

        before(function() {
            sandbox = sinon.sandbox.create();

            widget = new FDNPath();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('init()', function() {
            it('Should start the widget', function() {
                //ASSERT
                expect(widget.text).to.equal('');
                expect(widget.previousText).to.equal('');
            });
        });

        describe('callFDN()', function() {
            it('Should trigger token click if input has text', function() {
                //ASSEMBLE
                sandbox.spy(widget, 'trigger');
                sandbox.spy(widget, 'setText');

                widget.text = 'LTE001';
                widget.view.getInput().setValue('LTE002');

                //ACT
                widget.callFDN();

                //ASSERT
                expect(widget.trigger.callCount).to.equal(1);
                expect(widget.trigger.args[0][0]).to.equal('FDNTokenClicked');
                expect(widget.trigger.args[0][1].fdn).to.equal('LTE002');

                expect(widget.setText.callCount).to.equal(1);
                expect(widget.setText.args[0][0]).to.equal('LTE002');
            });

            it('Should not trigger token click if input is empty', function() {
                //ASSEMBLE
                sandbox.spy(widget, 'trigger');
                sandbox.spy(widget, 'setText');
                widget.view.getInput().setValue('');
                
                //ACT
                widget.callFDN();
    
                //ASSERT
                expect(widget.trigger.callCount).to.equal(0);
                expect(widget.setText.callCount).to.equal(0);
            });
        });

        describe('setText()', function() {
            it('Should set text and previous text', function() {
                widget.setText('abc');

                expect(widget.text).to.equal('abc');

                widget.setText('123');

                expect(widget.text).to.equal('123');
                expect(widget.previousText).to.equal('abc');
            });

            it('Should change text and title in DOM', function() {
                //ASSEMBLE
                var text = '123';

                sandbox.stub(widget.view.getInput(), 'setValue');
                sandbox.stub(widget.view.getInput(), 'setAttribute');

                //ACT
                widget.setText(text);

                //ASSERT
                expect(widget.view.getInput().setValue.callCount).to.equal(1);
                expect(widget.view.getInput().setAttribute.callCount).to.equal(1);
                expect(widget.view.getInput().setValue.getCall(0).calledWith(text)).to.equal(true);
                expect(widget.view.getInput().setAttribute.getCall(0).calledWith('title', text)).to.equal(true);
            });

        });
    });
});
