define([
    'jscore/core',
    'tablelib/Table',
    'widgets/Accordion',
    'networkobjectlib/regions/topologyTree/TopologyTree',
    'networkobjectlib/widgets/FormWidgets/RefreshDialogWidget/RefreshDialogWidgetContent',
], function(core, Table, Accordion, TopologyTree, RefreshDialogWidgetContent) {
    'use strict';

    describe('RefreshDialogWidgetContent', function() {
        var sandbox, app, content, topologyTree, region;

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

            // create RefreshDialogWidgetContent
            region = new RefreshDialogWidgetContent();
        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();
        });


        describe('setData()', function() {
            it('Should call setRefreshMessage', function() {
                //Assemble
                var newData = [{label: 'newLabel', type: 'newType'}];
                var oldData = [{label: 'oldLabel', type: 'oldType'}];

                sandbox.spy(region.view, 'setRefreshMessage');

                var table = new Table({
                    data: oldData,
                    columns: [
                        {title: 'columnTitle', attribute: 'label', width: '149px'},
                    ],
                });
    
                var accordion = new Accordion({
                    title: 'tableTitle' + ' (' + oldData.length + ')',
                    content: table
                });
    
                accordion.attachTo(region.getElement());
    
                region.accordion = accordion;
                region.table = table;

                //Act
                region.setData(newData);

                //Assert
                expect(region.view.setRefreshMessage.callCount).to.equal(1);
            });

        });
    });
});

