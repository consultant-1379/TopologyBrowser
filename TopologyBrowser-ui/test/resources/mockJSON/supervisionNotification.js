if (typeof define !== 'function') {
    var define = function(callback) {
        module.exports = callback();
    };
}

define(function() {
    return function() {
        var supervisionNotificationData = [
            {
                'START_TIME': 1683546782,
                'NodeName': 'RNC01MSRBS-V2259',
                'USER_NAME': 'administrator',
                'STATUS': 'SUCCESS',
                'ACTION': 'ENABLE',
                'InventorySupervision': true,
                'PROGRESS': 100,
                'ConfigurationManagementSupervision': true,
                'PerformanceSupervision': true,
                'CURRENT_TIME': 1683546782,
                'FaultManagementSupervision': true,
                'POID': 11004
            },
            {
                'START_TIME': 1683546782,
                'NodeName': 'RNC01MSRBS-V9999',
                'USER_NAME': 'administrator',
                'STATUS': 'FAILED',
                'ACTION': 'ENABLE',
                'InventorySupervision': true,
                'PROGRESS': 100,
                'ConfigurationManagementSupervision': true,
                'PerformanceSupervision': true,
                'CURRENT_TIME': 1683546782,
                'FaultManagementSupervision': true,
                'POID': 11004
            },
            {
                'START_TIME': 1683546782,
                'NodeName': 'RNC01MSRBS-V9998',
                'USER_NAME': 'administrator',
                'STATUS': 'IN PROGRESS',
                'ACTION': 'ENABLE',
                'InventorySupervision': true,
                'PROGRESS': 75,
                'ConfigurationManagementSupervision': true,
                'PerformanceSupervision': true,
                'CURRENT_TIME': 1683546782,
                'FaultManagementSupervision': true,
                'POID': 11004
            },
            {
                'START_TIME': 1683546782,
                'NodeName': 'RNC01MSRBS-V9997',
                'USER_NAME': 'administrator',
                'STATUS': 'FAIL',
                'ACTION': 'ENABLE',
                'InventorySupervision': true,
                'PROGRESS': 0,
                'ConfigurationManagementSupervision': true,
                'PerformanceSupervision': true,
                'CURRENT_TIME': 1683546782,
                'FaultManagementSupervision': true,
                'POID': 11004
            },
            {
                'START_TIME': 1683546782,
                'NodeName': 'RNC01MSRBS-V9996',
                'USER_NAME': 'administrator',
                'STATUS': 'INTERRUPTED',
                'ACTION': 'ENABLE',
                'InventorySupervision': true,
                'PROGRESS': 80,
                'ConfigurationManagementSupervision': true,
                'PerformanceSupervision': true,
                'CURRENT_TIME': 1683546782,
                'FaultManagementSupervision': true,
                'POID': 11004
            },
            {
                'START_TIME': 1683546782,
                'NodeName': 'RNC01MSRBS-V2260',
                'USER_NAME': 'administrator',
                'STATUS': 'SUCCESS',
                'ACTION': 'ENABLE',
                'InventorySupervision': true,
                'PROGRESS': 100,
                'ConfigurationManagementSupervision': true,
                'PerformanceSupervision': true,
                'CURRENT_TIME': 1683546782,
                'FaultManagementSupervision': true,
                'POID': 11004
            },
            {
                'START_TIME': 1683546782,
                'NodeName': 'ieatnetsimv6035-12_RNC01RBS03',
                'USER_NAME': 'administrator',
                'STATUS': 'SUCCESS',
                'ACTION': 'ENABLE',
                'InventorySupervision': true,
                'PROGRESS': 100,
                'ConfigurationManagementSupervision': true,
                'PerformanceSupervision': true,
                'CURRENT_TIME': 1683546782,
                'FaultManagementSupervision': true,
                'POID': 281475029105735
            }

        ];

        return {

            getSupervisionNotifications: function() {
                return supervisionNotificationData;
            },

            removeSupervisionNotifications: function(enableNodesList, disableNodesList) {
                var nodesToRemove = enableNodesList.concat(disableNodesList);
                nodesToRemove.forEach(function(node) {
                    supervisionNotificationData = supervisionNotificationData.filter(function(notification) {
                        return notification.NodeName !== node;
                    });
                });
            }
        };
    };
});
