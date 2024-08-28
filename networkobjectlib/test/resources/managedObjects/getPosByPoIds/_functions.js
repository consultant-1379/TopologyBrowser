define(function() {
    return {
        /**
         * options: {
         *  polist (required)
         *  attributeMappings (optional)
         * }
         * @param options
         * @returns {*}
         */
        generateResponse: function(options) {
            options = options || {};
            var response = [];
            for (var i = 0; i < options.poList.length; i++) {
                var newObject = {
                    poId: options.poList[i].toString(),
                    id: options.poList[i].toString(),
                    moName: 'Object' + (i + 1),
                    moType: 'Object',
                    fullMoType: 'Object',
                    mibRootName: 'RootObject' + (i + 1),
                    parentRDN: 'ParentObject=' + (i + 1),
                    cmSyncStatus: 'SYNCHRONIZED',
                    attributes: {}
                };
                //A negative PoId means attributes do not apply to the object
                if ((options.poList[i] >= 0) && options.attributeMappings) {
                    for (var j = 0; j < options.attributeMappings.length; j++) {
                        var mapping = options.attributeMappings[j];
                        mapping.attributeNames.forEach(function(name) {
                            newObject.attributes[name] = name + i;
                        });
                    }
                }
                response.push(newObject);
            }
            return response;
        }
    };
});
