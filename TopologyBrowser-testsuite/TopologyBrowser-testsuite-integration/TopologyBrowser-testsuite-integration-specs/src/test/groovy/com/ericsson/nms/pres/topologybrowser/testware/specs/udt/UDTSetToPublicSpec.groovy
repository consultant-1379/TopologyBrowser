package com.ericsson.nms.pres.topologybrowser.testware.specs.udt

import com.ericsson.nms.pres.topologybrowser.testware.pages.*
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Specification

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.*

@RunWith(ArquillianSputnik)
class UDTSetToPublicSpec extends Specification{
    @Page
    private TopologyBrowserPage topologyBrowserPage
    @Page
    private UDTDropdownFragment udtDropdownFragment
    @Page
    private TreeViewFragment treeViewFragment
    @Page
    private ActionsBarFragment actionsBarFragment
    @Page
    private NotificationFragment notificationFragment
    @Page
    private DetailsPanelFragment detailsPanelFragment

    def 'Set To Public a Private Collection'() {
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

        and: 'Private Leaf Collection exists and is selected'
        treeViewFragment.expandNodeByName(CHILD_LEAF+'002')
        treeViewFragment.clickNodeByName(CHILD_LEAF+'002')

        and: '"Set To Public" action button is visible'
        actionsBarFragment.isButtonVisible(SET_TO_PUBLIC_ACTION)

        when: '"Set To Public" action button is clicked'
        actionsBarFragment.clickActionButton(SET_TO_PUBLIC_ACTION)

        then: 'Success Notification is visible'
        assert notificationFragment.isNotificationVisible()
        assert notificationFragment.getText().equals("Sharing permission updated successfully")

        and: 'Sharing Permissions changed to Public'
        assert detailsPanelFragment.getSharingPermissions().getText().equals("Public")

        and: '"Set To Public" action button is not visible anymore'
        actionsBarFragment.isButtonNotPresent(SET_TO_PUBLIC_ACTION)

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Set To Public a Public Collection'() {
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

        and: 'Public Leaf Collection exists and is selected'
        treeViewFragment.expandNodeByName(CHILD_LEAF+'001')
        treeViewFragment.clickNodeByName(CHILD_LEAF+'001')

        and: '"Set To Public" action button is not visible'
        actionsBarFragment.isButtonNotPresent(SET_TO_PUBLIC_ACTION)

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

}
