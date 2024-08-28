define([
    'jscore/core',
    '../../utils/net',
    'networkobjectlib/utils/customError',
], function(core, net, customError) {

    /*
     * @returns {Object}
     *  {String|Object} data - response from the request
     *  {jscore/core/XHR} xhr - Custom XmlHttpRequest
     *  {Object} - config - configuration object (ex: to identify the request)
     */
    return {
        getRoot: function(poid) {
            return this.getPoid(poid+'?relativeDepth=0:-2&childDepth=1');
        },

        getPoid: function(poid) {
            return net.ajax({
                url: '/persistentObject/network/' + poid,
                type: 'GET',
                dataType: 'json'
            }).then(function(response) {
                response.data.treeNodes.forEach(function(node) {
                    if (node.childrens) {
                        node.childrens.forEach(function(n) {
                            n.poId = n.id || n.poId ;
                        });
                    }
                    node.poId = node.id || node.poId ;
                });
                return response;
            }).catch(function(response) {
                throw customError.getError(response.data.errorCode, response.data.title);
            });
        },

        getPoidSubtree: function(poid) {
            return net.ajax({
                url: '/persistentObject/network/' + poid + '/subTrees',
                type: 'GET',
                dataType: 'json'
            }).then(function(response) {
                response.data.treeNodes.forEach(function(node) {
                    if (node.childrens) {
                        node.childrens.forEach(function(n) {
                            n.poId = n.id || n.poId ;
                        });
                    }
                    node.poId = node.id || node.poId ;
                });

                return response;
            }).catch(function(response) {
                throw customError.getError(response.data.errorCode, response.data.title);
            });
        },

        getByFdn: function(fdn) {
            return net.ajax({
                url: '/persistentObject/fdn/' + fdn,
                type: 'GET',
                dataType: 'json'
            }).then(function(response) {
                response.data.poId = response.data.id || response.data.poId ;
                return response;
            }).catch(function(response) {
                throw customError.getError(response.data.errorCode, response.data.title);
            });
        },

        refreshManagedObjects: function(poids) {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: '/persistentObject/network/refresh',
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        poids: poids
                    }),
                    success: function(data, xhr) {
                        resolve({data: data, xhr: xhr});
                    },
                    error: function(data, xhr) {
                        reject({data: data, xhr: xhr});
                    }
                });
            });
        },

        getPoids: function(poids) {
            return net.ajax({
                url: '/persistentObject/network/poids',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    poids: poids
                })
            }).then(function(res) {
                return res;
            }).catch(function(response) {
                throw customError.getError(response.data.errorCode, response.data.title);
            });
        }
    };
});
