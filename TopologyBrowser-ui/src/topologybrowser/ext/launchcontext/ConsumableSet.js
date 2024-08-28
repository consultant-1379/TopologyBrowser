define(function() {
    var ConsumableSet = function() {
        this._contents = [];
    };

    ConsumableSet.prototype = {
        add: function(item) {
            var found = this._contents.some(function(obj) {
                return obj.equals(item);
            });
            if (!found) {
                this._contents.push(item);
            }
        },

        toArray: function() {
            var result = [];
            this._contents.forEach(function(consumable) {
                result.push(consumable.toJSON());
            });
            return result;
        }
    };

    return ConsumableSet;
});
