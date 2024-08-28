define([
    'widgets/WidgetCore',
    'networkobjectlib/widgets/FormWidgets/ConfirmDialogWidget/ConfirmDialogWidgetContent'
], function(WidgetCore, ConfirmDialogContent) {
    'use strict';

    describe('ConfirmDialogWidgetContent', function() {

        var ConfirmDialogWidget;

        beforeEach(function() {

            ConfirmDialogWidget = new ConfirmDialogContent();
        });

        it('Should display the changes the user is about to save',function() {

            var original = [
                {
                    key: 'logicalName',
                    type: 'STRING',
                    value: ''
                }
            ];
            var changes = [
                {
                    key: 'logicalName',
                    datatype: 'STRING',
                    value: '12'
                }
            ];

            ConfirmDialogWidget.setChanges(original,changes);

            expect(ConfirmDialogWidget.accordion.options.title).to.equal('Changes (1)');
            expect(ConfirmDialogWidget.accordion.options.content.options.data[0].key).to.equal('logicalName');
            expect(ConfirmDialogWidget.accordion.options.content.options.data[0].newValue).to.equal('12');
            expect(ConfirmDialogWidget.accordion.options.content.options.data[0].prevValue).to.equal('');
            expect(ConfirmDialogWidget.accordion.options.content.options.data[0].valueArray[0]).to.equal('12');
            expect(ConfirmDialogWidget.accordion.options.content.options.data[0].valueArray[1]).to.equal('12');
        });

        it('Should display description and namespace as tooltip for ENUM_REF type',function() {

            var original = [
                {
                    key: 'administrativeState',
                    type: 'ENUM_REF',
                    value: 'LOCKED',
                    enumeration: {
                        'key': 'AdmState',
                        'description': 'Administrative state of a resource.',
                        'enumMembers': [
                            {
                                'key': 'memberNamespace1$$$LOCKED',
                                'value': 'memberNamespace1$$$LOCKED',
                                'description': 'The administrative state_enum1'
                            },
                            {
                                'key': 'memberNamespace2$$$LOCKED',
                                'value': 'memberNamespace2$$$LOCKED',
                                'description': 'The administrative state_enum2'
                            }
                        ]
                    }
                }
            ];
            var changes = [
                {
                    key: 'administrativeState',
                    datatype: 'ENUM_REF',
                    value: 'memberNamespace2$$$LOCKED'
                }
            ];
            var expectedDescription = 'The administrative state_enum2 | nameSpace: memberNamespace2$$$LOCKED';

            ConfirmDialogWidget.setChanges(original,changes);

            expect(ConfirmDialogWidget.accordion.options.title).to.equal('Changes (1)');
            expect(ConfirmDialogWidget.accordion.options.content.options.data[0].key).to.equal('administrativeState');
            expect(ConfirmDialogWidget.accordion.options.content.options.data[0].newValue).to.equal('memberNamespace2$$$LOCKED');
            expect(ConfirmDialogWidget.accordion.options.content.options.data[0].prevValue).to.equal('LOCKED');
            expect(ConfirmDialogWidget.accordion.options.content.options.data[0].valueArray[0]).to.equal('LOCKED');
            expect(ConfirmDialogWidget.accordion.options.content.options.data[0].valueArray[1]).to.equal(expectedDescription);
        });

        it('Should display the previous value as null in confirmation table',function() {

            var original = [{}];
            var changes = [
                {
                    key: 'testKey',
                    datatype: 'XYZ',
                    value: 'testValue'
                }
            ];

            ConfirmDialogWidget.setChanges(original,changes);

            expect(ConfirmDialogWidget.accordion.options.title).to.equal('Changes (1)');
            expect(ConfirmDialogWidget.accordion.options.content.options.data[0].key).to.equal('testKey');
            expect(ConfirmDialogWidget.accordion.options.content.options.data[0].newValue).to.equal('testValue');
            expect(ConfirmDialogWidget.accordion.options.content.options.data[0].prevValue).to.equal('null');
        });


        it('Should display the network disturbances', function() {
            //Assemble
            var networkDisturbance = ['testDisturbance'];
            var original = [{}];
            var changes = [
                {
                    key: 'testKey',
                    datatype: 'XYZ',
                    value: 'testValue',
                    disturbance: 'testDisturbance'
                }
            ];

            //Act
            ConfirmDialogWidget.setChanges(original, changes, networkDisturbance);

            //Assert
            expect(document.getElementById(''));
            expect(ConfirmDialogWidget.accordion.options.content.options.columns[3].title).to.equal('Disturbance');
            expect(ConfirmDialogWidget.table.options.data[0].disturbance).to.equal('testDisturbance');

        });

        it('Should not display the network disturbances if disturbances are empty', function() {
            //Assemble
            var networkDisturbance = [];
            var original = [{}];
            var changes = [
                {
                    key: 'testKey',
                    datatype: 'XYZ',
                    value: 'testValue'
                }
            ];

            //Act
            ConfirmDialogWidget.setChanges(original, changes, networkDisturbance);

            //Assert
            expect(ConfirmDialogWidget.accordion.options.content.options.columns.length).to.equal(3);
            expect(ConfirmDialogWidget.accordion.options.content.options.columns[2].title).to.equal('Proposed Changes');
            expect(ConfirmDialogWidget.table.options.data[0].disturbance).to.equal('');
        });

    });
});
