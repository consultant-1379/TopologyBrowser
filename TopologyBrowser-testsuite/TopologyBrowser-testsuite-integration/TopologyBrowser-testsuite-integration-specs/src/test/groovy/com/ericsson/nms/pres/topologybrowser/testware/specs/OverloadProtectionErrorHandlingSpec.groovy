package com.ericsson.nms.pres.topologybrowser.testware.specs

import com.ericsson.nms.pres.topologybrowser.testware.pages.ActionsBarFragment
import com.ericsson.nms.pres.topologybrowser.testware.pages.DetailsPanelFragment
import com.ericsson.nms.pres.topologybrowser.testware.pages.DialogFragment
import com.ericsson.nms.pres.topologybrowser.testware.pages.InlineMessageFragment
import com.ericsson.nms.pres.topologybrowser.testware.pages.TopologyBrowserPage
import com.ericsson.nms.pres.topologybrowser.testware.pages.TopologyFDNFragment
import com.ericsson.nms.pres.topologybrowser.testware.pages.TreeViewFragment
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Specification

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.NO_CAPACITY_AVAILABLE_MESSAGE
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.NetworkData.ALL_OTHER_NODES
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.NetworkData.SUB_NETWORK_1
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.NetworkData.SUB_NETWORK_2
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.OTHER_RADIO_NODE
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.UNABLE_TO_LOCATE_OBJECT_TITLE
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.UNABLE_TO_RETRIEVE_DATA_TITLE

@RunWith(ArquillianSputnik)
class OverloadProtectionErrorHandlingSpec  extends Specification {

    @Page
    private TopologyBrowserPage topologyBrowserPage
    @Page
    private DetailsPanelFragment detailsPanelFragment
    @Page
    private TreeViewFragment treeViewFragment
    @Page
    private ActionsBarFragment actionsBarFragment
    @Page
    private TopologyFDNFragment topologyFDNFragment
    @Page
    private DialogFragment dialogFragment
    @Page
    private InlineMessageFragment inlineMessageFragment

    def statusCode = 429

    def 'No capacity available when getting by FDN'() {
        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'FDN Dialog is open'
        actionsBarFragment.clickActionButton('Browse to FDN')

        and: 'Set error response for fdn'
        treeViewFragment.setErrorResponse("overLoadProtectionFdn", statusCode)

        when: 'No capacity available for x=y'
        topologyFDNFragment.enterFDN('x=y')
        topologyFDNFragment.pressEnter()

        then: 'Error dialog is open'
        dialogFragment.isErrorDialogVisible()
        assert dialogFragment.getPrimaryText() == UNABLE_TO_LOCATE_OBJECT_TITLE
        assert dialogFragment.getSecondaryText() == NO_CAPACITY_AVAILABLE_MESSAGE
        dialogFragment.clickOk()

        and: 'Reset error responses'
        treeViewFragment.resetErrorResponse()
    }


    def 'No capacity available when loading topology tree'() {
        given: 'Set up error responses'
        treeViewFragment.resetErrorResponse()
        treeViewFragment.setErrorResponse("overLoadProtection", statusCode)

        when: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        then: 'Inline error exist with title and description'
        assert inlineMessageFragment.getHeaderText() == UNABLE_TO_RETRIEVE_DATA_TITLE
        assert inlineMessageFragment.getDescriptionText() == NO_CAPACITY_AVAILABLE_MESSAGE

        and: 'Reset error responses'
        treeViewFragment.resetErrorResponse()
    }

    def 'No capacity available when loading topology subtree'() {
        def roots = [SUB_NETWORK_1, SUB_NETWORK_2, ALL_OTHER_NODES]

        given: 'Topology Browser is open'
        treeViewFragment.resetErrorResponse()
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'Verify roots are exist'
        roots.each {root ->
            assert treeViewFragment.isNodeExist(root)
        }

        and: 'Set up error responses for subtree call'
        treeViewFragment.setErrorResponse("overLoadProtection", statusCode)

        when: 'Expand a parent'
        treeViewFragment.expandNodeByName(SUB_NETWORK_1)

        then: 'Error dialog is open'
        dialogFragment.isErrorDialogVisible()
        assert dialogFragment.getPrimaryText() == UNABLE_TO_RETRIEVE_DATA_TITLE
        assert dialogFragment.getSecondaryText() == NO_CAPACITY_AVAILABLE_MESSAGE
        dialogFragment.clickOk()

        and: 'Reset error responses'
        treeViewFragment.resetErrorResponse()
    }

    def 'No capacity available when updating by MoType attributes'() {
        def siteLocationAttribute = 'siteLocation'
        def shortString = 'SubNetwork=IrelandSubnetwork0'

        given: 'Topology Browser is open'
        treeViewFragment.resetErrorResponse()
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'Expand the root'
        treeViewFragment.expandNodeByName(ALL_OTHER_NODES)

        and: 'Node is selected'
        treeViewFragment.clickNodeByName(OTHER_RADIO_NODE)

        and: 'Details panel is visible'
        detailsPanelFragment.isDetailsPanelVisible()

        and: 'Edit button exists'
        detailsPanelFragment.isEditAttributesClickable().click()

        and: 'Check if textarea is visible'
        detailsPanelFragment.getTextArea(siteLocationAttribute)

        and: 'Input short string'
        detailsPanelFragment.inputShortText(shortString)

        and: 'Set up error responses for subtree call'
        treeViewFragment.setErrorResponse("overLoadProtection", statusCode)

        when: 'Save the attributes'
        detailsPanelFragment.isSaveAttributesButtonClickable().click()

        and: 'Dialog to confirm the changes is displayed and save is clicked'
        assert dialogFragment.isConfirmDialogVisible()
        dialogFragment.clickActionButton('Save Changes')

        then: 'Error dialog is open'
        dialogFragment.isErrorDialogVisible()
        assert dialogFragment.getPrimaryText() == UNABLE_TO_RETRIEVE_DATA_TITLE
        assert dialogFragment.getSecondaryText() == NO_CAPACITY_AVAILABLE_MESSAGE
        dialogFragment.clickOk()

        and: 'Reset error responses'
        treeViewFragment.resetErrorResponse()
    }
}
