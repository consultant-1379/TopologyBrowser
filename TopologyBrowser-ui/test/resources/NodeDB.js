if (typeof define !== 'function') {
    var define = function(callback) {
        module.exports = callback();
    };
}

define(function() {
    return function() {

        var root = {};
        var otherRoot = {};
        var nodes = {};
        var children = {};
        var uuid = parseInt('900000000000000');

        return {
            getNode: function(id) {
                return nodes[id];
            },

            getRoot: function() {
                return Object.keys(root).map(function(key) {
                    return root[key];
                });
            },

            getOtherRoot: function() {
                return Object.keys(otherRoot).map(function(key) {
                    return otherRoot[key];
                });
            },

            getUuid: function() {
                return ++uuid;
            },

            getChildren: function(parentId) {
                return children[parentId];
            },

            addNode: function(node) {
                nodes[node.id] = node;
                if (typeof node.parentId === 'string') {
                    if (!Array.isArray(children[node.parentId])) {
                        children[node.parentId] = [];
                    }
                    children[node.parentId].push(node);
                }
            },

            getPoid: function(id) {
                if (nodes[id]) {
                    return {
                        id: nodes[id].id,
                        moName: nodes[id].moName,
                        moType: nodes[id].moType,
                        syncStatus: nodes[id].syncStatus,
                        managementState: nodes[id].managementState,
                        neType: nodes[id].neType,
                        parentMoType: nodes[id].parentId ? nodes[nodes[id].parentId].moType : null
                    };
                }
                else {
                    return undefined;
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

            hasChildren: function(parentId) {
                return children[parentId] !== undefined;
            },

            remove: function(id) {
                var node = nodes[id];
                if (node && typeof node.parentId === 'string') {
                    // remove from children
                    if (this.hasChildren(node.parentId)) {
                        var index = '';
                        children[node.parentId].forEach(function(child, i) {
                            if (child.id === id) {
                                index = i;
                            }
                        });
                        if (index > -1) {
                            children[node.parentId].splice(index, 1);
                        }
                    }
                }

                delete nodes[id];
            },

            clearAll: function() {
                root = {};
                otherRoot = {};
                nodes = {};
                children = {};

                uuid = parseInt('900000000000000');
            },

            setData: function(data) {
                root = (data && data.root) ? JSON.parse(JSON.stringify(data.root)) : {};
                otherRoot = (data && data.otherRoot) ? JSON.parse(JSON.stringify(data.otherRoot)) : {};
                nodes = (data && data.nodes) ? JSON.parse(JSON.stringify(data.nodes)) : {};
                children = (data && data.children) ? JSON.parse(JSON.stringify(data.children)) : {};
                uuid = parseInt('900000000000000');
            },

            print: function() {
                console.log('nodes: ', nodes);
                console.log('children: ', children);
            }

        };
    };

});
