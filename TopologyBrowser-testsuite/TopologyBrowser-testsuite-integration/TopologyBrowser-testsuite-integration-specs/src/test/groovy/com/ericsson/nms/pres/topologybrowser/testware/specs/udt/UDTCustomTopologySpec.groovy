package com.ericsson.nms.pres.topologybrowser.testware.specs.udt

import com.ericsson.nms.pres.topologybrowser.testware.pages.AddTopologyDataFragment
import com.ericsson.nms.pres.topologybrowser.testware.pages.DetailsPanelFragment
import com.ericsson.nms.pres.topologybrowser.testware.pages.DialogFragment
import com.ericsson.nms.pres.topologybrowser.testware.pages.FlyoutFragment
import com.ericsson.nms.pres.topologybrowser.testware.pages.SelectedContainerFragment
import com.ericsson.nms.pres.topologybrowser.testware.pages.TopologyBrowserPage
import com.ericsson.nms.pres.topologybrowser.testware.pages.TreeViewFragment
import com.ericsson.nms.pres.topologybrowser.testware.pages.UDTDropdownFragment
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Specification

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.*

@RunWith(ArquillianSputnik)
class UDTCustomTopologySpec extends Specification {
    @Page
    TopologyBrowserPage topologyBrowserPage
    @Page
    UDTDropdownFragment udtDropdownFragment
    @Page
    TreeViewFragment treeViewFragment
    @Page
    FlyoutFragment flyoutFragment
    @Page
    DialogFragment dialogFragment
    @Page
    AddTopologyDataFragment addTopologyDataFragment
    @Page
    DetailsPanelFragment detailsPanelFragment
    @Page
    SelectedContainerFragment selectedContainerFragment

    private static final String RADIO_NODE2 = "ieatnetsimv6035-12_RNC01RBS03"
    private static final String RADIO_NODE3 = "ieatnetsimv6035-12_RNC02RBS16"
    private static final String RADIO_NODE4 = "LTE02ERBS00111"
    private static final String NO_CHILDREN = "No children found"
    private static final String NEW_CUSTOM_TOPOLOGY = 'TEST'
    private static final String NEW_LEAF = 'LEAF'

    def 'Test Multiselect on multiple Leaf collections (Collection of Objects)'() {
        given: 'Transport Topology with Leaf collection and nodes exists'
        treeViewFragment.setTopologyOnDB('rootWithLeafCollectionAndMultipleNodes')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Leaf Collections exist'
        assert treeViewFragment.isNodeExist(CHILD_LEAF+'001')
        assert treeViewFragment.isNodeExist(CHILD_LEAF+'002')

        when: 'Try to multiSelect Collection of Objects'
        treeViewFragment.clickNodeByName(CHILD_LEAF+'001')
        treeViewFragment.pressCtrl()
        treeViewFragment.clickNodeByName(CHILD_LEAF+'002')
        treeViewFragment.releaseCtrl()

        then: 'Verify what is selected'
        assert treeViewFragment.isNodeSelected(CHILD_LEAF+'001')
        assert treeViewFragment.isNodeSelected(CHILD_LEAF+'002')

        and: 'Select Transport Topology'
        treeViewFragment.clickNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Try multiselect with shift and ctrl'
        treeViewFragment.clickNodeByName(CHILD_LEAF+'001')
        treeViewFragment.pressShift()
        treeViewFragment.clickNodeByName(CHILD_LEAF+'002')
        treeViewFragment.clickNodeByName(CHILD_LEAF+'003')
        treeViewFragment.releaseShift()

        and: 'Verify what is selected'
        assert treeViewFragment.isNodeNotSelected(TRANSPORT_TOPOLOGY)
        assert treeViewFragment.isNodeSelected(CHILD_LEAF+'001')
        assert treeViewFragment.isNodeSelected(CHILD_LEAF+'002')
        assert treeViewFragment.isNodeSelected(CHILD_LEAF+'003')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Test Multiselect on multiple Branch collections (Collection of Collections)'() {
        given: 'Transport Topology with Leaf collection and nodes exists'
        treeViewFragment.setTopologyOnDB('rootWithMultipleBranchCollectionsAtSameLevel')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Leaf Collections exist'
        assert treeViewFragment.isNodeExist(CHILD_BRANCH+'001')
        assert treeViewFragment.isNodeExist(CHILD_BRANCH+'002')
        assert treeViewFragment.isNodeExist(CHILD_BRANCH+'003')

        when: 'Try to multiSelect Collection of Objects'
        treeViewFragment.clickNodeByName(CHILD_BRANCH+'001')
        treeViewFragment.pressCtrl()
        treeViewFragment.clickNodeByName(CHILD_BRANCH+'002')
        treeViewFragment.releaseCtrl()

        then: 'Verify what is selected'
        assert treeViewFragment.isNodeSelected(CHILD_BRANCH+'001')
        assert treeViewFragment.isNodeSelected(CHILD_BRANCH+'002')

        and: 'Select Transport Topology'
        treeViewFragment.clickNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Try multiselect with shift and ctrl'
        treeViewFragment.clickNodeByName(CHILD_BRANCH+'001')
        treeViewFragment.pressShift()
        treeViewFragment.clickNodeByName(CHILD_BRANCH+'002')
        treeViewFragment.clickNodeByName(CHILD_BRANCH+'003')
        treeViewFragment.releaseShift()

        and: 'Verify what is selected'
        assert treeViewFragment.isNodeNotSelected(TRANSPORT_TOPOLOGY)
        assert treeViewFragment.isNodeSelected(CHILD_BRANCH+'001')
        assert treeViewFragment.isNodeSelected(CHILD_BRANCH+'002')
        assert treeViewFragment.isNodeSelected(CHILD_BRANCH+'003')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Test Multiselect on Combination of Collections and objects'() {
        given: 'Transport Topology with Leaf collection and nodes exists'
        treeViewFragment.setTopologyOnDB('rootWithLeafCollectionAndMultipleNodes')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Leaf Collection exists'
        treeViewFragment.expandNodeByName(CHILD_LEAF+'001')

        and: 'Verify that the Node exists'
        assert treeViewFragment.isNodeExist(RADIO_NODE4)

        and: 'Select Transport Topology Collection'
        treeViewFragment.clickNodeByName(TRANSPORT_TOPOLOGY)

        when: 'Try to multiSelect other Collection'
        treeViewFragment.pressCtrl()
        treeViewFragment.clickNodeByName(CHILD_LEAF+'001')
        treeViewFragment.releaseCtrl()

        then: 'Verify what is selected'
        assert treeViewFragment.isNodeSelected(TRANSPORT_TOPOLOGY)
        assert treeViewFragment.isNodeSelected(CHILD_LEAF+'001')

        and: 'Select Transport Topology'
        treeViewFragment.clickNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Try multiselect with shift and ctrl'
        treeViewFragment.pressShift()
        treeViewFragment.clickNodeByName(CHILD_LEAF+'002')
        treeViewFragment.releaseShift()

        and: 'Verify what is selected'
        assert treeViewFragment.isNodeSelected(TRANSPORT_TOPOLOGY)
        assert treeViewFragment.isNodeSelected(CHILD_LEAF+'001')
        assert treeViewFragment.isNodeNotSelected(RADIO_NODE4)
        assert treeViewFragment.isNodeSelected(CHILD_LEAF+'002')

        and: 'Try to multiselect nodes'
        treeViewFragment.pressCtrl()
        treeViewFragment.clickNodeByName(RADIO_NODE4)
        treeViewFragment.releaseCtrl()

        and: 'Verify what is selected'
        assert treeViewFragment.isNodeNotSelected(RADIO_NODE4)
        assert treeViewFragment.isNodeSelected(CHILD_LEAF+'002')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Test Multiselect on Objects'() {
        given: 'Transport Topology with Leaf collection and nodes exists'
        treeViewFragment.setTopologyOnDB('rootWithLeafCollectionAndMultipleNodes')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Leaf Collection exists'
        treeViewFragment.expandNodeByName(CHILD_LEAF+'001')
        treeViewFragment.expandNodeByName(CHILD_LEAF+'002')

        and: 'Verify if the Nodes exists'
        assert treeViewFragment.isNodeExist(RADIO_NODE4)
        assert treeViewFragment.isNodeExist('ieatnetsimv6035-12_RNC02RBS13')

        and: 'Select in a Node inside of first Leaf'
        treeViewFragment.clickNodeByName(RADIO_NODE4)

        when: 'Try to multiSelect other node inside of same leaf'
        treeViewFragment.pressCtrl()
        treeViewFragment.clickNodeByName(RADIO_NODE2)
        treeViewFragment.releaseCtrl()

        then: 'Verify what is selected'
        assert treeViewFragment.isNodeSelected(RADIO_NODE4)
        assert treeViewFragment.isNodeSelected(RADIO_NODE2)

        and: 'Select Node in first Leaf'
        treeViewFragment.clickNodeByName(RADIO_NODE4)

        and: 'Try multiselect with shift and ctrl'
        treeViewFragment.pressShift()
        treeViewFragment.clickNodeByName(RADIO_NODE3)
        treeViewFragment.releaseShift()

        and: 'Verify what is selected'
        assert treeViewFragment.isNodeSelected(RADIO_NODE3)
        assert treeViewFragment.isNodeSelected(RADIO_NODE4)
        assert treeViewFragment.isNodeSelected('ieatnetsimv6035-12_RNC02RBS13')
        assert treeViewFragment.isNodeNotSelected(CHILD_LEAF+'002')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()

    }

    def 'Check node is deselected correctly when clicking the node on the tree or using the clear option'() {
        given: 'Transport Topology with Leaf collection and nodes exists'
        treeViewFragment.setTopologyOnDB('rootWithLeafCollectionAndMultipleNodes')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        when: 'Transport Topology is selected and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        then: 'Expand the collection'
        treeViewFragment.expandNodeByName(CHILD_LEAF + '001')

        // START - deselect by node name scenario
        and: 'Node is selected'
        treeViewFragment.clickNodeByName(RADIO_NODE4)

        and: 'Selected count is 1'
        assert selectedContainerFragment.getSelectedCount() == 1

        and: 'Deselect the node by selecting it on the tree'
        treeViewFragment.clickNodeByName(RADIO_NODE4)

        then: 'Details panel is empty'
        detailsPanelFragment.isDetailsPanelEmpty()

        and: 'Selected count is 0'
        assert selectedContainerFragment.getSelectedCount() == 0
        // END - deselect by node name scenario

        // START - deselect using clear option scenario
        and: 'Node is selected again'
        treeViewFragment.clickNodeByName(RADIO_NODE4)

        and: 'Selected count is 1'
        assert selectedContainerFragment.getSelectedCount() == 1

        and: 'Deselect the node by using the clear option'
        selectedContainerFragment.clickOnClear()

        then: 'Details panel is empty'
        detailsPanelFragment.isDetailsPanelEmpty()

        and: 'Selected count is 0'
        assert selectedContainerFragment.getSelectedCount() == 0
        // END - deselect using clear option scenario

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Check nodes and collections cannot be multi-selected together'() {
        given: 'Transport Topology with Leaf collection and nodes exists'
        treeViewFragment.setTopologyOnDB('rootWithLeafCollectionAndMultipleNodes')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Expand leaf collections'
        collections.each {item ->
            treeViewFragment.expandNodeByName(item)
        }

        and: 'Select a node'
        treeViewFragment.clickNodeByName(RADIO_NODE4)

        and: 'Try select collections with ctrl click'
        collections.each {item ->
            treeViewFragment.pressCtrl()
            treeViewFragment.clickNodeByName(item)
            treeViewFragment.releaseCtrl()
        }

        and: 'Check only the node is selected'
        assert treeViewFragment.isNodeSelected(RADIO_NODE4)

        and: 'Check the collections are not selected'
        collections.each {item ->
            assert treeViewFragment.isNodeNotSelected(item)
        }

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()

        where:
        collections = [CHILD_LEAF + '001', CHILD_LEAF + '002']

    }

    def 'Check if No Children Found cannot be selected'(){
        given: 'Transport Topology with empty Leaf collection exists'
        treeViewFragment.setTopologyOnDB('rootWithLeafCollectionAndMultipleNodes')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Create a new Leaf'
        treeViewFragment.rightClick(TRANSPORT_TOPOLOGY)

        and : 'Select the Option and wait for flyout appear'
        treeViewFragment.clickInOption(CREATE_COLLECTION_ACTION)
        assert flyoutFragment.isFlyoutVisible()

        and: 'Create a Leaf Collection'
        flyoutFragment.writeName(CHILD_LEAF)
        flyoutFragment.clickOnCreate()

        and: 'Check if the leaf is created'
        flyoutFragment.waitFlyoutTOClose()
        assert treeViewFragment.isCustomTopology(true)
        assert treeViewFragment.isNodeSelected(TRANSPORT_TOPOLOGY)
        assert treeViewFragment.isNodeArrowDown(TRANSPORT_TOPOLOGY)
        assert treeViewFragment.isNodeExist(CHILD_LEAF)
        assert treeViewFragment.isNodeArrowRight(CHILD_LEAF)
        treeViewFragment.clickNodeByName(CHILD_LEAF)

        and: 'Expand Leafs'
        treeViewFragment.expandNodeByName(CHILD_LEAF)
        treeViewFragment.expandNodeByName(CHILD_LEAF+'001')
        treeViewFragment.expandNodeByName(CHILD_LEAF+'002')

        when: 'Verify that the Node exists'
        assert treeViewFragment.isNodeExist(NO_CHILDREN)

        //Added sleep to avoid fast multiple clicks of "no children found".
        //TODO UI-fix to prevent selection on selecting multiple times

        then: 'Try to select the node multiple times'
        treeViewFragment.clickNodeByName(NO_CHILDREN)
        Thread.sleep(300)
        treeViewFragment.clickNodeByName(NO_CHILDREN)
        Thread.sleep(300)
        treeViewFragment.clickNodeByName(NO_CHILDREN)

        and: 'verify if the node is not selected'
        assert treeViewFragment.isNodeNotSelected(NO_CHILDREN)

        and: 'Try to Multiselect Leafs with the No Children'
        treeViewFragment.clickNodeByName(CHILD_LEAF+'002')
        treeViewFragment.pressShift()
        treeViewFragment.clickNodeByName(NO_CHILDREN)
        treeViewFragment.releaseShift()

        and: 'Check if the other leaf and No Children is selected'
        assert treeViewFragment.isNodeNotSelected(NO_CHILDREN)
        assert treeViewFragment.isNodeSelected(CHILD_LEAF+'001')
        assert treeViewFragment.isNodeSelected(CHILD_LEAF+'002')

        and: 'Try to Multiselect Branch with other collections with the No Children'
        treeViewFragment.clickNodeByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.pressShift()
        treeViewFragment.clickNodeByName(NO_CHILDREN)
        treeViewFragment.releaseShift()

        and: 'Check if the other leaf and No Children is selected'
        assert treeViewFragment.isNodeNotSelected(NO_CHILDREN)
        assert treeViewFragment.isNodeNotSelected(CHILD_LEAF+'001')
        assert treeViewFragment.isNodeNotSelected(CHILD_LEAF+'002')
        assert treeViewFragment.isNodeSelected(CHILD_LEAF)
        assert treeViewFragment.isNodeSelected(TRANSPORT_TOPOLOGY)

        and: 'Try to Multiselect Nodes with the No Children'
        treeViewFragment.clickNodeByName(RADIO_NODE4)
        treeViewFragment.pressShift()
        treeViewFragment.clickNodeByName(NO_CHILDREN)
        treeViewFragment.releaseShift()

        and: 'Check if the other leaf and No Children is selected'
        assert treeViewFragment.isNodeNotSelected(NO_CHILDREN)
        assert treeViewFragment.isNodeNotSelected(CHILD_LEAF+'001')
        assert treeViewFragment.isNodeNotSelected(CHILD_LEAF+'002')
        assert treeViewFragment.isNodeNotSelected(CHILD_LEAF)
        assert treeViewFragment.isNodeSelected(RADIO_NODE2)
        assert treeViewFragment.isNodeSelected(RADIO_NODE4)

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()

    }

    def 'Check RightClick Function'() {
        given: 'Transport Topology with Leaf collection exists'
        treeViewFragment.setTopologyOnDB('singleRoot')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        when: 'Right click on the Transport and Select Create Collection'
        treeViewFragment.rightClick(TRANSPORT_TOPOLOGY)

        and : 'Select the Option and wait for flyout appear'
        treeViewFragment.clickInOption(CREATE_COLLECTION_ACTION)
        assert flyoutFragment.isFlyoutVisible()

        then: 'Create a Branch'
        flyoutFragment.writeName(BRANCH_NAME)
        flyoutFragment.clickOnBranchOption()
        flyoutFragment.clickOnCreate()

        and: 'Check if the branch is created'
        flyoutFragment.waitFlyoutTOClose()
        assert treeViewFragment.isCustomTopology(true)
        assert treeViewFragment.isNodeSelected(TRANSPORT_TOPOLOGY)
        assert treeViewFragment.isNodeArrowDown(TRANSPORT_TOPOLOGY)
        assert treeViewFragment.isNodeExist(BRANCH_NAME)
        assert treeViewFragment.isNodeArrowRight(BRANCH_NAME)
        treeViewFragment.clickNodeByName(BRANCH_NAME)

        and: 'Right click on branch and Create a Leaf Collection'
        treeViewFragment.rightClick(BRANCH_NAME)

        and : 'Select the Option and wait for flyout appear'
        treeViewFragment.clickInOption(CREATE_COLLECTION_ACTION)
        assert flyoutFragment.isFlyoutVisible()

        then: 'Create a Leaf Collection'
        flyoutFragment.writeName(LEAF_NAME)
        flyoutFragment.clickOnCreate()

        and: 'Check if the leaf is created'
        flyoutFragment.waitFlyoutTOClose()
        assert treeViewFragment.isCustomTopology(true)
        assert treeViewFragment.isNodeSelected(BRANCH_NAME)
        assert treeViewFragment.isNodeArrowDown(BRANCH_NAME)
        assert treeViewFragment.isNodeExist(LEAF_NAME)
        assert treeViewFragment.isNodeArrowRight(LEAF_NAME)
        treeViewFragment.clickNodeByName(LEAF_NAME)

        and: 'Right click in the leaf collection to add node'
        treeViewFragment.rightClick(LEAF_NAME)
        treeViewFragment.clickInOption(ADD_TOPOLOGY_DATA_ACTION)

        and: 'Verify that  "Add Topology Data" (Scoping Panel) fly-in is displayed'
        assert addTopologyDataFragment.isScopingPanelVisible()

        and : 'Verify that "Add Topology Data" displays "Topology" tab (selected by default)'
        assert addTopologyDataFragment.isTopologyTabDefaultInScopingPanel()

        and: 'Expand Dropdown and select Network Data'
        udtDropdownFragment.expandDropdownScopingPanel()
        udtDropdownFragment.selectByNameScopingPanel(NETWORK_DATA)

        and: 'Try to add node to Leaf Collection CHILD_LEAF+001'
        addTopologyDataFragment.clickNodeByName(RNC + "01")
        addTopologyDataFragment.clickOnAddButton()
        addTopologyDataFragment.waitScopingPanelToClose()

        and: 'Verify that the Node added from Scoping Panel exists and Leaf is selected'
        assert treeViewFragment.isNodeSelected(LEAF_NAME)
        assert treeViewFragment.isNodeExist(LEAF_NAME)

        and: 'Select Node and Remove'
        assert treeViewFragment.isNodeExist(RNC + "01")
        addTopologyDataFragment.clickNodeByName(RNC + "01")
        treeViewFragment.rightClick(RNC + "01")
        treeViewFragment.clickInOption("Remove from Collection")

        and: 'Wait for the Dialog box with the buttons to confirm the Removal'
        dialogFragment.buttonClick("Remove")
        assert treeViewFragment.isLoadingNotVisible()

        and: 'Verify that the Node exists'
        assert treeViewFragment.isNodeNotExist(RNC + "01")

        and: 'Verify if the leaf Collection is selected'
        assert treeViewFragment.isNodeSelected(LEAF_NAME)

        and: 'Right Click the leaf Collection'
        treeViewFragment.rightClick(LEAF_NAME)
        treeViewFragment.clickInOption(DELETE_ACTION)

        and: 'Delete is confirmed'
        assert dialogFragment.isDialogVisible()
        dialogFragment.buttonClick(DELETE_ACTION)
        dialogFragment.buttonClick("OK")

        then: 'Verify that the deleted Leaf does not exist and branch collection is selected'
        assert treeViewFragment.isNodeNotExist(LEAF_NAME)
        assert treeViewFragment.isNodeSelected(BRANCH_NAME)

        and: 'Right Click the leaf Collection'
        treeViewFragment.rightClick(BRANCH_NAME)
        treeViewFragment.clickInOption(DELETE_ACTION)

        and: 'Delete is confirmed'
        assert dialogFragment.isDialogVisible()
        dialogFragment.buttonClick(DELETE_ACTION)
        dialogFragment.buttonClick("OK")

        then: 'Verify that the deleted Leaf does not exist and root is selected'
        assert treeViewFragment.isNodeNotExist(BRANCH_NAME)
        assert treeViewFragment.isNodeSelected(TRANSPORT_TOPOLOGY)

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Create Custom Topology'() {
        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'Topology dropdown is visible and expanded'
        udtDropdownFragment.expandDropdown()

        when: 'Create a Custom Topology is visible'
        udtDropdownFragment.checkDropDownItemIsVisible(CREATE_CUSTOM_TOPOLOGY)

        and: 'Create a Custom Topology is clicked'
        udtDropdownFragment.selectByName(CREATE_CUSTOM_TOPOLOGY)

        and: 'Create Custom Topology flyout is visible and we input the collection name'
        flyoutFragment.writeName(NEW_CUSTOM_TOPOLOGY)

        and: 'Click create'
        flyoutFragment.clickOnCreate()
        flyoutFragment.waitFlyoutTOClose()

        and: 'Make sure that the current topology is the newly created topology'
        udtDropdownFragment.expandDropdown()
        udtDropdownFragment.selectByName(NEW_CUSTOM_TOPOLOGY)

        and: 'Click create collection'
        treeViewFragment.expandNodeByName(NEW_CUSTOM_TOPOLOGY)
        treeViewFragment.rightClick(NEW_CUSTOM_TOPOLOGY)
        treeViewFragment.clickInOption(CREATE_COLLECTION_ACTION)

        and: 'Create a leaf collection '
        flyoutFragment.writeName(NEW_LEAF)
        flyoutFragment.clickOnLeafOption()
        flyoutFragment.clickOnCreate()
        flyoutFragment.waitFlyoutTOClose()

        and: 'Right click and Add Topology Data'
        treeViewFragment.rightClick(NEW_LEAF)
        treeViewFragment.clickInOption(ADD_TOPOLOGY_DATA_ACTION)

        and: 'Verify that "Add Topology Data" (Scoping Panel) fly-in is displayed'
        assert addTopologyDataFragment.isScopingPanelVisible()

        and: 'Verify that "Add Topology Data" displays "Topology" tab (selected by default)'
        assert addTopologyDataFragment.isTopologyTabDefaultInScopingPanel()

        and: 'Expand Dropdown and select Network Data'
        udtDropdownFragment.expandDropdownScopingPanel()
        udtDropdownFragment.selectByNameScopingPanel(NETWORK_DATA)

        and: 'Add an object to that leaf collection'
        addTopologyDataFragment.clickNodeByName('RNC01')
        addTopologyDataFragment.clickOnAddButton()

        then: 'Verify that the object has been added'
        treeViewFragment.expandNodeByName(NEW_LEAF)
        treeViewFragment.isNodeExist('RNC01')

        cleanup:
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }
}