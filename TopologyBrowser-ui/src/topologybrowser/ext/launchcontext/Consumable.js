define(function() {
    var Consumable = function(name, properties) {
        this._name = name || '';
        this._properties = properties || {};
    };

    Consumable.prototype = {
        addProperty: function(key, val) {
            this._properties[key] = val;
        },

        removeProperty: function(key) {
            delete this._properties[key];
        },

        setName: function(name) {
            this._name = name;
        },

        getName: function() {
            return this._name;
        },

        getProperty: function(key) {
            return this._properties[key];
        },

        getProperties: function() {
            return this._properties;
        },

        toJSON: function() {
            var result = {
                name: this._name,
                properties: []
            };
            for (var key in this._properties) {
                result.properties.push({
                    name: key,
                    value: this._properties[key]
                });
            }
            return result;
        },

        equals: function(consumable) {
            if (this._name !== consumable.getName()) {
                return false;
            }
            if (Object.keys(this._properties).length !== Object.keys(consumable.getProperties()).length) {
                return false;
            }
            for (var key in this._properties) {
                if (this._properties[key] !== consumable.getProperty(key)) {
                    return false;
                }
            }
            return true;
        }
    };

    return Consumable;
});
