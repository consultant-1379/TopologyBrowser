define([
    'jscore/core',
    './ReadOnlyView',
    'i18n!networkobjectlib/dictionary.json'
], function(core, View, i18n) {
    return core.Widget.extend({

        view: function() {
            var options = {
                key: i18n.get(this.options.key),
                value: this.options.value,
                collections: this.options.collections
            };
            return new View(options);
        },

        onViewReady: function() {
            if (this.options.key === 'Collections'|| this.options.key === 'Collection') {
                this.view.getValue().setStyle('display','none');
                this.view.getCollectionValue().setStyle('display','block');
            }
            if (this.options.key === 'CM syncStatus' || this.options.key === 'managementState') {
                switch (this.options.value) {
                case 'MAINTENANCE':
                    addIcon.call(this, ['elNetworkObjectLib-readOnly-icon-managementState', 'ebIcon', 'ebIcon_maintenanceMode'], i18n.get('nodeMaintenanceMsg'));
                    break;
                case 'UNSYNCHRONIZED':
                    addIcon.call(this, ['elNetworkObjectLib-readOnly-icon-syncStatus', 'ebIcon', 'ebIcon_syncError'], i18n.get('unsynchronized'));
                    break;
                case 'NOT_SUPPORTED':
                    addIcon.call(this, ['elNetworkObjectLib-readOnly-icon-syncStatus', 'ebIcon', 'ebIcon_sync_notSupported'], i18n.get('notsupported'));
                    break;
                case 'DELTA':
                case 'PENDING':
                case 'TOPOLOGY':
                case 'ATTRIBUTE':
                    addIcon.call(this, ['elNetworkObjectLib-readOnly-icon-syncStatus', 'ebIcon', 'ebIcon_syncing_animated'], i18n.get('synchronizing'));
                    break;
                default:
                    break;
                }
            }
        }
    });

    function addIcon(classList, tooltipLabel) {
        var valueEl = this.view.getValue();

        var el = new core.Element('i');
        classList.forEach(function(className) {
            el.getNative().classList.add(className);
        });
        el.setAttribute('title', tooltipLabel);
        valueEl.append(el);
    }
});
