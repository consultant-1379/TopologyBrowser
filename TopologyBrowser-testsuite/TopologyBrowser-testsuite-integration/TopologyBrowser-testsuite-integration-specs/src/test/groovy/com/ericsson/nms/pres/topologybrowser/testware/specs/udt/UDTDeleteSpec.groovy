package com.ericsson.nms.pres.topologybrowser.testware.specs.udt

import com.ericsson.nms.pres.topologybrowser.testware.pages.*
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Specification

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.*

@RunWith(ArquillianSputnik)
class UDTDeleteSpec extends Specification {
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

    def 'Deleting Leaf Collection under root Collection'() {
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

        and: 'Leaf Collection exists and is selected'
        treeViewFragment.expandNodeByName(CHILD_LEAF+'001')
        treeViewFragment.clickNodeByName(CHILD_LEAF+'001')

        when: 'Click on "Delete" alert button'
        actionsBarFragment.clickActionButton(DELETE_ACTION)

        and: 'Delete is confirmed'
        assert dialogFragment.isDialogVisible()
        dialogFragment.buttonClick('Delete')
        dialogFragment.buttonClick('OK')

        then: 'Verify that the deleted Leaf does not exist and root is selected'
        assert treeViewFragment.isNodeNotExist(CHILD_LEAF+'001')
        assert treeViewFragment.isNodeSelected(TRANSPORT_TOPOLOGY)

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Deleting Leaf Collection under parent branch Collection'() {
        given: 'Transport Topology with Leaf collection exists'
        treeViewFragment.setTopologyOnDB('rootWithNineBothCollection')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Expand branch'
        treeViewFragment.expandNodeByName(CHILD_BRANCH + '001')

        and: 'Leaf Collection exists and is selected'
        treeViewFragment.clickNodeByName(CHILD_LEAF+'002')

        when: 'Click on "Delete" alert button'
        actionsBarFragment.clickActionButton(DELETE_ACTION)

        and: 'Delete is confirmed'
        assert dialogFragment.isDialogVisible()
        dialogFragment.buttonClick('Delete')
        dialogFragment.buttonClick('OK')

        then: 'Verify that the deleted Leaf does not exist and the parent branch is selected'
        assert treeViewFragment.isNodeNotExist(CHILD_LEAF+'002')
        assert treeViewFragment.isNodeSelected(CHILD_BRANCH + '001')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Deleting Leaf Collection when collection does not exist'() {
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

        and: 'Leaf Collection exists and is selected'
        treeViewFragment.clickNodeByName(CHILD_LEAF+'001')

        when: 'Click on "Delete" alert button'
        actionsBarFragment.clickActionButton(DELETE_ACTION)

        and: 'Delete is confirmed'
        assert dialogFragment.isDialogVisible()
        dialogFragment.buttonClick('Delete')
        dialogFragment.buttonClick('OK')

        then: 'Verify that the deleted Leaf does not exist and root is selected'
        assert treeViewFragment.isNodeNotExist(CHILD_LEAF+'001')
        assert treeViewFragment.isNodeSelected(TRANSPORT_TOPOLOGY)

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Deleting Branch Collection without Leaf as Children'() {
        given: 'Transport Topology with Leaf collection exists'
        treeViewFragment.setTopologyOnDB('rootWithBranchCollection')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Leaf Collection exists and is selected'
        treeViewFragment.clickNodeByName(CHILD_BRANCH+'001')

        when: 'Click on "Delete" alert button'
        actionsBarFragment.clickActionButton(DELETE_ACTION)

        and: 'Delete is confirmed'
        assert dialogFragment.isDialogVisible()
        dialogFragment.buttonClick('Delete')
        dialogFragment.buttonClick('OK')

        then: 'Verify that the deleted Leaf does not exist and root is selected'
        assert treeViewFragment.isNodeNotExist(CHILD_BRANCH+'001')
        assert treeViewFragment.isNodeSelected(TRANSPORT_TOPOLOGY)

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Deleting Branch Collection with Leaf Children shows error'() {
        given: 'Transport Topology with Leaf collection exists'
        treeViewFragment.setTopologyOnDB('rootWithNineBothCollection')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Expand branch'
        treeViewFragment.expandNodeByName(CHILD_BRANCH + '001')

        and: 'verify Leaf Collection exists '
        assert treeViewFragment.isNodeExist(CHILD_LEAF+'002')

        when: 'parent Branch Collection is selected '
        treeViewFragment.clickNodeByName(CHILD_BRANCH + '001')

        then: 'verify that action bar gets DELETE button'
        assert actionsBarFragment.getActionButton(DELETE_ACTION)

        and: 'Click DELETE button on action bar '
        actionsBarFragment.clickActionButton(DELETE_ACTION)
        dialogFragment.buttonClick('Delete')

        then: 'verify delete result dialog contain error'
        assert dialogFragment.checkCount('Failed', '1')

        and: 'press okay to close the error dialog'
        dialogFragment.buttonClick('OK')

        then: 'Verify that the parent Branch Collection exist and is selected'
        assert treeViewFragment.isNodeExist(CHILD_BRANCH + '001')
        assert treeViewFragment.isNodeSelected(CHILD_BRANCH + '001')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Deleting Search Criteria Collection under root Collection'() {
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

        when: 'Click on "Delete" alert button'
            actionsBarFragment.clickActionButton(DELETE_ACTION)

        and: 'Delete is confirmed'
            assert dialogFragment.isDialogVisible()
            dialogFragment.buttonClick('Delete')
        dialogFragment.buttonClick('OK')

        then: 'Verify that the deleted Search Criteria does not exist and root is selected'
            assert treeViewFragment.isNodeNotExist(CHILD_LEAF+'001')
            assert treeViewFragment.isNodeSelected(TRANSPORT_TOPOLOGY)

        cleanup: 'Clear the DB and bring default data'
            treeViewFragment.clearDB()
            treeViewFragment.resetDropdownSettings()
    }
}


