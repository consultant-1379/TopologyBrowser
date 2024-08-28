define([
], function() {

    /**
     * Scope is an object that holds the scope selected in the Scoping Panel
     *
     * ### Scope
     * [===
     *   {Array} networkObjects - array of poids
     *   {Array} collections - array of collection ids
     *   {Array} savedSearches - array of saved searches ids
     * ===]
     *
     * @class Scope
     */
    function Scope(networkObjects, collections, savedSearches) {
        this.networkObjects = networkObjects || [];
        this.collections = collections || [];
        this.savedSearches = savedSearches || [];
    }

    Scope.prototype.getTotalSelected = function() {
        return this.networkObjects.length + this.collections.length + this.savedSearches.length;
    };

    return Scope;

});
