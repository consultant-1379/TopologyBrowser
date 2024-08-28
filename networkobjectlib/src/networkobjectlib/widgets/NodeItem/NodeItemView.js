define([
    'jscore/core',
    'text!./NodeItem.html',
    'styles!./NodeItem.less',
    'i18n!networkobjectlib/dictionary.json'
], function(core, template, styles, i18n) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return styles;
        },

        getLabel: function() {
            return this.getElement().find('.elNetworkObjectLib-NodeItem-label');
        },

        getNodeCount: function() {
            return this.getElement().find('.elNetworkObjectLib-NodeItem-count');
        },

        getIcon: function() {
            return this.getElement().find('.elNetworkObjectLib-NodeItem-icon');
        },

        getType: function() {
            return this.getElement().find('.elNetworkObjectLib-NodeItem-type');
        },

        getSyncStatus: function() {
            return this.getElement().find('.elNetworkObjectLib-NodeItem-syncStatus');
        },

        setSyncStatus: function(icon, title) {
            if (icon) {
                this.getSyncStatus().removeModifier('hidden');
                this.getSyncStatus().getNative().classList.add(icon);
                this.getSyncStatus().setAttribute('title', title);
            } else {
                this.getSyncStatus().setModifier('hidden');
            }

        },

        getManagementState: function() {
            return this.getElement().find('.elNetworkObjectLib-NodeItem-managementState');
        },

        setManagementState: function(icon, title) {
            if (icon) {
                this.getManagementState().removeModifier('hidden');
                this.getManagementState().getNative().classList.add(icon);
                this.getManagementState().setAttribute('title', title);
            } else {
                this.getManagementState().setModifier('hidden');
            }
        },

        setRadioAccessTechnologies: function(rats) {
            if (rats) {
                rats.forEach(function(element) {
                    this.setRatIcon(element);
                }.bind(this));
            }

        },

        getRATIcon: function(ratValue) {
            return this.getElement().find('.elNetworkObjectLib-NodeItem-rat'+ratValue);
        },

        setRatIcon: function(ratValue) {
            this.getRATIcon(ratValue).removeModifier('hidden');
            this.getRATIcon(ratValue).setAttribute('title', ratValue);

        },

        getMoreIcon: function() {
            return this.getElement().find('.elNetworkObjectLib-NodeItem-moreIcon');
        },

        showMoreIcon: function() {
            this.getMoreIcon().removeModifier('hidden');
        },

        hideMoreIcon: function() {
            this.getMoreIcon().setModifier('hidden');
        },

        getMoreContent: function() {
            return this.getElement().find('.elNetworkObjectLib-NodeItem-moreContent');
        },

        showMoreContent: function() {
            this.getMoreContent().removeModifier('hidden');
        },

        hideMoreContent: function() {
            this.getMoreContent().setModifier('hidden');
        },

        getStateIcons: function() {
            return this.getElement().find('.elNetworkObjectLib-NodeItem-stateIcons');
        },


        setNodeCount: function(count, options) {
            var isCountEmpty = (count === 'null' || count === undefined || count === null);
            var isSubNetwork = options.type === 'SubNetwork' || options.iconTitle === 'SubNetwork';
            var isAllOtherNodes = options.label === 'All other nodes';
            var isCollection = options.collectionType === "LEAF" || options.collectionType === "BRANCH";
            var showCount = options.showNodeCount && (isSubNetwork || isAllOtherNodes || isCollection);
            var displayedCount = (showCount && !isCountEmpty) ? ('[' + count + ']') : '';

            this.getNodeCount().setStyle({ visibility: showCount ? 'visible' : 'hidden' });
            this.getNodeCount().setText(displayedCount);
        },



        setIcon: function(icon, iconTitle) {
            if (Array.isArray(icon)) {
                icon.forEach(function(i) {
                    this.getIcon().getNative().classList.add(i);
                }.bind(this));
            } else if (icon) {
                this.getIcon().getNative().classList.add(icon);
            }
            this.getIcon().setAttribute('title', iconTitle);
        },

        setLabel: function(labelName, contentsUpdatedTime) {
            this.getLabel().setText(labelName);
            if (contentsUpdatedTime && document.querySelector('.elScopingPanel-rScopingPanel')) {
                this.getLabel().setAttribute('title', labelName + ' - ' + i18n.collectionDetailPanel.detailLabels.contentsUpdatedTime + ': ' + contentsUpdatedTime);
            } else {
                this.getLabel().setAttribute('title', labelName);
            }

        },

        setType: function(titleName) {
            if (titleName === 'PrivateNetwork') {
                this.getType().setText(i18n.privateNetwork);
            } else {
                this.getType().setText(titleName);
            }
            this.getType().setAttribute('title', titleName);
        },

        setId: function(id) {
            this.getElement().setAttribute('data-id', id);
        },

        manageVisibleIcons: function() {
            var visibleIconsCount = 0;
            var additionalIconsHTML='';
            var thirdIcon;

            this.getStateIcons().children().forEach(function(icon) {
                if (icon.getNative().nodeName==='I' && !icon.hasModifier('hidden')) {
                    visibleIconsCount++;
                    if (visibleIconsCount===3) {
                        thirdIcon = icon;
                    } else if (visibleIconsCount>3) {
                        additionalIconsHTML+=icon._getHTMLElement().outerHTML;
                        icon.setModifier('hidden');
                    }
                }
            });

            if (visibleIconsCount > 3) {
                this.getMoreContent()._getHTMLElement().innerHTML = thirdIcon._getHTMLElement().outerHTML + additionalIconsHTML;
                thirdIcon.setModifier('hidden');

                this.getMoreIcon().addEventHandler('mouseover', this.showMoreContent ,this);

                this.getMoreIcon().addEventHandler('mouseleave', this.hideMoreContent, this);

                this.showMoreIcon();
            }
        }
    });

});
