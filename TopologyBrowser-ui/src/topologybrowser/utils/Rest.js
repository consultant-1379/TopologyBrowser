define([
    'jscore/core',
    'jscore/ext/net'
], function(core, net) {

    /*
     * @returns {Object}
     *  {String|Object} data - response from the request
     *  {jscore/core/XHR} xhr - Custom XmlHttpRequest
     *  {Object} - config - configuration object (ex: to identify the request)
     */
    return {
        getRoot: function(poid, config) {
            return this.getPoid(poid+'?relativeDepth=0:-2&childDepth=1', config);
        },

        getPoid: function(poid, config) {
            config = config || {};
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: '/persistentObject/network/'+poid,
                    type: 'GET',
                    dataType: 'json',
                    success: function(data, xhr) {
                        data.treeNodes.forEach(function(node) {
                            node.poId = node.id || node.poId ;
                        });

                        resolve({data: data, xhr: xhr, config: config});
                    },
                    error: function(data, xhr) {
                        reject({data: data, xhr: xhr, config: config});
                    }
                });
            });
        },

        getPoidSubtree: function(poid, config) {
            config = config || {};
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: '/persistentObject/network/'+poid+'/subTrees',
                    type: 'GET',
                    dataType: 'json',
                    success: function(data, xhr) {
                        data.treeNodes.forEach(function(node) {
                            node.poId = node.id || node.poId ;
                        });

                        resolve({data: data, xhr: xhr, config: config});
                    },
                    error: function(data, xhr) {
                        reject({data: data, xhr: xhr, config: config});
                    }
                });
            });
        },

        getByFdn: function(fdn, config) {
            config = config || {};
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: '/persistentObject/fdn/' + fdn,
                    type: 'GET',
                    dataType: 'json',
                    success: function(data, xhr) {
                        data.poId = data.id || data.poId ;
                        resolve({data: data, xhr: xhr, config: config});
                    },
                    error: function(data, xhr) {
                        reject({data: data, xhr: xhr, config: config});
                    }
                });
            });
        },

        fetchNotifications: function(user) {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: '/network-visualization/v1/network-elements/get-current-notifications/' + user,
                    type: 'GET',
                    dataType: 'application/json',
                    success: function(data) {
                        if (data) {
                            resolve(JSON.parse(data));
                        } else {
                            resolve({});
                        }
                    },
                    error: function(data, xhr) {
                        reject({msg: data, xhr: xhr});
                    }
                });
            });
        }
    };
});
