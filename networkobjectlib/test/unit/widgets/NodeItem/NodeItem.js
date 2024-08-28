define([
    'networkobjectlib/widgets/NodeItem/NodeItem',
    'i18n!networkobjectlib/dictionary.json'
], function(NodeItem, i18n) {
    'use strict';

    describe('widgets/NodeItem', function() {
        var sandbox,
            widget;

        before(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('onViewReady()', function() {
            [{
                description: 'on TopologyBrowser main page, when contentsUpdatedTime is not undefined',
                data: {
                    label: '1',
                    type: '2',
                    contentsUpdatedTime: '3'
                },
                querySelectorReturn: undefined,
                expected: {
                    label: '1',
                    title: '1',
                    type: '2'
                }
            },{
                description: 'on TopologyBrowser main page, when contentsUpdatedTime is undefined',
                data: {
                    label: '1',
                    type: '2',
                    contentsUpdatedTime: undefined
                },
                querySelectorReturn: undefined,
                expected: {
                    label: '1',
                    title: '1',
                    type: '2'
                }
            },{
                description: 'in ScopingPanel, when contentsUpdatedTime is not undefined',
                data: {
                    label: '1',
                    type: '2',
                    contentsUpdatedTime: '3'
                },
                querySelectorReturn: {
                    anything: true
                },
                expected: {
                    label: '1',
                    title: '1 - ' +  i18n.collectionDetailPanel.detailLabels.contentsUpdatedTime + ': 3',
                    type: '2'
                }
            },{
                description: 'in ScopingPanel, when contentsUpdatedTime is undefined',
                data: {
                    label: '1',
                    type: '2',
                    contentsUpdatedTime: undefined
                },
                querySelectorReturn: {
                    anything: true
                },
                expected: {
                    label: '1',
                    title: '1',
                    type: '2'
                }
            }].forEach(function(test) {
                it('Should set label, tooltip and type ' + test.description, function() {
                    sandbox.stub(document, 'querySelector', function() {
                        return test.querySelectorReturn;
                    });
                    widget = new NodeItem({
                        label: test.data.label,
                        type: test.data.type,
                        contentsUpdatedTime: test.data.contentsUpdatedTime
                    });
                    //ACT
                    widget.onViewReady();

                    //verify the label and type has been set
                    expect(widget.view.getLabel().getText()).to.equal(test.expected.label);
                    expect(widget.view.getLabel().getAttribute('title')).to.equal(test.expected.title);
                    expect(widget.view.getType().getText()).to.equal(test.expected.type);
                });
            });

            it('Should set label, tooltip and type where type is a Private Network ', function() {
                sandbox.stub(document, 'querySelector', function() {
                    return {anything: true};
                });
                widget = new NodeItem({
                    label: 'SampleLabel',
                    stereotypes: [{type: 'PrivateNetwork'}],
                    contentsUpdatedTime: undefined
                });
                //ACT
                widget.onViewReady();

                //verify the label and type has been set
                expect(widget.view.getLabel().getText()).to.equal('SampleLabel');
                expect(widget.view.getLabel().getAttribute('title')).to.equal('SampleLabel');
                expect(widget.view.getType().getText()).to.equal('Private Network');
            });

            [{
                description: 'not show any icon',
                data: {
                    label: '1',
                    type: '2',
                    contentsUpdatedTime: '3',
                    radioAccessTechnology: []
                },
                querySelectorReturn: undefined,
                expected: {
                    label: '1',
                    title: '1',
                    type: '2'

                },
                expectedIcons: {
                    mngIcon: false,
                    sync: false
                }
            },{
                description: 'show maintenance and synchronization icons',
                data: {
                    label: '1',
                    type: '2',
                    contentsUpdatedTime: '3',
                    syncStatusIcon: 'syncIcon',
                    syncStatusTitle: 'sync',
                    managementStateIcon: 'mngIcon',
                    managementStateTitle: 'maintenance',
                    radioAccessTechnology: []
                },
                querySelectorReturn: undefined,
                expected: {
                    label: '1',
                    title: '1',
                    type: '2',
                    syncStatusTitle: 'sync',
                    managementStateTitle: 'maintenance'

                },
                expectedIcons: {
                    mngIcon: true,
                    sync: true
                }
            },{
                description: 'show maintenance and 2G icons',
                data: {
                    label: '1',
                    type: '2',
                    contentsUpdatedTime: '3',
                    radioAccessTechnology: ['2G'],
                    managementStateIcon: 'mngIcon',
                    managementStateTitle: 'maintenance'
                },
                querySelectorReturn: undefined,
                expected: {
                    label: '1',
                    title: '1',
                    type: '2',
                    managementStateTitle: 'maintenance'

                },
                expectedIcons: {
                    mngIcon: true,
                    sync: false,
                    '2G': true
                }
            },{
                description: 'show maintenance, 2G and 3G icons',
                data: {
                    label: '1',
                    type: '2',
                    contentsUpdatedTime: '3',
                    radioAccessTechnology: ['2G','3G'],
                    managementStateIcon: 'mngIcon',
                    managementStateTitle: 'maintenance'
                },
                querySelectorReturn: undefined,
                expected: {
                    label: '1',
                    title: '1',
                    type: '2',
                    managementStateTitle: 'maintenance'

                },
                expectedIcons: {
                    mngIcon: true,
                    sync: false,
                    '2G': true,
                    '3G': true
                }
            },{
                description: 'show maintenance, 4G and more icons',
                data: {
                    label: '1',
                    type: '2',
                    contentsUpdatedTime: '3',
                    radioAccessTechnology: ['2G','3G','4G'],
                    managementStateIcon: 'mngIcon',
                    managementStateTitle: 'maintenance'
                },
                querySelectorReturn: undefined,
                expected: {
                    label: '1',
                    title: '1',
                    type: '2',
                    managementStateTitle: 'maintenance'

                },
                expectedIcons: {
                    mngIcon: true,
                    sync: false,
                    '2G': false,
                    '3G': false,
                    '4G': true,
                    more: true
                }
            }].forEach(function(test) {
                it('Should ' + test.description, function() {
                    sandbox.stub(document, 'querySelector', function() {
                        return test.querySelectorReturn;
                    });
                    widget = new NodeItem(test.data);
                    //ACT
                    widget.onViewReady();

                    expect(widget.view.getSyncStatus().hasModifier('hidden')).to.equal(!test.expectedIcons.sync);
                    expect(widget.view.getSyncStatus().getAttribute('title')).to.equal(test.expected.syncStatusTitle);
                    expect(widget.view.getSyncStatus().getNative().classList.contains(test.data.syncStatusIcon)).to.equal(test.expectedIcons.sync);

                    expect(widget.view.getManagementState().hasModifier('hidden')).to.equal(!test.expectedIcons.mngIcon);
                    expect(widget.view.getManagementState().getAttribute('title')).to.equal(test.expected.managementStateTitle);
                    expect(widget.view.getManagementState().getNative().classList.contains(test.data.managementStateIcon)).to.equal(test.expectedIcons.mngIcon);

                    expect(widget.view.getRATIcon('4G').hasModifier('hidden')).to.equal(!test.expectedIcons['4G']);
                    expect(widget.view.getRATIcon('3G').hasModifier('hidden')).to.equal(!test.expectedIcons['3G']);
                    expect(widget.view.getRATIcon('2G').hasModifier('hidden')).to.equal(!test.expectedIcons['2G']);
                    expect(widget.view.getMoreIcon().hasModifier('hidden')).to.equal(!test.expectedIcons.more);

                });
            });
        });
    });
});
