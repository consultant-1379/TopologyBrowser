package com.ericsson.nms.pres.topologybrowser.testware.specs.udt

import com.ericsson.nms.pres.topologybrowser.testware.pages.*
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Specification

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.TRANSPORT_TOPOLOGY
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.CHILD_LEAF

@RunWith(ArquillianSputnik)
class UDTRemoveSpec extends Specification {
    @Page
    private TopologyBrowserPage topologyBrowserPage
    @Page
    private UDTDropdownFragment udtDropdownFragment
    @Page
    private TreeViewFragment treeViewFragment
    @Page
    private ActionsBarFragment actionsBarFragment
    @Page
    private DialogFragment dialogFragment

    def 'Remove nodes from a collection'() {
        given: 'Transport Topology with Leaf collection exists'
        treeViewFragment.setTopologyOnDB('rootWithLeafCollectionAndNodes')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Leaf Collection exists and is selected'
        treeViewFragment.expandNodeByName(CHILD_LEAF+'001')
        treeViewFragment.clickNodeByName(CHILD_LEAF+'001')

        when: 'Verify that the Node exists and click on the node'
        assert treeViewFragment.isNodeExist('LTE02ERBS00111')
        treeViewFragment.getNodeByName('LTE02ERBS00111')

        then: 'Click in the node'
        treeViewFragment.clickNodeByName('LTE02ERBS00111')

        and: 'Wait for the action buttons and click to Remove from Collection'
        actionsBarFragment.getActionButton("Remove from Collection")
        actionsBarFragment.clickActionButton("Remove from Collection")

        and: 'Verify if the cancel button is working'
        assert dialogFragment.isDialogVisible()
        dialogFragment.buttonClick('Cancel')

        and: 'Verify that the Node exists'
        assert treeViewFragment.isNodeExist('LTE02ERBS00111')

        and: 'Wait for the action buttons and click to Remove from Collection'
        actionsBarFragment.getActionButton("Remove from Collection")
        actionsBarFragment.clickActionButton("Remove from Collection")

        and: 'Wait for the Dialog box with the buttons to confirm the Removal'
        dialogFragment.buttonClick('Remove')
        assert treeViewFragment.isLoadingNotVisible()

        and: 'Verify that the Node exists'
        assert treeViewFragment.isNodeNotExist('LTE02ERBS00111')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Remove multiple nodes from a collection'() {
        given: 'Transport Topology with Leaf collection exists'
        treeViewFragment.setTopologyOnDB('rootWithLeafCollectionAndNodes')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Leaf Collection exists and is selected'
        treeViewFragment.expandNodeByName(CHILD_LEAF+'001')
        treeViewFragment.clickNodeByName(CHILD_LEAF+'001')

        when: 'Verify that the Nodes exists'
        assert treeViewFragment.isNodeExist('LTE02ERBS00111')
        assert treeViewFragment.isNodeExist('ieatnetsimv6035-12_RNC01RBS03')
        treeViewFragment.getNodeByName('LTE02ERBS00111')

        then: 'Click in the nodes'
        treeViewFragment.clickNodeByName('LTE02ERBS00111')
        treeViewFragment.pressCtrl()
        treeViewFragment.clickNodeByName('ieatnetsimv6035-12_RNC01RBS03')
        treeViewFragment.releaseCtrl()

        and: 'Wait for the action buttons and click to Remove from Collection'
        actionsBarFragment.getActionButton("Remove from Collection")
        actionsBarFragment.clickActionButton("Remove from Collection")

        and: 'Verify if the cancel button is working'
        assert dialogFragment.isDialogVisible()
        dialogFragment.buttonClick('Cancel')

        and: 'Verify that the Node exists'
        assert treeViewFragment.isNodeExist('LTE02ERBS00111')
        assert treeViewFragment.isNodeExist('ieatnetsimv6035-12_RNC01RBS03')

        and: 'Wait for the action buttons and click to Remove from Collection'
        actionsBarFragment.getActionButton("Remove from Collection")
        actionsBarFragment.clickActionButton("Remove from Collection")

        and: 'Wait for the Dialog box with the buttons to confirm the Removal'
        dialogFragment.buttonClick('Remove')
        assert treeViewFragment.isLoadingNotVisible()

        and: 'Verify that the Node exists'
        assert treeViewFragment.isNodeNotExist('LTE02ERBS00111')
        assert treeViewFragment.isNodeNotExist('ieatnetsimv6035-12_RNC01RBS03')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    //TODO TO Be stabilized
//    def 'Remove nodes from a collection without affect the duplicated nodes in other collection'() {
//        given: 'Transport Topology with Leaf collection exists'
//        treeViewFragment.setTopologyOnDB('rootWithLeafCollectionAndDuplicatedNodes')
//
//        and: 'Topology Browser is open'
//        topologyBrowserPage.refreshTopologyBrowserPage()
//        topologyBrowserPage.openTopologyBrowser(true)
//
//        and: 'UDT dropdown exists and is expanded'
//        udtDropdownFragment.expandDropdown()
//
//        and: '"Transport Topology" is clicked and expanded'
//        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
//        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)
//
//        and: 'Leaf Collection exists'
//        treeViewFragment.expandNodeByName(CHILD_LEAF+'001')
//
//        and: 'Verify that the Node exists and click on the node'
//        assert treeViewFragment.isNodeExist('LTE02ERBS00111')
//
//        and: 'Collapse First collection and expand the second'
//        treeViewFragment.collapseNodeByName(CHILD_LEAF+'001')
//        treeViewFragment.expandNodeByName(CHILD_LEAF+'002')
//
//        and: 'Verify that the Node exists and click on the node'
//        assert treeViewFragment.isNodeExist('LTE02ERBS00111')
//        treeViewFragment.getNodeByName('LTE02ERBS00111')
//
//        when: 'Click in the node'
//        treeViewFragment.clickNodeByName('LTE02ERBS00111')
//
//        then: 'Wait for the action buttons and click to Remove from Collection'
//        actionsBarFragment.getActionButton("Remove from Collection")
//        actionsBarFragment.clickActionButton("Remove from Collection")
//
//        and: 'Verify if the cancel button is working'
//        dialogFragment.buttonClick('Cancel')
//
//        and: 'Verify that the Node exists'
//        assert treeViewFragment.isNodeExist('LTE02ERBS00111')
//
//        and: 'Wait for the action buttons and click to Remove from Collection'
//        actionsBarFragment.getActionButton("Remove from Collection")
//        actionsBarFragment.clickActionButton("Remove from Collection")
//
//        and: 'Wait for the Dialog box with the buttons to confirm the Removal'
//        dialogFragment.buttonClick('Remove')
//        assert treeViewFragment.isLoadingNotVisible()
//
//        and: 'Verify that the Node exists'
//        assert treeViewFragment.isNodeNotExist('LTE02ERBS00111')
//
//        and: 'Collapse Second collection and expand the second'
//        treeViewFragment.collapseNodeByName(CHILD_LEAF+'002')
//        treeViewFragment.expandNodeByName(CHILD_LEAF+'001')
//
//        and: 'Verify that the Node exists and click on the node'
//        assert treeViewFragment.isNodeExist('LTE02ERBS00111')
//
//        cleanup: 'Clear the DB and bring default data'
//        treeViewFragment.clearDB()
//        treeViewFragment.resetDropdownSettings()
//    }

    def 'Remove nodes from Search Criteria collection is not possible.'() {
        given: 'Transport Topology with Leaf collection exists'
            treeViewFragment.setTopologyOnDB('rootWithSearchCriteriaCollection')

        and: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
            udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
            udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
            treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Leaf Collection exists and is selected'
            treeViewFragment.expandNodeByName(CHILD_LEAF+'001')
            treeViewFragment.clickNodeByName(CHILD_LEAF+'001')

        when: 'Verify that the Node exists and click on the node'
            assert treeViewFragment.isNodeExist('LTE02ERBS00111')
            treeViewFragment.getNodeByName('LTE02ERBS00111')

        then: 'Click in the node'
            treeViewFragment.clickNodeByName('LTE02ERBS00111')

        and: 'Wait for the action buttons and click to Remove from Collection'
            assert actionsBarFragment.isButtonNotPresent("Remove from Collection")

        and: 'Verify if any other action button is working'
            assert actionsBarFragment.isButtonVisible("Initiate CM Sync")

        cleanup: 'Clear the DB and bring default data'
            treeViewFragment.clearDB()
    }

}
