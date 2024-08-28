package com.ericsson.nms.pres.topologybrowser.testware.specs.actions

import com.ericsson.nms.pres.topologybrowser.testware.pages.*
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Specification
import spock.lang.Unroll

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.NetworkData.SUB_NETWORK_1
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.NetworkData.SUB_NETWORK_3

@RunWith(ArquillianSputnik)
class RecentActionsSpec extends Specification {
    @Page
    TopologyBrowserPage topologyBrowserPage
    @Page
    DialogFragment dialogFragment
    @Page
    TreeViewFragment treeViewFragment
    @Page
    ActionsBarFragment actionsBarFragment
    @Page
    SelectedContainerFragment selectedContainerFragment
    @Page
    private TreeViewFragment treeViewFragment

    private static final String EDIT_STATE = "Edit State"
    private static final String RECENT = "Recent"
    private static final String RADIO_NODE2 = "ieatnetsimv6035-12_RNC01RBS03"


    @Unroll
    def 'Recent Actions are displayed in the action bar'() {
        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: '"Network Data" is clicked and expanded'
        treeViewFragment.expandNodeByName(SUB_NETWORK_1)
        treeViewFragment.expandNodeByName(SUB_NETWORK_3)

        when: 'Nodes are selected'
        treeViewFragment.clickNodeByName(RADIO_NODE2)

        then: 'verify node is selected'
        assert treeViewFragment.isNodeSelected(RADIO_NODE2)

        and: 'verify selected count'
        assert selectedContainerFragment.getSelectedCount() == 1

        when: 'Click on Action'
        actionsBarFragment.clickRecentActionDropDown()

        then: 'Dialog Appears'
        assert actionsBarFragment.isActionVisible(EDIT_STATE)
    }

    @Unroll
    def 'Recent Actions are displayed in the context menu'() {
        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: '"Network Data" is clicked and expanded'
        treeViewFragment.expandNodeByName(SUB_NETWORK_1)
        treeViewFragment.expandNodeByName(SUB_NETWORK_3)

        when: 'Nodes are selected'
        treeViewFragment.rightClick(RADIO_NODE2)

        and : 'Select the Recent dropdown'
        treeViewFragment.clickInDropdownOption(RECENT)

        then: 'Dialog Appears'
        assert actionsBarFragment.isActionVisible(EDIT_STATE)
    }
}
