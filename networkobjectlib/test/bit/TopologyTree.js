/* global bitbox */
define([
    'jscore/core',
    'test/resources/BitUtils',
    'test/resources/PersistentObjectRestMock',
    'i18n!networkobjectlib/dictionary.json',
    'networkobjectlib/regions/topologyTree/TopologyTree',
], function(core, BitUtils, PersistentObjectRestMock, i18n, TopologyTree) {

    describe('Topology Tree', function() {
        var sandbox, app, content, classUnderTest;

        beforeEach(function() {
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
            content.setStyle({height: 420});
            app.getElement().append(content);

            // create region
            classUnderTest = new TopologyTree({
                context: app.getContext(),
                multiselect: true
            });
            classUnderTest.start(content);
        });

        afterEach(function() {
            content.remove();
            app.stop();
            sandbox.restore();
        });

        describe('load', function() {
            describe('without poid', function() {
                it('should show all items when there are only subnetworks', function(done) {
                    var items1 = BitUtils.buildTreeNodes(10);
                    var items2 = BitUtils.buildTreeNodes(10);

                    PersistentObjectRestMock.respondSubNetworks(sandbox.server, 200, {treeNodes: items1});
                    PersistentObjectRestMock.respondAllOtherNodes(sandbox.server, 200, {treeNodes: items2});

                    BitUtils.runTestSteps([
                        classUnderTest.load.bind(classUnderTest),
                        BitUtils.skipFrames,
                        function() {
                            var DOMAllItems = document.querySelectorAll('.elNetworkObjectLib-NodeItem');
                            expect(DOMAllItems[0].querySelector('.elNetworkObjectLib-NodeItem-label').textContent).to.equal(items1[0].moName);
                            expect(DOMAllItems[0].querySelector('.elNetworkObjectLib-NodeItem-type').textContent).to.equal(items1[0].moType);
                            expect(DOMAllItems[9].querySelector('.elNetworkObjectLib-NodeItem-label').textContent).to.equal(items1[9].moName);
                            expect(DOMAllItems[10].querySelector('.elNetworkObjectLib-NodeItem-label').textContent).to.equal(i18n.tree.nodes.allOtherNodes);

                            expect(document.querySelector('.elDataviz-Item_selected .elNetworkObjectLib-NodeItem-label')).to.equal(null);
                        }
                    ], done);
                });

                it('should show only all other nodes when there are no subnetworks', function(done) {
                    var items1 = BitUtils.buildTreeNodes(0);
                    var items2 = BitUtils.buildTreeNodes(0);

                    PersistentObjectRestMock.respondSubNetworks(sandbox.server, 200, {treeNodes: items1});
                    PersistentObjectRestMock.respondAllOtherNodes(sandbox.server, 200, {treeNodes: items2});

                    BitUtils.runTestSteps([
                        classUnderTest.load.bind(classUnderTest),
                        BitUtils.skipFrames,
                        function() {
                            var DOMAllItems = document.querySelectorAll('.elNetworkObjectLib-NodeItem');
                            expect(DOMAllItems[0].querySelector('.elNetworkObjectLib-NodeItem-label').textContent).to.equal(i18n.tree.nodes.allOtherNodes);
                            expect(document.querySelector('.elDataviz-Item_selected .elNetworkObjectLib-NodeItem-label')).to.equal(null);
                        }
                    ], done);
                });

                it('should show the error when tree not load', function(done) {
                    PersistentObjectRestMock.respondSubNetworks(sandbox.server, 500, {errorCode: -1});
                    PersistentObjectRestMock.respondAllOtherNodes(sandbox.server, 500, {errorCode: -1});

                    BitUtils.runTestSteps([
                        function() {
                            classUnderTest.load();
                        },
                        BitUtils.skipFrames,
                        function() {
                            var DOMAllItems = document.querySelectorAll('.elNetworkObjectLib-rTopologyTree-messageArea');
                            expect(DOMAllItems[0].querySelector('.ebInlineMessage-header').textContent).to.equal('Unknown server error');
                            expect(DOMAllItems[0].querySelector('.ebInlineMessage-description').textContent).to.equal('There was an unknown server error');
                        }
                    ], done);
                });
            });

            describe('with poid', function() {
                it('should select and scroll to item' , function(done) {
                    var items1 = BitUtils.buildTreeNodes(100);
                    var items2 = BitUtils.buildTreeNodes(100);

                    var itemRootChildren = BitUtils.buildTreeNodes(5);
                    var itemParentChildren = BitUtils.buildTreeNodes(2);

                    var itemRoot = JSON.parse(JSON.stringify(items2[items2.length-1]));
                    var itemParent = itemRootChildren[2];
                    var item = itemParentChildren[itemParentChildren.length-1];

                    itemRoot.noOfChildrens = itemRootChildren.length;
                    itemParent.noOfChildrens = itemParentChildren.length;

                    itemRoot.childrens = JSON.parse(JSON.stringify(itemRootChildren));
                    itemParent.childrens = JSON.parse(JSON.stringify(itemParentChildren));

                    var subtree = [itemRoot, itemParent, item];

                    PersistentObjectRestMock.respondSubNetworks(sandbox.server, 200, {treeNodes: items1});
                    PersistentObjectRestMock.respondAllOtherNodes(sandbox.server, 200, {treeNodes: items2});
                    PersistentObjectRestMock.respondSubtree(sandbox.server, 200, {treeNodes: subtree}, item.id);

                    BitUtils.runTestSteps([
                        classUnderTest.load.bind(classUnderTest, item.id),
                        BitUtils.skipFrames,
                        function() {
                            expect(document.querySelector('.elDataviz-Item_selected .elNetworkObjectLib-NodeItem-label').textContent).to.equal(item.moName);
                        }
                    ], done);
                });
            });

            describe('already in memory', function() {
                it('should select and scroll to item', function(done) {
                    var items1 = BitUtils.buildTreeNodes(100);
                    var items2 = BitUtils.buildTreeNodes(0);
                    var item = items1[50];

                    PersistentObjectRestMock.respondSubNetworks(sandbox.server, 200, {treeNodes: items1});
                    PersistentObjectRestMock.respondAllOtherNodes(sandbox.server, 200, {treeNodes: items2});

                    BitUtils.runTestSteps([
                        classUnderTest.load.bind(classUnderTest),
                        classUnderTest.load.bind(classUnderTest, item.id),
                        BitUtils.skipFrames,
                        function() {
                            expect(document.querySelector('.elDataviz-Item_selected .elNetworkObjectLib-NodeItem-label').textContent).to.equal(item.moName);
                        }
                    ], done);
                });
            });
        });

        describe('multiselect', function() {
            var items1, items2;

            beforeEach(function() {
                items1 = BitUtils.buildTreeNodes(100);
                items2 = BitUtils.buildTreeNodes(100);

                PersistentObjectRestMock.respondSubNetworks(sandbox.server, 200, {treeNodes: items1});
                PersistentObjectRestMock.respondAllOtherNodes(sandbox.server, 200, {treeNodes: items2});
            });

            it('should select even items', function(done) {
                BitUtils.runTestSteps([
                    classUnderTest.load.bind(classUnderTest),
                    BitUtils.skipFrames,
                    function() {
                        // convert node list to array
                        var elements = Array.prototype.slice.call(document.querySelectorAll('.elDataviz-Item-label'));

                        elements
                            .filter(function(elt, i) {
                                return i % 2 === 0;
                            })
                            .forEach(function(elt) {
                                core.Element.wrap(elt).trigger('click', {ctrlKey: true});
                            });
                    },
                    BitUtils.skipFrames,
                    function() {
                        // convert node list to array
                        var elements = Array.prototype.slice.call(document.querySelectorAll('.elDataviz-Item_selected .elNetworkObjectLib-NodeItem-label'));

                        expect(elements).to.have.length.above(1);
                        elements.forEach(function(elt, i) {
                            expect(elt.textContent).to.equal(items1[i*2].moName);
                        });
                    }
                ], done);
            });
        });

        describe('on select an item', function() {
            var items1, items2;

            beforeEach(function() {
                items1 = BitUtils.buildTreeNodes(20);
                items2 = BitUtils.buildTreeNodes(0);

                PersistentObjectRestMock.respondSubNetworks(sandbox.server, 200, {treeNodes: items1});
                PersistentObjectRestMock.respondAllOtherNodes(sandbox.server, 200, {treeNodes: items2});
            });

            it('should show error dialog if item does not exists', function(done) {
                PersistentObjectRestMock.respondPoids(sandbox.server, 200, {treeNodes: []});

                BitUtils.runTestSteps([
                    classUnderTest.load.bind(classUnderTest),
                    BitUtils.skipFrames,
                    function() {
                        core.Element.wrap(document.querySelector('.elNetworkObjectLib-NodeItem .elNetworkObjectLib-NodeItem-label')).trigger('click');
                    },
                    BitUtils.skipFrames,
                    function() {
                        var btn = document.querySelector('.ebDialogBox .ebBtn');
                        expect(btn).to.exists;
                        core.Element.wrap(btn).trigger('click');
                    }
                ], done);
            });

            it('should not show error dialog if item exists', function(done) {
                PersistentObjectRestMock.respondPoids(sandbox.server, 200, {treeNodes: [items1[0]]});

                BitUtils.runTestSteps([
                    classUnderTest.load.bind(classUnderTest),
                    BitUtils.skipFrames,
                    function() {
                        core.Element.wrap(document.querySelector('.elNetworkObjectLib-NodeItem .elNetworkObjectLib-NodeItem-label')).trigger('click');
                    },
                    BitUtils.skipFrames,
                    function() {
                        var btn = document.querySelector('.ebDialogBox .ebBtn');
                        expect(btn).to.be.null;
                    }
                ], done);
            });
        });

        describe('remove items from tree', function() {
            var items1, items2;

            beforeEach(function() {
                items1 = BitUtils.buildTreeNodes(20);
                items2 = BitUtils.buildTreeNodes(0);

                PersistentObjectRestMock.respondSubNetworks(sandbox.server, 200, {treeNodes: items1});
                PersistentObjectRestMock.respondAllOtherNodes(sandbox.server, 200, {treeNodes: items2});
            });

            it('should remove multiple root collapsed items from tree', function(done) {
                var numberOfItemsRemoved = 3;

                BitUtils.runTestSteps([
                    classUnderTest.load.bind(classUnderTest),
                    BitUtils.skipFrames,
                    function() {
                        items1
                            .slice(0, numberOfItemsRemoved)
                            .forEach(function(item) {
                                classUnderTest.remove(item.id);
                            });
                    },
                    BitUtils.skipFrames,
                    function() {
                        var elements = Array.prototype.slice.call(document.querySelectorAll('.elNetworkObjectLib-NodeItem .elNetworkObjectLib-NodeItem-label'));
                        elements.forEach(function(elt, i) {
                            expect(elt.textContent).to.equal(items1[i+numberOfItemsRemoved].moName);
                        });
                    }
                ], done);
            });

            it('should remove an expanded item from tree without changing scroll position', function(done) {
                var scrollIndex = 5;
                var removedVisibleIndex = 3;
                var item = JSON.parse(JSON.stringify(items1[scrollIndex+removedVisibleIndex]));
                item.childrens = BitUtils.buildTreeNodes(20);
                item.noOfChildrens = item.childrens.length;

                PersistentObjectRestMock.respondPoids(sandbox.server, 200, {treeNodes: [items1[scrollIndex]]});
                PersistentObjectRestMock.respondExpansion(sandbox.server, 200, {treeNodes: [item]}, item.id);

                BitUtils.runTestSteps([
                    classUnderTest.load.bind(classUnderTest),
                    classUnderTest.load.bind(classUnderTest, items1[scrollIndex].id),
                    BitUtils.skipFrames,
                    function() {
                        var arrows = Array.prototype.slice.call(document.querySelectorAll('.elDataviz-Item-expander'));
                        core.Element.wrap(arrows[removedVisibleIndex]).trigger('click');
                    },
                    BitUtils.skipFrames.bind(null, 6),
                    function() {
                        var elements = Array.prototype.slice.call(document.querySelectorAll('.elNetworkObjectLib-NodeItem .elNetworkObjectLib-NodeItem-label'));
                        elements.forEach(function(elt, i) {
                            if (i < removedVisibleIndex+1) {
                                expect(elt.textContent).to.equal(items1[scrollIndex+i].moName);
                            } else {
                                expect(elt.textContent).to.equal(item.childrens[i-removedVisibleIndex-1].moName);
                            }
                        });
                    },
                    classUnderTest.remove.bind(classUnderTest, item.id),
                    BitUtils.skipFrames,
                    function() {
                        var elements = Array.prototype.slice.call(document.querySelectorAll('.elNetworkObjectLib-NodeItem .elNetworkObjectLib-NodeItem-label'));
                        elements.forEach(function(elt, i) {
                            var index = (i >= removedVisibleIndex) ? i+1 : i;
                            expect(elt.textContent).to.equal(items1[scrollIndex+index].moName);
                        });
                    }
                ], done);
            });

            it('should remove an expanded children from tree without changing scroll position', function(done) {
                var scrollIndex = 5;
                var expandedVisibleIndex = 2;
                var removedVisibleIndex = 2;
                var item1 = JSON.parse(JSON.stringify(items1[scrollIndex+expandedVisibleIndex]));
                var item1Children = BitUtils.buildTreeNodes(20);
                item1.childrens = JSON.parse(JSON.stringify(item1Children));
                item1.noOfChildrens = item1.childrens.length;

                var item2 = JSON.parse(JSON.stringify(item1Children[removedVisibleIndex]));
                item2.childrens = BitUtils.buildTreeNodes(5);
                item2.noOfChildrens = item2.childrens.length;

                PersistentObjectRestMock.respondPoids(sandbox.server, 200, {treeNodes: [items1[scrollIndex]]});
                PersistentObjectRestMock.respondExpansion(sandbox.server, 200, {treeNodes: [item1]}, item1.id);
                PersistentObjectRestMock.respondExpansion(sandbox.server, 200, {treeNodes: [item2]}, item2.id);

                BitUtils.runTestSteps([
                    classUnderTest.load.bind(classUnderTest),
                    classUnderTest.load.bind(classUnderTest, items1[scrollIndex].id),
                    BitUtils.skipFrames,
                    function() {
                        var arrows = Array.prototype.slice.call(document.querySelectorAll('.elDataviz-Item-expander'));
                        core.Element.wrap(arrows[2]).trigger('click');
                    },
                    BitUtils.skipFrames.bind(null, 6),
                    function() {
                        var arrows = Array.prototype.slice.call(document.querySelectorAll('.elDataviz-Item-expander'));
                        core.Element.wrap(arrows[5]).trigger('click');
                    },
                    BitUtils.skipFrames.bind(null, 6),
                    classUnderTest.remove.bind(classUnderTest, item2.id),
                    BitUtils.skipFrames,
                    function() {
                        var elements = Array.prototype.slice.call(document.querySelectorAll('.elNetworkObjectLib-NodeItem .elNetworkObjectLib-NodeItem-label'));
                        elements.forEach(function(elt, i) {
                            if (i <= expandedVisibleIndex) {
                                expect(elt.textContent).to.equal(items1[scrollIndex+i].moName);
                            } else {
                                var index = (i > expandedVisibleIndex+removedVisibleIndex) ? i+1 : i;
                                expect(elt.textContent).to.equal(item1.childrens[index-expandedVisibleIndex-1].moName);
                            }
                        });
                    }
                ], done);
            });

            it('should remove item from tree when an item that doesn\'t exists anymore is selected', function(done) {
                PersistentObjectRestMock.respondPoids(sandbox.server, 200, {treeNodes: []});

                BitUtils.runTestSteps([
                    classUnderTest.load.bind(classUnderTest),
                    BitUtils.skipFrames,
                    function() {
                        core.Element.wrap(document.querySelector('.elNetworkObjectLib-NodeItem .elNetworkObjectLib-NodeItem-label')).trigger('click');
                    },
                    BitUtils.skipFrames,
                    function() {
                        core.Element.wrap(document.querySelector('.ebDialogBox .ebBtn')).trigger('click');
                    },
                    BitUtils.skipFrames,
                    function() {
                        var elements = Array.prototype.slice.call(document.querySelectorAll('.elNetworkObjectLib-NodeItem .elNetworkObjectLib-NodeItem-label'));
                        elements.forEach(function(elt, i) {
                            expect(elt.textContent).to.equal(items1[i+1].moName);
                        });
                    }
                ], done);
            });
        });

        describe('nodeItem', function() {
            var items1, items2, item1;

            beforeEach(function() {
                items1 = BitUtils.buildTreeNodes(10);
                items2 = BitUtils.buildTreeNodes(0);

                item1 = JSON.parse(JSON.stringify(items1[0]));
                var item1Children = BitUtils.buildTreeNodes(20);

                var syncStatus = ['SYNCHRONIZED', 'UNSYNCHRONIZED', 'PENDING'];

                for (var i = 0; i <= syncStatus.length; i++) {
                    item1Children[i].syncStatus = syncStatus[i];
                }

                item1.childrens = JSON.parse(JSON.stringify(item1Children));

                PersistentObjectRestMock.respondSubNetworks(sandbox.server, 200, {treeNodes: items1});
                PersistentObjectRestMock.respondAllOtherNodes(sandbox.server, 200, {treeNodes: items2});
                PersistentObjectRestMock.respondExpansion(sandbox.server, 200, {treeNodes: [item1]}, item1.id);
            });

            it('should display a node icon on launch', function(done) {
                BitUtils.runTestSteps([
                    classUnderTest.load.bind(classUnderTest),
                    BitUtils.skipFrames,
                    function() {
                        expect(document.querySelectorAll('.elNetworkObjectLib-NodeItem-icon')[0].title).to.equal('SubNetwork');
                    }
                ], done);
            });

            it('should display a label', function(done) {
                BitUtils.runTestSteps([
                    classUnderTest.load.bind(classUnderTest),
                    BitUtils.skipFrames,
                    function() {
                        core.Element.wrap(document.querySelector('.elDataviz-Item-expander')).trigger('click');
                    },
                    BitUtils.skipFrames.bind(null, 5),
                    function() {
                        expect(document.querySelectorAll('.elNetworkObjectLib-NodeItem-type')[2].title).to.equal('SubNetwork');
                    }
                ], done);
            });

            it('should display a type', function(done) {
                BitUtils.runTestSteps([
                    classUnderTest.load.bind(classUnderTest),
                    BitUtils.skipFrames,
                    function() {
                        core.Element.wrap(document.querySelector('.elDataviz-Item-expander')).trigger('click');
                    },
                    BitUtils.skipFrames.bind(null, 5),
                    function() {
                        expect(document.querySelectorAll('.elNetworkObjectLib-NodeItem-label')[2].title.substring(0, 6)).to.equal('Item 1');
                    }
                ], done);
            });

            it('should show synchronization status on the node item', function(done) {
                BitUtils.runTestSteps([
                    classUnderTest.load.bind(classUnderTest),
                    BitUtils.skipFrames,
                    function() {
                        core.Element.wrap(document.querySelector('.elDataviz-Item-expander')).trigger('click');
                    },
                    BitUtils.skipFrames.bind(null, 5),
                    function() {
                        expect(document.querySelectorAll('.elNetworkObjectLib-NodeItem-syncStatus')[1].title).to.equal('SYNCHRONIZED');
                        expect(document.querySelectorAll('.elNetworkObjectLib-NodeItem-syncStatus')[1].classList.contains('ebIcon_synced')).to.be.true;

                        expect(document.querySelectorAll('.elNetworkObjectLib-NodeItem-syncStatus')[2].title).to.equal('UNSYNCHRONIZED');
                        expect(document.querySelectorAll('.elNetworkObjectLib-NodeItem-syncStatus')[2].classList.contains('ebIcon_syncError')).to.be.true;

                        expect(document.querySelectorAll('.elNetworkObjectLib-NodeItem-syncStatus')[3].title).to.equal('SYNCHRONIZING');
                        expect(document.querySelectorAll('.elNetworkObjectLib-NodeItem-syncStatus')[3].classList.contains('ebIcon_syncing_animated')).to.be.true;

                        expect(document.querySelectorAll('.elNetworkObjectLib-NodeItem-syncStatus')[4].title).to.equal('');
                        expect(document.querySelectorAll('.elNetworkObjectLib-NodeItem-syncStatus')[4].classList.contains('null')).to.be.true;

                    }
                ], done);
            });

            it('should show an updated sync icon when selected', function(done) {
                var changedItem = JSON.parse(JSON.stringify(item1.childrens[0]));
                changedItem.syncStatus = 'PENDING';

                PersistentObjectRestMock.respondPoids(sandbox.server, 200, { treeNodes: [changedItem] });

                BitUtils.runTestSteps([
                    classUnderTest.load.bind(classUnderTest),
                    BitUtils.skipFrames,
                    function() {
                        core.Element.wrap(document.querySelector('.elDataviz-Item-expander')).trigger('click');
                    },
                    BitUtils.skipFrames.bind(null, 5),
                    function() {
                        expect(document.querySelectorAll('.elNetworkObjectLib-NodeItem-syncStatus.ebIcon.ebIcon')[1].title).to.equal('SYNCHRONIZED');
                        expect(document.querySelectorAll('.elNetworkObjectLib-NodeItem-syncStatus')[1].classList.contains('ebIcon_synced')).to.be.true;
                        core.Element.wrap(document.querySelectorAll('.elNetworkObjectLib-NodeItem-syncStatus.ebIcon')[1]).trigger('click');
                    },
                    BitUtils.skipFrames,
                    function() {
                        expect(document.querySelectorAll('.elNetworkObjectLib-NodeItem-syncStatus.ebIcon.ebIcon')[1].title).to.equal('SYNCHRONIZING');
                        expect(document.querySelectorAll('.elNetworkObjectLib-NodeItem-syncStatus')[1].classList.contains('ebIcon_syncing_animated')).to.be.true;
                    }
                ], done);
            });

             it('should show an updated sync icon after automatic refresh', function(done) {
                 var changedItem = JSON.parse(JSON.stringify(item1.childrens[0]));
                 changedItem.syncStatus = 'PENDING';

                 PersistentObjectRestMock.respondPoids(sandbox.server, 200, { treeNodes: [changedItem] });

                 BitUtils.runTestSteps([
                     classUnderTest.load.bind(classUnderTest),
                     BitUtils.skipFrames,
                     function() {
                         core.Element.wrap(document.querySelector('.elDataviz-Item-expander')).trigger('click');
                     },
                     BitUtils.skipFrames.bind(null, 5),
                     function() {
                         expect(document.querySelectorAll('.elNetworkObjectLib-NodeItem-syncStatus.ebIcon.ebIcon')[1].title).to.equal('SYNCHRONIZED');
                         expect(document.querySelectorAll('.elNetworkObjectLib-NodeItem-syncStatus')[1].classList.contains('ebIcon_synced')).to.be.true;
                     },
                     BitUtils.skipFrames,
                     function() {
                         setTimeout(function() {
                             expect(document.querySelectorAll('.elNetworkObjectLib-NodeItem-syncStatus.ebIcon.ebIcon')[1].title).to.equal('SYNCHRONIZING');
                             expect(document.querySelectorAll('.elNetworkObjectLib-NodeItem-syncStatus')[1].classList.contains('ebIcon_syncing_animated')).to.be.true;
                         }, 15000);
                     }
                 ], done);
             });

        });


        describe('resize', function() {
            /* eslint-disable no-unused-vars */
            var items1, items2, innerHeight;
            /* eslint-enable no-unused-vars */
            beforeEach(function() {
                core.Window.isTouch = function() { return true; };
                innerHeight = core.Window.getProperty('innerHeight');

                items1 = BitUtils.buildTreeNodes(10);
                items2 = BitUtils.buildTreeNodes(0);

                PersistentObjectRestMock.respondSubNetworks(sandbox.server, 200, {treeNodes: items1});
                PersistentObjectRestMock.respondAllOtherNodes(sandbox.server, 200, {treeNodes: items2});
            });

            it('Should resize properly when using an iPad', function(done) {
                BitUtils.runTestSteps([
                    classUnderTest.load.bind(classUnderTest),
                    BitUtils.skipFrames,
                    function() {
                        expect(document.querySelector('.elDataviz-Tree').style.height).to.equal((innerHeight - 230) + 'px');
                    }
                ], done);
            });
        });
    });
});
