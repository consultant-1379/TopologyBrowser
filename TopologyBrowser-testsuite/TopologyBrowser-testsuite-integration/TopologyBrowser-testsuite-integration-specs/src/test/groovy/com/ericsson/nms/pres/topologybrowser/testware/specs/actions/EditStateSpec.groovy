package com.ericsson.nms.pres.topologybrowser.testware.specs.actions

import com.ericsson.nms.pres.topologybrowser.testware.pages.*
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Specification
import spock.lang.Unroll

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.NetworkData.*

@RunWith(ArquillianSputnik)
class EditStateSpec extends Specification {
    @Page
    TopologyBrowserPage topologyBrowserPage
    @Page
    DialogFragment dialogFragment
    @Page
    EditStateDialogFragment editStateDialogFragment
    @Page
    ProgressRegionFragment progressRegionFragment
    @Page
    TreeViewFragment treeViewFragment
    @Page
    ActionsBarFragment actionsBarFragment
    @Page
    SelectedContainerFragment selectedContainerFragment

    private static final String EDIT_STATE = "Edit State"
    private static final String SUCCESS = "Updated Successfully"
    private static final String INTERNAL_ERROR = "Failed: The server encountered an internal error. Please try again later."
    private static final String FORBIDDEN_ERROR = "Failed: Your role does not allow you to perform this operation. Contact your Security Administrator to change your access rights."

    @Unroll
    def 'Edit State action on nodes where they are #summary'() {
        given: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        and: '"Network Data" is clicked and expanded'
            treeViewFragment.expandNodeByName(SUB_NETWORK_1)

        and: 'node has Maintenance State icon'
            assert treeViewFragment.nodeHasIcon(NODE_4, 'ebIcon_maintenanceMode')

        when: 'Nodes are selected'
            treeViewFragment.expandNodeByName(SUB_NETWORK_3)
            selectedNodes.each { node ->
                treeViewFragment.pressCtrl()
                treeViewFragment.clickNodeByName(node)
                treeViewFragment.releaseCtrl()
            }

        then: 'verify nodes are selected'
            selectedNodes.each { node ->
                assert treeViewFragment.isNodeSelected(node)
            }

        and: 'verify selected count'
            assert selectedContainerFragment.getSelectedCount() == selectedNodes.size()

        and: 'Appropriate Actions should appear on action bar'
            assert actionsBarFragment.isActionVisible(EDIT_STATE)

        when: 'Click on Action'
            actionsBarFragment.clickActionButton(EDIT_STATE)

        then: 'Dialog Appears'
            assert dialogFragment.isDialogVisible()

        and: 'Correct count of nodes displayed'
            assert editStateDialogFragment.getNodesCount().getText().toInteger() == selectedNodes.size()

        when: 'Set Management State and Review Changes'
            editStateDialogFragment.clickRadio(state)
            dialogFragment.buttonClick("Review Changes")

        then: 'Progress Table appears with proposed State'
            assert progressRegionFragment.getStateChangeResult(1).getText() == state

        and: 'Correct number of nodes not started is shown'
            assert progressRegionFragment.getStatusCount("Not Started").getText().toInteger() == selectedNodes.size()
            assert progressRegionFragment.getStatusCount("Total Nodes").getText().toInteger() == selectedNodes.size()

        when: 'Execute the changes'
            dialogFragment.buttonClick("Execute Changes")

        then: 'Close button appears'
            assert dialogFragment.isButtonVisible("OK")

        and: 'Correct Results appears for each node'
            resultText.eachWithIndex { it, index ->
                assert progressRegionFragment.getStateChangeResult(index + 1).getText() == it
            }

        and: 'Correct number of successes and failures are shown'
            assert progressRegionFragment.getStatusCount("Not Started").getText().toInteger() == 0
            assert progressRegionFragment.getStatusCount("Updated").getText().toInteger() == expectedSuccess
            assert progressRegionFragment.getStatusCount("Failed").getText().toInteger() == expectedFail

        when: 'Close the dialog'
            dialogFragment.buttonClick("OK")

        then: 'Maintenance State icon disappears from node'
            treeViewFragment.collapseNodeByName(SUB_NETWORK_3)
            assert treeViewFragment.nodeHasNoIcon(NODE_4, 'ebIcon_maintenanceMode')

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.restore()

        where:
            summary                | selectedNodes                                                                                        | state            | expectedSuccess | expectedFail | resultText
            "all Successful"       | [NODE_1, NODE_2, NODE_3]                                                                             | "In Maintenance" | 3               | 0            | [SUCCESS, SUCCESS, SUCCESS]
            "partially Successful" | [NODE_1, NODE_FORBIDDEN_UPDATE, NODE_DB_UNAVAILABLE_UPDATE]                                          | "In Maintenance" | 1               | 2            | [SUCCESS, FORBIDDEN_ERROR, INTERNAL_ERROR]
            "all failing"          | [NODE_DB_UNAVAILABLE_UPDATE, NODE_FORBIDDEN_UPDATE, NODE_UNAUTHORIZED_UPDATE, NODE_EXCEPTION_UPDATE] | "Normal"         | 0               | 4            | [INTERNAL_ERROR, FORBIDDEN_ERROR, INTERNAL_ERROR, INTERNAL_ERROR]
    }

    @Unroll
    def 'Edit State action returns error dialog when #summary'() {
        given: 'Topology Browser is open'
            topologyBrowserPage.refreshTopologyBrowserPage()
            topologyBrowserPage.openTopologyBrowser(true)

        and: '"Network Data" is clicked and expanded'
            treeViewFragment.expandNodeByName(SUB_NETWORK_1)
            treeViewFragment.expandNodeByName(SUB_NETWORK_3)

        when: 'Nodes are selected'
            treeViewFragment.clickNodeByName(selectedNode)

        then: 'verify node is selected'
            assert treeViewFragment.isNodeSelected(selectedNode)

        and: 'verify selected count'
            assert selectedContainerFragment.getSelectedCount() == 1

        and: 'Appropriate Actions should appear on action bar'
            assert actionsBarFragment.isActionVisible(EDIT_STATE)

        when: 'Click on Action'
            actionsBarFragment.clickActionButton(EDIT_STATE)

        then: 'Dialog Appears'
            assert dialogFragment.isErrorDialogVisible()

        and: 'correct header and body show'
            assert dialogFragment.getPrimaryText() == header
            assert dialogFragment.getSecondaryText() == body

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.restore()

        where:
            summary                    | selectedNode             | header                    | body
            "unauthorized"             | NODE_UNAUTHORIZED_READ   | "Unable to Retrieve Data" | "The server encountered an internal error. Please try again later."
            "database unavailable"     | NODE_DB_UNAVAILABLE_READ | "Unable to Retrieve Data" | "The server encountered an internal error. Please try again later."
            "generic exception thrown" | NODE_EXCEPTION_READ      | "Unable to Retrieve Data" | "The server encountered an internal error. Please try again later."
            "forbidden"                | NODE_FORBIDDEN_READ      | "Access Denied"           | "Your role does not allow you to perform this operation. Contact your Security Administrator to change your access rights."
    }
}
