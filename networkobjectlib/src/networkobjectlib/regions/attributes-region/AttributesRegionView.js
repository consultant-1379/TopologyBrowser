define([
    'jscore/core',
    'text!./_attributesRegion.html',
    'styles!./_attributesRegion.less',
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        getSelectedHolder: function() {
            return this.getElement().find('.elNetworkObjectLib-attributesRegion-selectedNodeNameHolder');
        },

        getSelectedNameHolder: function() {
            return this.getElement().find('.elNetworkObjectLib-attributesRegion-selectedNodeNameHolder-name');
        },

        getSelectedTypeHolder: function() {
            return this.getElement().find('.elNetworkObjectLib-attributesRegion-selectedNodeNameHolder-type');
        },

        getTabs: function() {
            return this.getElement().find('.elNetworkObjectLib-attributesRegion-tabs');
        },

        getFDNPathDiv: function() {
            return this.getElement().find('.elNetworkObjectLib-attributesRegion-fdn');
        },

        getHeaderFDN: function() {
            return this.getElement().find('.elNetworkObjectLib-attributesRegion-fdn-header');
        },

        getContentFDN: function() {
            return this.getElement().find('.elNetworkObjectLib-attributesRegion-fdn-content');
        },

        updateFDN: function(fdn) {
            var fdnPathDiv = this.getFDNPathDiv();
            if (fdn.length > 0) {
                fdnPathDiv.setStyle('display', 'block');
                this.getHeaderFDN().setText('FDN');
            } else {
                fdnPathDiv.setStyle('display', 'none');
                this.getHeaderFDN().setText('');
            }
            this.getContentFDN().setText(fdn);
        },

        updateSelectedName: function(name) {
            this.getSelectedNameHolder().getNative().innerHTML = name !== '' ? name : '&nbsp;';
        },

        updateSelectedType: function(type) {
            this.getSelectedTypeHolder().getNative().innerHTML = type !== '' ? type : '&nbsp;';
        },

        showSelectedHolder: function(show) {
            if (show) {
                this.getSelectedHolder().removeStyle('display');
            } else {
                this.getSelectedHolder().setStyle('display', 'none');
            }
        },

    });
});
