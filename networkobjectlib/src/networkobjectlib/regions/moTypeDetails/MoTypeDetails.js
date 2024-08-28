/*global define, Array */
define([
    'jscore/core',
    'jscore/ext/net',
    './MoTypeDetailsView',
    'i18n!networkobjectlib/dictionary.json',
    './Rest',
    '../../widgets/NodePropertyList/NodePropertyList',
    '../../widgets/NodeDetailsForm/NodeDetailsForm',
    '../../widgets/NonPersistentAttrForm/NonPersistentAttrForm',
    '../../widgets/NonPersistentAttrList/NonPersistentAttrList',
    '../../widgets/FormWidgets/Filter/Filter',
    '../../widgets/FormWidgets/LoadingAnimationWidget/LoadingAnimationWidget',
    'widgets/Dialog',
    'widgets/InlineMessage',
    'networkobjectlib/WidgetsProducer',
    '../../utils/AccessControl',
    '../../utils/Filters',
    '../../utils/TopologyUtility',
    'networkobjectlib/DataBuilder',
    '../../utils/customError',
], function(core, net, View,i18n, Rest, NodePropertyList, NodeDetailsForm, NonPersistentAttrForm, NonPersistentAttrList,Filter, LoadingAnimationWidget, Dialog, InlineMessage, NodeProducer, AccessControl, Filters, Utility, DataBuilder, customError) {

    /**
     * @class MoTypeDetails
     * @extends Region
     * @private
     */
    var CustomEvent = {
        SAVE_START: 'attributesRegion:save:start',
        SAVE_SUCCESS: 'attributesRegion:save:success',
        SAVE_ERROR: 'attributesRegion:save:error',
        SAVE_ERROR_CLOSED: 'attributesRegion:save:error:closed',
        FETCH_PERSISTENT_SUCCESS: 'attributesRegion:fetch:persistent:success',
        FETCH_PERSISTENT_ERROR: 'attributesRegion:fetch:persistent:error',
        FETCH_MODEL_SUCCESS: 'attributesRegion:fetch:model:success',
        FETCH_MODEL_ERROR: 'attributesRegion:fetch:model:error'
    };


    return core.Region.extend({

        View: View,
        nodePropertyList: null,
        selectedNodeProperties: null,
        filter: null,
        allAttributes: null,
        editMode: false,
        loadNodePropertyList: true,
        nonPersistentExpanded: false,
        nonPersistentAttributesReceived: false,
        rootNetworkPoId: '0',
        allSubnetworksNetworkPoId: '-2',
        lastPoId: null,
        includeAllAttributes: false,
        nonPersistentErrorMessage: null,
        persistentErrorMessage: null,
        expansionList: {},

        init: function() {
            this.errorMessage = null;
        },

        /*
         @desc entry point method
         */
        onStart: function() {
            this.widgetsProducer = new NodeProducer();
        },

        onViewReady: function() {
            this.addFilter();

            if (this.view.getControlPanel() && this.view.getControlPanel().setStyle) {
                this.view.getControlPanel().setStyle('display', 'none');
            }

            this.clearAttributesPanel();

            this.view.getEditPropertiesButton().addEventHandler('click', this.onEditProperties.bind(this));
            AccessControl.prototype.getResources('persistentObjectService').then(function(resources) {
                if (resources[0].actions.indexOf('update') === -1) {
                    this.view.getEditPropertiesButton().remove();
                }
            }.bind(this));
        },

        /**
         * Show message in attributes panel
         *
         * @method showMessageArea
         * @param {String} title
         * @param {String} message
         */
        showMessageArea: function(obj, icon) {
            obj = obj || {};
            icon = icon || 'infoMsgIndicator';

            if (this.errorMessage) {
                this.errorMessage.destroy();
            }

            this.errorMessage = new InlineMessage({
                header: obj.title,
                description: obj.message,
                icon: icon
            });

            this.errorMessage.attachTo(this.view.getSelectedNodePropertiesMessageArea());

            this.toggleContentArea(false);
            this.toggleMessageArea(true);
        },

        /*
         @desc calls a method on the view to show the Filter on Selected node properties pop out panel
         */
        addFilter: function() {
            this.filter = new Filter();
            this.filter.attachTo(this.view.getFilterContainer());
            this.filter.addKeyEnterFunction(this.filterAttributes.bind(this));
            this.filter.addClearFilterFunction(this.clearFilter.bind(this));
        },

        clearFilter: function() {
            this.filterAttributes('');
        },

        clearAttributesPanel: function() {
            this.showMessageArea({
                title: i18n.defaultNetworkMessageTitle,
                message: i18n.defaultNetworkMessageText
            });
        },

        requestTimedout: function() {
            var nodePropertyView = this.nodePropertyList ? this.nodePropertyList : this.formWidget;
            nodePropertyView.setNonPersistentContent(new InlineMessage({
                header: i18n.errors.timeout.title,
                description: i18n.errors.timeout.body,
                icon: 'error'
            }));
        },

        /*
         @desc sending the rest request for mo attributes
         */
        requestMoAttributes: function(poId, includeAllAttributes, nodeClicked) {
            this.includeAllAttributes = includeAllAttributes;
            this.expansionList = {};
            if (this.expansionListBackup) {
                this.expansionList = this.expansionListBackup;
                this.expansionListBackup = undefined;
            }
            if (this.lastPoId && this.lastPoId !== poId) {
                this.nonPersistentExpanded = false;
            }
            this.lastPoId = poId;
            if (typeof poId === 'undefined'  || poId === null || poId === this.allSubnetworksNetworkPoId) {
                this.clearAttributesPanel();
            } else {
                this.toggleMessageArea(false);
                Rest.getAttributes(poId, includeAllAttributes)
                    .then(function(response) {
                        if (!includeAllAttributes) {
                            this.getEventBus().publish(CustomEvent.FETCH_PERSISTENT_SUCCESS, response);
                        }
                        this.moAttributeDataReceived(nodeClicked, response.data);
                    }.bind(this), function(error) {
                        if (error instanceof customError.Timeout) {
                            this.requestTimedout();
                        } else {
                            if (!includeAllAttributes) {
                                this.getEventBus().publish(CustomEvent.FETCH_PERSISTENT_ERROR, error);
                            }
                            this.createErrorContent(error.message, includeAllAttributes, error);
                        }
                    }.bind(this));
            }
        },

        createErrorContent: function(message, includeAllAttributes, error) {
            this.loadNodePropertyList = false;

            if (includeAllAttributes) {
                this.createNonPersistentAttrWidget(message, error);
            }
        },

        /*
         @desc handle the success server response
         */
        moAttributeDataReceived: function(status, data) {
            this.loadNodePropertyList = status;
            this.nonPersistentExpanded = status ? false : this.nonPersistentExpanded;
            this.nonPersistentAttributesReceived = false;
            this.editMode = status ? false : this.editMode;
            this.sortNodeProperties(data);
            this.selectedNodeProperties = data;
            this.requestAttributeDefintions(data.neType, data.neVersion, data.namespace, data.type, data.namespaceVersion);
        },

        requestAttributeDefintions: function(neType, neVersion, namespace, type, version) {
            return Rest.getModelInfo(neType, neVersion, namespace, type, version, this.nonPersistentExpanded)
                .then(function(response) {
                    this.onAttributeDefinitionsReceived(response.data);
                    this.getEventBus().publish(CustomEvent.FETCH_MODEL_SUCCESS, response);
                }.bind(this), function(error) {
                    this.setAttributesPanelMessage(error.message, this.includeAllAttributes);
                    this.toggleContentArea(true);
                    this.toggleMessageArea(false);
                    this.getEventBus().publish(CustomEvent.FETCH_MODEL_ERROR, error);
                }.bind(this));
        },

        setAttributesPanelMessage: function(message, includeAllAttributes) {
            this.loadNodePropertyList = false;

            if (includeAllAttributes) {
                this.createNonPersistentAttrWidget(message);
            } else {
                var nodePropertyDetails = {
                    type: this.selectedNodeProperties.type,
                    name: this.selectedNodeProperties.name,
                    attributes: []
                };
                this.createNodePropertyList(nodePropertyDetails, message);
            }

            this.selectedNodeProperties.attributes = [];
            if (!includeAllAttributes) {
                this.filter.resetFilter();
                this.filterAttributes('');
            }
        },

        onAttributeDefinitionsReceived: function(data) {
            this.nonPersistentErrorMessage = null;
            this.persistentErrorMessage = null;

            if (!this.nonPersistentExpanded) {
                this.toggleContentArea(true);
                this.toggleMessageArea(false);
            }

            var attributes = this.mapReponseToValues(data, this.getSelectedNodeItems());
            var choices = data.choices ? this.createChoices(attributes, data.choices) : [];
            var nodeAttributeValuesAndDefinitions = this.removeChoiceAttributesAndAddChoice(attributes, choices);

            //Split persistent and non persistent attributes
            this.allAttributes = this.splitPersistentNonPersistentAttributes(nodeAttributeValuesAndDefinitions);
            this.selectedNodeProperties.nonPersistentAttributes = this.allAttributes.nonPersistentAttributes;
            this.selectedNodeProperties.attributes = this.allAttributes.persistentAttributes;

            // update nodeDetailsForm with nonPersistentAttributes
            if (this.formWidget) {
                this.formWidget.nonPersistentAttributes = this.selectedNodeProperties.nonPersistentAttributes;
            }

            this.createNonPersistentAttrWidget(this.persistentErrorMessage);

            if (!this.nonPersistentExpanded) {
                this.filter.resetFilter();
            } else if (this.getFilterText() !== '') {
                this.filterAttributes(this.getFilterText());
            }
        },

        createChoices: function(attributes, choicesResponse) {
            var choices = {};

            choicesResponse.forEach(function(choiceTmp) {
                var choice = this.createChoiceObject(choiceTmp);
                choices[choice.key] = choice;

                choiceTmp.cases.forEach(function(caseTmp, i) {
                    var case1 = this.createCaseObject(caseTmp);
                    choice.cases.push(case1);

                    case1.attributes = attributes.filter(function(e) {
                        if (e.activeChoiceCase && e.activeChoiceCase.caseName === case1.name) {
                            if (e.value !== null) {
                                choice.value = case1.name;
                                choice.selectedIndex = i;
                            }
                            return true;
                        }

                        return false;
                    });
                }.bind(this));
            }.bind(this));

            return choices;
        },

        createChoiceObject: function(c) {
            return {
                key: c.name,
                type: 'CHOICE',
                defaultValue: null,
                value: null,
                selectedIndex: null,
                mandatory: c.mandatory,
                expanded: false,
                cases: []
            };
        },

        createCaseObject: function(c) {
            return {
                name: c.name,
                attributes: [],
                hasPrimaryType: c.hasPrimaryType,
                description: c.description
            };
        },

        /*
         * @desc remove attributes based on choice, and add the choice object to the list
         */
        removeChoiceAttributesAndAddChoice: function(attributes, choices) {
            var choicesIndexToAdd = {};
            var numRemoved = 0;

            // remove attributes based on choice and save index to add choices later
            attributes = attributes.filter(function(e, i) {
                if (e.activeChoiceCase) {
                    if (!(e.activeChoiceCase.choiceName in choicesIndexToAdd)) {
                        choicesIndexToAdd[e.activeChoiceCase.choiceName] = (i - numRemoved);
                    }
                    numRemoved += 1;
                }
                return !e.activeChoiceCase;
            });

            // add choices to array
            Object.keys(choicesIndexToAdd).forEach(function(key) {
                attributes.splice(choicesIndexToAdd[key], 0, choices[key]);
            });

            return attributes;
        },

        splitPersistentNonPersistentAttributes: function(nodeAttributeValuesAndDefinitions) {
            var persistentAttributes = [];
            var nonPersistentAttributes = [];
            var attributeObject = {
                persistentAttributes: persistentAttributes,
                nonPersistentAttributes: nonPersistentAttributes
            };

            nodeAttributeValuesAndDefinitions.forEach(function(e) {
                if (e.isNonPersistent) {
                    nonPersistentAttributes.push(e);
                }  else {
                    persistentAttributes.push(e);
                }
            }.bind(this));

            return attributeObject;
        },

        updateAttributesRegion: function(selectedNodePropertiesJSON, persistentErrorMessage) {
            this.createNodePropertyList(selectedNodePropertiesJSON, persistentErrorMessage);
        },

        createNodePropertyList: function(nodePropertyList, message) {
            /* loads Node Property List*/
            if (this.nodePropertyList) {
                this.nodePropertyList.destroy();
                this.nodePropertyList =null;
            }
            if (this.formWidget) {
                this.formWidget.destroy();
                this.formWidget = null;
            }

            this.persistentErrorMessage = message;

            this.nodePropertyList = new NodePropertyList(nodePropertyList, this.nonPersistentExpanded, this.viewNonPersistentAttributes.bind(this), this.getFilterText(), this.persistentErrorMessage, this.expansionList, this.widgetsProducer);
            this.nodePropertyList.attachTo(this.view.getSelectedNodePropertiesContentDiv());

            /*Enable edit properties button in case it was disabled before*/
            this.view.getControlPanel().setStyle('display', 'none');
            this.view.getEditPropertiesButtonHolder().setStyle('display', 'block');
        },

        createNonPersistentAttrWidget: function(message, error) {
            if (this.editMode) {
                if (this.formWidget===undefined || this.formWidget===null) {
                    this.createNodeDetailsForm(message);
                } else {
                    this.createNonPersistentAttrForm(message);
                }
            } else {
                if (this.nodePropertyList===undefined || this.nodePropertyList===null || this.loadNodePropertyList) {
                    this.updateAttributesRegion(this.selectedNodeProperties, this.persistentErrorMessage);
                } else {
                    this.createNonPersistentAttrList(this.selectedNodeProperties, message, error);
                }
            }
        },


        createNonPersistentAttrList: function(nodePropertyList, errorMessage, error) {
            this.nonPersistentErrorMessage = errorMessage;
            this.nonPersistentAttributesReceived = true;
            this.nonPersistentAttrList = new NonPersistentAttrList(nodePropertyList, this.getFilterText(), this.nonPersistentErrorMessage, this.expansionList, this.widgetsProducer, error);
            this.nodePropertyList.setNonPersistentContent(this.nonPersistentAttrList);
        },

        createNodeDetailsForm: function(message) {
            if (this.nodePropertyList) {
                this.nodePropertyList.destroy();
                this.nodePropertyList = null;
            }
            if (this.formWidget) {
                this.formWidget.destroy();
                this.formWidget = null;
            }

            this.persistentErrorMessage = message;
            this.formWidget = new NodeDetailsForm({
                saveButton: this.view.getSaveButton(),
                cancelButton: this.view.getCancelButton(),
                attributeValuesNotSaved: this.view.getAttributeValuesNotSaved()
            }, this.selectedNodeProperties.attributes, this.getFilterText(), this.viewNonPersistentAttributes.bind(this), this.nonPersistentExpanded, this.persistentErrorMessage, this.expansionList, this.widgetsProducer, this.selectedNodeProperties.nonPersistentAttributes);
            //TODO Same For on Save
            this.formWidget.attachOnCancelCallback(this.formClickCancelHandler.bind(this));
            this.formWidget.attachOnSaveCallback(this.formClickSaveHandler.bind(this));
            this.formWidget.attachTo(this.view.getSelectedNodePropertiesContentDiv());

            this.view.getEditPropertiesButtonHolder().setStyle('display', 'none');
            this.view.getControlPanel().setStyle('display','block');
        },

        createNonPersistentAttrForm: function(errorMessage) {
            this.nonPersistentErrorMessage = errorMessage;
            this.nonPersistentAttributesReceived = true;
            var nonPersistentAttr = this.selectedNodeProperties.nonPersistentAttributes ? this.selectedNodeProperties.nonPersistentAttributes : [];
            this.nonPersistentAttrform = new NonPersistentAttrForm(
                nonPersistentAttr,
                this.getFilterText(),
                this.valuesToBeSaved.bind(this),
                this.nonPersistentErrorMessage,
                this.expansionList,
                this.widgetsProducer
            );

            this.formWidget.setNonPersistentContent(this.nonPersistentAttrform);
            this.updateFilterAllAttributes(this.getFilterText());
        },

        valuesToBeSaved: function(attributes) {
            this.formWidget.setValuesToBeSaved(attributes);
        },

        viewNonPersistentAttributes: function(status) {
            this.nonPersistentExpanded = status;

            if (!this.nonPersistentAttributesReceived && this.nonPersistentExpanded) {
                this.createLoadingAnimation();
                this.expansionListBackup = this.expansionList;
                this.requestMoAttributes(''+this.selectedNodeProperties.poId, true, false);
            } else if (this.nonPersistentExpanded) {
                if (this.nodePropertyList) {
                    this.createNonPersistentAttrList(this.selectedNodeProperties, this.nonPersistentErrorMessage);
                } else if (this.formWidget && this.formWidget.nonPersistentValuesToBeSaved.length===0) {
                    this.createNonPersistentAttrForm(this.nonPersistentErrorMessage);
                }
                if (this.getFilterText() !== '') {
                    this.filterAttributes(this.getFilterText());
                }
            } else if (this.getFilterText() !== '') {
                this.filterAttributes(this.getFilterText());
            }
        },

        createLoadingAnimation: function() {
            var showLoadingAnimation = new LoadingAnimationWidget();
            showLoadingAnimation.showNonPersistentLoadingAnimation();
            var nodePropertyView = this.nodePropertyList ? this.nodePropertyList : this.formWidget;
            nodePropertyView.setNonPersistentContent(showLoadingAnimation);
        },

        onEditProperties: function() {
            this.editMode = true;
            this.createNodeDetailsForm(this.persistentErrorMessage);
            if (this.nonPersistentExpanded) {
                this.createNonPersistentAttrForm(this.nonPersistentErrorMessage);
            }
        },

        getSelectedNodeItems: function() {
            return this.selectedNodeProperties.attributes;
        },

        mapReponseToValues: function(response, values) {

            return values.map(function(curr) {

                function identityFilter(element)  {
                    return element.key===curr.key;
                }

                //TODO Optimise this
                var currentResponse = response.attributes.filter(identityFilter)[0];
                var moWriteBehavior = response.writeBehavior;

                return this.mergeResponseAndModelInfo(currentResponse, curr, moWriteBehavior);
            }.bind(this));
        },

        mergeResponseAndModelInfo: function(currentResponse, curr, moWriteBehavior) {
            function getWriteBehavior(moBehavior, attributeBehavior) {
                if (attributeBehavior === 'INHERITED') {
                    return moBehavior;
                }
                return attributeBehavior;
            }
            var lifeCycle = currentResponse.lifeCycle ? currentResponse.lifeCycle.state : null;
            //TODO Make this polymorphic for enumeration  and default value
            var returnObject = {
                activeChoiceCase: currentResponse.activeChoiceCase,
                memberTypes: currentResponse.listMembers,
                key: curr.key,
                readOnly: (currentResponse.immutable || getWriteBehavior(moWriteBehavior,currentResponse.writeBehavior) === 'NOT_ALLOWED' ||
                    currentResponse.userExposure === 'READ_ONLY' || lifeCycle === 'OBSOLETE'),
                constraints: currentResponse.constraints,
                type: currentResponse.type,
                defaultValue: currentResponse.defaultValue || null,
                description: currentResponse.description || '',
                isNonPersistent: currentResponse.readBehavior === 'FROM_DELEGATE',
                trafficDisturbances: currentResponse.trafficDisturbances || null,
                readBehavior: currentResponse.readBehavior,
                writeBehavior: currentResponse.writeBehavior,
                userExposure: currentResponse.userExposure,
                immutable: currentResponse.immutable,
                sensitive: currentResponse.sensitive,
                moType: this.selectedNodeProperties.type,
                namespace: this.selectedNodeProperties.namespace,
                namespaceVersion: this.selectedNodeProperties.namespaceVersion
            };

            if (typeof currentResponse.enumeration !== 'undefined') {
                returnObject.enumeration = DataBuilder.buildEnumeration(currentResponse.enumeration);
            }

            if (typeof currentResponse.bitsMembers !== 'undefined') {
                returnObject.bitsMembers = currentResponse.bitsMembers;
            }

            if (typeof currentResponse.complexRef !== 'undefined') {
                returnObject.complexRef = {
                    description: currentResponse.complexRef.description,
                    key: currentResponse.complexRef.key
                };

                //If complex ref not null, use original values, otherwise:
                if (curr.value === null) {
                    curr.value = currentResponse.complexRef.attributes.map(function(e) {
                        return {
                            key: e.key,
                            value: null,
                            datatype: e.type
                        };
                    });
                }
                returnObject.complexRef.attributes = this.mapReponseToValues(currentResponse.complexRef, curr.value);
            }

            if (typeof currentResponse.listReference !== 'undefined') {
                if (Array.isArray(curr.value)) {
                    curr.value.forEach(function(list) {
                        if (Array.isArray(list)) {
                            list.forEach(function(e) {
                                e.datatype = currentResponse.listReference.complexRef.attributes.filter(function(element) {
                                    return element.key === e.key;
                                })[0].type;
                            });
                        }
                    });
                }

                if (typeof currentResponse.listReference.complexRef !== 'undefined') {
                    var enums = currentResponse.listReference.complexRef.attributes.filter(function(element) {
                        return element.type === 'ENUM_REF';
                    });

                    enums.forEach(function(e) {
                        e.enumeration = DataBuilder.buildEnumeration(e.enumeration);
                    });
                }

                if (typeof currentResponse.listReference.enumeration !== 'undefined') {
                    currentResponse.listReference.enumeration = DataBuilder.buildEnumeration(currentResponse.listReference.enumeration);
                }

                returnObject.listReference = currentResponse.listReference;
            }

            returnObject.origValue = curr.value;
            returnObject.value = Utility.extractEnumMember(curr.value);
            return returnObject;
        },

        formClickCancelHandler: function() {
            this.editMode = false;
            this.updateAttributesRegion(this.selectedNodeProperties, this.persistentErrorMessage);
            if (this.nonPersistentExpanded) {
                this.createNonPersistentAttrList(this.selectedNodeProperties, this.nonPersistentErrorMessage);
            }

            if (this.getFilterText() !== '') {
                this.filterAttributes(this.getFilterText());
            }
        },

        formClickSaveHandler: function(valuesToBeSaved) {
            this.editMode = false;
            var requestData = this.formatRequestData(valuesToBeSaved);
            this.putRequest(requestData);
            this.filter.resetFilter();

        },

        toggleContentArea: function(opened) {
            try {
                var div = this.view.getFilterContainerPanel();
                this.view.setShowModifierFor(div, opened);
                div = this.view.getEditPropertiesButtonHolder();
                this.view.setShowModifierFor(div, opened);
                div = this.view.getSelectedNodePropertiesContentDiv();
                this.view.setShowModifierFor(div, opened);
                div = this.view.getControlPanel();
                this.view.setShowModifierFor(div, opened);
                div = this.view.getSelectedNodePropertiesHeaderContainer();
                this.view.setShowModifierFor(div, opened);
            }
            catch (e) { console.error(e); }

        },

        toggleMessageArea: function(opened) {
            try {
                var div = this.view.getSelectedNodePropertiesMessageArea();
                this.view.setShowModifierFor(div, opened);
            }
            catch (e) { console.error(e); }
        },

        // Checks if the form is enabled, then checks if a name is specified.
        formatRequestData: function(valuesToBeSaved) {

            return  {
                name: this.selectedNodeProperties.moName,
                type: this.selectedNodeProperties.moType,
                poId: this.selectedNodeProperties.poId,
                fdn: this.selectedNodeProperties.fdn,
                attributes: valuesToBeSaved
            };
        },

        // Handles the actual saving of attributes values
        putRequest: function(data) {
            if (data.poId===null || data.poId==='' || typeof  data.poId === 'undefined'  || data.poId === this.allSubnetworksNetworkPoId) {
                this.toggleContentArea(false);
                this.toggleMessageArea(true);
            }
            else {
                this.toggleContentArea(true);
                this.toggleMessageArea(false);

                this.getEventBus().publish(CustomEvent.SAVE_START);
                Rest.saveAttributes(data.poId, data)
                    .then(function(response) {
                        this.handleSuccess(response.data, data);
                    }.bind(this), function(error) {
                        this.handleAttributeSaveError(error);
                    }.bind(this));
            }
        },

        handleSuccess: function(responseData, data) {
            this.nonPersistentExpanded = false;
            this.nonPersistentAttributesReceived = false;
            this.editMode = false;

            this.getEventBus().publish(CustomEvent.SAVE_SUCCESS, data);

            if (this.formWidget) {
                this.formWidget.destroy();
            }
            this.expansionListBackup = this.expansionList;
            this.requestMoAttributes(''+this.selectedNodeProperties.poId, this.nonPersistentExpanded, true);
        },

        // FIXME error should be based on error code not on message from body. xhr has to be removed from here
        handleAttributeSaveError: function(error) {
            var xhr = error.extra.xhr;
            var errorCode = error.code;
            var header, body, optional, status, type;
            var errorState=false;
            var extraMessage=null;

            if (error && error.code === 10106) {
                header = error.title;
                body = error.message;
                type = 'error';
            } else if (error instanceof customError.SaveTimeout) {
                header = error.title;
                body = error.message;
                type = 'information';
            } else {
                type = 'error';

                var message = xhr && typeof xhr.getResponseJSON === 'function' ? xhr.getResponseJSON().body: null;
                if (message && message.toLowerCase().indexOf('entity:')>=0) {
                    var startIndex = message.toLowerCase().indexOf('entity:')+7;
                    var endIndex = message.indexOf(',', startIndex+2);
                    /* The trim() is related to the uncertain protocol if there is no element the default message
                     * is all element failed. This was an angreement with the RV and Joseph*/
                    if (startIndex>=0 && endIndex>0) {
                        var elem = message.substr(startIndex,  endIndex-startIndex).trim();
                        if (elem) {
                            errorState = true;
                            extraMessage = elem;
                        }
                    }
                }
                status = xhr.getStatus() === 403;
                header = status ? i18n.savePropertiesForbiddenHeader : i18n.savePropertiesErrorHeader;

                var suppliedValue = '';
                if (message && message.toLowerCase().indexOf('supplied value:')>=0) {
                    suppliedValue = message.split(',')[2];
                }
                if (isConstraintViolationError(message)) {
                    body = status ? i18n.savePropertiesForbiddenContent : (errorState? i18n.savePropertiesErrorConstraintContent.replace('$1',extraMessage).replace('$2',suppliedValue) :i18n.savePropertiesErrorConstraintContentBoth) ;
                } else if (isMediationError(message)) {
                    body = status ? i18n.savePropertiesForbiddenContent : (errorState ? i18n.savePropertiesErrorLogContent.replace('$1', extraMessage) : i18n.savePropertiesErrorLogContentBoth);
                } else if (isSyncError(errorCode)) {
                    body = errorState ? i18n.savePropertiesErrorLogContent.replace('$1', extraMessage) : message;
                } else if (isTransactionError(errorCode)) {
                    body = errorState ? i18n.savePropertiesErrorLogContent.replace('$1', extraMessage) : message;
                } else {
                    body = status ? i18n.savePropertiesForbiddenContent : (errorState ? i18n.savePropertiesErrorContent.replace('$1', extraMessage) : i18n.savePropertiesErrorContentBoth);
                }
                optional = status ? i18n.savePropertiesForbiddenOptionalContent : '';
            }

            var dialog = createDialog.call(this, type, header, body, CustomEvent.SAVE_ERROR_CLOSED, optional);
            dialog.show();

            this.getEventBus().publish(CustomEvent.SAVE_ERROR);
        },

        sortNodeProperties: function(properties) {
            this.sortItemsByKey(properties.attributes);

            properties.attributes.forEach(function(e) {
                if (e.value instanceof Array && e.value.length>0 && e.value[0] instanceof Object && e.value[0].hasOwnProperty('key')) {
                    this.sortItemsByKey(e.value);
                }
            }.bind(this));
        },

        sortItemsByKey: function(dataToSort) {
            dataToSort.sort(function(a, b) {
                if (a.key.toLowerCase() > b.key.toLowerCase()) {
                    return 1;
                }
                if (a.key.toLowerCase() < b.key.toLowerCase()) {
                    return -1;
                }
                return 0;
            });
        },

        filterAttributes: function(filterString) {
            if (this.nodePropertyList) {

                var filteredList ={};
                if (this.nonPersistentExpanded) {
                    filteredList.nonPersistentAttributes = this.selectedNodeProperties.nonPersistentAttributes.filter(function(e) {
                        return Filters.filterFormAttribute(filterString, e);
                    });
                }

                filteredList.attributes = this.selectedNodeProperties.attributes.filter(function(e) {
                    return Filters.filterFormAttribute(filterString, e);
                });

                filteredList.name = this.selectedNodeProperties.name;
                filteredList.type = this.selectedNodeProperties.type;
                this.createNodePropertyList(filteredList, this.persistentErrorMessage);
                if (this.nonPersistentExpanded) {
                    this.createNonPersistentAttrList(filteredList, this.nonPersistentErrorMessage);
                }


                var filteredPersistentAttributeCount = filteredList.attributes.length;
                var filteredNonPersistentAttributeCount = filteredList.nonPersistentAttributes ? filteredList.nonPersistentAttributes.length : 0;
                var filteredAttributeCount = filteredPersistentAttributeCount + filteredNonPersistentAttributeCount;

                var includeNonPersistentInTotalCount = 0;
                if (this.nonPersistentExpanded) {
                    includeNonPersistentInTotalCount = this.selectedNodeProperties.nonPersistentAttributes.length;
                }
                var totalAttributeCount = this.selectedNodeProperties.attributes.length + includeNonPersistentInTotalCount;

                this.updateFilterCounter(filteredAttributeCount, totalAttributeCount);
            }
            else if (this.formWidget) {
                this.updateFilterAllAttributes(filterString);
            }

            if (filterString==='') {
                return this.filter.resetFilter();
            }
        },

        updateFilterAllAttributes: function(filterString) {
            var persistentCount = this.formWidget.updateFiltering(filterString);
            var filtered = persistentCount.filtered;
            var total = persistentCount.total;

            if (this.nonPersistentExpanded && this.nonPersistentAttrform) {
                var nonPersistentCount = this.nonPersistentAttrform.updateFiltering(filterString);

                filtered += nonPersistentCount.filtered;
                total += nonPersistentCount.total;
            }

            this.updateFilterCounter(filtered, total);
        },

        updateFilterCounter: function(displayed, total) {
            this.filter.getNumberOfAttributeValuesFiltered(displayed, total);
        },

        getFilterText: function() {
            return this.filter.getText();
        },

        setMessageAreaText: function(title, message) {
            this.view.setMessageAreaText(title, message);
        }
    });

    function isMediationError(errorMessage) {
        return errorMessage.toLowerCase().indexOf('mediat') >= 0;
    }

    function isConstraintViolationError(errorMessage) {
        return errorMessage.toLowerCase().indexOf('constraint') >= 0;
    }

    function isSyncError(errorCode) {
        return errorCode === 10021;
    }

    function isTransactionError(errorCode) {
        return errorCode === 1004;
    }

    function createDialog(type, header, content, closedEvent, optionalContent) {
        var modalDialog = new Dialog({
            header: header,
            content: content,
            optionalContent: optionalContent,
            buttons: [
                {
                    caption: i18n.buttons.ok,
                    action: function() {
                        // TODO remove .hide() when TORF-184466 is delivered
                        modalDialog.hide();
                        modalDialog.destroy();

                        this.getEventBus().publish(closedEvent);
                    }.bind(this)
                }
            ],
            type: type
        });
        return modalDialog;
    }

});



