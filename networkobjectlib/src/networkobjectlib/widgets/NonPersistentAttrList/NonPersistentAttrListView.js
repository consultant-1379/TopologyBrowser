/**
 * Created by IntelliJ IDEA.
 * User: xsantmi
 */
define([
    'jscore/core',
    'template!./NonPersistentAttrList.html',
    'styles!./NonPersistentAttrList.less',
    '../../utils/TooltipBuilder',
    'i18n!networkobjectlib/dictionary.json'
], function(core, template, style, TooltipBuilder, i18n) {

    return core.View.extend({
        getStyle: function() {
            return style;
        },
        getTemplate: function() {

            //TODO Needs to be recursive for Complex with List Attribute etc
            //We need to Stringify value because handlebar renders falsy (0, false, null etc) as empty strings
            this.options.nonPersistentAttributes = this.options.nonPersistentAttributes ? this.options.nonPersistentAttributes : [];
            this.options.itemsNew = this.options.nonPersistentAttributes.map(function(e) {

                return {
                    key: e.key,
                    datatype: e.type,
                    description: '',
                    value: function() {
                        if (e.formattedTimestamp) {
                            return e.formattedTimestamp;
                        }
                        else if (e.value === null) {
                            return 'null';
                        }
                        else if (e.value instanceof Array && e.value.length>0 && e.value[0] instanceof Object && e.value[0].key !== undefined) {
                            e.isArray = true;
                            return e.value;
                        }
                        else if (typeof e.value === 'undefined') {
                            return '';
                        }
                        else {
                            return e.value.toString();
                        }
                    }(),
                    isArray: function() {
                        return e.value instanceof Array && e.value.length > 0;
                    }(),
                    valueFixed: TooltipBuilder.fixTitleLabel(e.value)
                };
            });
            //Adding from dictionary for internationalisation.
            this.options.nonPersistentInfoMessage = i18n.nonPersistentInfoMessage;
            this.options.nonPersistentAttributesNotFound = i18n.nonPersistentAttributesNotFound;
            return template(this.options);
        },

        getFormContainer: function() {
            return this.getElement();
        },

        getAccordionContainerForKey: function(key) {
            return this.getElement().find('.elNetworkObjectLib-wNodePropertyList-accordionContainer-nonPersistent-attribute-' + key);
        },

        getNonPersistentAttrbsNotFound: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodePropertyList-accordionContainer-nonPersistent-attributesNotFound');
        },

        showNonPersistentAttrbsNotFoundMsg: function() {
            return this.getNonPersistentAttrbsNotFound().setModifier('show');
        },

        getNonPersistentErrorMessage: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodePropertyList-accordionContainer-nonPersistent-errorMessage');
        }
    });

});
