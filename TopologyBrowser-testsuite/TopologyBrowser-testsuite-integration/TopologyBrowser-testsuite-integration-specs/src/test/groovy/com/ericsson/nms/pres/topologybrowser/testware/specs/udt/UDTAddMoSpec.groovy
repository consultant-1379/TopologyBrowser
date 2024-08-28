package com.ericsson.nms.pres.topologybrowser.testware.specs.udt

import com.ericsson.nms.pres.topologybrowser.testware.data.Duplication
import com.ericsson.nms.pres.topologybrowser.testware.pages.*
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Specification

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.*

@RunWith(ArquillianSputnik)
class UDTAddMoSpec extends Specification {
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

    def networkData = Duplication.getNetworkData()
    def leafData = Duplication.getLeafData()
    def leafBranchData = Duplication.getLeafBranchData()
    def 'Add nodes to existing Leaf Collection'() {
        given: 'Transport Topology with Leaf collection exists'
        treeViewFragment.setTopologyOnDB('rootWithLeafCollection')

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

        when: 'Click on "Add Topology Data" action button'
        actionsBarFragment.clickActionButton(ADD_TOPOLOGY_DATA_ACTION)

        then: 'Verify that  "Add Topology Data" (Scoping Panel) fly-in is displayed'
        assert addTopologyDataFragment.isScopingPanelVisible()

        and : 'Verify that "Add Topology Data" displays "Topology" tab (selected by default)'
        assert addTopologyDataFragment.isTopologyTabDefaultInScopingPanel()

        and: 'Expand Dropdown and select Network Data'
        udtDropdownFragment.expandDropdownScopingPanel()
        udtDropdownFragment.selectByNameScopingPanel(NETWORK_DATA)

        when: 'Try to add node to Leaf branch CHILD_LEAF+001'
        addTopologyDataFragment.clickNodeByName(RNC + "01")
        addTopologyDataFragment.clickOnAddButton()
        addTopologyDataFragment.waitScopingPanelToClose()

        then: 'Verify that the Node added from Scoping Panel exists and Leaf is selected'
        assert treeViewFragment.isNodeExist(RNC + "01")
        assert treeViewFragment.isNodeSelected(CHILD_LEAF+'001')

        and: 'Verify that the new node(s) are not selected by default'
        assert treeViewFragment.isNodeNotSelected(RNC + "01")

        and: 'Verify that the Leaf Collection arrow is pointing down to indicate the collection is expanded.'
        assert treeViewFragment.isNodeArrowDown(CHILD_LEAF+'001')

        and: 'Verify that the Leaf collection can be collapsed (arrow ends up pointing to the right)'
        treeViewFragment.collapseNodeByName(CHILD_LEAF+'001')
        assert treeViewFragment.isNodeArrowRight(CHILD_LEAF+'001')

        and: 'Verify that the Leaf collection can be expanded (arrow ends up pointing downwards)'
        treeViewFragment.expandNodeByName(CHILD_LEAF+'001')
        assert treeViewFragment.isNodeArrowDown(CHILD_LEAF+'001')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Add same MO(s) to multiple collection'() {

        def networkDataNodes = networkData.values() as List<String>


        given: 'Transport topology with nine branch collections'
        treeViewFragment.setTopologyOnDB('rootWithTwoLeafCollection')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)

        and: 'Tree view switches to "Transport Topology"'
        assert treeViewFragment.isCustomTopology(true)

        and: '"Transport Topology" expanded'
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        leafData.each { key, value ->

            when: 'Leaf Collection exists and is selected "$key"'
            treeViewFragment.clickNodeByName(key)

            then: 'Click on "Add Topology Data" action button'
            actionsBarFragment.clickActionButton(ADD_TOPOLOGY_DATA_ACTION)

            and: 'Verify that  "Add Topology Data" (Scoping Panel) fly-in is displayed'
            assert addTopologyDataFragment.isScopingPanelVisible()

            and : 'Verify that "Add Topology Data" displays "Topology" tab (selected by default)'
            assert addTopologyDataFragment.isTopologyTabDefaultInScopingPanel()

            and: 'Expand Dropdown and select Network Data'
            udtDropdownFragment.expandDropdownScopingPanel()
            udtDropdownFragment.selectByNameScopingPanel(NETWORK_DATA)

            when: 'Expand "RNC01" and select nodes'
            addTopologyDataFragment.expandNodeByName(RNC + "01")

            then: 'Select nodes'
            addTopologyDataFragment.multiSelect(networkDataNodes)

            and: 'Add nodes into topology'
            addTopologyDataFragment.clickOnAddButton()
            addTopologyDataFragment.waitScopingPanelToClose()

            and: 'Added nodes must exist'
            networkData.each { name, id ->
                assert treeViewFragment.isNodeExistForId(value + ":" + id)
            }

            cleanup:
            treeViewFragment.resetDropdownSettings()
        }

        when: 'Select one duplicate leaf node'
        treeViewFragment.clickNodeById(leafData[CHILD_LEAF + '001'] + ":" + networkData[RADIO_NODE_13])

        then: 'Only selected node (duplicate) keep selection'
        assert treeViewFragment.isNodeSelectedForId(leafData[CHILD_LEAF + '001'] + ":" + networkData[RADIO_NODE_13])

        and: 'Other duplication node not keep selection'
        assert !treeViewFragment.isNodeNotSelectedForId(leafData[CHILD_LEAF + '002'] + ":" + networkData[RADIO_NODE_13])

        and: 'Un select the node'
        treeViewFragment.clickNodeById(leafData[CHILD_LEAF + '001'] + ":" + networkData[RADIO_NODE_13])

        when: 'Select both duplicate leaf node'
        treeViewFragment.pressCtrl()
        leafData.each { key, value ->
            treeViewFragment.clickNodeById(value + ":" + networkData[RADIO_NODE_13])
        }
        treeViewFragment.releaseCtrl()

        then: 'Keep selected both duplicate nodes'
        leafData.each { key, value ->
            assert treeViewFragment.isNodeSelectedForId(value + ":" + networkData[RADIO_NODE_13])
        }

        when: 'Collapse both parents'
        leafData.each { key, value ->
            treeViewFragment.collapseNodeByName(key)
        }

        then: 'Expand both parents again'
        leafData.each { key, value ->
            treeViewFragment.expandNodeByName(key)
        }

        and: 'Keep selected both duplicate nodes'
        then: 'Keep selected both duplicate nodes'
        leafData.each { key, value ->
            assert treeViewFragment.isNodeSelectedForId(value + ":" + networkData[RADIO_NODE_13])
        }

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
    }

    def 'Duplication on each level'() {

        def networkDataNodes = networkData.values() as List<String>

        given: 'Transport topology with nine branch collections'
        treeViewFragment.setTopologyOnDB('rootWithNineBothCollection')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)

        and: 'Tree view switches to "Transport Topology"'
        assert treeViewFragment.isCustomTopology(true)

        and: '"Transport Topology" expanded'
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Create duplicate data on each level'
        1.upto(9, {
            when: 'Leaf Collection exists and is selected "$it"'
            treeViewFragment.clickNodeByName('child_leaf_00' + it)

            then: 'Click on "Add Topology Data" action button'
            actionsBarFragment.clickActionButton(ADD_TOPOLOGY_DATA_ACTION)

            and: 'Verify that  "Add Topology Data" (Scoping Panel) fly-in is displayed'
            assert addTopologyDataFragment.isScopingPanelVisible()

            and : 'Verify that "Add Topology Data" displays "Topology" tab (selected by default)'
            assert addTopologyDataFragment.isTopologyTabDefaultInScopingPanel()

            and: 'Expand Dropdown and select Network Data'
            udtDropdownFragment.expandDropdownScopingPanel()
            udtDropdownFragment.selectByNameScopingPanel(NETWORK_DATA)

            when: 'Expand "RNC01" and select nodes'
            addTopologyDataFragment.expandNodeByName(RNC + "01")

            then: 'Select nodes'
            addTopologyDataFragment.multiSelect(networkDataNodes)

            and: 'Add nodes into topology'
            addTopologyDataFragment.clickOnAddButton()
            addTopologyDataFragment.waitScopingPanelToClose()

            and: 'Added nodes must exist'
            networkData.each { name, id ->
                assert treeViewFragment.isNodeExistForId(leafBranchData[CHILD_LEAF + '00' + it] + ":" + id)
            }
            treeViewFragment.collapseNodeByName(CHILD_LEAF + '00' + it)

            and: 'Expand next level branch'
            if (it < 9) {
                treeViewFragment.expandNodeByName(CHILD_BRANCH + '00' + it)
            }

            cleanup:
            treeViewFragment.resetDropdownSettings()
        })

        and: 'Expand and check duplication nodes, then collapse branch'
        1.upto(9, {
            int next = 10 - it
            treeViewFragment.expandNodeByName(CHILD_LEAF + '00' + next)
            networkData.each { name, id ->
                assert treeViewFragment.isNodeExistForId(leafBranchData[CHILD_LEAF + '00' + next] + ":" + id)
            }
            treeViewFragment.collapseNodeByName(CHILD_LEAF + '00' + next)
            if (it < 9) {
                int nextParent = 10 - (it + 1)
                treeViewFragment.collapseNodeByName(CHILD_BRANCH + '00' + nextParent)
            }
        })

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
    }

    def 'Add nodes to existing Search Criteria Collection is not possible'() {
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

        when: 'Leaf Collection exists and is selected'
            treeViewFragment.expandNodeByName(CHILD_LEAF+'001')
            treeViewFragment.clickNodeByName(CHILD_LEAF+'001')

        then: '"Add Topology Data" action button is not available'
            assert actionsBarFragment.isButtonNotPresent(ADD_TOPOLOGY_DATA_ACTION)

        cleanup: 'Clear the DB and bring default data'
            treeViewFragment.clearDB()
            treeViewFragment.resetDropdownSettings()
    }
}