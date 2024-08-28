define([
    'jscore/ext/privateStore',
    './net'
], function(PrivateStore, net) {
    var _= PrivateStore.create();

    /**
     * Constructor for the collection of Resource information
     *
     * @constructor
     */
    var AccessControl = function() {
        _(this).actionsOf = null;
        this.x = new Date();
    };

    /**
     * Make multiple AJAX requests for the collection of Resource information.
     *
     * @returns {Promise}
     */
    AccessControl.prototype.getResources = function(application) {
        var userData = [], itemsProcessed = 0, urls = [];

        if (application === 'topologyBrowser') {
            /* Topology Browser needs to know if user is authorized for Network Explorer in order to enable/disable
             'Search for an Object' button.  */
            urls = [
                'oss/uiaccesscontrol/resources/searchExecutor/actions',
                'oss/uiaccesscontrol/resources/topologySearchService/actions'
            ];
        } else if (application === 'persistentObjectService') {
            /* Details panel needs to know if the user is authorized to perform update actions and therefore show the 'Edit Attributes' button. */
            urls = [
                'oss/uiaccesscontrol/resources/persistentobjectservice/actions'
            ];
        } else {
            /* Scoping panel needs to know if user is authorized for Topology/Search/Collection/SavedSearches tabs. */
            urls = [
                'oss/uiaccesscontrol/resources/searchExecutor/actions',
                'oss/uiaccesscontrol/resources/persistentobjectservice/actions',
                'oss/uiaccesscontrol/resources/topologySearchService/actions',
                'oss/uiaccesscontrol/resources/topologyCollectionsService/actions',
                'oss/uiaccesscontrol/resources/Collections_Public/actions',
                'oss/uiaccesscontrol/resources/Collections_Private/actions',
                'oss/uiaccesscontrol/resources/CollectionsOthers_Public/actions',
                'oss/uiaccesscontrol/resources/CollectionsOthers_Private/actions',
                'oss/uiaccesscontrol/resources/SavedSearch_Public/actions',
                'oss/uiaccesscontrol/resources/SavedSearch_Private/actions',
                'oss/uiaccesscontrol/resources/SavedSearchOthers_Public/actions',
                'oss/uiaccesscontrol/resources/SavedSearchOthers_Private/actions'
            ];
        }

        return new Promise(function(resolve, reject) {
            //Loop through the number urls, making an AJAX request for each.
            urls.forEach(function(url) {
                net.ajax({
                    url: url,
                    type: 'GET',
                    dataType: 'json'
                })
                    .then(
                        //Successful Response
                        function(data) {
                            //Using the response, push both the Resource and Actions information to the UserData array.
                            userData.push({resource: data.data.resource, actions: data.data.actions});
                            itemsProcessed++;
                            //At the final AJAX request, we collect all Actions info from userData and store it in _(this).actionsOf.
                            if (itemsProcessed === urls.length) {
                                _(this).actionsOf = userData.reduce(function(actionsOf, obj) {
                                    actionsOf[obj.resource] = obj.actions;
                                    return actionsOf;
                                }, {});
                                resolve(userData);
                            }
                        }.bind(this),
                        //Failed Response
                        function(data) {
                            itemsProcessed++;
                            //At the final AJAX request, we collect all Actions info from userData and store it in _(this).actionsOf.
                            if (itemsProcessed === urls.length) {
                                if (userData.length > 0) {
                                    _(this).actionsOf = userData.reduce(function(actionsOf, obj) {
                                        actionsOf[obj.resource] = obj.actions;
                                        return actionsOf;
                                    }, {});
                                    resolve(userData);
                                }
                                else {
                                    //if userData is empty, meaning there have been no successful responses, then we reject.
                                    reject(data);
                                }
                            }
                        }.bind(this)
                    );
            }.bind(this));
        }.bind(this));
    };

    /**
     * @param arguments - [resource1, action1], [resource2, action2]
     * @returns {boolean}
     */
    AccessControl.prototype.isAllowed = function() {
        var restrictions = Array.prototype.slice.call(arguments);

        if (_(this).actionsOf === null) {
            throw new Error('Resources needs to be fetched first in order to use isAllowed');
        }

        if (restrictions.length === 0) {
            return false;
        }

        return restrictions.every(function(restriction) {
            var resource = restriction[0];
            var action = restriction[1];
            if (!_(this).actionsOf[resource]) {
                return false;
            }

            return _(this).actionsOf[resource].some(function(act) {
                return act === action;
            });
        }.bind(this));

    };

    return AccessControl;
});
