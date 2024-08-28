define([
    'jscore/core',
    'template!./CounterBox.html',
    'styles!./CounterBox.less'
], function(core, template, style) {
    return core.View.extend({
        getTemplate: function() {
            return template(this.options);
        },
        getStyle: function() {
            return style;
        },
        getTitle: function() {
            return this.getElement().find('.elNetworkObjectLib-wCounterBox-title');
        },
        setValue: function(value) {
            this.getElement().find('.elNetworkObjectLib-wCounterBox-value').setText(value);
        }
    });
});
