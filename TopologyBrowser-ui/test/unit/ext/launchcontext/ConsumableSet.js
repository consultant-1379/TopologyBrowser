define([
    'topologybrowser/ext/launchcontext/ConsumableSet',
    'topologybrowser/ext/launchcontext/Consumable'
], function(ConsumableSet, Consumable) {

    describe('ConsumableSet', function() {
        var consumableSet;

        beforeEach(function() {
            consumableSet = new ConsumableSet();
            consumableSet.add(new Consumable('ManagedObject', {
                mocName: 'MeContext'
            }));
            consumableSet.add(new Consumable('ManagedObject', {
                mocName: 'ManagedElement'
            }));
            consumableSet.add(new Consumable('ManagedObject', {
                mocName: 'NetworkElement'
            }));
        });

        describe('add()', function() {
            it('should only add the Consumable if it is different than one already in the set', function() {
                // ACT
                expect(consumableSet._contents.length).to.equal(3);
                consumableSet.add(new Consumable('ManagedObject', {
                    mocName: 'ManagedElement'
                }));

                // ASSERT
                expect(consumableSet._contents.length).to.equal(3);
            });
        });

        describe('toArray()', function() {
            it('should return an array of the JSON representations of the consumables', function() {
                // ACT + ASSERT
                expect(consumableSet.toArray()).to.deep.equal([{
                    'name': 'ManagedObject',
                    'properties': [{
                        'name': 'mocName',
                        'value': 'MeContext'
                    }]
                }, {
                    'name': 'ManagedObject',
                    'properties': [{
                        'name': 'mocName',
                        'value': 'ManagedElement'
                    }]
                }, {
                    'name': 'ManagedObject',
                    'properties': [{
                        'name': 'mocName',
                        'value': 'NetworkElement'
                    }]
                }]);
            });
        });
    });
});
