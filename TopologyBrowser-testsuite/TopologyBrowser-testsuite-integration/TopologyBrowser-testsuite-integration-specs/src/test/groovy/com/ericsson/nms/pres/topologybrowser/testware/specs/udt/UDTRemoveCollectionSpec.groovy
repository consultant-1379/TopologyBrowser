package com.ericsson.nms.pres.topologybrowser.testware.specs.udt

import com.ericsson.nms.pres.topologybrowser.testware.pages.*
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Specification

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.*

@RunWith(ArquillianSputnik)
class UDTRemoveCollectionSpec extends Specification {
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
    @Page
    private FailureFeedbackFragment failureFeedbackFragment

    def 'Removing Leaf Collection under root Collection'() {
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

        when: 'Leaf Collection exists and is selected'
        treeViewFragment.expandNodeByName(CHILD_LEAF+'001')
        treeViewFragment.clickNodeByName(CHILD_LEAF+'001')

        and: 'Wait for the action buttons and click to Remove from Collection'
        actionsBarFragment.getActionButton(REMOVE_ACTION)
        actionsBarFragment.clickActionButton(REMOVE_ACTION)

        and: 'Remove is confirmed'
        assert dialogFragment.isDialogVisible()
        dialogFragment.buttonClick('Remove')

        then: 'Verify that the removed Leaf does not exist and root is selected'
        assert treeViewFragment.isNodeNotExist(CHILD_LEAF+'001')
        assert treeViewFragment.isNodeSelected(TRANSPORT_TOPOLOGY)

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Removing Leaf Collection under parent branch Collection'() {
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

        and: 'Branch is expanded'
        treeViewFragment.expandNodeByName(CHILD_BRANCH + '001')

        and: 'Leaf Collection exists and is selected'
        treeViewFragment.clickNodeByName(CHILD_LEAF+'002')

        when: 'Wait for the action buttons and click to Remove from Collection'
        actionsBarFragment.getActionButton(REMOVE_ACTION)
        actionsBarFragment.clickActionButton(REMOVE_ACTION)

        and: 'Remove is confirmed'
        assert dialogFragment.isDialogVisible()
        dialogFragment.buttonClick('Remove')

        then: 'Verify that the removed Leaf does not exist and the parent branch is selected'
        assert treeViewFragment.isNodeNotExist(CHILD_LEAF+'002')
        assert treeViewFragment.isNodeSelected(CHILD_BRANCH + '001')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Removing Branch Collections'() {
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

        when: 'Branch is selected'
        treeViewFragment.clickNodeByName(CHILD_BRANCH + '001')

        then: 'Confirm the Remove button is not displayed'
        assert actionsBarFragment.isButtonNotPresent(REMOVE_ACTION)

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Server Error when Removing Leaf Collection'() {
        given: 'Transport Topology with Leaf collection exists'
        treeViewFragment.setTopologyOnDB('rootWithOneLeafCollection')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        when: 'Leaf is selected'
        treeViewFragment.clickNodeByName(CHILD_LEAF + '001')

        and: 'Remove from Collection is clicked'
        actionsBarFragment.getActionButton(REMOVE_ACTION)
        actionsBarFragment.clickActionButton(REMOVE_ACTION)

        and: 'Remove is confirmed'
        assert dialogFragment.isDialogVisible()
        dialogFragment.buttonClick('Remove')

        then: 'Error dialog is displayed'
        assert dialogFragment.isErrorDialogVisible()

        and: 'Contains correct failure details'
        assert failureFeedbackFragment.isFailureFeedbackVisible()
        assert failureFeedbackFragment.getFailureDetailsText().contains(CHILD_LEAF+'001')
        assert failureFeedbackFragment.getResultCountersText().contains('1 ' +FAILED)

        and: 'Verify that the Leaf still exists'
        dialogFragment.clickOk()
        assert treeViewFragment.isNodeExist(CHILD_LEAF+'001')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Test that Multiple Leaf Collection under SAME branch Collection can be removed'() {
        given: 'Transport Topology with Leaf collection exists'
        treeViewFragment.setTopologyOnDB('rootWithMultipleBranchCollectionsAtSameLevel')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Branch is expanded'
        treeViewFragment.expandNodeByName(CHILD_BRANCH + '001')

        and: 'Leaf Collection exists and is selected'
        treeViewFragment.clickNodeByName(CHILD_LEAF+'001')
        treeViewFragment.pressShift()
        treeViewFragment.clickNodeByName(CHILD_LEAF+'002')
        treeViewFragment.releaseShift()

        when: 'Wait for the action buttons and click to Remove from Collection'
        actionsBarFragment.getActionButton(REMOVE_ACTION)
        actionsBarFragment.clickActionButton(REMOVE_ACTION)

        and: 'Remove is confirmed'
        assert dialogFragment.isDialogVisible()
        dialogFragment.buttonClick('Remove')

        then: 'Verify that the removed Leaf does not exist and the parent branch is selected'
        assert treeViewFragment.isNodeNotExist(CHILD_LEAF+'001')
        assert treeViewFragment.isNodeNotExist(CHILD_LEAF+'002')
        assert treeViewFragment.isNodeSelected(CHILD_BRANCH + '001')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

// TODO: Below test is failing only in jenkins so need to have a look at it later
// def 'Test that Multiple Leaf Collection under DIFFERENT branch Collection can be removed'() {
//        given: 'Transport Topology with Leaf collection exists'
//        treeViewFragment.setTopologyOnDB('rootWithMultipleBranchCollectionsAtSameLevel')
//
//        and: 'Topology Browser is open'
//        topologyBrowserPage.refreshTopologyBrowserPage()
//        topologyBrowserPage.openTopologyBrowser(true)
//
//        and: 'UDT dropdown exists and is expanded'
//        udtDropdownFragment.expandDropdown()
//
//        and: '"Transport Topology" is clicked and expanded'
//        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
//        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)
//
//        and: 'Branch is expanded'
//        treeViewFragment.expandNodeByName(CHILD_BRANCH + '001')
//        treeViewFragment.expandNodeByName(CHILD_BRANCH + '002')
//
//        and: 'Leaf Collection exists and is selected'
//        treeViewFragment.clickNodeByName(CHILD_LEAF+'001')
//        treeViewFragment.pressShift()
//        treeViewFragment.clickNodeByName(CHILD_LEAF+'003')
//        treeViewFragment.releaseShift()
//
//        and: 'Verify what is selected'
//        assert treeViewFragment.isNodeSelected(CHILD_LEAF+'001')
//        assert treeViewFragment.isNodeSelected(CHILD_LEAF+'002')
//        assert treeViewFragment.isNodeSelected(CHILD_LEAF+'003')
//
//        when: 'Wait for the action buttons and click to Remove from Collection'
//        Thread.sleep(5000)
//        actionsBarFragment.clickActionButton(REMOVE_ACTION)
//
//        and: 'Remove is confirmed'
//        assert dialogFragment.isDialogVisible()
//        dialogFragment.buttonClick('Remove')
//
//        then: 'Verify that only the removed Leaf does not exist and the parent branch is selected'
//        assert treeViewFragment.isNodeNotExist(CHILD_LEAF+'001')
//        assert treeViewFragment.isNodeNotExist(CHILD_LEAF+'002')
//        assert treeViewFragment.isNodeNotExist(CHILD_LEAF+'003')
//        assert treeViewFragment.isNodeExist(CHILD_LEAF+'004')
//        assert treeViewFragment.isNodeSelected(CHILD_BRANCH + '001')
//
//        cleanup: 'Clear the DB and bring default data'
//        treeViewFragment.clearDB()
//        treeViewFragment.resetDropdownSettings()
//    }

    def 'Test that Removing Leaf Collection if fails shows appropriate error '() {
        given: 'Transport Topology with Leaf collection exists'
        treeViewFragment.setTopologyOnDB('rootWithOneLeafCollection')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        when: 'Leaf is selected'
        treeViewFragment.clickNodeByName(CHILD_LEAF + '001')

        and: 'Remove from Collection is clicked'
        actionsBarFragment.getActionButton(REMOVE_ACTION)
        actionsBarFragment.clickActionButton(REMOVE_ACTION)

        and: 'Remove is confirmed'
        assert dialogFragment.isDialogVisible()
        dialogFragment.buttonClick('Remove')

        then: 'Error dialog is displayed'
        assert dialogFragment.isErrorDialogVisible()

        and: 'Contains correct failure details'
        assert failureFeedbackFragment.isFailureFeedbackVisible()
        assert failureFeedbackFragment.getFailureDetailsText().contains(CHILD_LEAF+'001')
        assert failureFeedbackFragment.getResultCountersText().contains('1 ' + FAILED)

        and: 'Verify that the Leaf still exists'
        dialogFragment.clickOk()
        assert treeViewFragment.isNodeExist(CHILD_LEAF+'001')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Test that Removing Leaf Collection if partially fails shows appropriate error '() {
        given: 'Transport Topology with Leaf collection exists'
        treeViewFragment.setTopologyOnDB('rootWithOneLeafCollection')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        when: 'Leaf is selected'
        treeViewFragment.clickNodeByName(CHILD_LEAF + '001')
        treeViewFragment.pressCtrl()
        treeViewFragment.clickNodeByName(CHILD_LEAF+'002')
        treeViewFragment.releaseCtrl()

        and: 'Remove from Collection is clicked'
        actionsBarFragment.getActionButton(REMOVE_ACTION)
        actionsBarFragment.clickActionButton(REMOVE_ACTION)

        and: 'Remove is confirmed'
        assert dialogFragment.isDialogVisible()
        dialogFragment.buttonClick('Remove')

        then: 'Error dialog is displayed'
        assert dialogFragment.isErrorDialogVisible()

        and: 'Contains correct failure details'
        assert failureFeedbackFragment.isFailureFeedbackVisible()
        assert failureFeedbackFragment.getFailureDetailsText().contains(CHILD_LEAF+'001')
        assert failureFeedbackFragment.getResultCountersText().contains('1 ' + FAILED)

        and: 'Verify that the Leaf still exists'
        dialogFragment.clickOk()
        assert treeViewFragment.isNodeExist(CHILD_LEAF+'001')

        and: 'Verify that the removed Leaf doesnt exists'
        assert treeViewFragment.isNodeNotExist(CHILD_LEAF+'002')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Removing Search Criteria Collection under root Collection'() {
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

        when: 'Search Criteria Collection exists and is selected'
            treeViewFragment.expandNodeByName(CHILD_LEAF+'001')
            treeViewFragment.rightClick(CHILD_LEAF+'001')

        and: 'Wait for the action buttons and click to Remove from Collection'
            treeViewFragment.clickInOption(REMOVE_ACTION)

        and: 'Remove is confirmed'
            assert dialogFragment.isDialogVisible()
            dialogFragment.clickOk()

        then: 'Verify that the removed Search Criteria collection does not exist'
            assert treeViewFragment.isNodeNotExist(CHILD_LEAF+'001')

        cleanup: 'Clear the DB and bring default data'
            treeViewFragment.clearDB()
            treeViewFragment.resetDropdownSettings()
    }
}


