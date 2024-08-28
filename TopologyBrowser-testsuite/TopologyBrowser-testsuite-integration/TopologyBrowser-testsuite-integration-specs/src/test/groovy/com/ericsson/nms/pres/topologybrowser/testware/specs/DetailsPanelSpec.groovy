package com.ericsson.nms.pres.topologybrowser.testware.specs

import com.ericsson.nms.pres.topologybrowser.testware.pages.*
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Specification

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.*
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.NetworkData.NODE_4
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.NetworkData.SUB_NETWORK_1

@RunWith(ArquillianSputnik)
class DetailsPanelSpec extends Specification {
    private final String shortString = 'SubNetwork=IrelandSubnetwork0'
    private final String longString = 'SubNetwork=IrelandSubnetwork0,MeContext=LTE01dg2ERBS00039,ManagedElement=LTE01dg2ERBS00039'
    private final String siteLocationAttribute = 'siteLocation'
    private final String connectedUsersAttribute= 'licConnectedUsersPercentileConf'
    private final String networkManagedElementIdAttribute = 'networkManagedElementId'
    private final String newAttributeValue = 'Dublin2'
    private final String maxLong = '9223372036854775807'
    private final String minLong = '-9223372036854775807'
    private final String longAtrribute = 'mockLongAttribute'
    private final String obsoleteAttribute = 'mockObsoleteAttribute'

    @Page
    private TopologyBrowserPage topologyBrowserPage

    @Page
    private TreeViewFragment treeViewFragment

    @Page
    private UDTDropdownFragment udtDropdownFragment

    @Page
    private DetailsPanelFragment detailsPanelFragment

    @Page
    private DialogFragment dialogFragment

    def 'Check text is wrapped in textarea' () {

        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        treeViewFragment.restore()
        topologyBrowserPage.openTopologyBrowser(true)

        when: 'SubNetwork is expanded'
        treeViewFragment.expandNodeByName(ALL_OTHER_NODES)

        and: 'Node is selected'
        treeViewFragment.clickNodeByName(OTHER_RADIO_NODE)

        and: 'Details panel is visible'
        detailsPanelFragment.isDetailsPanelVisible()

        and: 'Edit Attribute is selected'
        detailsPanelFragment.isEditAttributesClickable().click()

        and: 'Check if textarea is visible'
        detailsPanelFragment.getTextArea(siteLocationAttribute)

        and: 'Input short string'
        detailsPanelFragment.inputShortText(shortString)

        and: 'Input long string'
        detailsPanelFragment.inputLongText(longString)

        then: 'Text Area should wrap string'
        detailsPanelFragment.isStringWrapped()
    }

    def 'Check details panel is empty on initial load of Topology Browser' () {

        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'Verify details panel is empty'
        assert detailsPanelFragment.isDetailsPanelEmpty()
    }

    def 'Check filter attribute in Details panel' () {

        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        when: 'SubNetwork is expanded'
        treeViewFragment.expandNodeByName(ALL_OTHER_NODES)

        and: 'Node is selected'
        treeViewFragment.clickNodeByName(OTHER_RADIO_NODE)

        and: 'Details panel is visible'
        assert detailsPanelFragment.isDetailsPanelVisible()

        and: 'Input filter value'
        detailsPanelFragment.inputFilter('neType')

        then: 'Check if only the filtered attribute is displayed'
        detailsPanelFragment.isFilteredResultsValid('neType', 1)

        and: 'Clear filter value'
        detailsPanelFragment.clearFilter()

        and: 'Input partial value of attributes'
        detailsPanelFragment.inputFilter('ne')

        //displays both neType and networkManagedElementId which starts with 'ne'
        then: 'Check if only the filtered attribute list is displayed'
        detailsPanelFragment.isFilteredResultsValid('ne', 2)

    }

    def 'Click Edit and Save attributes' () {

        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        treeViewFragment.restore()
        topologyBrowserPage.openTopologyBrowser(true)

        when: 'SubNetwork is expanded'
        treeViewFragment.expandNodeByName(ALL_OTHER_NODES)

        and: 'Node is selected'
        treeViewFragment.clickNodeByName(OTHER_RADIO_NODE)

        and: 'Details panel is visible'
        detailsPanelFragment.isDetailsPanelVisible()

        and: 'Edit Attribute is selected'
        detailsPanelFragment.isEditAttributesClickable().click()

        and: 'Input different value'
        detailsPanelFragment.setTextAreaValue(siteLocationAttribute, newAttributeValue)

        and: 'Click Save Button'
        detailsPanelFragment.isSaveAttributesButtonClickable().click()

        and: 'Dialog to confirm the changes is displayed and save is clicked'
        assert dialogFragment.isConfirmDialogVisible()
        dialogFragment.clickActionButton('Save Changes')

        then: 'Check if the edited attribute is saved and displayed'
        detailsPanelFragment.getAttributeValueElement(siteLocationAttribute).isDisplayed()
        detailsPanelFragment.getAttributeTextValue(siteLocationAttribute) == newAttributeValue

        cleanup: 'Restore default data'
        detailsPanelFragment.restoreDB()

        }

    def 'Attribute marked As OBSOLETE cannot be edited' () {

        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        treeViewFragment.restore()
        topologyBrowserPage.openTopologyBrowser(true)

        when: 'SubNetwork is expanded'
        treeViewFragment.expandNodeByName(ALL_OTHER_NODES)

        and: 'Node is selected'
        treeViewFragment.clickNodeByName(OTHER_RADIO_NODE)

        and: 'Details panel is visible'
        detailsPanelFragment.isDetailsPanelVisible()

        and: 'Edit Attribute is selected'
        detailsPanelFragment.isEditAttributesClickable().click()

        then: ''
        detailsPanelFragment.isReadOnlyAttribute(obsoleteAttribute)
    }

    def 'Check Edit and Save attributes for Forbidden error' () {

        String editedAttributeValue

        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        treeViewFragment.restore()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'SubNetwork is expanded'
        treeViewFragment.expandNodeByName(ALL_OTHER_NODES)

        and: 'Node is selected'
        treeViewFragment.clickNodeByName(OTHER_RADIO_NODE)

        and: 'Details panel is visible'
        detailsPanelFragment.isDetailsPanelVisible()

        and: 'Edit Attribute is selected'
        detailsPanelFragment.isEditAttributesClickable().click()

        and: 'Input different value'
        detailsPanelFragment.setTextAreaValue(networkManagedElementIdAttribute, newAttributeValue)

        and: 'Click Save Button'
        detailsPanelFragment.isSaveAttributesButtonClickable().click()

        when: 'Dialog to confirm the changes is displayed and save is clicked'
        dialogFragment.isConfirmDialogVisible()
        dialogFragment.clickActionButton('Save Changes')

        //mocked error when we edit 'networkManagedElementId' attribute
        and: 'Error dialog is open'
        assert dialogFragment.isErrorDialogVisible()
        dialogFragment.clickOk()

        and: 'Get the text area value'
        editedAttributeValue = detailsPanelFragment.getTextAreaValue(networkManagedElementIdAttribute)

        then: 'Check if the dialog closes and the edited attributes remains as such'
        editedAttributeValue == newAttributeValue
    }

    def 'Click validation errors in Edit and Save' () {

        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        treeViewFragment.restore()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'SubNetwork is expanded'
        treeViewFragment.expandNodeByName(ALL_OTHER_NODES)

        and: 'Node is selected'
        treeViewFragment.clickNodeByName(OTHER_RADIO_NODE)

        and: 'Details panel is visible'
        detailsPanelFragment.isDetailsPanelVisible()

        and: 'Edit Attribute is selected'
        detailsPanelFragment.isEditAttributesClickable().click()

        when: 'Input value which is out of range'
        detailsPanelFragment.setTextAreaValue(connectedUsersAttribute,'505')

        then: 'Check if the range validation error is shown'
        detailsPanelFragment.getInlineError(connectedUsersAttribute).isDisplayed()
        detailsPanelFragment.getInlineErrorText(connectedUsersAttribute) == 'Number is out of range'


        when: 'Input string in number field type '
        detailsPanelFragment.setTextAreaValue(connectedUsersAttribute,'check')

        then: 'Check if the input type validation error is shown'
        detailsPanelFragment.getInlineError(connectedUsersAttribute).isDisplayed()
        detailsPanelFragment.getInlineErrorText(connectedUsersAttribute) == 'Not a number'


        when: 'Input null value'
        detailsPanelFragment.setTextAreaValue(connectedUsersAttribute,'<null>')

        then: 'Check if the "cannot be null" validation error is shown'
        detailsPanelFragment.getInlineError(connectedUsersAttribute).isDisplayed()
        detailsPanelFragment.getInlineErrorText(connectedUsersAttribute) == 'Input cannot be null'

    }

    def 'Click Cancel after Edit' () {

        String oldAttributeValue

        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        treeViewFragment.restore()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'SubNetwork is expanded'
        treeViewFragment.expandNodeByName(ALL_OTHER_NODES)

        and: 'Node is selected'
        treeViewFragment.clickNodeByName(OTHER_RADIO_NODE)

        and: 'Details panel is visible'
        detailsPanelFragment.isDetailsPanelVisible()

        and: 'Edit Attribute is selected'
        detailsPanelFragment.isEditAttributesClickable().click()

        and: 'Check if textarea is visible and get the current attribute value'
        oldAttributeValue = detailsPanelFragment.getTextAreaValue('dnPrefix')

        and: 'Input different value'
        detailsPanelFragment.setTextAreaValue('dnPrefix','abc')

        when: 'Click Cancel Button'
        detailsPanelFragment.isCancelEditAttributesButtonClickable().click()

        then: 'Check if all attributes are readonly and unchanged'
        detailsPanelFragment.getAttributeValueElement('dnPrefix').isDisplayed()
        detailsPanelFragment.getAttributeTextValue('dnPrefix') == oldAttributeValue
    }

    def 'Click Cancel in "Confirm Save" dialog box' () {

        String editedAttributeValue

        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        treeViewFragment.restore()
        topologyBrowserPage.openTopologyBrowser(true)

        when: 'SubNetwork is expanded'
        treeViewFragment.expandNodeByName(ALL_OTHER_NODES)

        and: 'Node is selected'
        treeViewFragment.clickNodeByName(OTHER_RADIO_NODE)

        and: 'Details panel is visible'
        detailsPanelFragment.isDetailsPanelVisible()

        and: 'Edit Attribute is selected'
        detailsPanelFragment.isEditAttributesClickable().click()

        and: 'Input different value'
        detailsPanelFragment.setTextAreaValue(siteLocationAttribute, newAttributeValue)

        and: 'Click Save Button'
        detailsPanelFragment.isSaveAttributesButtonClickable().click()

        and: 'Dialog to confirm the changes is displayed and cancel is clicked'
        assert dialogFragment.isConfirmDialogVisible()
        dialogFragment.clickActionButton('Cancel')

        and: 'Get the text area value'
        editedAttributeValue = detailsPanelFragment.getTextAreaValue(siteLocationAttribute)

        then: 'Check if the dialog closes and the edited attributes remains as such'
        editedAttributeValue == newAttributeValue

    }

    def 'Check Details Panel for a Custom Topology having a branch, a leaf and a search criteria collection'() {
        given: 'Transport Topology with Branch, Leaf and Search Criteria collection exists'
        treeViewFragment.setTopologyOnDB('rootWithBranchLeafAndSearchCriteriaCollection')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        when: '"Transport Topology" is clicked and selected'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.clickNodeByName(TRANSPORT_TOPOLOGY)

        then: 'Check the details panel'
        assert detailsPanelFragment.isDetailsPanelVisible()
        assert detailsPanelFragment.isCollectionAttributeVisible('Created')
        assert detailsPanelFragment.isCollectionAttributeNotVisible('Contents Updated')

        when: '"Transport Topology" is expanded'
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        then: 'Branch, Leaf and Search Criteria Collections exist'
        assert treeViewFragment.isNodeExist(CHILD_BRANCH+'001')
        assert treeViewFragment.isNodeExist(CHILD_LEAF+'001')
        assert treeViewFragment.isNodeExist(CHILD_SEARCH_CRITERIA+'001')

        when: 'Branch Collection is clicked'
        treeViewFragment.clickNodeByName(CHILD_BRANCH+'001')

        then: 'Check the details panel'
        assert detailsPanelFragment.isDetailsPanelVisible()
        assert detailsPanelFragment.isCollectionAttributeVisible('Created')
        assert detailsPanelFragment.isCollectionAttributeNotVisible('Contents Updated')
        assert detailsPanelFragment.isCollectionAttributeNotVisible('Search Criteria')

        when: 'Leaf Collection is clicked'
        treeViewFragment.clickNodeByName(CHILD_LEAF+'001')

        then: 'Check the details panel'
        assert detailsPanelFragment.isDetailsPanelVisible()
        assert detailsPanelFragment.isCollectionAttributeVisible('Created')
        assert detailsPanelFragment.isCollectionAttributeVisible('Contents Updated')
        assert detailsPanelFragment.isCollectionAttributeNotVisible('Search Criteria')

        when: 'Search Criteria Collection is clicked'
        treeViewFragment.clickNodeByName(CHILD_SEARCH_CRITERIA+'001')

        then: 'Check the details panel'
        assert detailsPanelFragment.isDetailsPanelVisible()
        assert detailsPanelFragment.isCollectionAttributeVisible('Created')
        assert detailsPanelFragment.isCollectionAttributeVisible('Contents Updated')
        assert detailsPanelFragment.isCollectionAttributeVisible('Search Criteria')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()

    }

    def 'Test max boundary for a long, given that it has been sent as a String from POS'() {

        given: 'Transport Topology with Branch, Leaf and Search Criteria collection exists'
        treeViewFragment.setTopologyOnDB('rootWithBranchLeafAndSearchCriteriaCollection')

        when: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'Select a Node and check if the details panel is open'
        treeViewFragment.expandNodeByName(SUB_NETWORK_1)
        treeViewFragment.clickNodeByName(NODE_4)
        assert detailsPanelFragment.isDetailsPanelVisible()
        assert detailsPanelFragment.isAttributeVisible(longAtrribute)

        and: 'Edit mockLongAttribute with the largest long possible in Java'
        detailsPanelFragment.isEditAttributesClickable().click()
        detailsPanelFragment.clearTextArea(longAtrribute)
        detailsPanelFragment.getTextArea(longAtrribute).sendKeys(maxLong)
        detailsPanelFragment.isSaveAttributesButtonClickable().click()
        detailsPanelFragment.isConfirmSaveDialogSaveButtonClickable().click()

        then: 'Verify that the attribute we edited is correct'
        assert maxLong == detailsPanelFragment.getAttributeTextValue(longAtrribute)

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Test min boundary for a long, given that it has been sent as a String from POS'() {

        given: 'Transport Topology with Branch, Leaf and Search Criteria collection exists'
        treeViewFragment.setTopologyOnDB('rootWithBranchLeafAndSearchCriteriaCollection')

        when: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'Select a Node and check if the details panel is open'
        treeViewFragment.expandNodeByName(SUB_NETWORK_1)
        treeViewFragment.clickNodeByName(NODE_4)
        assert detailsPanelFragment.isDetailsPanelVisible()
        assert detailsPanelFragment.isAttributeVisible(longAtrribute)

        and: 'Edit mockLongAttribute with the largest long possible in Java'
        detailsPanelFragment.isEditAttributesClickable().click()
        detailsPanelFragment.clearTextArea(longAtrribute)
        detailsPanelFragment.getTextArea(longAtrribute).sendKeys(minLong)
        detailsPanelFragment.isSaveAttributesButtonClickable().click()
        detailsPanelFragment.isConfirmSaveDialogSaveButtonClickable().click()

        then: 'Verify that the attribute we edited is correct'
        assert minLong == detailsPanelFragment.getAttributeTextValue(longAtrribute)

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }
}
