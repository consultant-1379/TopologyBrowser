package com.ericsson.nms.pres.topologybrowser.testware.specs

import com.ericsson.nms.pres.topologybrowser.testware.pages.*
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Unroll

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.*
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.NetworkData.BITS_NODE_1
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.NetworkData.BITS_NODE_2
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.NetworkData.BITS_NODE_3
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.NetworkData.BITS_PARENT_NODE
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.NetworkData.SUB_NETWORK_1

@RunWith(ArquillianSputnik)
class YANGSpec extends Specification {
    final LIST_OF_UNION_ATTR = 'community-list'

    @Shared
    def ACCESS_OPERATION_ATTRIBUTE = 'access-operations'

    @Shared
    def BITS_SINGLE_TYPE_ATTRIBUTE = 'a-bits'

    @Shared
    def ONE_ITEM = [READ]

    @Shared
    def TWO_ITEMS = [READ, CREATE]

    @Shared
    def ALL_ITEMS = [CREATE, READ, UPDATE, DELETE, EXEC]

    @Page
    private TopologyBrowserPage topologyBrowserPage

    @Page
    private TreeViewFragment treeViewFragment

    @Page
    private DetailsPanelFragment detailsPanelFragment

    @Page
    private DialogFragment dialogFragment

    def 'Check List<UNION> attribute exists and has proper value'() {
        given: 'Topology Browser is open'
        treeViewFragment.restore()
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        when: 'SubNetwork is expanded'
        treeViewFragment.expandNodeByName(SUB_NETWORK_1)

        and: 'Node is selected'
        treeViewFragment.clickNodeByName(RADIO_NODE_14)

        and: 'Details panel is visible'
        detailsPanelFragment.isDetailsPanelVisible()

        then: 'Community-list attribute has element 0 -> local-as'
        assert ['0': 'local-as'].equals(detailsPanelFragment.getListElementsByName(LIST_OF_UNION_ATTR))
    }

    def 'Check List<UNION> attribute can be edited'() {
        given: 'Topology Browser is open'
        treeViewFragment.restore()
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'SubNetwork is expanded'
        treeViewFragment.expandNodeByName(SUB_NETWORK_1)

        and: 'Node is selected'
        treeViewFragment.clickNodeByName(RADIO_NODE_14)

        and: 'Details panel is visible'
        detailsPanelFragment.isDetailsPanelVisible()

        and: 'Edit button exists'
        detailsPanelFragment.isEditAttributesClickable().click()

        when: 'Add elements with values '
        ['111:111', '222:222', 'internet'].each { value ->
            detailsPanelFragment.addListAttributeElement(LIST_OF_UNION_ATTR, value);
        }

        and: 'Save the attributes'
        detailsPanelFragment.isSaveAttributesButtonClickable().click()

        and: 'Dialog to confirm the changes is displayed and save is clicked'
        assert dialogFragment.isConfirmDialogVisible()
        dialogFragment.clickActionButton('Save Changes')

        then: "Community-list attribute has 4 elements with values as follows: local-as, '111:111', '222:222', 'internet'"
        assert ['0': 'local-as', '1': '111:111', '2': '222:222', '3': 'internet']
                .equals(detailsPanelFragment.getListElementsByName(LIST_OF_UNION_ATTR))
    }

    @Unroll
    def 'Check List<UNION> attribute validation, regex is ^[0-9]{1,5}:[0-9]{1,5}$'() {
        given: 'Topology Browser is open'
        treeViewFragment.restore()
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'SubNetwork is expanded'
        treeViewFragment.expandNodeByName(SUB_NETWORK_1)

        and: 'Node is selected'
        treeViewFragment.clickNodeByName(RADIO_NODE_14)

        and: 'Details panel is visible'
        detailsPanelFragment.isDetailsPanelVisible()

        and: 'Edit button exists'
        detailsPanelFragment.isEditAttributesClickable().click()

        when: 'Add attribute'
        detailsPanelFragment.addListAttributeElement(LIST_OF_UNION_ATTR, value as String);

        then: 'Validation works'
        assert detailsPanelFragment.isSaveAttributesButtonEnabled(valid)
        if (!valid) {
            assert detailsPanelFragment.getValidationError(LIST_OF_UNION_ATTR).isDisplayed()
        }

        where:
        value        | valid
        '123:123'    | true
        '123:123a'   | false
        '111:123456' | false
        'internet'   | true
        'no-'        | false
        'interneta'  | false
    }

    def 'Check List<UNION> attribute dropdown'() {
        given: 'Topology Browser is open'
        treeViewFragment.restore()
        topologyBrowserPage.refreshTopologyBrowserPage()
        topologyBrowserPage.openTopologyBrowser(true)

        and: 'SubNetwork is expanded'
        treeViewFragment.expandNodeByName(SUB_NETWORK_1)

        and: 'Node is selected'
        treeViewFragment.clickNodeByName(RADIO_NODE_14)

        and: 'Details panel is visible'
        detailsPanelFragment.isDetailsPanelVisible()

        when: 'Edit button exists'
        detailsPanelFragment.isEditAttributesClickable().click()

        then: 'community-list Dropdown has 4 ENUM elements'
        assert ['no-export', 'no-advertise', 'local-as', 'internet'].equals(detailsPanelFragment.getENUMvaluesOfAttribute(LIST_OF_UNION_ATTR))
    }

    @Unroll
    def 'Change Bits attribute value and save' () {

        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        treeViewFragment.restore()
        topologyBrowserPage.openTopologyBrowser(true)

        when: 'All other nodes is expanded'
        treeViewFragment.expandNodeByName(ALL_OTHER_NODES)

        and: 'BITS Node is expanded'
        treeViewFragment.expandNodeByName(BITS_PARENT_NODE)

        and: 'Node is selected'
        treeViewFragment.clickNodeByName(bitsNode)

        and: 'Details panel is visible'
        detailsPanelFragment.isDetailsPanelVisible()

        and: 'Edit Attribute is selected'
        detailsPanelFragment.isEditAttributesClickable().click()

        and: 'Change attribute'
        detailsPanelFragment.selectItemsFromComboMultiSelect(attribute, input)

        and: 'Click Save Button'
        detailsPanelFragment.isSaveAttributesButtonClickable().click()

        and: 'Dialog to confirm the changes is displayed and save is clicked'
        assert dialogFragment.isConfirmDialogVisible()
        dialogFragment.clickActionButton('Save Changes')

        then: 'Check if the edited attribute is saved and displayed'
        detailsPanelFragment.getAttributeValueElement(attribute).isDisplayed()
        assert detailsPanelFragment.getAttributeTextValue(attribute) == expected

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.restore()

        where:
        attribute                   | bitsNode                | input                                   | expected
        ACCESS_OPERATION_ATTRIBUTE  | BITS_NODE_2             | ONE_ITEM                                | READ
        ACCESS_OPERATION_ATTRIBUTE  | BITS_NODE_2             | TWO_ITEMS                               | READ + " " + CREATE
        ACCESS_OPERATION_ATTRIBUTE  | BITS_NODE_2             | ALL_ITEMS                               | "*"
        BITS_SINGLE_TYPE_ATTRIBUTE  | BITS_NODE_3             | ONE_ITEM                                | READ
        BITS_SINGLE_TYPE_ATTRIBUTE  | BITS_NODE_3             | TWO_ITEMS                               | READ + " " + CREATE
        BITS_SINGLE_TYPE_ATTRIBUTE  | BITS_NODE_3             | ALL_ITEMS                               | "*"
    }

    def 'Check Bits attribute accept null and remove item' () {

        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        treeViewFragment.restore()
        topologyBrowserPage.openTopologyBrowser(true)

        when: 'All other nodes is expanded'
        treeViewFragment.expandNodeByName(ALL_OTHER_NODES)

        and: 'BITS Node is expanded'
        treeViewFragment.expandNodeByName(BITS_PARENT_NODE)

        and: 'Node is selected'
        treeViewFragment.clickNodeByName(BITS_NODE_1)

        and: 'Details panel is visible'
        detailsPanelFragment.isDetailsPanelVisible()

        and: 'Edit Attribute is selected'
        detailsPanelFragment.isEditAttributesClickable().click()

        and: 'Change attribute'
        detailsPanelFragment.removeItemFromComboMultiSelect(READ)

        and: 'Click Save Button'
        detailsPanelFragment.isSaveAttributesButtonClickable().click()

        and: 'Dialog to confirm the changes is displayed and save is clicked'
        assert dialogFragment.isConfirmDialogVisible()
        dialogFragment.clickActionButton('Save Changes')

        then: 'Check if the edited attribute is saved and displayed'
        detailsPanelFragment.getAttributeValueElement(ACCESS_OPERATION_ATTRIBUTE).isDisplayed()
        assert detailsPanelFragment.getAttributeTextValue(ACCESS_OPERATION_ATTRIBUTE) == 'null'

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.restore()
    }

    def 'Check Bits attribute constraints error' () {

        given: 'Topology Browser is open'
        topologyBrowserPage.refreshTopologyBrowserPage()
        treeViewFragment.restore()
        topologyBrowserPage.openTopologyBrowser(true)

        when: 'All other nodes is expanded'
        treeViewFragment.expandNodeByName(ALL_OTHER_NODES)

        and: 'BITS Node is expanded'
        treeViewFragment.expandNodeByName(BITS_PARENT_NODE)

        and: 'Node is selected'
        treeViewFragment.clickNodeByName(BITS_NODE_1)

        and: 'Details panel is visible'
        detailsPanelFragment.isDetailsPanelVisible()

        and: 'Edit Attribute is selected'
        detailsPanelFragment.isEditAttributesClickable().click()

        and: 'Change attribute'
        detailsPanelFragment.selectItemsFromComboMultiSelect(ACCESS_OPERATION_ATTRIBUTE, [DELETE, EXEC])

        then: 'Check if the bits validation error is shown'
        detailsPanelFragment.getComboMultiSelectError(ACCESS_OPERATION_ATTRIBUTE).isDisplayed()
        detailsPanelFragment.getComboMultiSelectErrorText(ACCESS_OPERATION_ATTRIBUTE) == 'Invalid bits value'

        and: 'Check Save Button couldn\'t click'
        assert detailsPanelFragment.isSaveAttributesButtonEnabled(false)

        when: 'Click Cancel Button'
        detailsPanelFragment.isCancelEditAttributesButtonClickable().click()

        then: 'Check original attribute values is unchanged and displayed'
        detailsPanelFragment.getAttributeValueElement(ACCESS_OPERATION_ATTRIBUTE).isDisplayed()
        assert detailsPanelFragment.getAttributeTextValue(ACCESS_OPERATION_ATTRIBUTE) == 'read'

        cleanup: 'Clear the DB and bring default data'
        treeViewFragment.restore()
    }

}
