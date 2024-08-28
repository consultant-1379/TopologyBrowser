/* global define, describe, it, expect, bitbox */
define([
    'topologybrowser/TopologyBrowser',
    'test/resources/PersistentObjectRestMock',
    'test/resources/ActionsRestMock',
    'test/resources/BitUtils',
    'test/resources/viewmodels/TopologyBrowser',
    'networkobjectlib/utils/AccessControl',
    'jscore/core'
], function(TopologyBrowser, PersistentObjectRestMock, ActionsRestMock, BitUtils, view, AccessControl, core) {
    'use strict';

    describe('TopologyBrowser', function() {
        var sandbox, classUnderTest;

        beforeEach(function() {
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });
            sandbox.server.autoRespond = true;
            window.location.hash = 'topologybrowser';

            sandbox.stub(AccessControl.prototype, 'getResources', function() {
                return Promise.resolve();
            });
            sandbox.stub(AccessControl.prototype, 'isAllowed').returns(true);
        });

        afterEach(function() {
            classUnderTest && classUnderTest.stop();
            classUnderTest = undefined;
            sandbox.restore();
        });

        after(function() {
            window.location.hash = '';
        });

        it('TopologyBrowser should be defined', function() {
            expect(TopologyBrowser).not.to.be.undefined;
        });

        it('should show the error dashboard instead of the tree', function(done) {
            PersistentObjectRestMock.respondSubNetworks(sandbox.server, 500, {});
            PersistentObjectRestMock.respondAllOtherNodes(sandbox.server, 500, {});
            createApp();

            // Action
            classUnderTest.onLocationChange('');

            //Assert
            BitUtils.runTestSteps([
                BitUtils.wait,
                function() {
                    var DialogContain = document.querySelectorAll('.elNetworkObjectLib-rTopologyTree-messageArea');
                    expect(DialogContain[0].querySelector('.ebInlineMessage-header').textContent).to.equal('Unable to Retrieve Data');
                    expect(DialogContain[0].querySelector('.ebInlineMessage-description').textContent).to.equal('The server encountered an internal error. Please try again later.');
                }
            ], done);
        });

        describe('Available actions', function() {
            it('should show actions button', function(done) {
                var items1 = buildTreeNodes(5);
                var initialNodes = buildTreeNodes(5);
                var actionResponse = {
                    'actions': [
                        {
                            'defaultLabel': 'Launch AMOS',
                            'name': 'advancedmoscripting-remote-show',
                            'plugin': 'advancedmoscripting/advancedmoscripting-remote-show',
                            'applicationId': 'advancedmoscripting',
                            'multipleSelection': false,
                            'primary': false,
                            'category': 'Configuration Management'
                        }
                    ],
                    'action-matches': {
                        'conditions': [
                            {
                                'dataType': 'ManagedObject',
                                'properties': [
                                    {
                                        'name': 'type',
                                        'value': 'ManagedElement'
                                    },
                                    {
                                        'name': 'neType',
                                        'value': 'RadioTNode'
                                    }
                                ]
                            }
                        ],
                        'application': 'topologybrowser',
                        'multipleSelection': false
                    }
                };
                PersistentObjectRestMock.respondSubNetworks(sandbox.server, 200, {treeNodes: items1});
                PersistentObjectRestMock.respondNetworkGetPoids(sandbox.server, 200, {treeNodes: initialNodes});
                PersistentObjectRestMock.respondAllOtherNodes(sandbox.server, 200, {treeNodes: initialNodes});
                PersistentObjectRestMock.respondAttributes(sandbox.server, 200, [], '.*', '.*');

                ActionsRestMock.respondActions(sandbox.server, 200, actionResponse);
                createApp();

                BitUtils.runTestSteps([
                    view.getNodeRootItems,
                    function() {
                        view.expandItem(0);
                        return view.getTreeItems();
                    },
                    function(items) {
                        return BitUtils.clickElement(items[1]);
                    },
                    BitUtils.wait,
                    function() {
                        var actionbar = document.querySelectorAll('.elLayouts-QuickActionBar-center .elLayouts-QuickActionBar-items.elLayouts-QuickActionBar-items_fadeIn');
                        expect(actionbar[0].lastChild.textContent).to.equal('Launch AMOS');
                    }
                ], done);

            });
        });

        function createApp() {
            classUnderTest = new TopologyBrowser();
            classUnderTest.start(core.Element.wrap(bitbox.getBody()));
        }

        function buildTreeNodes(length) {
            var data = [];

            for (var i = 0; i < length; i++) {
                var id = BitUtils.uuid();
                data.push({
                    id: id,
                    moName: 'Item ' + String(i) + ' - ' + id,
                    moType: 'ManagedElement',
                    iconType: '',
                    noOfChildrens: 1,
                    childrens: null,
                    neType: 'RadioTNode'
                });
            }
            return data;
        }
    });
});

       
