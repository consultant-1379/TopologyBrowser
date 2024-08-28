define([
    'jscore/core',
    '../../../widgets/modelInfoDisplay/ModelInfoDialog'
], function(core, ModelInfoDialog) {
    return core.Widget.extend({

        setValid: function(bool) {
            this.valid = bool;
            return this;
        },

        isValid: function() {
            return this.valid;
        },

        hideError: function() {

        },

        createModelInfoButton: function() {
            var modelInfo = new core.Element();
            var infoIcon = new core.Element('i');
            infoIcon.setAttribute('class', 'ebIcon ebIcon_info');
            modelInfo.append(infoIcon);
            modelInfo.addEventHandler('click', this.displayModelInfo.bind(this));
            this.view.getModelInfoButton().append(modelInfo);
        },

        displayModelInfo: function() {
            this.modelInfoDialog = new ModelInfoDialog({
                attribute: this.options,
                moType: this.options.moType,
                namespace: this.options.namespace,
                namespaceVersion: this.options.namespaceVersion
            });
            this.modelInfoDialog.display();
        }

    });

});
