define([
    'jscore/core',
    'template!./RefreshDialogWidgetContent.html',
    'text!./RefreshDialogWidgetContent.scss',
    'i18n!networkobjectlib/dictionary.json',
], function(core, template, style, i18n) {

    return core.View.extend({
        getTemplate: function() {
            return template(i18n);
        },

        getStyle: function() {
            return style;
        },

        setRefreshMessage: function() {
            this.getElement().find('.elNetworkObjectLib-wRefreshDialogWidgetContent-message').setText(i18n.refreshInfo.message);
        }
    });
});
