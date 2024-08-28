define([
    'widgets/WidgetCore',
    './FDNPathView'
], function(WidgetCore, View) {

    return WidgetCore.extend({

        init: function() {
            this.previousText = '';
            this.text = '';
        },

        view: function() {
            return new View();
        },

        // trigger to request FDN
        callFDN: function() {
            var text = this.view.getInput().getValue();
            if (text.length > 0) {
                this.trigger('FDNTokenClicked', {fdn: text});
                this.setText(text);
            }
        },

        setText: function(text) {
            text = text || '';
            this.previousText = this.text;
            this.text = text;

            this.view.getInput().setValue(text);
            this.view.getInput().setAttribute('title', text);
        },

        getText: function() {
            return this.view.getInput().getValue();
        },

        clearFDN: function() {
            this.view.getInput().setValue('');
        }
    });

});
