package com.ericsson.nms.pres.topologybrowser.testware.specs

import com.ericsson.nms.pres.topologybrowser.testware.pages.*
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Specification

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.ALL_OTHER_NODES
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.MockActions.CM_SYNC
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.OTHER_RADIO_NODE

@RunWith(ArquillianSputnik)
class CMSyncSpec extends Specification {
    @Page
    private TopologyBrowserPage topologyBrowserPage
    @Page
    private TreeViewFragment treeViewFragment
    @Page
    private ActionsBarFragment actionsBarFragment
    @Page
    private CMSyncFragment cmSyncFragment
    @Page
    private DialogFragment dialogFragment


    def 'Initiate CM Sync'() {

        given: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        and: 'SubNetwork is expanded'
            treeViewFragment.expandNodeByName(ALL_OTHER_NODES)

        and: 'Node is selected'
            treeViewFragment.clickNodeByName(OTHER_RADIO_NODE)

        when: 'CM Sync Dialog is open'
            actionsBarFragment.clickActionButton(CM_SYNC)

        then: 'click on sync button to initiate the node sync'
            assert dialogFragment.isDialogVisible()
            dialogFragment.buttonClick("Sync")

        then: 'CM Sync dialog fragment shows the sync progress and status'
            Map<String, String> tableItems = cmSyncFragment.tableItems()
            assert tableItems.containsKey('Total Nodes')
            assert tableItems.containsKey('Not Started')
            assert tableItems.containsKey('Initiating')
            assert tableItems.containsKey('Initiated')
            assert tableItems.containsKey('Failed')
            assert tableItems.get('Total Nodes') == '1'
            assert cmSyncFragment.progressPrimaryText() == 'Initiate Node Sync'
            assert cmSyncFragment.progressRegionText() == 'Once sync is initiated, it may take a period of time for Synchronization to begin'

        then: 'CM dialog fragment shows the sync complete'
            if (dialogFragment.isButtonVisible("OK")) {
                List<String> result = cmSyncFragment.getResults()
                tableItems = cmSyncFragment.tableItems()
                assert tableItems.get('Initiated') == '1'
                assert tableItems.get('Failed') == '0'
                assert tableItems.get('Initiating') == '0'
                assert tableItems.get('Not Started') == '0'
                assert cmSyncFragment.progressPrimaryText() == 'Node Sync Initiation Complete'
                assert cmSyncFragment.progressBarText() == '100%'
                assert result.get(0) == 'Initiated Successfully'
            }

        then: 'click on Ok button to close the CM dialog fragment after the sync is finished'
            dialogFragment.buttonClick("OK")

        cleanup: 'Clear the DB and bring default data'
            treeViewFragment.clearDB()
    }

    def 'Initiate CM Sync Abort'() {

        given: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        and: 'SubNetwork is expanded'
            treeViewFragment.expandNodeByName(ALL_OTHER_NODES)

        and: 'Node is selected'
            treeViewFragment.clickNodeByName(OTHER_RADIO_NODE)

        when: 'CM Sync Dialog is open'
            actionsBarFragment.clickActionButton(CM_SYNC)

        then: 'click on sync button to initiate the node sync'
            assert dialogFragment.isDialogVisible()
            dialogFragment.buttonClick("Sync")

        then: 'click on Abort button to stop the sync'
            dialogFragment.buttonClick("Abort")

        then: 'CM dialog fragment shows the sync complete'
            Map<String, String> tableItems = cmSyncFragment.tableItems()
            List<String> result = cmSyncFragment.getResults()
            assert cmSyncFragment.progressPrimaryText() == 'Node Sync Initiation Complete'
            assert dialogFragment.isButtonVisible("OK")
            assert tableItems.get('Total Nodes') == '1'
            assert tableItems.get('Not Started') == '1'
            assert tableItems.get('Initiated') == '0'
            assert tableItems.get('Failed') == '0'
            assert tableItems.get('Initiating') == '0'
            assert cmSyncFragment.progressBarText() == '0%'
            assert result.get(0) == 'Not Started'

        then: 'click on Ok button to close the CM dialog fragment'
            dialogFragment.buttonClick("OK")

        cleanup: 'Clear the DB and bring default data'
            treeViewFragment.clearDB()
    }

    def 'Initiate CM Sync Cancel'() {

        given: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        and: 'SubNetwork is expanded'
            treeViewFragment.expandNodeByName(ALL_OTHER_NODES)

        and: 'Node is selected'
            treeViewFragment.clickNodeByName(OTHER_RADIO_NODE)

        when: 'CM Sync Dialog is open'
            actionsBarFragment.clickActionButton(CM_SYNC)

        then: 'press cancel to cancel the sync'
            assert dialogFragment.isDialogVisible()
            dialogFragment.buttonClick("Cancel")

        then: 'CM sync Dialog is closed'
            assert dialogFragment.isDialogNotVisible()

        cleanup: 'Clear the DB and bring default data'
            treeViewFragment.clearDB()
    }

}