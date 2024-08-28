package com.ericsson.nms.pres.topologybrowser.testware.specs.networkdata

import com.ericsson.nms.pres.topologybrowser.testware.pages.ActionsBarFragment
import com.ericsson.nms.pres.topologybrowser.testware.pages.DialogFragment
import com.ericsson.nms.pres.topologybrowser.testware.pages.SelectedContainerFragment
import com.ericsson.nms.pres.topologybrowser.testware.pages.TopologyBrowserPage
import com.ericsson.nms.pres.topologybrowser.testware.pages.TreeViewFragment
import com.ericsson.nms.pres.topologybrowser.testware.pages.UDTDropdownFragment
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Specification
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.NetworkData.*
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.*

@RunWith(ArquillianSputnik)
class RefreshSpec extends Specification {
    @Page
    TopologyBrowserPage topologyBrowserPage
    @Page
    UDTDropdownFragment udtDropdownFragment
    @Page
    TreeViewFragment treeViewFragment
    @Page
    ActionsBarFragment actionsBarFragment
    @Page
    SelectedContainerFragment selectedContainerFragment
    @Page
    DialogFragment dialogFragment


    def 'Check refresh on default topology' () {
        def roots = [SUB_NETWORK_1, SUB_NETWORK_2, ALL_OTHER_NODES]
        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'Verify roots are exist'
        roots.each {root ->
            assert treeViewFragment.isNodeExist(root)
        }

        when: 'Refresh the topology'
        selectedContainerFragment.clickOnRefresh()

        then: 'Verify roots are exist after refresh'
        roots.each {root ->
            assert treeViewFragment.isNodeExist(root)
        }
    }

    def 'Check refresh on expansion' () {
        def roots = [SUB_NETWORK_1, SUB_NETWORK_2, ALL_OTHER_NODES]
        def nodes = [NODE_1, NODE_2, NODE_3, NODE_4]
        def expansions = [SUB_NETWORK_1]
        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'Expand nodes'
        expansions.each {node ->
            treeViewFragment.expandNodeByName(node)
        }

        and: 'Roots and nodes should exist'
        roots.each {root ->
            assert treeViewFragment.isNodeExist(root)
        }
        nodes.each {node ->
            assert treeViewFragment.isNodeExist(node)
        }

        when: 'Refresh the topology'
        selectedContainerFragment.clickOnRefresh()

        then: 'Verify roots and nodes exist after refresh'
        roots.each {root ->
            assert treeViewFragment.isNodeExist(root)
        }
        nodes.each {node ->
            assert treeViewFragment.isNodeExist(node)
        }

        and: 'Verify expansions'
        expansions.each {node ->
            assert treeViewFragment.isNodeArrowDown(node)
        }
    }

    def 'Check refresh on expansions - different parents' () {
        def roots = [SUB_NETWORK_1, SUB_NETWORK_2, ALL_OTHER_NODES]
        def nodes = [NODE_1, NODE_2, NODE_3, NODE_4, NODE_5, NODE_6, NODE_7, NODE_8, NODE_9]
        def expansions = [SUB_NETWORK_1, SUB_NETWORK_2]

        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'Expand nodes'
        expansions.each {node ->
            treeViewFragment.expandNodeByName(node)
        }

        and: 'Roots and nodes should exist'
        roots.each {root ->
            assert treeViewFragment.isNodeExist(root)
        }
        nodes.each {node ->
            assert treeViewFragment.isNodeExist(node)
        }

        when: 'Refresh the topology'
        selectedContainerFragment.clickOnRefresh()

        then: 'Verify roots and nodes exist after refresh'
        roots.each {root ->
            assert treeViewFragment.isNodeExist(root)
        }
        nodes.each {node ->
            assert treeViewFragment.isNodeExist(node)
        }

        and: 'Verify expansions after refresh'
        expansions.each {node ->
            assert treeViewFragment.isNodeArrowDown(node)
        }
    }

    def 'Check refresh on expansion - No children found' () {
        def roots = [SUB_NETWORK_1,]
        def nodes = [NODE_1, NODE_2, NODE_3, NODE_4, NO_CHILDREN_FOUND]
        def expansions = [SUB_NETWORK_1, NODE_4]

        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'Expand nodes'
        expansions.each {node ->
            treeViewFragment.expandNodeByName(node)
        }

        and: 'Roots and nodes should exist'
        roots.each {root ->
            assert treeViewFragment.isNodeExist(root)
        }
        nodes.each {node ->
            assert treeViewFragment.isNodeExist(node)
        }

        when: 'Refresh the topology'
        selectedContainerFragment.clickOnRefresh()

        then: 'Verify roots and nodes exist after refresh'
        roots.each {root ->
            assert treeViewFragment.isNodeExist(root)
        }
        nodes.each {node ->
            assert treeViewFragment.isNodeExist(node)
        }

        and: 'Verify expansions after refresh'
        expansions.each {node ->
            assert treeViewFragment.isNodeArrowDown(node)
        }
    }

    def 'Check refresh on root selection' () {
        def roots = [SUB_NETWORK_1, SUB_NETWORK_2, ALL_OTHER_NODES]
        def selections = [SUB_NETWORK_1]

        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'Verify roots are exist'
        roots.each {root ->
            assert treeViewFragment.isNodeExist(root)
        }

        and: 'Select the root (RNC01)'
        selections.each {selection ->
            treeViewFragment.clickNodeByName(selection)
        }

        when: 'Refresh the topology'
        selectedContainerFragment.clickOnRefresh()

        then: 'Verify roots are exist after refresh'
        roots.each {root ->
            assert treeViewFragment.isNodeExist(root)
        }

        and: 'Verify root is selected after refresh'
        selections.each {selection ->
            assert treeViewFragment.isNodeSelected(selection)
        }

    }

    def 'Check refresh on both expansion and selection' () {
        def roots = [SUB_NETWORK_1, SUB_NETWORK_2, ALL_OTHER_NODES]
        def nodes = [NODE_1, NODE_2, NODE_3, NODE_4, NODE_5, NODE_6, NODE_7, NODE_8, NODE_9]
        def expansions = [SUB_NETWORK_1, SUB_NETWORK_2, NODE_3]
        def selections = [SUB_NETWORK_1, NODE_3]

        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'Expand nodes'
        expansions.each {node ->
            treeViewFragment.expandNodeByName(node)
        }

        and: 'Roots and nodes should exist'
        roots.each {root ->
            assert treeViewFragment.isNodeExist(root)
        }
        nodes.each {node ->
            assert treeViewFragment.isNodeExist(node)
        }

        and: 'Select some nodes'
        treeViewFragment.pressCtrl()
        selections.each {selection ->
            treeViewFragment.clickNodeByName(selection)
        }
        treeViewFragment.releaseCtrl()

        when: 'Refresh the topology'
        selectedContainerFragment.clickOnRefresh()

        then: 'Verify roots and nodes exist after refresh'
        roots.each {root ->
            assert treeViewFragment.isNodeExist(root)
        }
        nodes.each {node ->
            assert treeViewFragment.isNodeExist(node)
        }

        and: 'Verify expansions'
        expansions.each {node ->
            assert treeViewFragment.isNodeArrowDown(node)
        }

        and: 'Verify previous selected nodes are remain the selection after refresh'
        selections.each {selection ->
            assert treeViewFragment.isNodeSelected(selection)
        }
    }

    def 'Check refresh on add node' () {
        def newNode = 'ieatnetsimv6035-12_RNC01RBS01'
        def roots = [SUB_NETWORK_1, SUB_NETWORK_2, ALL_OTHER_NODES]
        def nodes = [NODE_1, NODE_2, NODE_3, NODE_4]
        def expansions = [SUB_NETWORK_1]
        def selections = [NODE_1, NODE_2, NODE_3, NODE_4]

        given: 'Network data exists'
        treeViewFragment.setNetworkDataOnDB('defaultData')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'Expand nodes'
        expansions.each {node ->
            treeViewFragment.expandNodeByName(node)
        }

        and: 'Roots and nodes should exist'
        roots.each {root ->
            assert treeViewFragment.isNodeExist(root)
        }
        nodes.each {node ->
            assert treeViewFragment.isNodeExist(node)
        }

        and: 'New node not exist yet'
        assert treeViewFragment.isNodeNotExist(newNode)

        and: 'Select some nodes'
        treeViewFragment.pressCtrl()
        selections.each {selection ->
            treeViewFragment.clickNodeByName(selection)
        }
        treeViewFragment.releaseCtrl()

        when: 'Add node into the network'
        treeViewFragment.addNode(newNode)

        then: 'Still new node appear on topology tree'
        assert treeViewFragment.isNodeNotExist(newNode)

        when: 'Refresh the topology'
        selectedContainerFragment.clickOnRefresh()

        then: 'Verify roots and nodes exist after refresh'
        roots.each {root ->
            assert treeViewFragment.isNodeExist(root)
        }
        nodes.each {node ->
            assert treeViewFragment.isNodeExist(node)
        }

        and: 'New node must exist'
        assert treeViewFragment.isNodeExist(newNode)

        and: 'Verify expansions'
        expansions.each {node ->
            assert treeViewFragment.isNodeArrowDown(node)
        }

        and: 'Verify previous selected nodes are remain the selection after refresh'
        selections.each {selection ->
            assert treeViewFragment.isNodeSelected(selection)
        }

        and: 'Verify new node not selected'
        assert treeViewFragment.isNodeNotSelected(newNode)

        and: 'Set network data to default'
        treeViewFragment.setNetworkDataOnDB('defaultData')
    }

    def 'Check refresh on delete node' () {
        def roots = [SUB_NETWORK_1, SUB_NETWORK_2, ALL_OTHER_NODES]
        def deletedNode = NODE_3
        def deleteNodeId = '281475029139727'
        def nodesBefore = [NODE_1, NODE_2, NODE_3, NODE_4]
        def nodesAfter = [NODE_1, NODE_2, NODE_4]
        def expansions = [SUB_NETWORK_1]
        def selectionsBefore = [NODE_3, NODE_4]
        def selectionsAfter = [SUB_NETWORK_1, NODE_4]

        given: 'Network data exists'
        treeViewFragment.setNetworkDataOnDB('defaultData')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'Expand nodes'
        expansions.each {node ->
            treeViewFragment.expandNodeByName(node)
        }

        and: 'Roots and nodes should exist'
        roots.each {root ->
            assert treeViewFragment.isNodeExist(root)
        }
        nodesBefore.each {node ->
            assert treeViewFragment.isNodeExist(node)
        }

        and: 'Select some nodes'
        treeViewFragment.pressCtrl()
        selectionsBefore.each {selection ->
            treeViewFragment.clickNodeByName(selection)
        }
        treeViewFragment.releaseCtrl()

        when: 'Delete a node from network'
        treeViewFragment.removeNode(deleteNodeId)

        then: 'Still deleted node appear on topology tree with selection'
        assert treeViewFragment.isNodeExist(deletedNode)
        assert treeViewFragment.isNodeSelected(deletedNode)

        when: 'Refresh the topology'
        selectedContainerFragment.clickOnRefresh()

        then: 'Refresh dialog should appear'
        assert dialogFragment.isDialogVisible()

        and: 'Deleted node should appear on changes table'
        dialogFragment.clickChangesAccordion()
        assert dialogFragment.isNodeExistOnChanges(deletedNode)

        when: 'Click ok on refresh dialog'
        dialogFragment.clickOk()

        then: 'Verify roots and nodes exist after refresh'
        roots.each {root ->
            assert treeViewFragment.isNodeExist(root)
        }
        nodesAfter.each {node ->
            assert treeViewFragment.isNodeExist(node)
        }

        and: 'Deleted node must not exist'
        assert treeViewFragment.isNodeNotExist(deletedNode)

        and: 'Verify expansions'
        expansions.each {node ->
            assert treeViewFragment.isNodeArrowDown(node)
        }

        and: 'Verify previous selected nodes are remain and parent of deleted node select after refresh'
        selectionsAfter.each {selection ->
            assert treeViewFragment.isNodeSelected(selection)
        }

        and: 'Set network data to default'
        treeViewFragment.setNetworkDataOnDB('defaultData')
    }

    def 'Refresh Transport Topology without selected'() {
        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'Topology dropdown is visible and expanded'
        udtDropdownFragment.expandDropdown()

        when: 'Transport Topology is visible'
        udtDropdownFragment.checkDropDownItemIsVisible(TRANSPORT_TOPOLOGY)

        and: 'Transport Topology is clicked'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)

        then: 'Verify that Transport Topology is not been selected'
        assert treeViewFragment.isNodeNotSelected(TRANSPORT_TOPOLOGY)

        when: 'Click Refresh Button'
        selectedContainerFragment.clickOnRefresh()

        then: 'Verify Transport Topology are exist after refresh'
        assert dialogFragment.isDialogNotVisible();
        assert treeViewFragment.isNodeExist(TRANSPORT_TOPOLOGY)
        assert treeViewFragment.isNodeNotSelected(TRANSPORT_TOPOLOGY)

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }
}
