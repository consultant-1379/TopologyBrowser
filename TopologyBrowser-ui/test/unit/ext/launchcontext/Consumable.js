define([
    'topologybrowser/ext/launchcontext/Consumable'
], function(Consumable) {

    describe('Consumable', function() {
        describe('constructor', function() {
            it('should initialise with name and properties if defined', function() {
                // ACT
                var name = 'ManagedObject';
                var properties = {
                    mocName: 'MeContext',
                    neType: 'ERBS'
                };
                var consumable = new Consumable(name, properties);

                // ASSERT
                expect(consumable._name).to.equal(name);
                expect(consumable._properties).to.equal(properties);
            });

            it('should initialise with default name and properties if none are defined', function() {
                // ACT
                var consumable = new Consumable();

                // ASSERT
                expect(consumable._name).to.equal('');
                expect(consumable._properties).to.deep.equal([]);
            });
        });

        describe('set/remove functionality', function() {
            // ARRANGE
            var consumable = new Consumable('ManagedObject', {
                mocName: 'MeContext',
                neType: 'ERBS'
            });

            it('should return true if a property has been successfully added', function() {
                // ARRANGE
                consumable.addProperty('nodeType', 'LTE');
                // ACT + ASSERT
                expect(consumable.getProperty('nodeType')).to.equal('LTE');
            });

            it('should return true if the property has been successfully removed', function() {
                // ARRANGE
                consumable.removeProperty('ManagedObject');
                // ACT + ASSERT
                expect(consumable.getProperty('ManagedObject')).to.equal(undefined);
            });

            it('should return true if the name has been set successfully', function() {
                // ARRANGE
                consumable.setName('LTENode1234');
                // ACT + ASSERT
                expect(consumable.getName()).to.equal('LTENode1234');
            });
        });

        describe('toJSON()', function() {
            it('should return a JSON representation of the object', function() {
                // ARRANGE
                var consumable = new Consumable('ManagedObject', {
                    mocName: 'MeContext',
                    neType: 'ERBS'
                });

                // ACT + ASSERT
                expect(consumable.toJSON()).to.deep.equal({
                    name: 'ManagedObject',
                    properties: [{
                        name: 'mocName',
                        value: 'MeContext'
                    }, {
                        name: 'neType',
                        value: 'ERBS'
                    }]
                });
            });
        });

        describe('equals()', function() {
            var consumable;
            beforeEach(function() {
                consumable = new Consumable('ManagedObject', {
                    mocName: 'MeContext',
                    neType: 'ERBS'
                });
            });

            it('should return false if names are not equal', function() {
                // ARRANGE
                var otherConsumable = new Consumable('Collection');

                // ACT + ASSERT
                expect(consumable.equals(otherConsumable)).to.equal(false);
            });

            it('should return false if number of properties is different', function() {
                // ARRANGE
                var otherConsumable = new Consumable('ManagedObject', {
                    mocName: 'MeContext'
                });

                // ACT + ASSERT
                expect(consumable.equals(otherConsumable)).to.equal(false);
            });

            it('should return false if a property value is different', function() {
                // ARRANGE
                var otherConsumable = new Consumable('ManagedObject', {
                    mocName: 'NetworkElement',
                    neType: 'ERBS'
                });

                // ACT + ASSERT
                expect(consumable.equals(otherConsumable)).to.equal(false);
            });

            it('should return true if name and properties are the same', function() {
                // ARRANGE
                var otherConsumable = new Consumable('ManagedObject', {
                    mocName: 'MeContext',
                    neType: 'ERBS'
                });

                // ACT + ASSERT
                expect(consumable.equals(otherConsumable)).to.equal(true);
            });

            it('should return true if name and properties are the same but in different order', function() {
                // ARRANGE
                var otherConsumable = new Consumable('ManagedObject', {
                    neType: 'ERBS',
                    mocName: 'MeContext'
                });

                // ACT + ASSERT
                expect(consumable.equals(otherConsumable)).to.equal(true);
            });
        });
    });

});
