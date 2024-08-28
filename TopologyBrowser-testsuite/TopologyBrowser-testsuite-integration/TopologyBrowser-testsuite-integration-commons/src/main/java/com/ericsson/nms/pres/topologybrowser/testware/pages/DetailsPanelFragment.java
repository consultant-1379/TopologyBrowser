/*------------------------------------------------------------------------------
 *******************************************************************************
 * COPYRIGHT Ericsson 2018
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 *----------------------------------------------------------------------------*/

package com.ericsson.nms.pres.topologybrowser.testware.pages;

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.ACCORDION_CONTAINER;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.ATTR_CLASS;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.BASE_URL;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.NETWORK_DATA_DETAILS_URL;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.READ_ONLY_MODIFIER;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathRelatives.ANCESTOR;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathRelatives.NEXT_SIBLING;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathRelatives.PARENT;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.*;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.Graphene;
import org.jboss.arquillian.graphene.fragment.Root;
import org.jboss.arquillian.graphene.page.Location;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;

@Location("")
public class DetailsPanelFragment {

    @Drone
    private WebDriver driver;

    @SuppressWarnings("PMD.UnusedPrivateField")
    @Root
    @FindBy(css = ".elLayouts-MultiSlidingPanels-right")
    private WebElement root;

    @FindBy(css = ".elNetworkObjectLib-attributesRegion-fdn-content")
    private WebElement fdn;

    @FindBy(xpath = DIV + CONTAINS + TEXT + "No Attributes Found" + CLOSE)
    private WebElement emptyPanelMessage;

    @FindBy(css = ".elNetworkObjectLib-attributesRegion-editPropertiesLink")
    private WebElement editAttributesButton;

    @FindBy(css = ".elNetworkObjectLib-attributesRegion-saveButton")
    private WebElement saveAttributesButton;

    @FindBy(css = ".elNetworkObjectLib-attributesRegion-cancelLink")
    private WebElement cancelEditAttributesButton;

    @FindBy(css = ".elNetworkObjectLib-wNodeDetailsForm-filter-form-filterInput")
    private WebElement filterInput;

    @FindBy(xpath = DIV + CLASS_EQ + "ebTabs-tabItem ebTabs-tabItem_closable_false" + AND + CONTAINS + TEXT + "Node Details" + CLOSE)
    private WebElement nodeDetailsTab;

    @FindBy(css = ".elNetworkObjectLib-readOnly-icon-syncStatus")
    private WebElement syncStatusIcon;

    @FindBy(css = ".elNetworkObjectLib-readOnly-icon-managementState")
    private WebElement managementStateIcon;

    @FindBy(xpath = PAR + CONTAINS + TEXT + "Public" + CLOSE)
    private WebElement sharingPermissions;

    private int initialHeight = 0;
    private static final String SITE_LOCATION = "siteLocation";
    private static final String ACCORDION_CONTAINER_XPATH = ANCESTOR + DIV_INSIDE + CONTAINS + CLASS + ACCORDION_CONTAINER + CLOSE;

    public WebElement isDetailsPanelEmpty() {
        return waitGuiVisible(emptyPanelMessage, driver);
    }

    public WebElement getNodeFDN() {
        return waitGuiVisible(fdn, driver);
    }

    public WebElement getFilterInput() {
        return waitGuiVisible(filterInput, driver);
    }

    public WebElement isDetailsPanelVisible() {
        return waitGuiVisible(root, driver);
    }

    public WebElement isEditAttributesClickable() {
        return waitGuiClickable(editAttributesButton, driver);
    }

    public WebElement isSaveAttributesButtonClickable() {
        return waitGuiClickable(saveAttributesButton, driver);
    }

    public boolean isSaveAttributesButtonEnabled(final boolean isEnabled) {
        final boolean isButtonEnabled = isEnabled != waitGuiClickable(saveAttributesButton, driver).getAttribute("class").contains("ebBtn_disabled");
        if (!isButtonEnabled) {
            screenshot("isSaveAttributesButtonEnabled_" + isEnabled, driver);
        }
        return isButtonEnabled;
    }

    public WebElement isCancelEditAttributesButtonClickable() {
        return waitGuiClickable(cancelEditAttributesButton, driver);
    }

    public WebElement isConfirmSaveDialogSaveButtonClickable() {
        return waitGuiClickable(BUTTON + CONTAINS + CLASS + "ebBtn" + CLOSE + SPAN + TEXT_EQ + "Save Changes" + CLOSE_SHORT, driver);
    }

    public WebElement getNodeDetailsTab() {
        return waitGuiVisible(nodeDetailsTab, driver);
    }

    public WebElement getSyncStatusIcon() {
        return waitGuiVisible(syncStatusIcon, driver);
    }

    public WebElement getManagementStateIcon() {
        return waitGuiVisible(managementStateIcon, driver);
    }

    public WebElement getSharingPermissions() {
        return waitGuiVisible(sharingPermissions, driver);
    }

    private int getHeight() {
        return Integer.parseInt(getTextArea(SITE_LOCATION).getAttribute("clientHeight"));
    }

    public void inputShortText(final String input) {
        getTextArea(SITE_LOCATION).sendKeys(input);
        initialHeight = getHeight();
    }

    public void inputLongText(final String input) {
        getTextArea(SITE_LOCATION).sendKeys(input);
    }

    public boolean isStringWrapped() {
        return initialHeight < getHeight();
    }

    public void inputFilter(final String filter) {
        getFilterInput().sendKeys(filter);
    }

    public void clearFilter() {
        getFilterInput().clear();
    }

    public boolean isFilteredResultsValid(final String filterText, final int noOfFilteredResults) {
        final List<WebElement> filteredAttributes = waitGuiVisibleForListOfElements(DIV + CONTAINS + CLASS + "-keyStyle" + CLOSE_PARENTHESIS_AND + CONTAINS + TEXT + filterText + CLOSE, driver);
        return filteredAttributes.size() == noOfFilteredResults;
    }

    public WebElement getTextArea(final String attributeName) {
        return waitGuiVisible(ANY_ELEMENT + "[" + CONTAINS + CLASS + attributeName + CLOSE, driver);
    }

    public void clearTextArea(final String attributeName) {
        getTextArea(attributeName).clear();
    }

    public String getTextAreaValue(final String attributeName) {
        return getTextArea(attributeName).getAttribute("value");
    }

    public void setTextAreaValue(final String attributeName, final String value) {
        getTextArea(attributeName).clear();
        getTextArea(attributeName).sendKeys(value);
    }

    public Map<String, String> getListElementsByName(final String attributeName) {
        click(getAttributeByText(attributeName, ACCORDION_CONTAINER_XPATH), driver);
        final List<WebElement> elements =
                waitGuiVisibleForListOfElements(DIV + CONTAINS + TEXT + attributeName + CLOSE + ACCORDION_CONTAINER_XPATH
                        + DIV + CONTAINS + CLASS + "keyStyle" + CLOSE, driver);

        final Map<String, String> listMap = new HashMap<>();
        for (final WebElement element : elements) {
            listMap.put(element.getText(), element.findElement(By.xpath("../../p")).getText());
        }
        return listMap;
    }

    public void addListAttributeElement(final String attributeName, final String value) {
        expandListAttribute(attributeName);
        final WebElement listWidget = getAttributeByText(attributeName, ACCORDION_CONTAINER_XPATH);
        click(listWidget.findElement(By.xpath(BUTTON + CONTAINS + CLASS + "listWidgetContainer" + CLOSE)), driver);

        final List<WebElement> elements =
                waitGuiVisibleForListOfElements(DIV + CONTAINS + TEXT + attributeName + CLOSE + ACCORDION_CONTAINER_XPATH + "//Input", driver);

        final WebElement lastElement = elements.get(elements.size() - 1);
        new Actions(driver).keyDown(lastElement, Keys.CONTROL).sendKeys(lastElement, "a").keyUp(lastElement, Keys.CONTROL)
                .sendKeys(lastElement, Keys.BACK_SPACE)
                .sendKeys(lastElement, value)
                .moveToElement(lastElement, -13, -14).click().perform();
        final String lastElementValue = lastElement.getAttribute("value");
        if (!value.equals(lastElementValue)) {
            screenshot("addListAttributeElement", driver);
            throw new AssertionError("Last Element of " + attributeName + " should have value '" + value + "', but it was " + lastElementValue);
        }
    }

    public List<String> getENUMvaluesOfAttribute(final String attributeName) {
        return getENUMvaluesOfAttribute(attributeName, -1);
    }

    public List<String> getENUMvaluesOfAttribute(final String attributeName, int index) {
        expandListAttribute(attributeName);
        final List<WebElement> elements =
                waitGuiVisibleForListOfElements(DIV + CONTAINS + TEXT + attributeName + CLOSE +
                        ANCESTOR + DIV_INSIDE + CONTAINS + CLASS + ACCORDION_CONTAINER + CLOSE +
                        BUTTON + CONTAINS + CLASS + "ebCombobox-helper"+ CLOSE + "//I", driver);

         elements.get((index == -1) ? elements.size() - 1 : index).click();

         return getValuesOfComponentList();
    }

    public WebElement getValidationError(final String attributeName) {
        return waitGuiVisible(getAttributeByText(attributeName, ACCORDION_CONTAINER_XPATH + SPAN + CONTAINS + TEXT + "Input does not match regular exp" + CLOSE), driver);
    }

    public WebElement getAttributeValueElement(final String attributeName) {
        return getAttributeByText(attributeName, NEXT_SIBLING + "p");
    }

    public WebElement getAttributeByText(final String attributeName, final String additionalXpath) {
        final String xpath = DIV + CONTAINS + TEXT + attributeName + CLOSE + additionalXpath;
        return waitGuiVisible(xpath, driver);
    }

    public boolean isReadOnlyAttribute(final String attributeName) {
        return getAttributeByText(attributeName, "").getAttribute(ATTR_CLASS).contains(READ_ONLY_MODIFIER);
    }

    public boolean isAttributeVisible(final String attributeName) {
        return getAttributeValueElement(attributeName) != null;
    }

    public WebElement getCollectionAttributeByText(final String attributeName) {
        final String xpath = SPAN + CONTAINS + TEXT + attributeName + CLOSE;
        return waitGuiVisible(xpath, driver);
    }

    public boolean isCollectionAttributeVisible(final String attributeName) {
        return getCollectionAttributeByText(attributeName) != null;
    }

    public boolean isCollectionAttributeNotVisible(final String attributeName) {
        final String xpath = PAR + CONTAINS + TEXT + attributeName + CLOSE;
        return waitGuiNotPresent(xpath, driver);
    }

    public String getAttributeTextValue(final String attributeName) {
        return getAttributeValueElement(attributeName).getText();
    }

    public WebElement getInlineError(final String attributeName) {
        final String xpath = INPUT + CONTAINS + CLASS + attributeName + CLOSE + "/../.." + SPAN + CONTAINS + CLASS + "ebInput-statusError" + CLOSE;
        return waitGuiVisible(xpath, driver);
    }

    public String getInlineErrorText(final String attributeName) {
        return getInlineError(attributeName).getText();
    }

    public void restoreDB() throws IOException {
        Graphene.guardNoRequest(((HttpURLConnection) new URL(BASE_URL + NETWORK_DATA_DETAILS_URL + "/restore").openConnection()).getResponseCode());
    }

    public boolean isSyncStatusIconNotVisible() {
        return waitGuiNotPresent(syncStatusIcon, driver);
    }

    public boolean isManagementStateIconNotVisible() {
        return waitGuiNotPresent(managementStateIcon, driver);
    }

    public void expandComboMultiSelect(final String attributeName) {
        final String xpath = DIV + CONTAINS + TEXT + attributeName + CLOSE + PARENT + DIV_PLAIN + NEXT_SIBLING +
                DIV_PLAIN + BUTTON + CONTAINS + CLASS + "ebComboMultiSelect-helper" + CLOSE;
        click(waitGuiVisible(xpath, driver), driver);
    }

    public void selectItemFromComboMultiSelect(final String itemName) {
        final String rootXpath = DIV + CLASS_EQ + "ebComponentList-item" + CLOSE_SHORT + OPEN_BRACKET + CONTAINS + TEXT + itemName + CLOSE;
        click(waitGuiVisible(rootXpath, driver), driver);
    }

    public void selectItemsFromComboMultiSelect(final String attributeName, final List<String> itemNames) {
        for (String itemName : itemNames) {
            expandComboMultiSelect(attributeName);
            selectItemFromComboMultiSelect(itemName);
        }
    }

    public void removeItemFromComboMultiSelect(final String itemName) {
        final String rootXpath = SPAN + CONTAINS + TEXT + itemName + CLOSE + NEXT_SIBLING + ICON_INSIDE;
        click(waitGuiVisible(rootXpath, driver), driver);
    }

    public WebElement getComboMultiSelectError(final String attributeName) {
        final String xpath = DIV + CONTAINS + TEXT + attributeName + CLOSE + PARENT + DIV_PLAIN + NEXT_SIBLING +
                SPAN_PLAIN + SPAN + CONTAINS + CLASS + "ebInput-statusError" + CLOSE;
        return waitGuiVisible(xpath, driver);
    }

    public String getComboMultiSelectErrorText(final String attributeName) {
        return getComboMultiSelectError(attributeName).getText();
    }

    private List<String> getValuesOfComponentList() {
        final List<WebElement> elements = waitGuiVisibleForListOfElements(DIV + CLASS_EQ + "ebComponentList-item" + CLOSE_SHORT, driver);
        final List<String> listElementsAsString = new ArrayList<>();
        for (WebElement element : elements) {
            listElementsAsString.add(element.getText());
        }

        return listElementsAsString;
    }

    private void expandListAttribute(final String attributeName){
        final WebElement listWidget = getAttributeByText(attributeName, ACCORDION_CONTAINER_XPATH);
        if (listWidget.findElement(By.xpath(DIV + CLASS_EQ + "ebAccordion-button" + CLOSE_SHORT + ICON + CONTAINS + CLASS + "Arrow" + CLOSE)).getAttribute("class").contains("downArrow")) {
            click(listWidget, driver);
        }
    }
}
