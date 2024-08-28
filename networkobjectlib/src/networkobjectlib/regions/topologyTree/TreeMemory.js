define([
], function() {

    /**
     * @class TreeMemory
     * @private
     */

    return function() {
        /*
         * @desc holds all elements indexed by id
         */
        var memory = {};

        /*
         * @desc holds an ordered array of children keys for each parent
         * @example: { 'parentPoid': ['childrenMemoryKey1', 'childrenMemoryKey2'] }
         */
        var childrenIndex = {};

        return {
            /*
             * @desc returns all elements from memory
             * @returns map
             */
            all: function() {
                return memory;
            },

            allChildren: function() {
                return childrenIndex;
            },

            /*
             * @desc returns element from memory
             * @returns element or undefined if not found
             */
            get: function(key) {
                return memory[key];
            },

            /**
             * returns children from parent. Use recursive to return all descendants
             *
             * @method getChildren
             * @param key
             * @param recursive
             * @returns {Array}
             */
            getChildren: function(key, recursive) {
                var children = childrenIndex[key] || [];

                if (recursive) {
                    return children.reduce(function(prev, curr) {
                        var innerChildren = this.getChildren(curr, recursive);
                        return prev.concat(memory[curr], innerChildren);
                    }.bind(this), []);
                } else {
                    return children.map(function(childKey) {
                        return memory[childKey];
                    });
                }
            },

            /*
             * @desc add object to memory
             * @returns TreeMemory
             */
            addObject: function(key, object, parent) {
                if (this.has(key)) {
                    return this;
                }

                memory[key] = object;

                if (!Array.isArray(childrenIndex[parent])) {
                    childrenIndex[parent] = [];
                }

                // add children key to childrenIndexes
                childrenIndex[parent].push(key);

                return this;
            },

            /*
             * @desc add objects to memory
             * @param objects - array
             */
            addObjects: function(objects) {
                if (Array.isArray(objects)) {
                    objects.forEach(function(object) {
                        this.addObject(object.id, object, object.parent);
                    }.bind(this));
                }
            },

            /*
             * @desc check if element exists in memory
             * @returns boolean
             */
            has: function(key) {
                return typeof memory[key] !== 'undefined';
            },

            /*
             * @desc check if children elements are in memory
             * @returns boolean
             */
            hasChildren: function(parent) {
                return typeof childrenIndex[parent] !== 'undefined';
            },

            /**
             * removes key from memory and from children index
             *
             * @method remove
             * @param {String} key
             * @param {String} parent
             */
            remove: function(key, parent) {
                // remove from memory
                delete memory[key];

                // remove from children index
                if (this.hasChildren(parent)) {
                    var index = childrenIndex[parent].indexOf(key);
                    if (index > -1) {
                        childrenIndex[parent].splice(index, 1);
                    }
                }
            },

            /**
             * clear children from parent. Use recursive to remove all descendants
             *
             * @method clearChildren
             * @param parent
             * @param recursive
             */
            clearChildren: function(parent, recursive) {
                if (this.hasChildren(parent)) {
                    childrenIndex[parent].forEach(function(childKey) {
                        if (recursive) {
                            this.clearChildren(childKey, recursive);
                        }

                        delete memory[childKey];
                    }.bind(this));

                    delete childrenIndex[parent];
                }
            },

            /*
             * @desc clear all memory
             */
            clearAll: function() {
                memory = {};
                childrenIndex = {};
            }
        };
    };
});
