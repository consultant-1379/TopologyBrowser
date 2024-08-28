package com.ericsson.nms.pres.topologybrowser.testware.specs


import com.ericsson.nms.pres.topologybrowser.testware.pages.DetailsPanelFragment
import com.ericsson.nms.pres.topologybrowser.testware.pages.TopologyBrowserPage
import com.ericsson.nms.pres.topologybrowser.testware.pages.TreeViewFragment
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Specification
import spock.lang.Unroll

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.ALL_OTHER_NODES

@RunWith(ArquillianSputnik)
class IconsSpec extends Specification {

    @Page
    TopologyBrowserPage topologyBrowserPage
    @Page
    TreeViewFragment treeViewFragment
    @Page
    DetailsPanelFragment detailsPanelFragment

    private static final String SUB_NETWORK_1 = 'RNC01'
    private static final String NODE_1 = 'ieatnetsimv6035-12_RNC01RBS03'
    private static final String NODE_2 = 'ieatnetsimv6035-12_RNC01RBS13'
    private static final String NODE_3 = 'ieatnetsimv6035-12_RNC01RBS14'
    private static final String NODE_4 = 'ieatnetsimv6035-12_RNC01RBS21'
    private static final String NODE_5 = 'ieatnetsimv6035-12_M01'

    @Unroll
    def 'Sync icon is displayed in Topology Tree item when node is #syncStatus'() {

        given: 'Topology Browser is open'
        topologyBrowserPage.openTopologyBrowser(false)

        and: 'Expand SubNetwork "RNC01"'
        treeViewFragment.expandNodeByName(SUB_NETWORK_1)

        expect: 'Node has sync icons'
        assert treeViewFragment.nodeHasIcon(node, iconClassName)

        where:
        syncStatus       | node   | iconClassName
        'UNSYNCHRONIZED' | NODE_1 | 'ebIcon_syncError'
        'TOPOLOGY'       | NODE_2 | 'ebIcon_syncing_animated'
    }

    def 'Sync icon is not displayed in Topology Tree item when node is SYNCHRONIZED'() {

        given: 'Topology Browser is open'
        topologyBrowserPage.openTopologyBrowser(false)

        and: 'Expand SubNetwork "RNC01"'
        treeViewFragment.expandNodeByName(SUB_NETWORK_1)

        expect: 'Node does not have sync icon'
        assert treeViewFragment.nodeHasNoIcon(NODE_3, 'ebIcon_syncError')
        assert treeViewFragment.nodeHasNoIcon(NODE_3, 'ebIcon_syncing_animated')
    }

    @Unroll
    def 'Radio Access Technology icons for #rats are displayed in Topology Tree item depending on radioAccessTechnology attribute value'() {

        given: 'Topology Browser is open'
        topologyBrowserPage.openTopologyBrowser(false)

        and: 'Expand SubNetwork "RNC01"'
        treeViewFragment.expandNodeByName(SUB_NETWORK_1)

        expect: 'Node has #rat icon'
        iconClassName.each { iconClass  ->
            assert treeViewFragment.nodeHasIcon(node, iconClass)
        }

        where:
        rats        | node   | iconClassName
        ['2G']      | NODE_1 | ['ebIcon_2G']
        ['2G','3G'] | NODE_2 | ['ebIcon_2G','ebIcon_3G']
        ['5G']      | NODE_3 | ['ebIcon_5G']
        ['5G']      | NODE_4 | ['ebIcon_5G']
    }

    @Unroll
    def '"More" icon is displayed in Topology Tree item when there are more than 3 icons to be shown and the remaining icons #remainingIcons are shown on icon click'() {

        given: 'Topology Browser is open'
        topologyBrowserPage.openTopologyBrowser(false)

        and: 'Expand SubNetwork "RNC01"'
        treeViewFragment.expandNodeByName(SUB_NETWORK_1)

        expect: 'Node has more icon'
        assert treeViewFragment.nodeHasIcon(node, 'ebIcon_more')

        and: 'Remaining icons are not visible'
        remainingIcons.each {icon ->
            assert treeViewFragment.nodeHasNoIcon(node, icon)
        }

        and: "click More icon"
        treeViewFragment.moveMouseOver(treeViewFragment.getNodeIcon(node, 'ebIcon_more'));

        and: 'Remaining icons should be shown'
        assert treeViewFragment.isMoreContentVisible()
        assert treeViewFragment.getMoreContentIcons().size() == remainingIcons.size()
        remainingIcons.each {icon ->
            assert treeViewFragment.isIconVisibleInsideMoreContent(icon)
        }

        where:
        node    |   remainingIcons
        NODE_3  |   ['ebIcon_4G', 'ebIcon_3G','ebIcon_2G']
    }

    @Unroll
    def '"#tooltip" icon is displayed in Node Details panel when node is #nodeStatus'() {

        given: 'Topology Browser is open'
        topologyBrowserPage.openTopologyBrowser(false)

        and: 'Expand SubNetwork "RNC01"'
        treeViewFragment.expandNodeByName(SUB_NETWORK_1)

        and: 'Select node #node'
        treeViewFragment.clickNodeByName(node)

        and: 'Open Node Details tab in Details panel'
        detailsPanelFragment.getNodeDetailsTab().click()

        expect: 'Node has #nodeStatus icon'
        def statusIcon = detailsPanelFragment."${getIconMethod}"()
        assert statusIcon.isDisplayed()
        assert statusIcon.getAttribute('class').contains(iconClassName)
        assert statusIcon.getAttribute('title').contains(tooltip)

        where:
        nodeStatus       | node   | iconClassName             | tooltip                  | getIconMethod
        'UNSYNCHRONIZED' | NODE_1 | 'ebIcon_syncError'        | 'UNSYNCHRONIZED'         | 'getSyncStatusIcon'
        'TOPOLOGY'       | NODE_2 | 'ebIcon_syncing_animated' | 'SYNCHRONIZING'          | 'getSyncStatusIcon'
        'MAINTENANCE'    | NODE_1 | 'ebIcon_maintenanceMode'  | 'Node is in maintenance' | 'getManagementStateIcon'
    }

    @Unroll
    def '#nodeStatus icon is not displayed in Node Details panel when node status is #nodeStatus'() {

        given: 'Topology Browser is open'
        topologyBrowserPage.openTopologyBrowser(false)

        and: 'Expand SubNetwork "RNC01"'
        treeViewFragment.expandNodeByName(SUB_NETWORK_1)

        and: 'Select node #node'
        treeViewFragment.clickNodeByName(node)

        and: 'Open Node Details tab in Details panel'
        detailsPanelFragment.getNodeDetailsTab().click()

        expect: 'Icon is not present'
        assert detailsPanelFragment."${isIconNotVisibleMethod}"()

        where:
        nodeStatus     | node   | isIconNotVisibleMethod
        'SYNCHRONIZED' | NODE_3 | 'isSyncStatusIconNotVisible'
        'NORMAL'       | NODE_2 | 'isManagementStateIconNotVisible'
    }

    @Unroll
    def '"#nodeStatus" icon is displayed in Node Details panel when node status is #nodeStatus' () {

        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        treeViewFragment.restore()
        topologyBrowserPage.openTopologyBrowser(false)

        and: 'All other nodes is expanded'
        treeViewFragment.expandNodeByName(ALL_OTHER_NODES)

        and: 'Select node #node'
        treeViewFragment.clickNodeByName(node)

        and: 'Open Node Details tab in Details panel'
        detailsPanelFragment.getNodeDetailsTab().click()

        expect: 'Node has #nodeStatus icon'
        def statusIcon = detailsPanelFragment."${getIconMethod}"()
        assert statusIcon.isDisplayed()
        assert statusIcon.getAttribute('class').contains(iconClassName)
        assert statusIcon.getAttribute('title').contains(tooltip)

        where:
        nodeStatus       | node   | iconClassName             | tooltip                  | getIconMethod
        'NOT_SUPPORTED'  | NODE_5 | 'ebIcon_sync_notSupported'| 'NOT_SUPPORTED'          | 'getSyncStatusIcon'
    }
}
