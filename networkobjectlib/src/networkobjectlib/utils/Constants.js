define([], function() {
    return {
        NO_CHILDREN_POID_PREFIX: '-9',
        ALL_OTHER_NODES_POID: '-2',
        SEARCH_INPUT_REGEX: /^\\*?[a-zA-Z0-9-_.*]+\\*?$/,
        CustomEvent: {
            CUSTOM_TOPOLOGY_START: 'customTopology:start',
            NODE_SELECT: 'topologyTree:node:select',
            NODE_OBJECT_SELECT: 'topologyTree:object:select',
            FETCH_ROOT_ERROR: 'topologyTree:fetch:root:error',
            SELECT: 'topologyTree:select',
            EXPAND_TOPOLOGY: 'topologyTree:customtopology:exapnd',
            ACTION_SUCCESSFUL: 'topologybrowser:action-successful',
            RELOAD_ACTION_BAR: 'topologybrowser:reload-action-bar',
            RELOAD_ACTIONS: 'topologybrowser:reload-actions',
            SHOW_REFRESH_NOTIFICATION: 'topologybrowser:showRefreshNotification',
            REFRESH: 'topologyTree:refresh',
            FETCH_SUBTREE_ERROR_CLOSED: 'topologyTree:fetch:subtree:error:closed',
            FETCH_CHILDREN_ERROR_CLOSED: 'topologyTree:fetch:children:error:closed',
            LOAD: 'topologyTree:load',
            LOADER_SHOW: 'topologyTree:loader:show',
            LOADER_HIDE: 'topologyTree:loader:hide',
            SYNC: 'topologyTree:sync',
            START: 'topologyTree:start',
            SHOW_CONTEXT_MENU: 'topologyTree:contextMenu:show',
            ACTION_FAILED: 'topologybrowser:action-failed',
            LOAD_COLLECTION_DETAILS: 'attributesRegion:loadCollection',
            REFRESH_COMPLETE: 'topologyTree:refreshComplete',
            APPLY_RECURSIVELY: 'applyRecursively:checked'
        },
        Event: {
            CONTEXT_MENU_HIDE: 'contextmenu:hide'
        },
        defaultTopologies: {
            NETWORK_DATA: 'networkData'
        },
        RESIZE: 'resize',
        MOUSE_DOWN: 'mousedown',
        HASH_CHANGE: 'hashchange',
        TOPOLOGY_URL: 'topologybrowser?topology=',
        POID_URL: 'topologybrowser?poid=',
        NETWORK_DATA: 'networkData',
        NETWORK_DATA_VIEW: 'Network Data',
        TOPOLOGY: 'topology',
        TOPOLOGY_BROWSER: 'topologybrowser',
        NETWORK_ELEMENT: 'NetworkElement',
        MANAGEMENT_SYSTEM: 'ManagementSystem',
        VIRTUAL_NETWORK_FUNCTION_MANAGER: 'VirtualNetworkFunctionManager',
        VIRTUAL_INFRASTRUCTURE_MANAGER: 'VirtualInfrastructureManager',
        NODE: 'Node',
        TREE: 'tree'
    };
});
