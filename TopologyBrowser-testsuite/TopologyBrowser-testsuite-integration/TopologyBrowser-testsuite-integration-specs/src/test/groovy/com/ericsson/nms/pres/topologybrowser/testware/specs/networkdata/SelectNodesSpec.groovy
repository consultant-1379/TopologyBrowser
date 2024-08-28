package com.ericsson.nms.pres.topologybrowser.testware.specs.networkdata

import com.ericsson.nms.pres.topologybrowser.testware.pages.*
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Specification

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.ALL_OTHER_NODES
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.MockActions.*
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.NetworkData.*

@RunWith(ArquillianSputnik)
class SelectNodesSpec extends Specification {
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

    def 'Check actions for Single select node'() {
            def selectedNodes = [NODE_1]
        given: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        and: '"Network Data" is clicked and expanded'
            treeViewFragment.expandNodeByName(SUB_NETWORK_1)

        when: 'Nodes are selected'
            selectedNodes.each { node ->
                treeViewFragment.clickNodeByName(node)
            }

        then: 'Appropriate Actions should appear on action bar'
            assert actionsBarFragment.actionBarButtons().size() == 8
            [CM_SYNC, SINGLE_SELECT, TYPE_MECONTEXT, NE_TYPE_RBS].each { button ->
                assert actionsBarFragment.isButtonVisible(button)
            }

        then: 'verify nodes are selected'
            selectedNodes.each { node ->
                assert treeViewFragment.isNodeSelected(node)
            }
        and: 'verify selected count'
            assert selectedContainerFragment.getSelectedCount() == selectedNodes.size()
    }

    def 'Check actions for multi select nodes'() {
            def selectedNodes = [NODE_1, NODE_2]
        given: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        and: '"Network Data" is clicked and expanded'
            treeViewFragment.expandNodeByName(SUB_NETWORK_1)

        when: 'multiple nodes are selected'
            treeViewFragment.pressCtrl()
            selectedNodes.each { node ->
                treeViewFragment.clickNodeByName(node)
            }
            treeViewFragment.releaseCtrl()

        then: 'Appropriate Actions should appear on action bar'
            assert actionsBarFragment.actionBarButtons().size() == 8
            [MULTI_SELECT, TYPE_MECONTEXT, NE_TYPE_RBS].each { button ->
                assert actionsBarFragment.isButtonVisible(button)
            }

        and: 'verify nodes are selected'
            selectedNodes.each { node ->
                assert treeViewFragment.isNodeSelected(node)
            }

        and: 'verify selected count'
            assert selectedContainerFragment.getSelectedCount() == selectedNodes.size()
    }

    def 'Check actions for multi select nodes on different node types'() {
            def selectedNodes = [NODE_1, NODE_10]
        given: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        and: '"Network Data" is clicked and expanded'
            treeViewFragment.expandNodeByName(SUB_NETWORK_1)

        and: 'Expand "All Other Nodes"'
            treeViewFragment.expandNodeByName(ALL_OTHER_NODES)

        when: 'multiple nodes are selected'
            treeViewFragment.pressCtrl()
            selectedNodes.each { node ->
                treeViewFragment.clickNodeByName(node)
            }
            treeViewFragment.releaseCtrl()

        then: 'Appropriate Actions should appear on action bar'
            def actions = actionsBarFragment.actionsBarButtonsWithDropDownActions()
            assert actions.size() == 10
            assert actions.containsAll([CM_SYNC, MULTI_SELECT, TYPE_MECONTEXT, NE_TYPE_RBS, TYPE_MANAGEDELEMENT, NE_TYPE_ERBS])

        and: 'verify nodes are selected'
            selectedNodes.each { node ->
                assert treeViewFragment.isNodeSelected(node)
            }

        and: 'verify selected count'
            assert selectedContainerFragment.getSelectedCount() == selectedNodes.size()
    }

    def 'Select multiple nodes using Shift'() {
            def selectedNodes = [NODE_1, NODE_2, NODE_3, NODE_4]
        given: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        and: '"Network Data" is clicked and expanded'
            treeViewFragment.expandNodeByName(SUB_NETWORK_1)

        when: 'multiple nodes are selected'
            treeViewFragment.clickNodeByName(NODE_1)
            treeViewFragment.pressShift()
            treeViewFragment.clickNodeByName(NODE_4)
            treeViewFragment.releaseShift()

        then: 'verify nodes are selected'
            selectedNodes.each { node ->
                assert treeViewFragment.isNodeSelected(node)
            }

        and: 'Appropriate Actions should appear on action bar'
            assert actionsBarFragment.actionBarButtons().size() == 8
            [MULTI_SELECT, TYPE_MECONTEXT, NE_TYPE_RBS].each { button ->
                assert actionsBarFragment.isButtonVisible(button)
            }

        and: 'verify selected count'
            assert selectedContainerFragment.getSelectedCount() == selectedNodes.size()
    }

    def 'Select multiple nodes using SHIFT with nodes expanded'() {
            def selectedSet1 = [NODE_1, NODE_2, NODE_3, NODE_4, SUB_NETWORK_2, NODE_10, BITS_PARENT_NODE, NODE_11, NODE_12]
        given: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        and: '"Network Data" is clicked and expanded'
            treeViewFragment.expandNodeByName(SUB_NETWORK_1)

        and: 'Expand "All Other Nodes"'
            treeViewFragment.expandNodeByName(ALL_OTHER_NODES)

        when: 'multiple nodes are selected'
            treeViewFragment.clickNodeByName(NODE_1)
            treeViewFragment.pressShift()
            treeViewFragment.clickNodeByName(NODE_11)
            treeViewFragment.releaseShift()

        then: 'verify nodes are selected'
            selectedSet1.each { node ->
                assert treeViewFragment.isNodeSelected(node)
            }

        and: 'Appropriate Actions should appear on action bar'
            def actions = actionsBarFragment.actionsBarButtonsWithDropDownActions()
            assert actions.size() == 18
            [CM_SYNC, MULTI_SELECT, TYPE_MECONTEXT, NE_TYPE_RBS, TYPE_SUB_NETWORK, NE_TYPE_NULL, TYPE_MANAGEDELEMENT, NE_TYPE_ERBS,
             TYPE_MECONTEXT, NE_TYPE_ERBS, NE_TYPE_EPG].each { button ->
                assert actionsBarFragment.isActionVisible(button)
            }

        and: 'verify selected count'
            assert selectedContainerFragment.getSelectedCount() == selectedSet1.size()

            //Keep shift pressing select one of node from selection
            def selectedSet2 = [NODE_10, BITS_PARENT_NODE, NODE_11, NODE_12]
            def unselectSet = [NODE_1, NODE_2, NODE_4, NODE_3, SUB_NETWORK_2]
        when: 'Keep shift pressing select a node (RNC01MSRBS-V2259)'
            treeViewFragment.pressShift()
            treeViewFragment.clickNodeByName(NODE_10)
            treeViewFragment.releaseShift()

        then: 'verify still other nodes are selected'
            selectedSet2.each { node ->
                assert treeViewFragment.isNodeSelected(node)
            }

        and: 'verify un selected nodes'
            unselectSet.each { node ->
                assert treeViewFragment.isNodeNotSelected(node)
            }

        and: 'Appropriate Actions should appear on action bar'
            def actions_2 = actionsBarFragment.actionsBarButtonsWithDropDownActions()
            assert actions_2.size() == 14
            [CM_SYNC, MULTI_SELECT, TYPE_MANAGEDELEMENT, NE_TYPE_ERBS, TYPE_MECONTEXT, NE_TYPE_ERBS, NE_TYPE_EPG].each { button ->
                assert actionsBarFragment.isActionVisible(button)
            }

        and: 'verify selected count'
            assert selectedContainerFragment.getSelectedCount() == selectedSet2.size()
    }

    def 'Select multiple nodes using SHIFT and select different node'() {
            def selectedSet1 = [NODE_1, NODE_2, NODE_3, NODE_4]
        given: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        and: '"Network Data" is clicked and expanded'
            treeViewFragment.expandNodeByName(SUB_NETWORK_1)

        and: 'Expand "All Other Nodes"'
            treeViewFragment.expandNodeByName(ALL_OTHER_NODES)

        when: 'multiple nodes are selected'
            treeViewFragment.clickNodeByName(NODE_1)
            treeViewFragment.pressShift()
            treeViewFragment.clickNodeByName(NODE_4)
            treeViewFragment.releaseShift()

        then: 'verify nodes are selected'
            selectedSet1.each { node ->
                assert treeViewFragment.isNodeSelected(node)
            }

        and: 'Appropriate Actions should appear on action bar'
            def actions = actionsBarFragment.actionsBarButtonsWithDropDownActions()
            assert actions.size() == 8
            [MULTI_SELECT, TYPE_MECONTEXT, NE_TYPE_RBS].each { button ->
                assert actionsBarFragment.isActionVisible(button)
            }

        and: 'verify selected count'
            assert selectedContainerFragment.getSelectedCount() == selectedSet1.size()

            //Keep shift pressing select one of node from selection
        when: 'Select a node (RNC01MSRBS-V2259) from out side of the selection'
            treeViewFragment.clickNodeByName(NODE_10)

        then: 'verify only selected node (RNC01MSRBS-V2259) get selected'
            assert treeViewFragment.isNodeSelected(NODE_10)

        and: 'verify un selected nodes'
            [NODE_1, NODE_2, NODE_4, NODE_3].each { node ->
                assert treeViewFragment.isNodeNotSelected(node)
            }

        and: 'Appropriate Actions should appear on action bar'
            def actions_2 = actionsBarFragment.actionsBarButtonsWithDropDownActions()
            assert actions_2.size() == 8
            [CM_SYNC, SINGLE_SELECT, TYPE_MANAGEDELEMENT, NE_TYPE_ERBS].each { button ->
                assert actionsBarFragment.isActionVisible(button)
            }
            assert selectedContainerFragment.getSelectedCount() == 1
    }

    def 'Select multiple nodes using SHIFT and Clear Selection'() {
            def selectedNodes = [NODE_1, NODE_2, NODE_3, NODE_4]
        given: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        and: '"Network Data" is clicked and expanded'
            treeViewFragment.expandNodeByName(SUB_NETWORK_1)

        when: 'Multiple nodes are selected'
            treeViewFragment.clickNodeByName(NODE_1)
            treeViewFragment.pressShift()
            treeViewFragment.clickNodeByName(NODE_4)
            treeViewFragment.releaseShift()

        then: 'Verify nodes are selected'
            selectedNodes.each { node ->
                assert treeViewFragment.isNodeSelected(node)
            }

        and: 'verify selected count'
            assert selectedContainerFragment.getSelectedCount() == selectedNodes.size()

        when: 'Click on clear button'
            selectedContainerFragment.clickOnClear()

        then: 'Verify click button not exist'
            assert selectedContainerFragment.clearButtonNotVisible()

        and: 'Verify selected count'
            assert selectedContainerFragment.getSelectedCount() == 0
    }
}
