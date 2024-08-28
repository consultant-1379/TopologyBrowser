define([
    'jscore/core',
    'text!./topologyBrowser.html',
    'styles!./topologyBrowser.less'
], function(core, template, style) {

    return core.View.extend({
        showModifier: 'show',
        /*
         @desc default method to get the html template associated with the view defined above
         */
        getTemplate: function() {
            return template;
        },

        /*
         @desc default method to get access to the style defined above
         */
        getStyle: function() {
            return style;
        },

        /*
         @desc method that returns a reference to the div that will contain the Topology Tree
         */
        getTopologyTreeContainer: function() {
            return this.getElementFromCSSClassName('.elLayouts-NavigationBar-placeholder');
        },

        /*
         @desc method that returns a reference to the div that will contain the navigation object
         */
        getNavigation: function() {
            return this.getElementFromCSSClassName('.eaTopologyBrowser-navigation');
        },

       /*
         @desc method that returns a reference to the div that will contain the navigation object
         */
        getBreadCrumb: function() {
            return this.getElementFromCSSClassName('.elLayouts-NavigationBar-breadcrumb');
        },

        /*
         @desc utility method that returns a reference to an element
         @param string elementName is the css class of the element in question
         */
        getElementFromCSSClassName: function(className) {
            return this.getElement().find(className);
        },

        /*
        temp put this code in here until it gets implemented in the SlidingPanelsLayout
         */
        getSlidingPanelCenterPanel: function() {
            return this.getElement().find('.elLayouts-SlidingPanels-center');
        },

        getSlidingPanelLeftPanel: function() {
            return this.getElement().find('.elLayouts-SlidingPanels-leftContents');
        },
        getSlidingPanelRightPanel: function() {
            return this.getElement().find('.elLayouts-SlidingPanels-rightContents');
        },

        setMainViewStyle: function(key, value) {
            this.getElement().find('.eaTopologyBrowser-rMain').setStyle(key, value);
        },

        getSelectedTopologyText: function() {
            return this.getElementFromCSSClassName('.elNetworkObjectLib-rTopologyHeader-selected').getNative()
            .getElementsByClassName('elNetworkObjectLib-rTopologyHeader-selected-dropdown')[0].getElementsByClassName('ebSelect-value')[0].innerText;
        }
    });
});
