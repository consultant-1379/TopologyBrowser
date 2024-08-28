package com.ericsson.nms.pres.topologybrowser.testware.specs.udt

import com.ericsson.nms.pres.topologybrowser.testware.pages.*
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import org.openqa.selenium.support.ui.WebDriverWait
import spock.lang.Ignore
import spock.lang.Specification

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.*

@RunWith(ArquillianSputnik)
class UDTExportSpec extends Specification {
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

    def 'Export a Leaf Collection using Action Bar'() {
        given: 'Transport Topology with Leaf collection exists'
        treeViewFragment.setTopologyOnDB('rootWithTwoLeafCollection')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Leaf Collection exists'
        treeViewFragment.expandNodeByName(CHILD_LEAF + '001')

        when: 'Leaf Collection is selected'
        treeViewFragment.clickNodeByName(CHILD_LEAF + '001')

        then: 'verify that action bar gets "Export Collection" button'
        assert actionsBarFragment.getActionButton(EXPORT_COLLECTION_ACTION)

        and: ' "Export Collection" action button is clicked'
        actionsBarFragment.clickActionButton(EXPORT_COLLECTION_ACTION)

        then: 'Verify that the Collections Export Progress is visible and Download selected'
        assert dialogFragment.isDialogVisible()
        dialogFragment.buttonClick('Download')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Export a Branch Collection using Action Bar'() {
        given: 'Transport Topology with Branch collection exists'
        treeViewFragment.setTopologyOnDB('rootWithBranchCollection')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Branch Collection exists'
        treeViewFragment.expandNodeByName(CHILD_BRANCH + '001')

        when: 'Branch Collection is selected'
        treeViewFragment.clickNodeByName(CHILD_BRANCH + '001')

        then: 'verify that action bar gets "Export Topology" button'
        assert actionsBarFragment.getActionButton(EXPORT_TOPOLOGY_ACTION)

        and: ' "Export Topology" action button is clicked'
        actionsBarFragment.clickActionButton(EXPORT_TOPOLOGY_ACTION)

        then: 'Verify that the Collections Export Progress is visible and Download selected'
        assert dialogFragment.isDialogVisible()
        dialogFragment.buttonClick('Download')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }
}


