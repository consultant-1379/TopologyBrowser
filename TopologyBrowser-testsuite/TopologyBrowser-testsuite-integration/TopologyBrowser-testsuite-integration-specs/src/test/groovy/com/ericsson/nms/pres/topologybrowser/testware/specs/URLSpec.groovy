package com.ericsson.nms.pres.topologybrowser.testware.specs

import com.ericsson.nms.pres.topologybrowser.testware.pages.*

import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Specification

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.*

@RunWith(ArquillianSputnik)
class URLSpec  extends Specification {

    @Page
    TopologyBrowserPage topologyBrowserPage
    @Page
    UDTDropdownFragment udtDropdownFragment
    @Page
    TreeViewFragment treeViewFragment
    @Page
    ActionsBarFragment actionsBarFragment
    @Page
    DialogFragment dialogFragment
    @Page
    DetailsPanelFragment detailsPanelFragment
    @Page
    TopologyFDNFragment topologyFDNFragment


    private static final String SEARCH_FOR_OBJECT = 'Search for an Object'
    private static final String POID_URL = 'poid='
    private static final String SUBNETWORK = 'RNC01'
    private static final String SUBNETWORK_POID = '281475029085392'
    private static final String TOPOLOGY_URL = 'topology=281474978623587'
    private static final String ROOT_URL = 'topology=281474978846998'
    private static final String TRANSPORT_TOPOLOGY_URL = 'topology=281474978623587&fullpath=281474978623587'
    private static final String TOPOLOGY_BRANCH_URL = 'topology=281474978623587&fullpath=281474978623587>281474978846999'
    private static final String TOPOLOGY_LEAF_URL = 'topology=281474978623587&fullpath=281474978623587>281474978846998'
    private static final String RADIO_NODE = 'LTE02ERBS00111'
    private static final String RADIO_NODE_POID = '281475059730933'

//Thread.sleep used to accommodate the time taken for url change in the browser
    def 'Selecting an Object in the Network data'() {

        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'Url should contain topologybrowser'
        assert topologyBrowserPage.checkUrl('')

        when: 'Select subnetwork'
        treeViewFragment.clickNodeByName(SUBNETWORK)

        then: 'Url should contain "poid" url param'
        Thread.sleep(200)
        assert topologyBrowserPage.checkUrl(POID_URL + SUBNETWORK_POID)

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()

    }
    def 'Selecting node through FDN'() {
        String fdn

        given: 'Topology Browser is open'
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'SubNetwork is expanded'
        treeViewFragment.expandNodeByName(ALL_OTHER_NODES)

        when: 'Node is selected'
        treeViewFragment.clickNodeByName(OTHER_RADIO_NODE)

        and: 'FDN is displayed in Details Panel'
        fdn = detailsPanelFragment.getNodeFDN().getText()

        and: 'Select different node'
        treeViewFragment.clickNodeByName(SUBNETWORK)

        and: 'FDN Dialog is open'
        actionsBarFragment.clickActionButton('Browse to FDN')

        and: 'FDN is entered into input'
        topologyFDNFragment.clearFDNText()
        topologyFDNFragment.enterFDN(fdn)
        topologyFDNFragment.clickBrowseButton()

        then: 'Url should contain "poid" url param'
        Thread.sleep(200)
        assert topologyBrowserPage.checkUrl(POID_URL + '281475075346449')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()

    }


    def 'URL should contain "topology" param for Custom topology'() {

        given: 'Transport topology with one branch collection'
        treeViewFragment.setTopologyOnDB('rootWithBothTypeOfCollection')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)

        and: 'Tree view switches to "Transport Topology"'
        assert treeViewFragment.isCustomTopology(true)

        and: 'Verify that the url contain "topology" url params'
        assert topologyBrowserPage.checkUrl(TOPOLOGY_URL)

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()

    }

    def 'Selecting Collections in the Custom Topology'() {

        given: 'Transport topology with one branch collection'
        treeViewFragment.setTopologyOnDB('rootWithBothTypeOfCollection')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: 'Transport Topology is clicked'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)

        and: 'Tree view switches to "Transport Topology"'
        assert treeViewFragment.isCustomTopology(true)

        and: 'Url should contain "topology" url param'
        assert topologyBrowserPage.checkUrl(TOPOLOGY_URL)

        when: 'Root topology is selected'
        treeViewFragment.clickNodeByName(TRANSPORT_TOPOLOGY)

        then: 'Url should contain "topology" url param and "fullpath" url param'
        Thread.sleep(200)
        assert topologyBrowserPage.checkUrl(TRANSPORT_TOPOLOGY_URL)

        and: 'Transport Topology is expanded'
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        when: 'Branch collection is expanded'
        treeViewFragment.clickNodeByName(CHILD_BRANCH + '001')

        then: 'Url should contain "topology" url param and and "fullpath" url param'
        Thread.sleep(200)
        assert topologyBrowserPage.checkUrl(TOPOLOGY_BRANCH_URL)

        when: 'Leaf collection is selected'
        treeViewFragment.clickNodeByName(CHILD_LEAF + '001')

        then: 'Url should contain "topology" url param and and "fullpath" url param'
        Thread.sleep(300)
        assert topologyBrowserPage.checkUrl(TOPOLOGY_LEAF_URL)

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()

    }

    def 'Selecting an Object in the Custom Topology'() {

        given: 'Transport topology with one branch collection'
        treeViewFragment.setTopologyOnDB('rootWithBothTypeOfCollection')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)

        and: 'Tree view switches to "Transport Topology"'
        assert treeViewFragment.isCustomTopology(true)

        and: 'Url should contain "topology" url param'
        assert topologyBrowserPage.checkUrl(TOPOLOGY_URL)

        and: 'Leaf collection is expanded'
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(CHILD_LEAF + '001')

        when: 'Object in the leaf collection is selected'
        treeViewFragment.clickNodeByName(RADIO_NODE)

        then: 'Url should contain "poid" url param'
        Thread.sleep(200)
        assert topologyBrowserPage.checkUrl(POID_URL + RADIO_NODE_POID)

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()

    }

    def 'Executing the Topology Browser URL when Custom Topology is being viewed'() {

        given: 'Transport topology with one branch collection'
        treeViewFragment.setTopologyOnDB('rootWithBothTypeOfCollection')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)

        and: 'Tree view switches to "Transport Topology"'
        assert treeViewFragment.isCustomTopology(true)

        and: 'Url should contain "topology" url param'
        treeViewFragment.getCurrentUrl()
        assert topologyBrowserPage.checkUrl(TOPOLOGY_URL)

        //Check cancel path
        when: 'Change url into Topology Browser URL'
        topologyBrowserPage.changeUrl('')

        then: 'Warning dialog appear'
        assert dialogFragment.isDialogVisible()

        and: 'Click cancel button on warning dialog'
        dialogFragment.buttonClick('Cancel')

        and: 'Verify custom topology url and view '
        assert topologyBrowserPage.checkUrl(TOPOLOGY_URL)
        assert treeViewFragment.isCustomTopology(true)

        //Check ok path
        when: 'Change url into Topology Browser URL'
        topologyBrowserPage.changeUrl('')

        then: 'Warning dialog appear'
        assert dialogFragment.isDialogVisible()

        and: 'Click ok button on warning dialog'
        dialogFragment.clickOk()

        and: 'Verify custom topology url and view'
        assert topologyBrowserPage.checkUrl(TOPOLOGY_URL)
        assert treeViewFragment.isCustomTopology(true)

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()

    }

    def '"Search for an Object" when using Custom Topologies'() {

        given: 'Transport topology with one branch collection'
        treeViewFragment.setTopologyOnDB('rootWithBothTypeOfCollection')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)

        and: 'Tree view switches to "Transport Topology"'
        assert treeViewFragment.isCustomTopology(true)

        and: 'Verify the url'
        treeViewFragment.getCurrentUrl()
        assert topologyBrowserPage.checkUrl(TOPOLOGY_URL)

        when: 'Click "Search for an Object" action'
        actionsBarFragment.clickActionButton(SEARCH_FOR_OBJECT)

        //Check cancel path for topology url
        then: 'Warning dialog appear'
        assert dialogFragment.isDialogVisible()

        and: 'Click cancel button on warning dialog'
        dialogFragment.buttonClick('Cancel')

        and: 'Verify custom topology url and view '
        assert topologyBrowserPage.checkUrl(TOPOLOGY_URL)
        assert treeViewFragment.isCustomTopology(true)

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()

    }

    def 'Selecting Root Collections not existing in Custom Topology Dropdown'() {

        given: 'Transport topology and another Root Collection not published as Custom Topology'
        treeViewFragment.setTopologyOnDB('moreThanOneRoot')

        when: 'Topology Browser is open with non custom topology root loaded'
        topologyBrowserPage.openTopologyBrowser(true)
        topologyBrowserPage.changeUrl('?'+ROOT_URL)

        then: 'Url should contain "topology" and the root id'
        treeViewFragment.getCurrentUrl()
        assert topologyBrowserPage.checkUrl(ROOT_URL)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Root Non Custom Topology" has a collapsible arrow, it points to right'
        assert treeViewFragment.isCustomRootArrowRight()

        and: 'Tree is showing Topology'
        assert treeViewFragment.isCustomTopology(true)

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }
}
