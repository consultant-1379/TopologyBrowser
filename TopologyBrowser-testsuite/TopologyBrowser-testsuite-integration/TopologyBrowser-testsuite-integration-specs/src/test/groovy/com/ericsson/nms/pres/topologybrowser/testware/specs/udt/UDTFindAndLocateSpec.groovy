package com.ericsson.nms.pres.topologybrowser.testware.specs.udt

import com.ericsson.nms.pres.topologybrowser.testware.pages.SearchNodeFragment
import com.ericsson.nms.pres.topologybrowser.testware.pages.TopologyBrowserPage
import com.ericsson.nms.pres.topologybrowser.testware.pages.TreeViewFragment
import com.ericsson.nms.pres.topologybrowser.testware.pages.UDTDropdownFragment
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Specification
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.CHILD_LEAF
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.TRANSPORT_TOPOLOGY
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.NETWORK_DATA
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.NetworkData.NODE_11
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.NetworkData.BITS_PARENT_NODE


@RunWith(ArquillianSputnik)
class UDTFindAndLocateSpec extends Specification {

    @Page
    private TopologyBrowserPage topologyBrowserPage
    @Page
    private UDTDropdownFragment udtDropdownFragment
    @Page
    private TreeViewFragment treeViewFragment
    @Page
    private SearchNodeFragment searchNodeFragment

    def 'Test Find and Locate Functionality'() {
        given: 'Transport Topology with Leaf collection exists'
            treeViewFragment.setTopologyOnDB('rootWithLeafCollectionAndMultipleNodes')

        and: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        when: 'UDT dropdown exists and is expanded'
            udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
            udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
            treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Search Icon is Selected'
            searchNodeFragment.selectIcon()

        and: 'Search is Selected'
            searchNodeFragment.selectSearch()
            searchNodeFragment.enterSearch('iea')
            searchNodeFragment.pressEnter()

        then: 'Node exists and is selected'
            treeViewFragment.expandNodeByName(CHILD_LEAF+'001')
            treeViewFragment.clickNodeByName(CHILD_LEAF+'001')

        and: 'Click the down arrow'
            searchNodeFragment.clickDownArrowButton()

        then: 'Node exists and is selected'
            treeViewFragment.expandNodeByName(CHILD_LEAF+'002')
            treeViewFragment.clickNodeByName(CHILD_LEAF+'002')

        and: 'Click the up arrow'
            searchNodeFragment.clickUpArrowButton()

        then: 'Node exists and is selected'
            treeViewFragment.expandNodeByName(CHILD_LEAF+'002')
            treeViewFragment.clickNodeByName(CHILD_LEAF+'002')

        cleanup:
            treeViewFragment.resetDropdownSettings()
            treeViewFragment.clearDB()

    }

    def 'Test Find and Locate Functionality for Network Data Layer'() {

        given: 'Network Data with Leaf Node exists'
            treeViewFragment.setTopologyOnDB('rootWithLeafCollectionAndMultipleNodes')

        and: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        when: 'UDT dropdown exists and is expanded'
            udtDropdownFragment.expandDropdown()

        and: '"Network Data" is selected'
            udtDropdownFragment.selectByName(NETWORK_DATA)

        and: 'search Icon is Selected'
            searchNodeFragment.selectIcon()

        and: 'search is Selected'
            searchNodeFragment.selectSearch()
            searchNodeFragment.enterSearch('001')
            searchNodeFragment.pressEnter()

        then: 'node is found and selected'
            treeViewFragment.isNodeSelected(BITS_PARENT_NODE)

        and: 'click the down arrow'
            searchNodeFragment.clickDownArrowButton()
            treeViewFragment.isNodeSelected(NODE_11)

        and: 'click the up arrow'
            searchNodeFragment.clickUpArrowButton()
            treeViewFragment.isNodeSelected(BITS_PARENT_NODE)

        cleanup:
            treeViewFragment.resetDropdownSettings()
            treeViewFragment.clearDB()

    }

    def 'Test for invalid characters'() {
        given: 'Transport Topology with Leaf collection exists'
            treeViewFragment.setTopologyOnDB('rootWithLeafCollectionAndMultipleNodes')

        and: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        when: 'UDT dropdown exists and is expanded'
            udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
            udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
            treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Search Icon is Selected'
            searchNodeFragment.selectIcon()

        and: 'Search is Selected'
            searchNodeFragment.selectSearch()
            searchNodeFragment.enterSearch(input)

        then: 'Check invalid character error message'
            assert searchNodeFragment.isErrorMessageDisplayed() == isVisible

        cleanup:
            treeViewFragment.resetDropdownSettings()
            treeViewFragment.clearDB()

        where:
            input               | isVisible
            ')'                 | true
            '!'                 | true
            'iea'               | false
            ']'                 | true
            'ieatnetsimv6035'   | false
            '&'                 | true
            '*'                 | false
            '$'                 | true
            '_'                 | false
            '"'                 | true
            '+'                 | true
            '='                 | true
            '{'                 | true
            '/'                 | true
            ';'                 | true
            '#'                 | true
    }

    def 'Test for nodes not found'() {
        given: 'Transport Topology with Leaf collection exists'
            treeViewFragment.setTopologyOnDB('rootWithLeafCollectionAndMultipleNodes')

        and: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        when: 'UDT dropdown exists and is expanded'
            udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked and expanded'
            udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
            treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Search Icon is Selected'
            searchNodeFragment.selectIcon()

        then: 'Search is Selected'
            searchNodeFragment.selectSearch()
            searchNodeFragment.enterSearch(input)
            searchNodeFragment.pressEnter()

        then: 'Check node not found error message'
            assert searchNodeFragment.isErrorMessageDisplayed() == isVisible

        cleanup:
            treeViewFragment.resetDropdownSettings()
            treeViewFragment.clearDB()

        where:
            input               | isVisible
            'RNC'               | true
            'iea'               | false
            'Nr0'               | true
    }

}
