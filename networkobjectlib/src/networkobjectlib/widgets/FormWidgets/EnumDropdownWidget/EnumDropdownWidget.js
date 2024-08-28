define([
    'jscore/core',
    './EnumDropdownWidgetView',
    'widgets/SelectBox',
    'i18n!networkobjectlib/dictionary.json',
    '../AbstractWidget/AbstractWidget',
    '../NullButtonWidget/NullButtonWidget',
    '../../../utils/TopologyUtility'
], function(core, View, SelectBox, strings, AbstractWidget, NullButton, Utility) {
    return AbstractWidget.extend({

        init: function(options) {
            this.options = options;
            this.mandatory = (!!options.constraints && !options.constraints.nullable) || !!options.defaultValue;
            this.nullOption = {
                name: strings.selectBoxEmptyValueMessage,
                value: null,
                title: strings.selectBoxEmptyValueMessage
            };
        },

        view: function() {
            return new View(this.options);
        },

        onViewReady: function() {
            this.baseKeyValue = this.options.key;
            this.setKeyValue(this.options.key);
            if (this.options.keySectionDisabled) {
                this.view.getKeyValue().setModifier('hidden');
            }
            var dropdown = this.createDropdown();
            dropdown.attachTo(this.view.getDropdownContainer());
            this.widget = dropdown;

            // if its a new item, then show purple bar
            if (this.options.newItem === true) {
                this.view.getOuterWrapper().setModifier('valid');
            }

            //if (!this.mandatory) {
            //    var nullButton = this.createNullButton(dropdown);
            //    nullButton.attachTo(this.view.getDropdownContainer());
            //}

            if (this.options.description !== null) {
                this.createModelInfoButton();
            }
        },

        getWidget: function() {
            return this.widget;
        },

        createDropdown: function() {
            var selectBoxOptions = {}, dropDownData = {};
            if (this.options.isMultiEdit) {
                selectBoxOptions.placeholder = strings.get('selectBoxEmptyValueMessage');
                //For Multi-Edit Flow, Boolean type widget is drawn as drop down with items TRUE and FALSE.
                if (this.options.type === 'BOOLEAN') {
                    selectBoxOptions.items = [{
                        name: strings.get('labelsForBoolean.false'),
                        value: false,
                        title: strings.get('labelsForBoolean.false')
                    }, {
                        name: strings.get('labelsForBoolean.true'),
                        value: true,
                        title: strings.get('labelsForBoolean.true')
                    }];
                } else {
                    dropDownData = this.getDropDownOptions();
                    selectBoxOptions.items = dropDownData.items;
                }
            } else {
                dropDownData = this.getDropDownOptions();
                selectBoxOptions.items = dropDownData.items;
                selectBoxOptions.value = dropDownData.value;
            }
            /*
            * Drop down is created with a placeholder for Multi-Edit flow, with no default value selected.
            */
            var dropdown = new SelectBox(selectBoxOptions);

            dropdown.addEventHandler('change', function() {
                var value = dropdown.getValue() ? dropdown.getValue().value: null;
                this.handleChangedValue(value);
            }.bind(this));

            return dropdown;
        },

        getDropDownOptions: function() {
            var items = this.options.enumeration.enumMembers.map(function(e) {
                if (e.separator) {
                    return {
                        type: 'separator'
                    };
                } else {
                    var key = Utility.extractEnumMember(e.key);
                    var description = Utility.getDescriptionWithNamespace(e);
                    return {
                        name: key,
                        value: e.value,
                        title: description
                    };
                }
            });

            items.sort(function(a, b) {
                if (a.name && b.name) {
                    return a.name.localeCompare(b.name, undefined, {
                        numeric: true
                    });
                }
            });

            var value = items.filter(function(item) {
                return typeof item.value !== 'undefined' && item.value === this.options.origValue;
            }.bind(this))[0];

            if (!this.mandatory) {
                items.unshift(this.nullOption);
                if (this.options.value === null || typeof this.options.value === 'undefined' || value === null || typeof value === 'undefined') {
                    value = this.nullOption;
                }
            } else {
                if (value === null || typeof value === 'undefined') {
                    value = items[0];
                }
            }

            return {
                items: items,
                value: value
            };
        },

        handleChangedValue: function(value) {
            // if is new item, it should be always marked as changed
            if (this.options.newItem || value !== this.options.value || this.options.isMultiEdit) {
                this.view.getOuterWrapper().setModifier('valid');
            }
            else {
                this.view.getOuterWrapper().removeModifier('valid');
            }

            this.setValid(true);

            //Add to Collection
            this.options.onChangeCallback({
                'key': this.getKeyValue(),
                'value': value,
                'datatype': this.options.type
            });
        },

        createNullButton: function(dropdown) {
            return new NullButton({
                onClick: function() {
                    dropdown.setValue(this.nullOption);
                    // this is required because changing value programmatically does not trigger 'change' event
                    this.handleChangedValue(this.nullOption.value);
                }.bind(this)
            });
        },

        showError: function(errorMessage) {
            this.view.showError(errorMessage);
        },

        hideError: function() {
            this.view.hideError();
        },

        doInvalid: function(key, value, type, message) {
            this.showError(message);
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



