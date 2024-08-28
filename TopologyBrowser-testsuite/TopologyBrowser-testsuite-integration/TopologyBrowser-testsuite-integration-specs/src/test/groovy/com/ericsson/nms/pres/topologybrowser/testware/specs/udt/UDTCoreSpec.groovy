package com.ericsson.nms.pres.topologybrowser.testware.specs.udt

import com.ericsson.nms.pres.topologybrowser.testware.pages.*
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Specification

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.*

@RunWith(ArquillianSputnik)
class UDTCoreSpec extends Specification {
    @Page
    private TopologyBrowserPage topologyBrowserPage
    @Page
    private UDTDropdownFragment udtDropdownFragment
    @Page
    private TreeViewFragment treeViewFragment
    @Page
    private DetailsPanelFragment detailsPanelFragment
    @Page
    private ActionsBarFragment actionsBarFragment

    def 'Expand UDT dropdown and check content'() {
        given: 'Topology Browser is open'
        topologyBrowserPage.openTopologyBrowser(true)

        when: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        then: 'Modelled Topologies, Network Data, Custom Topologies, Transport Topology, Create a Custom Topology items to be visible'
        assert udtDropdownFragment.checkDropDownItemIsVisible(dropDownElement)

        and: 'Network Data and Transport Topology is selectable'
        assert udtDropdownFragment.checkSelectableByName(dropDownElement) == isClickable

        where:

        dropDownElement         | isClickable
        MODELLED_TOPOLOGIES     | false
        NETWORK_DATA            | true
        CUSTOM_TOPOLOGIES       | false
        CREATE_CUSTOM_TOPOLOGY  | true
        TRANSPORT_TOPOLOGY      | true
    }

    def 'Check Icon Tooltips on Branches and Leafs'() {
        given: 'Transport Topology with Leaf collection and nodes exists'
        treeViewFragment.setTopologyOnDB('rootWithLeafCollectionAndMultipleNodes')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        when: 'Transport Topology is clicked and expanded'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        then: 'Verify that the icon tooltips are valid'
         treeViewFragment.getIconTooltip(TRANSPORT_TOPOLOGY) == "Collection Of Collections"
        treeViewFragment.getIconTooltip(CHILD_LEAF+'001') == "Collection Of Objects"

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Expand UDT dropdown and switch to Transport Topology and back to Network Data'() {
        given: 'Topology Browser is open'
        topologyBrowserPage.openTopologyBrowser(true)
        topologyBrowserPage.refreshTopologyBrowserPage()

        when: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: 'Item is clicked '
        udtDropdownFragment.selectByName(view)
        then: 'Tree view switches'
        switch (view) {
            case TRANSPORT_TOPOLOGY:
                assert treeViewFragment.isCustomTopology(true)
                break
            case NETWORK_DATA:
                assert treeViewFragment.isNetworkData()
                break
        }

        where:
        view << [TRANSPORT_TOPOLOGY, NETWORK_DATA]
    }

    def 'Switch to Transport and confirm page content'() {
        given: 'Topology Browser is open'
        topologyBrowserPage.openTopologyBrowser(true)

        when: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)

        then: 'Tree view switches to "Transport Topology"'
        assert treeViewFragment.isCustomTopology(true)

        and: '"Transport Topology" has a collapsable arrow, it points to right'
        assert treeViewFragment.isRootArrowRight()

        and: '"Transport Topology" is not selected'
        assert !treeViewFragment.getTreeRoot().isSelected()

        and: 'No Details are shown in "Details Panel"'
        detailsPanelFragment.isDetailsPanelEmpty()

        and: 'No actions are presented in the Action Bar'
        assert actionsBarFragment.actionBarButtons().size() == 2

        cleanup:
        treeViewFragment.resetDropdownSettings()
    }

    def 'Check Private Network SubHeading is shown'() {
        given: 'Transport Topology with Private Network collection'
            treeViewFragment.setTopologyOnDB('rootWithOnePrivateNetworkCollection')

        and: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
            udtDropdownFragment.expandDropdown()

        when: 'Transport Topology is clicked and expanded'
            udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
            treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        then: 'Verify that Private Network Type is shown'
            assert treeViewFragment.getPrivateNetwork().getText().equals('Private Network')

        cleanup: 'Clear the DB and bring default data'
            treeViewFragment.clearDB()
            treeViewFragment.resetDropdownSettings()
    }
}