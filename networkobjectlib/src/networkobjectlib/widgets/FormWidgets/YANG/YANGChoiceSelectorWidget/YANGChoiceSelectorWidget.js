define([
    'jscore/core',
    './YANGChoiceSelectorWidgetView',
    'widgets/SelectBox'
], function(core, View, SelectBox) {
    return core.Widget.extend({

        // selected value from the database
        selectedValueSaved: null,

        selectBox: null,
        selectBoxItems: [],
        options: null,
        onChangeHandler: null,

        init: function(options, onChangeHandler) {
            this.options = options;
            this.onChangeHandler = onChangeHandler;

            this.selectBoxItems = this.parseItems(this.options.values, this.options.mandatory);
            this.selectedValueSaved = this.createItem(this.options.value, this.options.value, this.options.description, false);
        },

        view: function() {
            this.options.inputTitle = this.titleTextBuilder();
            return new View(this.options);
        },

        onViewReady: function() {
            this.baseKeyValue = this.options.key;
            this.setKeyValue(this.options.key);

            this.selectBox = this.createSelectBox();
            this.selectBox.attachTo(this.view.getDropdownContainer());
        },

        createSelectBox: function() {
            var selectBox = new SelectBox({
                value: this.selectedValueSaved,
                items: this.selectBoxItems
            });

            selectBox.addEventHandler('change', function() {
                this.handleChangedValue(selectBox.getValue().value);
            }.bind(this));

            return selectBox;
        },

        handleChangedValue: function(value) {
            if (value === this.selectedValueSaved) {
                this.view.getOuterWrapper().removeModifier('valid');
            }
            else {
                this.view.getOuterWrapper().setModifier('valid');
            }

            if (typeof this.onChangeHandler === 'function') {
                if (this.onChangeHandler)
                    { this.onChangeHandler(value); }
            }
        },

        parseItems: function(items, mandatory) {
            items = items.map(function(e) {
                return this.createItem(e.key, e.key, e.description, e.hasPrimaryType);
            }.bind(this));
            if (!mandatory) {
                items.unshift(this.createItem('', null, '', false));
            }

            return items;
        },

        createItem: function(name, value, title, disabled) {
            return {
                name: name,
                value: value,
                title: title,
                disabled: disabled
            };
        },

        titleTextBuilder: function() {
            return 'Type: CASE  ' +
                (this.options.hasOwnProperty('defaultValue') && this.options.defaultValue !== null?', Default: ' + this.options.defaultValue: '');
        },

        setIndex: function(index) {
            this.setKeyValue(this.baseKeyValue + index);
            this.updateDisplayWIthKeyValue(index);
        },

        updateDisplayWIthKeyValue: function(text) {
            this.view.getKeyValue().setText(text);
        },

        setKeyValue: function(keyValue) {
            this.keyValue = keyValue;
        },

        getKeyValue: function() {
            return this.keyValue;
        }
    });

});



