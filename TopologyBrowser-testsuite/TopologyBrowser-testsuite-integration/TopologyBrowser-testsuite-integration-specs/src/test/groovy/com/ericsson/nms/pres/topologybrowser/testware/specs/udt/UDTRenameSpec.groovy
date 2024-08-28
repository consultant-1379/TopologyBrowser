package com.ericsson.nms.pres.topologybrowser.testware.specs.udt

import com.ericsson.nms.pres.topologybrowser.testware.pages.*
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Specification

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.*

@RunWith(ArquillianSputnik)
class UDTRenameSpec extends Specification{
    @Page
    private TopologyBrowserPage topologyBrowserPage
    @Page
    private UDTDropdownFragment udtDropdownFragment
    @Page
    private TreeViewFragment treeViewFragment
    @Page
    private ActionsBarFragment actionsBarFragment
    @Page
    private FlyoutFragment flyoutFragment
    @Page
    private DialogFragment dialogFragment

    private static final String NEW_COLLECTION_NAME = 'NewCollectionName'

    def 'Rename a Leaf Collection'() {
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

        when: ' "Rename" action button is clicked'
        actionsBarFragment.clickActionButton(RENAME_ACTION)

        then: 'verify Rename flyout is visible'
        assert flyoutFragment.isFlyoutVisible()

        when: 'A new name of collection is provided'
        flyoutFragment.inputName(NEW_COLLECTION_NAME)
        flyoutFragment.clickOnRenameSave()
        flyoutFragment.waitFlyoutTOClose()

        then: 'Verify that the leaf collection updated is present with different name'
        assert treeViewFragment.isNodeExist(NEW_COLLECTION_NAME)
        assert treeViewFragment.isNodeNotExist(CHILD_LEAF+'001')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Rename a Branch Collection'() {
        given: 'Transport Topology with Branch collection exists'
        treeViewFragment.setTopologyOnDB('rootWithBothTypeOfCollection')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Leaf Collection exists and is selected'
        treeViewFragment.expandNodeByName(CHILD_BRANCH+'001')
        treeViewFragment.clickNodeByName(CHILD_BRANCH+'001')

        when: ' "Rename" action button is clicked'
        actionsBarFragment.clickActionButton(RENAME_ACTION)

        then: 'verify Rename flyout is visible'
        assert flyoutFragment.isFlyoutVisible()

        when: 'A new name of collection is provided'
        flyoutFragment.inputName(NEW_COLLECTION_NAME)
        flyoutFragment.clickOnRenameSave()
        flyoutFragment.waitFlyoutTOClose()

        then: 'Verify that the leaf collection updated is present with different name'
        assert treeViewFragment.isNodeExist(NEW_COLLECTION_NAME)
        assert treeViewFragment.isNodeNotExist(CHILD_BRANCH+'001')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Rename a Leaf Collection Negative test'() {

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

        when: ' "Rename" action button is clicked'
        actionsBarFragment.clickActionButton(RENAME_ACTION)

        then: 'verify Rename flyout is visible'
        assert flyoutFragment.isFlyoutVisible()

        when: 'An existing name is given as renamed collection is provided'
        flyoutFragment.inputName(CHILD_LEAF+'002')
        flyoutFragment.clickOnRenameSave()

        then: 'verify error dialog appears'
        assert dialogFragment.isErrorDialogVisible()

        and: 'press okay to close the error dialog'
        dialogFragment.clickOk()
        flyoutFragment.waitFlyoutTOClose()

        then: 'Verify that the existing leaf collection exists'
        assert treeViewFragment.isNodeExist(CHILD_LEAF+'002')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

}
