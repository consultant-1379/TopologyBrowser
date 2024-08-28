package com.ericsson.nms.pres.topologybrowser.testware.specs.udt

import com.ericsson.nms.pres.topologybrowser.testware.pages.*
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Specification


import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.*

@RunWith(ArquillianSputnik)
class FDNSpec extends Specification {
    @Page
    private TopologyBrowserPage topologyBrowserPage
    @Page
    private UDTDropdownFragment udtDropdownFragment
    @Page
    private TreeViewFragment treeViewFragment
    @Page
    private ActionsBarFragment actionsBarFragment
    @Page
    private DetailsPanelFragment detailsPanelFragment
    @Page
    private TopologyFDNFragment topologyFDNFragment
    @Page
    private DialogFragment dialogFragment

    def 'Browse to FDN dialog input box should be empty as default and browse button be disabled on initial load'() {

        given: 'Topology Browser is open'
        topologyBrowserPage.openTopologyBrowser(true)

        when: 'FDN Dialog is open'
        actionsBarFragment.clickActionButton('Browse to FDN')

        then: 'Check if the FDN value is empty when the dialog is open'
        topologyFDNFragment.getFDNValue() == ''
        topologyFDNFragment.isBrowseButtonEnabled() == false

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
    }

    def 'Browse to FDN dialog input box should have the FDN value of selected object'() {
        String fdn

        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'SubNetwork is expanded'
        treeViewFragment.expandNodeByName(ALL_OTHER_NODES)

        and: 'Node is selected'
        treeViewFragment.clickNodeByName(OTHER_RADIO_NODE)

        and: 'FDN is displayed in Details Panel'
        fdn = detailsPanelFragment.getNodeFDN().getText()

        when: 'FDN Dialog is open'
        actionsBarFragment.clickActionButton('Browse to FDN')

        then: 'Check if the FDN value is empty when the dialog is open'
        topologyFDNFragment.getFDNValue() == fdn

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
    }

    def 'Press Browse to FDN with a wrong FDN value'() {

        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'FDN Dialog is open'
        actionsBarFragment.clickActionButton('Browse to FDN')

        and: 'Wrong FDN is entered into input'
        topologyFDNFragment.enterFDN('wrong_fdn')
        topologyFDNFragment.pressEnter()

        and: 'Error dialog is open'
        dialogFragment.isErrorDialogVisible()
        dialogFragment.clickOk()

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
    }

    def 'Press Browse to FDN using enter, from Network Data'() {
        String fdn

        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'SubNetwork is expanded'
        treeViewFragment.expandNodeByName(ALL_OTHER_NODES)

        and: 'Node is selected'
        treeViewFragment.clickNodeByName(OTHER_RADIO_NODE)

        and: 'FDN is displayed in Details Panel'
        fdn = detailsPanelFragment.getNodeFDN().getText()

        and: 'Node is unselected'
        treeViewFragment.clickNodeByName(OTHER_RADIO_NODE)

        and: 'FDN Dialog is open'
        actionsBarFragment.clickActionButton('Browse to FDN')

        and: 'FDN is entered into input'
        topologyFDNFragment.enterFDN(fdn)
        assert topologyFDNFragment.isBrowseButtonEnabled()
        topologyFDNFragment.pressEnter()

        and: 'The correct node is selected'
        treeViewFragment.isNodeSelected(OTHER_RADIO_NODE)

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
    }

    def 'Press Browse to FDN using enter, from Transport Topology'() {
        String fdn

        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'SubNetwork is expanded'
        treeViewFragment.expandNodeByName(ALL_OTHER_NODES)

        and: 'Node is selected'
        treeViewFragment.clickNodeByName(OTHER_RADIO_NODE)

        and: 'FDN is displayed in Details Panel'
        fdn = detailsPanelFragment.getNodeFDN().getText()
        println fdn

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'FDN Dialog is open'
        actionsBarFragment.clickActionButton('Browse to FDN')

        and: 'FDN is entered into input'
        topologyFDNFragment.enterFDN(fdn)
        topologyFDNFragment.pressEnter()

        and: 'Warning dialog should appear'
        dialogFragment.isDialogVisible()
        dialogFragment.clickOk()

        and: 'The correct node is selected'
        treeViewFragment.isNodeSelected(OTHER_RADIO_NODE)

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Browse to FDN dialog input box should be empty when selecting a collection'() {

        given: 'Transport topology with one branch collection'
        treeViewFragment.setTopologyOnDB('rootWithBothTypeOfCollection')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        when: 'Branch collection is selected'
        treeViewFragment.clickNodeByName(CHILD_BRANCH + '001')

        and: 'FDN Dialog is open'
        actionsBarFragment.clickActionButton('Browse to FDN')

        then: 'Check if the FDN value is empty when the dialog is open'
        topologyFDNFragment.getFDNValue() == ''

        and: 'FDN dialog is closed'
        topologyFDNFragment.clickCancelButton()

        when: 'Leaf collection is selected'
        treeViewFragment.clickNodeByName(CHILD_LEAF + '001')

        and: 'FDN Dialog is open'
        actionsBarFragment.clickActionButton('Browse to FDN')

        then: 'Check if the FDN value is empty when the dialog is open'
        topologyFDNFragment.getFDNValue() == ''

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

}