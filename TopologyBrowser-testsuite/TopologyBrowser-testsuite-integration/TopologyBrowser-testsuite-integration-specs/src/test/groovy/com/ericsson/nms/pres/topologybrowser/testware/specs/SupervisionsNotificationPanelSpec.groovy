package com.ericsson.nms.pres.topologybrowser.testware.specs

import com.ericsson.nms.pres.topologybrowser.testware.pages.DialogFragment
import com.ericsson.nms.pres.topologybrowser.testware.pages.SupervisionsNotificationPanelFragment
import com.ericsson.nms.pres.topologybrowser.testware.pages.TopologyBrowserPage
import com.ericsson.nms.pres.topologybrowser.testware.pages.TreeViewFragment
import com.ericsson.nms.pres.topologybrowser.testware.pages.UDTDropdownFragment
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Specification

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.EMPTY
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.ENABLE_SUPERVISION
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.LOCATE_NODE
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.TRANSPORT_TOPOLOGY
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.VIEW_STATUS

@RunWith(ArquillianSputnik)
class SupervisionsNotificationPanelSpec extends Specification {

    private static final String RNC01MSRBS_V2260 = "RNC01MSRBS-V2260"
    private static final String RNC01MSRBS_V2259 = "RNC01MSRBS-V2259"
    private static final String RNC01RBS03 = "ieatnetsimv6035-12_RNC01RBS03"

    @Page
    private TopologyBrowserPage topologyBrowserPage

    @Page
    private SupervisionsNotificationPanelFragment supervisionsNotificationPanelFragment

    @Page
    private UDTDropdownFragment udtDropdownFragment

    @Page
    private TreeViewFragment treeViewFragment

    @Page
    private DialogFragment dialogFragment

    def 'check the supervisions notification panel is open'() {
        given: 'Topology Browser is open'
            topologyBrowserPage.openTopologyBrowser(true)

        when: 'the supervisions notification panel button is clicked'
            supervisionsNotificationPanelFragment.openSupervisionsNotificationPanel()

        then: 'the supervisions notification panel is opened'
            supervisionsNotificationPanelFragment.isSupervisionsNotificationPanelVisible()
    }

    def 'check the supervisions notification panel contains notification'() {
        given: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        when: 'the supervisions notification panel button is clicked'
            supervisionsNotificationPanelFragment.openSupervisionsNotificationPanel()

        then: 'the supervisions notification panel is opened'
            supervisionsNotificationPanelFragment.isSupervisionsNotificationPanelVisible()

        and: "supervision panel contains notifications"
            supervisionsNotificationPanelFragment.isSupervisionNotificationPanelTableVisible()
    }

    def 'view supervision notification status'() {
        given: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        when: 'the supervisions notification panel button is clicked'
            supervisionsNotificationPanelFragment.openSupervisionsNotificationPanel()

        and: "the view status button is clicked for a particular notification"
            supervisionsNotificationPanelFragment.clickButtonForNotification(RNC01MSRBS_V2259, ENABLE_SUPERVISION , VIEW_STATUS)

        then: 'view supervisions notification status detail dialog is opened'
            dialogFragment.isDialogWithGivenTittleVisible(ENABLE_SUPERVISION)
    }

    def 'locate a node in the Network data topology tree'() {
        given: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        when: 'the supervisions notification panel button is clicked'
            supervisionsNotificationPanelFragment.openSupervisionsNotificationPanel()

        and: "the locate node button is clicked for a particular notification"
            supervisionsNotificationPanelFragment.clickButtonForNotification(RNC01MSRBS_V2259, ENABLE_SUPERVISION , LOCATE_NODE)

        then: 'node is located and selected on the topology tree'
            treeViewFragment.isNodeSelected(RNC01MSRBS_V2259)
    }

    def 'check an error dialog is shown when a node cannot be located in Network Data'() {
        given: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        when: 'the supervisions notification panel button is clicked'
            supervisionsNotificationPanelFragment.openSupervisionsNotificationPanel()

        then: 'the supervisions notification panel is opened'
            supervisionsNotificationPanelFragment.isSupervisionsNotificationPanelVisible()

        and: 'the supervision notification is visible'
            supervisionsNotificationPanelFragment.isSupervisionNotificationVisible(RNC01MSRBS_V2260, ENABLE_SUPERVISION)

        then: 'click the Locate Node button for a node that is not in the topology tree'
            supervisionsNotificationPanelFragment.clickButtonForNotification(RNC01MSRBS_V2260, ENABLE_SUPERVISION, LOCATE_NODE)

        and: 'a dialog box is shown informing the user the requested object cannot be found'
            dialogFragment.isDialogVisible()

        and: 'click ok'
            dialogFragment.clickOk()

        and: 'open the supervisions notifications panel'
            supervisionsNotificationPanelFragment.openSupervisionsNotificationPanel()
    }

    def 'locate a node in the transport topology tree'() {
        given: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)
            treeViewFragment.setTopologyOnDB('rootWithLeafCollectionAndMultipleNodes')

        and: 'UDT dropdown exists and is expanded'
            udtDropdownFragment.expandDropdown()

        when: 'Transport Topology" is opened'
            udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
            treeViewFragment.clickNodeByName(TRANSPORT_TOPOLOGY)

        then: 'the supervisions notification panel button is clicked'
            supervisionsNotificationPanelFragment.openSupervisionsNotificationPanel()

        and: 'the supervision notification is visible'
            supervisionsNotificationPanelFragment.isSupervisionNotificationVisible(RNC01RBS03, ENABLE_SUPERVISION)

        then: 'the supervisions notification panel is opened'
            supervisionsNotificationPanelFragment.isSupervisionsNotificationPanelVisible()

        then: 'click the Locate Node button for a node that is in the topology tree'
            supervisionsNotificationPanelFragment.clickButtonForNotification(RNC01RBS03, ENABLE_SUPERVISION, LOCATE_NODE)

        and: 'the node should be located and selected on the tree'
            treeViewFragment.isNodeSelected(RNC01RBS03)

        cleanup:
            treeViewFragment.resetDropdownSettings()
            treeViewFragment.clearDB()
    }

    def 'check an error dialog is shown when a node cannot be located in Transport Topology'() {
        given: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
            udtDropdownFragment.expandDropdown()

        when: 'Transport Topology" is opened'
            udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
            treeViewFragment.clickNodeByName(TRANSPORT_TOPOLOGY)

        then: 'the supervisions notification panel button is clicked'
            supervisionsNotificationPanelFragment.openSupervisionsNotificationPanel()

        and: 'the supervision notification is visible'
            supervisionsNotificationPanelFragment.isSupervisionNotificationVisible(RNC01MSRBS_V2259, ENABLE_SUPERVISION)

        then: 'the supervisions notification panel is opened'
            supervisionsNotificationPanelFragment.isSupervisionsNotificationPanelVisible()

        then: 'click the Locate Node button for a node that is not in the topology tree'
            supervisionsNotificationPanelFragment.clickButtonForNotification(RNC01MSRBS_V2259, ENABLE_SUPERVISION, LOCATE_NODE)

        and: 'a dialog box is shown informing the user the requested object cannot be found'
            dialogFragment.isDialogVisible()

        and: 'click ok'
            dialogFragment.clickOk()

        cleanup:
            treeViewFragment.resetDropdownSettings()
    }
}
