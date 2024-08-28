define([
    'jscore/core',
    './YANGChoiceCasesWidgetView',
    '../YANGChoiceSelectorWidget/YANGChoiceSelectorWidget',
    '../CaseDetailsForm/CaseDetailsForm',
    '../../LabelWidget/LabelWidget',
    'i18n!networkobjectlib/dictionary.json'
], function(core, View, YANGChoiceSelector, CaseDetailsForm, LabelWidget, i18n) {
    return core.Widget.extend({

        init: function(options) {
            this.options = options;
            this.caseForms = [];
        },

        view: function() {
            return new View(this.options);
        },

        onViewReady: function() {
            this.baseKeyValue = this.options.key;
            this.setKeyValue(this.options.key);

            this.valuesMap = {};

            this.options.cases.filter(function(caseObject) {
                return !caseObject.hasPrimaryType;
            }).forEach(function(caseObject) {
                var caseLabel = new LabelWidget({
                    text: caseObject.name
                });
                caseLabel.view.getElement().setModifier('caseLabel');
                caseLabel.attachTo(this.view.getCaseContainerByName(caseObject.name));

                var caseForm = this.createNodeDetailsForm(caseObject);
                caseForm.attachTo(this.view.getCaseContainerByName(caseObject.name));
                this.caseForms.push(caseForm);
                this.valuesMap[caseObject.name] = [];
            }.bind(this));
        },

        createNodeDetailsForm: function(caseObject) {
            return new CaseDetailsForm(caseObject.attributes, this.options.expanded, this.options.widgetsProducer, caseObject.name, this.onCasePanelAttributeChange.bind(this));
        },

        onCasePanelAttributeChange: function(caseName, values) {
            this.valuesMap[caseName] = JSON.parse(JSON.stringify(values));

            var changedCases = [];
            Object.keys(this.valuesMap).forEach(function(key) {
                if (this.valuesMap[key].length > 0) {
                    changedCases.push(key);
                }
            }.bind(this));

            // iterate through widgets on all cases
            this.caseForms.forEach(function(form) {
                form.formElements.forEach(function(widget) {
                    // check if value from this widget was changed
                    var valueChanged = this.valuesMap[form.caseName].filter(function(e) {
                        return e.key === widget.options.key;
                    }).length > 0;

                    // if there is attributes changed in different cases
                    if (changedCases.length > 1) {
                        // if this value was changed
                        if (valueChanged) {
                            widget.showError(i18n.YANG.errors.conflict);
                            widget.view.getOuterWrapper().removeModifier('valid');
                        }
                    }
                    else {
                        // hide error from other cases
                        if (form.caseName !== changedCases[0]) {
                            // if this widget is valid
                            if (widget.isValid()) {
                                widget.hideError();
                            }
                        }
                        else {
                            // if this value was changed
                            if (valueChanged) {
                                widget.hideError();
                                widget.view.getOuterWrapper().setModifier('valid');
                            }
                        }
                    }
                }.bind(this));

                // if there is attributes changed in different cases
                if (changedCases.length > 1) {
                    this.view.showConflictError(i18n.YANG.errors.editConflict.replace('$1', this.baseKeyValue));
                    // invalid all changed values
                    this.handleInvalid(form.caseName, this.valuesMap[form.caseName]);
                }
                else {
                    this.view.hideConflictError();
                    // valid all changed values
                    this.handleChangedValue(form.caseName, this.valuesMap[form.caseName]);
                }
            }.bind(this));

            if (changedCases.length === 1) {
                // lastly handle changed value of the unique changed case
                this.handleChangedValue(changedCases[0], this.valuesMap[changedCases[0]]);
            }
        },

        handleChangedValue: function(caseName, value) {
            if (typeof this.options.onChangeCallback === 'function') {
                //Add to Collection
                this.options.onChangeCallback({
                    'key': this.options.key,
                    'value': value,
                    'dataType': this.options.type,
                    'case': caseName,

                });
            }
        },

        handleInvalid: function(caseName, value) {
            this.options.onInvalidCallback({
                'key': this.options.key,
                'value': value,
                'datatype': this.options.type,
                'case': caseName,
            });
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



