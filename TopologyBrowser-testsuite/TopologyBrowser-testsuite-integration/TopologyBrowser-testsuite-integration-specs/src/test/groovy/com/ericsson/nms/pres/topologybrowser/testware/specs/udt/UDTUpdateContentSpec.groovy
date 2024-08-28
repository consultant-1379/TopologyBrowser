package com.ericsson.nms.pres.topologybrowser.testware.specs.udt

import com.ericsson.nms.pres.topologybrowser.testware.data.Duplication
import com.ericsson.nms.pres.topologybrowser.testware.pages.*
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Specification

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.*
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.NetworkData.*

@RunWith(ArquillianSputnik)
class UDTUpdateContentSpec extends Specification {
    @Page
    private TopologyBrowserPage topologyBrowserPage
    @Page
    private UDTDropdownFragment udtDropdownFragment
    @Page
    private TreeViewFragment treeViewFragment
    @Page
    private ActionsBarFragment actionsBarFragment
    @Page
    private AddTopologyDataFragment addTopologyDataFragment
    @Page
    private FlyoutFragment flyoutFragment

    def networkData = Duplication.getNetworkData()
    def leafData = Duplication.getLeafData()
    def leafBranchData = Duplication.getLeafBranchData()
    def 'Update contents of existing Search Criteria Collection '() {
        given: 'Transport Topology with Search Criteria collection exists'
        treeViewFragment.setTopologyOnDB('rootWithSearchCriteriaCollection')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Search Criteria Collection exists and is selected'
        treeViewFragment.expandNodeByName(CHILD_LEAF+'001')
        treeViewFragment.clickNodeByName(CHILD_LEAF+'001')

        when: 'Click on "Update Contents" action button'
        actionsBarFragment.clickActionButton(UPDATE_CONTENTS_ACTION)

        then: 'Verify that the Node exists and Search Criteria is selected'
        assert treeViewFragment.isNodeExist(RNC + "01")
        assert treeViewFragment.isNodeSelected(CHILD_LEAF+'001')

        and: 'Verify that the new node(s) are not selected by default'
        assert treeViewFragment.isNodeNotSelected(RNC + "01")

        and: 'Verify that the Search Criteria Collection arrow is pointing down to indicate the collection is expanded.'
        assert treeViewFragment.isNodeArrowDown(CHILD_LEAF+'001')

        and: 'Verify that the Search Criteria collection can be collapsed (arrow ends up pointing to the right)'
        treeViewFragment.collapseNodeByName(CHILD_LEAF+'001')
        assert treeViewFragment.isNodeArrowRight(CHILD_LEAF+'001')

        and: 'Verify that the Search Criteria collection can be expanded (arrow ends up pointing downwards)'
        treeViewFragment.expandNodeByName(CHILD_LEAF+'001')
        assert treeViewFragment.isNodeArrowDown(CHILD_LEAF+'001')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Edit search criteria of existing Search Criteria Collection '() {
        given: 'Transport Topology with Search Criteria collection exists'
            treeViewFragment.setTopologyOnDB('rootWithSearchCriteriaCollection')

        and: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
            udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
            udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
            treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Search Criteria Collection exists and is selected'
            treeViewFragment.expandNodeByName(CHILD_LEAF+'001')
            treeViewFragment.clickNodeByName(CHILD_LEAF+'001')

        and: 'Search Criteria Collection has nodes'
            assert treeViewFragment.isNodeExist(NODE_11)

        when: 'Click on "Edit Criteria" action button'
            actionsBarFragment.clickActionButton(EDIT_CRITERIA_ACTION)

        then: 'Select search criteria'
            flyoutFragment.clickOnSearchCriteria()
            flyoutFragment.clickOnSave()

        then: 'Verify that the Node exists and Search Criteria is selected'
            assert treeViewFragment.isNodeExist(RNC + "01")
            assert treeViewFragment.isNodeNotExist(NODE_11)
            assert treeViewFragment.isNodeSelected(CHILD_LEAF+'001')

        and: 'Verify that the new node(s) are not selected by default'
            assert treeViewFragment.isNodeNotSelected(RNC + "01")

        and: 'Verify that the Search Criteria Collection arrow is pointing down to indicate the collection is expanded.'
            assert treeViewFragment.isNodeArrowDown(CHILD_LEAF+'001')

        and: 'Verify that the Search Criteria collection can be collapsed (arrow ends up pointing to the right)'
            treeViewFragment.collapseNodeByName(CHILD_LEAF+'001')
            assert treeViewFragment.isNodeArrowRight(CHILD_LEAF+'001')

        and: 'Verify that the Search Criteria collection can be expanded (arrow ends up pointing downwards)'
            treeViewFragment.expandNodeByName(CHILD_LEAF+'001')
            assert treeViewFragment.isNodeArrowDown(CHILD_LEAF+'001')

        cleanup: 'Clear the DB and bring default data'
            treeViewFragment.clearDB()
            treeViewFragment.resetDropdownSettings()
    }
}