define([
    'actionlibrary/ActionLibrary',
    'jscore/core',
    'i18n!topologybrowser/actions.json'
], function(ActionLibrary, core, _strings) {
    'use strict';
    /**
     * LocateInTopology
     * ===
     * id: topologybrowser-locate-in-topology
     *
     * This action launches the Topology Browser UI and locates an object in the network topology
     *
     * Expected parameters:
     * # Array of data
     *
     * Expected contents
     * * If not empty, the first item must be a valid string representing a persistent object id
     */
    return ActionLibrary.Action.extend({
        run: function(callbackObject, data) {
            // Create new lifecycle
            var lifecycle = new ActionLibrary.ActionLifecycle(callbackObject);
            // Notify calling app that Action is starting
            lifecycle.onReady({
                message: _strings.launchingApp
            });
            // Defer execution
            new Promise(function(resolve) {
                // on next redraw
                requestAnimationFrame(function() {
                    var poIdString = '';
                    if (data && data.length && data[0]) {
                        if (data[0].id) {
                            poIdString = '?poid=' + data[0].id;
                        } else if (data[0].poid) {
                            poIdString = '?poid=' + data[0].poid;
                        } else if (data[0].poId) {
                            poIdString = '?poid=' + data[0].poId;
                        }
                    }
                    var href = '#topologybrowser' + poIdString;
                    // acknowledge the calling App before completing
                    setTimeout(function() {
                        core.Window.open(href, '_blank');
                    }, 100);
                    resolve();
                });
            }).then(function() {
                // Finish successfully
                var actionResult = new ActionLibrary.ActionResult({
                    success: true
                });
                lifecycle.onComplete(actionResult);
            }).catch(function() {
                // Catch all errors
                var actionResult = new ActionLibrary.ActionResult({
                    success: false,
                    message: _strings.error
                });
                lifecycle.onFail(actionResult);
            });
            // Return lifecycle immediately
            return lifecycle;
        }
    });
});
