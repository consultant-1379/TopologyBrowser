package com.ericsson.nms.pres.topologybrowser.testware.specs.udt

import com.ericsson.nms.pres.topologybrowser.testware.pages.*
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Specification

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.*

@RunWith(ArquillianSputnik)
class UDTCreateSpec extends Specification {
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

    def 'In Custom Topologies, create a branch'() {
        given: 'Topology Browser is open'
        topologyBrowserPage.openTopologyBrowser(true)
        topologyBrowserPage.refreshTopologyBrowserPage()

        when: 'Clean all previous tests data from Custom Topologies'
        treeViewFragment.clearDB()

        and: 'navigate to CustomTopology'
        udtDropdownFragment.expandDropdown()
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        assert treeViewFragment.isCustomTopology(true)

        then: 'Open the flyout to create a branch of the Root level'
        treeViewFragment.clickNodeByName(TRANSPORT_TOPOLOGY)
        actionsBarFragment.clickActionButton(CREATE_COLLECTION_ACTION)
        assert flyoutFragment.isFlyoutVisible()

        and: 'Create a Branch'
        flyoutFragment.writeName(BRANCH_NAME)
        flyoutFragment.clickOnBranchOption()
        flyoutFragment.clickOnCreate()

        and: 'Check if the branch is created'
        flyoutFragment.waitFlyoutTOClose()
        assert treeViewFragment.isCustomTopology(true)
        assert treeViewFragment.isNodeSelected(TRANSPORT_TOPOLOGY)
        assert treeViewFragment.isNodeArrowDown(TRANSPORT_TOPOLOGY)
        assert treeViewFragment.isNodeExist(BRANCH_NAME)
        assert treeViewFragment.isNodeArrowRight(BRANCH_NAME)

        cleanup:
        treeViewFragment.resetDropdownSettings()
    }

    def 'In Custom Topologies, create a leaf inside a branch'() {
        given: 'Topology Browser is open'
        topologyBrowserPage.openTopologyBrowser(true)
        topologyBrowserPage.refreshTopologyBrowserPage()

        when: 'Clean all previous tests data from Custom Topologies'
        treeViewFragment.clearDB()

        and: 'Navigate to CustomTopology'
        udtDropdownFragment.expandDropdown()
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
        assert treeViewFragment.isCustomTopology(true)

        and: 'Open the flyout to create a branch of the Root level'
        treeViewFragment.clickNodeByName(TRANSPORT_TOPOLOGY)
        actionsBarFragment.clickActionButton(CREATE_COLLECTION_ACTION)
        assert flyoutFragment.isFlyoutVisible()

        and: 'Create a Branch'
        flyoutFragment.writeName(BRANCH_NAME)
        flyoutFragment.clickOnBranchOption()
        flyoutFragment.clickOnCreate()

        and: 'Check if the branch is created'
        flyoutFragment.waitFlyoutTOClose()
        assert treeViewFragment.isCustomTopology(true)
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)
        treeViewFragment.clickNodeByName(BRANCH_NAME)

        then: 'Create a Leaf'
        actionsBarFragment.clickActionButton(CREATE_COLLECTION_ACTION)
        assert flyoutFragment.isFlyoutVisible()
        flyoutFragment.writeName(LEAF_NAME)
        flyoutFragment.clickOnLeafOption()
        flyoutFragment.clickOnCreate()

        and: 'Check if the leaf is created'
        flyoutFragment.waitFlyoutTOClose()
        assert treeViewFragment.isCustomTopology(true)
        assert treeViewFragment.isNodeSelected(BRANCH_NAME)
        assert treeViewFragment.isNodeArrowDown(TRANSPORT_TOPOLOGY)
        assert treeViewFragment.isNodeExist(LEAF_NAME)
        assert treeViewFragment.isNodeArrowRight(LEAF_NAME)

        cleanup:
        treeViewFragment.resetDropdownSettings()
    }

    def 'Select Branch Collection, Create another Branch collection'() {

        given: 'Transport topology with one branch collection'
        treeViewFragment.setTopologyOnDB('rootWithBranchCollection')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)

        and: 'Tree view switches to "Transport Topology"'
        assert treeViewFragment.isCustomTopology(true)

        and: 'Expand the root Transport Topology"'
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)

        and: 'Select the branch collection"'
        treeViewFragment.clickNodeByName(CHILD_BRANCH + '001')

        when: 'Click on "Create Collection" action button'
        actionsBarFragment.clickActionButton(CREATE_COLLECTION_ACTION)

        then: '"Create Collection" Flyout appear'
        assert flyoutFragment.isFlyoutVisible()

        when: 'Create a new branch'
        flyoutFragment.writeName(CHILD_BRANCH + '002')
        flyoutFragment.clickOnBranchOption()
        flyoutFragment.clickOnCreate()

        then: 'Flyout close and bring the new branch collection'
        flyoutFragment.waitFlyoutTOClose()

        and: 'Parent node, "child_branch_001" selected and expanded'
        assert treeViewFragment.isNodeSelected(CHILD_BRANCH + '001')
        assert treeViewFragment.isNodeArrowDown(CHILD_BRANCH + '001')

        and: 'New branch, "child_branch_002" appear'
        assert treeViewFragment.isNodeExist(CHILD_BRANCH + '002')
        assert treeViewFragment.isNodeArrowRight(CHILD_BRANCH + '002')

        when: 'Expand newly created branch'
        treeViewFragment.expandNodeByName(CHILD_BRANCH + '002')

        then: 'No children found object appear as child'
        assert treeViewFragment.isNodeExist(NO_CHILDREN_FOUND)

        and: 'Expanded branch arrow must be down'
        assert treeViewFragment.isNodeArrowDown(CHILD_BRANCH + '002')

        when: 'Collapse parent node "child_branch_001"'
        treeViewFragment.collapseNodeByName(CHILD_BRANCH + '001')

        then: 'Newly created branch not shows and arrow must be right'
        assert treeViewFragment.isNodeArrowRight(CHILD_BRANCH + '001')
        assert treeViewFragment.isNodeNotExist(CHILD_BRANCH + '002')
        assert treeViewFragment.isNodeNotExist(NO_CHILDREN_FOUND)

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Check level limit of the branch for Branch collection'() {

        given: 'Transport topology with nine branch collections'
        treeViewFragment.setTopologyOnDB('rootWithNineBranchCollection')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)

        and: 'Tree view switches to "Transport Topology"'
        assert treeViewFragment.isCustomTopology(true)

        and: 'Expand nodes in "Transport Topology"'
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)
        1.upto(9, {
            treeViewFragment.expandNodeByName(CHILD_BRANCH + '00' + it)
        })

        and: 'Select the branch collection'
        treeViewFragment.clickNodeByName(CHILD_BRANCH + '009')

        when: 'Click on "Create Collection" action button'
        actionsBarFragment.clickActionButton(CREATE_COLLECTION_ACTION)

        then: '"Create Collection" Flyout must appear'
        assert flyoutFragment.isFlyoutVisible()

        when: 'Try to create new branch "child_branch_010"'
        flyoutFragment.writeName(CHILD_BRANCH + '010')
        flyoutFragment.clickOnBranchOption()
        flyoutFragment.clickOnCreate()

        then: 'Throw error dialog'
        assert dialogFragment.isDialogVisible()

        and: 'Click ok button on error dialog'
        dialogFragment.clickOk()

        and: 'Not create the branch collection'
        assert treeViewFragment.isNodeNotExist(CHILD_BRANCH + '010')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Check level limit of the branch for Leaf collection'() {

        given: 'Transport topology with nine branch collections'
        treeViewFragment.setTopologyOnDB('rootWithNineBranchCollection')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)

        and: 'Tree view switches to "Transport Topology"'
        assert treeViewFragment.isCustomTopology(true)

        and: 'Expand nodes in Topology"'
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)
        1.upto(9, {
            treeViewFragment.expandNodeByName(CHILD_BRANCH + '00' + it)
        })

        and: 'Select the branch collection"'
        treeViewFragment.clickNodeByName(CHILD_BRANCH + '009')

        when: 'Click on "Create Collection" action button'
        actionsBarFragment.clickActionButton(CREATE_COLLECTION_ACTION)

        then: '"Create Collection" Flyout must appear'
        assert flyoutFragment.isFlyoutVisible()

        when: 'Try to create new branch "child_leaf_010"'
        flyoutFragment.writeName(CHILD_LEAF + '010')
        flyoutFragment.clickOnLeafOption()
        flyoutFragment.clickOnCreate()

        then: 'Throw error dialog'
        assert dialogFragment.isDialogVisible()

        and: 'Click ok button on error dialog'
        dialogFragment.clickOk()

        and: 'Not create the branch collection'
        assert treeViewFragment.isNodeNotExist(CHILD_LEAF + '010')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }
    def 'Check level limit of the branch for Private Network collection'() {

        given: 'Transport topology with nine branch collections'
        treeViewFragment.setTopologyOnDB('rootWithNineBranchCollection')

        and: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Transport Topology" is clicked'
        udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)

        and: 'Tree view switches to "Transport Topology"'
        assert treeViewFragment.isCustomTopology(true)

        and: 'Expand nodes in Topology"'
        treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)
        1.upto(9, {
            treeViewFragment.expandNodeByName(CHILD_BRANCH + '00' + it)
        })

        and: 'Select the branch collection"'
        treeViewFragment.clickNodeByName(CHILD_BRANCH + '009')

        when: 'Click on "Create Private Network" action button'
        actionsBarFragment.clickActionButton(CREATE_PRIVATE_NETWORK_ACTION)

        then: '"Create Private Network" Flyout must appear'
        assert flyoutFragment.isFlyoutVisible()

        when: 'Try to create new private network "PRIVATE-NETWORK-01"'
        flyoutFragment.writeName(PRIVATE_NETWORK_NAME)
        flyoutFragment.inputCompanyName(PRIVATE_NETWORK_COMPANY_NAME)
        flyoutFragment.inputNetworkName(PRIVATE_NETWORK_NETWORK_NAME)
        flyoutFragment.inputLocation(PRIVATE_NETWORK_LOCATION)
        flyoutFragment.clickOnCreate()

        then: 'Throw error dialog'
        assert dialogFragment.isDialogVisible()

        and: 'Click ok button on error dialog'
        dialogFragment.clickOk()

        and: 'Not create the branch collection'
        assert treeViewFragment.isNodeNotExist(CHILD_LEAF + '010')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.clearDB()
        treeViewFragment.resetDropdownSettings()
    }

    def 'Switch to Create Custom Topology and confirm page content'() {
        given: 'Topology Browser is open'
        topologyBrowserPage.openTopologyBrowser(true)
        topologyBrowserPage.refreshTopologyBrowserPage()

        when: 'UDT dropdown exists and is expanded'
        udtDropdownFragment.expandDropdown()

        and: '"Create a Custom Topology" is clicked'
        udtDropdownFragment.selectByName(CREATE_CUSTOM_TOPOLOGY)

        then: 'Tree view kept as "Transport Topology"'
        assert treeViewFragment.isNetworkData()

        and: 'Open the flyout to create a custom topology'
        assert flyoutFragment.isFlyoutVisible()
    }

    def 'Create new Custom Topology'() {
        given: 'Topology Browser is open'
        topologyBrowserPage.openTopologyBrowser(true)
        topologyBrowserPage.refreshTopologyBrowserPage()

        when: 'navigate to CustomTopology'
        udtDropdownFragment.expandDropdown()
        udtDropdownFragment.selectByName(CREATE_CUSTOM_TOPOLOGY)
        assert treeViewFragment.isNetworkData()

        then: 'Confirm then flyout to create custom Topology is open'
        assert flyoutFragment.isFlyoutVisible()

        and: 'Create a Custom Topology'
        flyoutFragment.writeName(CUSTOM_TOPOLOGY)
        flyoutFragment.clickOnCreate()

        and: 'Check if the custom topology is created'
        flyoutFragment.waitFlyoutTOClose()
        assert treeViewFragment.isCustomTopology(true)
        assert treeViewFragment.isNodeExist(CUSTOM_TOPOLOGY)
        assert treeViewFragment.isNodeArrowRight(CUSTOM_TOPOLOGY)

        cleanup:
        treeViewFragment.resetDropdownSettings()
    }

    def 'In Custom Topologies, create a Search Criteria inside a branch'() {
        given: 'Topology Browser is open'
            topologyBrowserPage.openTopologyBrowser(true)
            topologyBrowserPage.refreshTopologyBrowserPage()

        when: 'Clean all previous tests data from Custom Topologies'
            treeViewFragment.clearDB()

        and: 'Navigate to CustomTopology'
            udtDropdownFragment.expandDropdown()
            udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
            assert treeViewFragment.isCustomTopology(true)

        and: 'Open the flyout to create a branch of the Root level'
            treeViewFragment.clickNodeByName(TRANSPORT_TOPOLOGY)
            actionsBarFragment.clickActionButton(CREATE_COLLECTION_ACTION)
            assert flyoutFragment.isFlyoutVisible()

        and: 'Create a Branch'
            flyoutFragment.writeName(BRANCH_NAME)
            flyoutFragment.clickOnBranchOption()
            flyoutFragment.clickOnCreate()

        and: 'Check if the branch is created'
            flyoutFragment.waitFlyoutTOClose()
            assert treeViewFragment.isCustomTopology(true)
            treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)
            treeViewFragment.clickNodeByName(BRANCH_NAME)

        then: 'Create a Search Criteria collection'
            actionsBarFragment.clickActionButton(CREATE_COLLECTION_ACTION)
            assert flyoutFragment.isFlyoutVisible()
            flyoutFragment.writeName(LEAF_NAME)
            flyoutFragment.clickOnSearchCriteriaOption()
            flyoutFragment.clickOnSearchCriteria()
            flyoutFragment.clickOnCreate()

        and: 'Check if the leaf is created'
            flyoutFragment.waitFlyoutTOClose()
            assert treeViewFragment.isCustomTopology(true)
            assert treeViewFragment.isNodeSelected(BRANCH_NAME)
            assert treeViewFragment.isNodeArrowDown(TRANSPORT_TOPOLOGY)
            assert treeViewFragment.isNodeExist(LEAF_NAME)
            assert treeViewFragment.isNodeArrowRight(LEAF_NAME)

        cleanup:
            treeViewFragment.resetDropdownSettings()
    }

    def 'In Custom Topologies, create a Private Network'() {
        given: 'Topology Browser is open'
            topologyBrowserPage.openTopologyBrowser(true)
            topologyBrowserPage.refreshTopologyBrowserPage()

        when: 'Clean all previous tests data from Custom Topologies'
            treeViewFragment.clearDB()

        and: 'navigate to CustomTopology'
            udtDropdownFragment.expandDropdown()
            udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
            assert treeViewFragment.isCustomTopology(true)

        then: 'Open the flyout to create a Private Network of the Root level'
            treeViewFragment.clickNodeByName(TRANSPORT_TOPOLOGY)
            actionsBarFragment.clickActionButton(CREATE_PRIVATE_NETWORK_ACTION)
            assert flyoutFragment.isFlyoutVisible()

        and: 'Create a Private Network'
            flyoutFragment.writeName(PRIVATE_NETWORK_NAME)
            flyoutFragment.inputCompanyName(PRIVATE_NETWORK_COMPANY_NAME)
            flyoutFragment.inputNetworkName(PRIVATE_NETWORK_NETWORK_NAME)
            flyoutFragment.inputLocation(PRIVATE_NETWORK_LOCATION)
            flyoutFragment.clickOnCreate()

        and: 'Check if the Private Network is created'
            flyoutFragment.waitFlyoutTOClose()
            assert treeViewFragment.isCustomTopology(true)
            assert treeViewFragment.isNodeSelected(TRANSPORT_TOPOLOGY)
            assert treeViewFragment.isNodeArrowDown(TRANSPORT_TOPOLOGY)
            assert treeViewFragment.isNodeExist(PRIVATE_NETWORK_NAME)
            assert treeViewFragment.isNodeArrowRight(PRIVATE_NETWORK_NAME)
            assert treeViewFragment.getPrivateNetwork().getText().equals('Private Network')

        cleanup:
            treeViewFragment.resetDropdownSettings()
    }

    def 'In Custom Topologies, create a Private Network inside a branch'() {
        given: 'Topology Browser is open'
            topologyBrowserPage.openTopologyBrowser(true)
            topologyBrowserPage.refreshTopologyBrowserPage()

        when: 'Clean all previous tests data from Custom Topologies'
            treeViewFragment.clearDB()

        and: 'Navigate to CustomTopology'
            udtDropdownFragment.expandDropdown()
            udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
            assert treeViewFragment.isCustomTopology(true)

        and: 'Open the flyout to create a branch of the Root level'
            treeViewFragment.clickNodeByName(TRANSPORT_TOPOLOGY)
            actionsBarFragment.clickActionButton(CREATE_COLLECTION_ACTION)
            assert flyoutFragment.isFlyoutVisible()

        and: 'Create a Branch'
            flyoutFragment.writeName(BRANCH_NAME)
            flyoutFragment.clickOnBranchOption()
            flyoutFragment.clickOnCreate()

        and: 'Check if the branch is created'
            flyoutFragment.waitFlyoutTOClose()
            assert treeViewFragment.isCustomTopology(true)
            treeViewFragment.expandNodeByName(TRANSPORT_TOPOLOGY)
            treeViewFragment.clickNodeByName(BRANCH_NAME)

        then: 'Open the flyout to create a Private Network under the branch'
            actionsBarFragment.clickActionButton(CREATE_PRIVATE_NETWORK_ACTION)
            assert flyoutFragment.isFlyoutVisible()

        and: 'Create a Private Network'
            flyoutFragment.writeName(PRIVATE_NETWORK_NAME)
            flyoutFragment.inputCompanyName(PRIVATE_NETWORK_COMPANY_NAME)
            flyoutFragment.inputNetworkName(PRIVATE_NETWORK_NETWORK_NAME)
            flyoutFragment.inputLocation(PRIVATE_NETWORK_LOCATION)
            flyoutFragment.clickOnCreate()

        and: 'Check if the Private Network is created'
            flyoutFragment.waitFlyoutTOClose()
            assert treeViewFragment.isCustomTopology(true)
            assert treeViewFragment.isNodeSelected(TRANSPORT_TOPOLOGY)
            assert treeViewFragment.isNodeArrowDown(TRANSPORT_TOPOLOGY)
            assert treeViewFragment.isNodeExist(PRIVATE_NETWORK_NAME)
            assert treeViewFragment.isNodeArrowRight(PRIVATE_NETWORK_NAME)
            assert treeViewFragment.getPrivateNetwork().getText().equals('Private Network')

        cleanup:
            treeViewFragment.resetDropdownSettings()
    }

    def 'In Custom Topologies, create a Leaf and a Private Network. On selection do not show Create Private Network action'() {
        given: 'Topology Browser is open'
            topologyBrowserPage.openTopologyBrowser(true)
            topologyBrowserPage.refreshTopologyBrowserPage()

        when: 'Clean all previous tests data from Custom Topologies'
            treeViewFragment.clearDB()

        and: 'navigate to CustomTopology'
            udtDropdownFragment.expandDropdown()
            udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
            assert treeViewFragment.isCustomTopology(true)

        then: 'Open the flyout to create a Private Network of the Root level'
            treeViewFragment.clickNodeByName(TRANSPORT_TOPOLOGY)
            actionsBarFragment.clickActionButton(CREATE_PRIVATE_NETWORK_ACTION)
            assert flyoutFragment.isFlyoutVisible()

        and: 'Create a Private Network'
            flyoutFragment.writeName(PRIVATE_NETWORK_NAME)
            flyoutFragment.inputCompanyName(PRIVATE_NETWORK_COMPANY_NAME)
            flyoutFragment.inputNetworkName(PRIVATE_NETWORK_NETWORK_NAME)
            flyoutFragment.inputLocation(PRIVATE_NETWORK_LOCATION)
            flyoutFragment.clickOnCreate()

        and: 'navigate to CustomTopology and create a leaf'
            udtDropdownFragment.expandDropdown()
            udtDropdownFragment.selectByName(TRANSPORT_TOPOLOGY)
            actionsBarFragment.clickActionButton(CREATE_COLLECTION_ACTION)
            flyoutFragment.writeName(LEAF_NAME)
            flyoutFragment.clickOnLeafOption()
            flyoutFragment.clickOnCreate()

        and: 'Check if the Private Network can be clicked and Create Private Network Action does not appear'
            flyoutFragment.waitFlyoutTOClose()
            treeViewFragment.clickNodeByName(PRIVATE_NETWORK_NAME)
            assert actionsBarFragment.isButtonNotPresent(CREATE_PRIVATE_NETWORK_ACTION)

        and: 'Check if the Leaf can be clicked and Create Private Network Action does not appear'
            treeViewFragment.clickNodeByName(LEAF_NAME)
            assert actionsBarFragment.isButtonNotPresent(CREATE_PRIVATE_NETWORK_ACTION)

        cleanup:
            treeViewFragment.resetDropdownSettings()
    }
}