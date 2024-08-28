/**
 * Created by IntelliJ IDEA.
 * User: xsantmi
 */
define([
    'jscore/core',
    'template!./NodePropertyList.html',
    'styles!./NodePropertyList.less',
    '../../utils/TooltipBuilder',
    '../../utils/TopologyUtility'
], function(core, template, style, TooltipBuilder, Utility) {

    return core.View.extend({

        optionsNew: null,

        getTemplate: function() {

            //TODO Needs to be recursive for Complex with List Attribute etc
            //We need to Stringify value because handlebar renders falsy (0, false, null etc) as empty strings
            this.options.itemsNew = this.options.attributes.map(function(e) {

                return {
                    key: e.key,
                    datatype: e.type,
                    value: function() {
                        if (e.formattedTimestamp) {
                            return e.formattedTimestamp;
                        }
                        else if (e.value === null) {
                            return 'null';
                        }
                        else if (e.cases instanceof Array && e.cases.length>0 && e.cases[0].name !== undefined) {
                            e.isArray = true;
                            return e.choices;
                        }
                        else if (e.value instanceof Array && e.value.length>0 && e.value[0].key !== undefined) {
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
                        if (e.value instanceof Array && e.value.length>0) {
                            return true;
                        }
                        else if (e.cases instanceof Array && e.cases.length>0) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }(),
                    valueFixed: function() {
                        var formattedDesc =  Utility.getEnumMemberDescription(e,e,true);
                        return TooltipBuilder.fixTitleLabel(formattedDesc);
                    }
                };
            });
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getAccordionContainerForKey: function(key) {
            return this.getElement().find('.elNetworkObjectLib-wNodePropertyList-accordionContainer-'+ key);
        },

        getAccordionNonPersistentContainer: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodePropertyList-accordionContainer-nonPersistent');
        },

        getPropertyListContainer: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodePropertyList-message-container');
        }
    });

});
