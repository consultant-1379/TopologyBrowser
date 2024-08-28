/* global bitbox */
define([
    'jscore/core',
    'test/resources/BitUtils',
    'topologybrowser/regions/main/Main',
    'topologybrowser/TopologyBrowser',
    'test/resources/PersistentObjectRestMock',
    'test/resources/ActionsRestMock',
    'i18n!topologybrowser/app.json',
    'container/api',
    'test/resources/viewmodels/TopologyBrowser'
], function(core, BitUtils, Main, TopologyBrowser, PersistentObjectRestMock, ActionsRestMock, i18n, Container, view) {
    'use strict';

    describe('Contextual Actions', function() {
        var sandbox, app, content, classUnderTest, contextMenuShowSubscriptionId, showContextMenuEventFired, _actions, TIMEOUT = 8000;

        var initialNodes = BitUtils.buildTreeNodes(10);

        beforeEach(function() {
            window.location.hash = '';

            _actions = [{
                applicationId: 'alarmviewer',
                category: 'Fault Management Actions',
                defaultLabel: 'Monitor Alarms',
                icon: 'alarmUnacknowledged',
                multipleSelection: true,
                name: 'alarmmonitor-remote-show',
                plugin: 'alarmviewer/alarmmonitor-remote-show',
                primary: false
            }];

            // create sandbox with fake server and auto respond to requests
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });
            sandbox.server.autoRespond = true;

            // create app
            app = new core.App();
            app.start(core.Element.wrap(bitbox.getBody()));

            // create div to hold the region
            content = new core.Element();
            content.setStyle({width: '100%', height: 420});
            app.getElement().append(content);

            var item1 = JSON.parse(JSON.stringify(initialNodes[0]));
            item1.childrens = BitUtils.buildTreeNodes(10, 'MeContext');
            item1.noOfChildrens = item1.childrens.length;

            PersistentObjectRestMock.respondSubNetworks(sandbox.server, 200, {treeNodes: []});
            PersistentObjectRestMock.respondNetworkGetPoids(sandbox.server, 200, {treeNodes: initialNodes});
            PersistentObjectRestMock.respondAllOtherNodes(sandbox.server, 200, {treeNodes: initialNodes});
            PersistentObjectRestMock.respondAttributes(sandbox.server, 200, [], '.*', '.*');

            // initialNodes.forEach(function(item){
            //     PersistentObjectRestMock.respondPoid(sandbox.server, 200, item, item.id);
            // });

            // create region
            classUnderTest = new TopologyBrowser({
                context: app.getContext()
            });
            classUnderTest.start(content);

            showContextMenuEventFired = false;

            contextMenuShowSubscriptionId = Container.getEventBus().subscribe('contextmenu:show', function() {
                showContextMenuEventFired = true;
            });

            classUnderTest.getEventBus().publish('topologyTree:load');
        });

        afterEach(function() {
            if (contextMenuShowSubscriptionId) {
                Container.getEventBus().unsubscribe('contextmenu:show', contextMenuShowSubscriptionId);
            }
            content.remove();
            app.stop();
            sandbox.restore();
        });

        describe('When no objects are selected initially', function() {
            describe('and a single item is right clicked', function() {
                it('then the item is selected and the context menu event is fired', function(done) {
                    this.timeout(TIMEOUT);

                    ActionsRestMock.respondActions(sandbox.server, 200, {actions: _actions});

                    BitUtils.runTestSteps([
                        BitUtils.wait,
                        view.getNodeRootItems,
                        function() {
                            expect(showContextMenuEventFired).to.equal(false);
                            view.expandItem(0);
                        },
                        view.getTreeItems,
                        function(items) {
                            return BitUtils.rightClickElement(items[1]);
                        },
                        BitUtils.wait,
                        view.getNodeRootItems,
                        function(rootItems) {
                            expect(showContextMenuEventFired).to.equal(true);
                            expect(rootItems[1].className).to.contain('selected');
                            for (var i = 2; i < rootItems.length; i++) {
                                expect(rootItems[i].className).to.not.contain('selected');
                            }
                        }
                    ], done);
                });
                it('if actions cannot be fetched then an error dialog should appear', function(done) {
                    this.timeout(TIMEOUT);

                    ActionsRestMock.respondActions(sandbox.server, 404, '<html />');

                    BitUtils.runTestSteps([
                        BitUtils.wait,
                        view.getNodeRootItems,
                        function() {
                            expect(showContextMenuEventFired).to.equal(false);
                            view.expandItem(0);
                        },
                        view.getTreeItems,
                        function(items) {
                            return BitUtils.rightClickElement(items[1]);
                        },
                        BitUtils.wait,
                        view.getActionsErrorDialog,
                        function(errorDialog) {
                            expect(showContextMenuEventFired).to.equal(false);
                            expect(BitUtils.isElementVisible(errorDialog)).to.equal(true);
                            return view.getActionsErrorDialogText();
                        },
                        function(dialogText) {
                            expect(dialogText.textContent).to.equal(i18n.errors.actionsFetchError.title);
                        }
                    ], done);
                });
            });
        });

        describe('When a single item is selected initially', function() {
            describe('and the same item is right clicked', function() {
                it('then the Node remains selected and the context menu event is shown', function(done) {
                    this.timeout(TIMEOUT);

                    ActionsRestMock.respondActions(sandbox.server, 200, {actions: _actions});

                    BitUtils.runTestSteps([
                        BitUtils.wait,
                        view.getNodeRootItems,
                        function() {
                            expect(showContextMenuEventFired).to.equal(false);
                            view.expandItem(0);
                        },
                        view.getTreeItems,
                        function(items) {
                            BitUtils.clickElement(items[1]);
                            return view.getSelectedNodeRootItems();
                        },
                        view.getNodeRootItems,
                        function(rootItems) {
                            expect(rootItems[1].className).to.contain('selected');
                            return view.getTreeItems();
                        },
                        function(items) {
                            expect(showContextMenuEventFired).to.equal(false);
                            return BitUtils.rightClickElement(items[1]);
                        },
                        BitUtils.wait,
                        view.getNodeRootItems,
                        function(rootItems) {
                            expect(showContextMenuEventFired).to.equal(true);
                            expect(rootItems[1].className).to.contain('selected');
                            for (var i = 2; i < rootItems.length; i++) {
                                expect(rootItems[i].className).to.not.contain('selected');
                            }
                        }
                    ], done);
                });
            });

            describe('and a different item is right clicked', function() {
                it('then only the new item is selected and the context menu event is fired', function(done) {
                    this.timeout(TIMEOUT);

                    ActionsRestMock.respondActions(sandbox.server, 200, {actions: _actions});

                    BitUtils.runTestSteps([
                        BitUtils.wait,
                        view.getNodeRootItems,
                        function() {
                            expect(showContextMenuEventFired).to.equal(false);
                            view.expandItem(0);
                        },
                        view.getTreeItems,
                        function(items) {
                            BitUtils.clickElement(items[2]);
                            return view.getSelectedNodeRootItems();
                        },
                        view.getNodeRootItems,
                        function(rootItems) {
                            expect(rootItems[2].className).to.contain('selected');
                            return view.getTreeItems();
                        },
                        function(items) {
                            expect(showContextMenuEventFired).to.equal(false);
                            return BitUtils.rightClickElement(items[1]);
                        },
                        BitUtils.wait,
                        view.getNodeRootItems,
                        function(rootItems) {
                            expect(showContextMenuEventFired).to.equal(true);
                            expect(rootItems[1].className).to.contain('selected');
                            for (var i = 2; i < rootItems.length; i++) {
                                expect(rootItems[i].className).to.not.contain('selected');
                            }
                        }
                    ], done);
                });
            });
        });

        describe('When multiple items are selected initially', function() {
            var itemsToSelect;
            beforeEach(function() {
                itemsToSelect = 3;
            });
            describe('and one of the items is right clicked', function() {
                it('then all the items remain selected and the context menu event is fired', function(done) {
                    this.timeout(TIMEOUT);

                    ActionsRestMock.respondActions(sandbox.server, 200, {actions: _actions});

                    BitUtils.runTestSteps([
                        BitUtils.wait,
                        view.getNodeRootItems,
                        function() {
                            view.expandItem(0);
                        },
                        view.getTreeItems,
                        function(treeItems) {
                            for (var i = 1; i < itemsToSelect + 1; i++) {
                                BitUtils.ctrlClickElement(treeItems[i]);
                            }
                            return view.getSelectedNodeRootItems();
                        },
                        function(selectedItems) {
                            expect(selectedItems.length).to.equal(3);
                            return view.getTreeItems();
                        },
                        function(items) {
                            return BitUtils.rightClickElement(items[1]);
                        },
                        BitUtils.wait,
                        view.getSelectedNodeRootItems,
                        function(selectedItems) {
                            expect(selectedItems.length).to.equal(3);
                            return view.getNodeRootItems();
                        },
                        function(rootItems) {
                            for (var i = 1; i < itemsToSelect + 1; i++) {
                                expect(rootItems[i].className).to.contain('selected');
                            }
                            for (var j = itemsToSelect + 1; j < (rootItems.length - (itemsToSelect + 1)); j++) {
                                expect(rootItems[j].className).to.not.contain('selected');
                            }
                        }
                    ], done);
                });
            });
            describe('and a different item is right clicked', function() {
                it('then only the new item is selected and the context menu event is fired', function(done) {
                    this.timeout(TIMEOUT);

                    ActionsRestMock.respondActions(sandbox.server, 200, {actions: _actions});

                    BitUtils.runTestSteps([
                        BitUtils.wait,
                        view.getNodeRootItems,
                        function() {
                            expect(showContextMenuEventFired).to.equal(false);
                            view.expandItem(0);
                        },
                        view.getTreeItems,
                        function(items) {
                            for (var i = 1; i < itemsToSelect + 1; i++) {
                                BitUtils.ctrlClickElement(items[i]);
                            }
                            return view.getSelectedNodeRootItems();
                        },
                        function(selectedItems) {
                            expect(selectedItems.length).to.equal(3);
                            return view.getTreeItems();
                        },
                        function(items) {
                            return BitUtils.rightClickElement(items[4]);
                        },
                        BitUtils.wait,
                        view.getNodeRootItems,
                        function(rootItems) {
                            expect(rootItems[4].className).to.contain('selected');
                            expect(showContextMenuEventFired).to.equal(true);
                            return view.getSelectedNodeRootItems();
                        },
                        function(selectedItems) {
                            expect(selectedItems.children[2].children.length).to.equal(1);
                        }
                    ], done);
                });
            });
        });
    });
});
