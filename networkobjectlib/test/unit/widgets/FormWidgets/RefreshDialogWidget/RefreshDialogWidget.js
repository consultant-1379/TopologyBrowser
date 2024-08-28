define([
    'jscore/core',
    'networkobjectlib/regions/topologyTree/TopologyTree',
    'networkobjectlib/widgets/FormWidgets/RefreshDialogWidget/RefreshDialogWidget',
    'i18n!networkobjectlib/dictionary.json'
], function(core, TopologyTree, RefreshDialogWidget, i18n) {
    'use strict';

    describe('RefreshDialogWidget', function() {
        var sandbox, app, content, topologyTree, region, options;

        beforeEach(function() {
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });

            // create app
            app = new core.App();
            app.start(new core.Element());

            // create div to hold the region
            content = new core.Element();
            content.setStyle({width: '100%', height: 420});
            app.getElement().append(content);

            // create topology tree region
            topologyTree = new TopologyTree({
                context: app.getContext(),
            });
            topologyTree.start(content);

            // create RefreshDialogWidget and content
            options = {okAction: function() { return true; }};
            region = new RefreshDialogWidget(options);

        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();
        });


        describe('show()', function() {
            it('Should show the refreshed dialog content', function() {
                //Assemble
                var data = [{label: 'ROPStar', type: 'ERBS'}];

                //Act
                region.show(data);

                //Assert
                expect(document.body.getElementsByClassName('ebAccordion').length).to.equal(1);
                expect(document.body.getElementsByClassName('ebAccordion-title')[0].innerHTML).to.equal('Changes (1)');
                expect(document.body.getElementsByClassName('ebTableCell')[0].innerHTML).to.equal(i18n.refreshInfo.table.label);
                expect(document.body.getElementsByClassName('ebTableCell')[1].innerHTML).to.equal(i18n.refreshInfo.table.type);
                expect(document.body.getElementsByClassName('ebTableCell')[3].innerHTML).to.equal(data[0].label);
                expect(document.body.getElementsByClassName('ebTableCell')[4].innerHTML).to.equal(data[0].type);

                region.hide();
            });
        });

        describe('hide()', function() {
            it('Should hide the refreshed dialog content', function() {
                //Assemble
                var data = [{label: 'ROPStar', type: 'ERBS'}];

                //Act
                region.show(data);
                region.hide();

                //Assert
                expect(document.body.getElementsByClassName('ebAccordion')[0]).to.be.empty;
            });

        });
    });
});

