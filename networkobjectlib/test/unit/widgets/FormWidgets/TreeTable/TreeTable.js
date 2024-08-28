define([
    'networkobjectlib/widgets/FormWidgets/TreeTable/TreeTable',
], function(TreeTable) {
    'use strict';

    describe('TreeTable', function() {
        var sandbox,
            options,
            region;

        beforeEach(function() {
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });

            options = {
                columns: {index: 0, data: {value: ['TestColumn']}},
                row: {index: -1, data: {children: [{children: ['TestChild'], expanded: true, index: 1}]}}
            };

            region = new TreeTable(options);
        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();
        });

        describe('onRowExpand()', function() {
            it('Should expand the children of a row', function() {
                //Assemble
                expect(region.table._rows.length).to.not.equal(2);
                
                //Act
                region.onRowExpand(options.row);

                //Assert
                expect(region.table._rows.length).to.equal(2);
                expect(region.table.options.row.data.children[0].expanded).to.be.true;
                expect(region.table.options.row.data.children[0].children[0]).to.equal('TestChild');
            });
        });

        describe('onRowCollapse()', function() {
            it('Should collapse the children of a row', function() {
                //Assemble
                region.onRowExpand(options.row);
                var rowLength = region.table._rows.length;
                expect(region.table._rows.length).to.not.be.lt(rowLength);
                expect(region.table._rows.length).to.not.equal(0);

                //Act
                region.onRowCollapse(options.row);

                //Assert
                expect(region.table._rows.length).to.be.lt(rowLength);
                expect(region.table._rows.length).to.equal(0);
            });
        });
    });

});

