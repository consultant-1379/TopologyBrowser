if (typeof define !== 'function') {
    var define = function(callback) {
        module.exports = callback();
    };
}

define(function() {

    return function() {
        var root = {
            'id': '800074978623583',
            'parentId': null,
            'name': 'Transport Topology',
            'category': 'Public',
            'type': 'NESTED',
            'subType': 'BRANCH',
            'level': 0
        };
        var rootId = '800074978623583';
        var nodes = {};
        var children = {};
        var leafChildren = {};
        var roots = {};

        nodes[root.id] = root;
        roots[root.id] = root;
        children[root.id] = [];
        var uuid = parseInt('900000000000000');

        return {
            getNode: function(id) {
                return nodes[id];
            },

            getRoot: function() {
                return nodes[rootId];
            },

            getRoots: function() {
                var rootsMap = Object.keys(roots).map(function(key) {
                    return roots[key];
                });
                return rootsMap;
            },

            getLevel: function(id) {
                return this.getNode(id).level;
            },

            getUuid: function() {
                return ++uuid;
            },

            getParentId: function(id) {
                return this.getNode(id).parentId;
            },

            getChildren: function(parentId) {
                return children[parentId];
            },

            getLeafChildren: function(parentId) {
                return leafChildren[parentId];
            },

            updateNode: function(node) {
                if (node && this.hasNodeById(node.id)) {
                    nodes[node.id].name = node.name ? node.name : nodes[node.id].name;
                    nodes[node.id].category = node.category ? node.category : nodes[node.id].category;
                    var parentId = nodes[node.id].parentId;
                    if (parentId) {
                        var childNodes = children[parentId].filter(function(child) {
                            return node.id === child.id;
                        });
                        if (childNodes.length > 0) {
                            childNodes.forEach(function(childNode) {
                                childNode.name = node.name ? node.name : childNode.name;
                                childNode.category = node.category ? node.category : childNode.category;
                            });
                        }
                    }
                    return nodes[node.id];
                } else {
                    return null;
                }
            },

            addNode: function(parentId, node) {
                if (this.hasNode(node.name) || !this.hasNodeById(parentId)) {
                    return this;
                }
                node.level = nodes[parentId].level + 1;
                nodes[node.id] = node;

                if (!Array.isArray(children[parentId])) {
                    children[parentId] = [];
                }
                children[parentId].push(node);

                return this;
            },


            addRoot: function(root) {
                if (this.hasRoot(root.name) || this.hasNode(root.name)) {
                    return this;
                }
                root.level = 0;
                root.type = 'NESTED';
                root.subType = 'BRANCH';
                roots[root.id] = root;
                nodes[root.id] = root;

                return this;
            },

            addLeafChildren: function(parentId, node) {
                if (!Array.isArray(leafChildren[parentId])) {
                    leafChildren[parentId] = [];
                }
                if (leafChildren[parentId].objects) {
                    leafChildren[parentId].objects = leafChildren[parentId].objects.concat(node.objects);

                } else {
                    leafChildren[parentId] = node;
                }
            },

            hasNodeById: function(id) {
                return nodes[id] !== undefined;
            },

            hasNode: function(name) {
                var nodeNames = Object.keys(nodes).map(function(node) {
                    return nodes[node].name;
                });
                return nodeNames.indexOf(name) > -1;
            },

            hasRootById: function(id) {
                return roots[id] !== undefined;
            },

            hasRoot: function(name) {
                var rootNames = Object.keys(roots).map(function(root) {
                    return roots[root].name;
                });
                return rootNames.indexOf(name) > -1;
            },

            hasChildren: function(parentId) {
                return children[parentId] !== undefined;
            },

            remove: function(id, parentId) {
                delete nodes[id];
                // remove from children
                if (this.hasChildren(parentId)) {
                    children[parentId].forEach(function(value, index) {
                        if (value.id === id) {
                            children[parentId].splice(index, 1);
                        }
                    });
                }
            },

            removeCollection: function(id, parentId) {
                nodes[id].parentId = null;
                // remove from children
                if (this.hasChildren(parentId)) {
                    children[parentId].forEach(function(value, index) {
                        if (value.id === id) {
                            children[parentId].splice(index, 1);
                        }
                    });
                }
            },

            clearAll: function() {
                nodes = {};
                roots = {};
                children = {};
                leafChildren = {};
                nodes[root.id] = root;
                roots[root.id] = root;
                children[root.id] = [];
                rootId = '800074978623583';
                uuid = parseInt('900000000000000');
            },

            setData: function(data) {
                rootId = data.rootId;
                if (data && data.children) {
                    nodes = JSON.parse(JSON.stringify(data.children));
                }
                nodes = (data && data.nodes) ? JSON.parse(JSON.stringify(data.nodes)) : {};
                roots = (data && data.roots) ? JSON.parse(JSON.stringify(data.roots)) : {};
                children = (data && data.children) ? JSON.parse(JSON.stringify(data.children)) : {};
                leafChildren = (data && data.leafChildren) ? JSON.parse(JSON.stringify(data.leafChildren)) : {};
                uuid = parseInt('900000000000000');
            },

            convertToV4Collection: function(data, isCustomTopology) {
                var v4Objects = [];
                data.forEach(function(item) {
                    var v4Item = {};
                    v4Item.id = item.id;
                    v4Item.parentId = item ? [item.parentId] : null;
                    v4Item.name = item.name;
                    v4Item.type = item.subType === 'LEAF' || item.subType === 'SEARCH_CRITERIA' ? 'LEAF' : 'BRANCH';
                    v4Item.contents = item.objects;
                    v4Item.isCustomTopology = isCustomTopology || item.parentId === null;
                    v4Item.lastRefreshTime = item.contentsUpdatedTime;
                    v4Item.sharing = item.category;
                    v4Item.query = item.query;
                    v4Item.totalNodeCount = 0;
                    if (item.subType === 'LEAF' && item.stereotypes) {
                        v4Item.stereotypes = [
                            {
                                type: 'PrivateNetwork',
                                attributes: item.stereotypes[0].attributes
                            }
                        ];
                    }
                    v4Objects.push(v4Item);
                }.bind(this));
                return v4Objects;
            },

            print: function() {
                console.log('nodes: ', nodes);
                console.log('roots: ', roots);
                console.log('children: ', children);
                console.log('leafChildren: ', leafChildren);

            }

        };
    };
});
