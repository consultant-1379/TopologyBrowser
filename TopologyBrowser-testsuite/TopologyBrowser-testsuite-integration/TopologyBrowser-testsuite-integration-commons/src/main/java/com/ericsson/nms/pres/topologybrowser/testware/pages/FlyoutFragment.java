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

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.SPAN;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.CLOSE;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.CONTAINS;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.waitGuiVisible;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.waitGuiNotVisible;

import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.fragment.Root;
import org.jboss.arquillian.graphene.page.Location;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

@Location("")
public class FlyoutFragment {

    @Drone
    private WebDriver driver;

    @Root
    @FindBy(css = ".eaFlyout-panel")
    private WebElement root;

    @FindBy(css = ".elNetworkExplorerLib-wInsertCollection-collectionNameInput")
    private WebElement nameInput;

    @FindBy(css = ".elNetworkExplorerLib-rCollectionRenamer-collectionNameInput")
    private WebElement renameInput;

    @FindBy(css = ".elNetworkExplorerLib-wPrivateNetworkOptions-editable-input-companyName")
    private WebElement companyNameInput;

    @FindBy(css = ".elNetworkExplorerLib-wPrivateNetworkOptions-editable-input-networkName")
    private WebElement networkNameInput;

    @FindBy(css = ".elNetworkExplorerLib-wPrivateNetworkOptions-editable-input-location")
    private WebElement locationInput;

    @FindBy(xpath = SPAN + CONTAINS + ".,'Objects" + CLOSE)
    private WebElement leafRadioSelection;

    @FindBy(xpath = SPAN + CONTAINS + ".,'Collections" + CLOSE)
    private WebElement branchRadioSelection;

    @FindBy(css = ".elNetworkExplorerLib-wCreateWithOptions-selectObjectsFromBlock-radioButtons-searchCriteriaButton")
    private WebElement searchCriteriaRadioSelection;

    @FindBy(xpath = ROW + CONTAINS + ".,'EUtranCells" + CLOSE )
    private WebElement searchCriteria;

    @FindBy(css = ".elNetworkExplorerLib-rCollectionCreator-actionButtons-buttonsBlock-submitButton")
    private WebElement submitButton;

    @FindBy(css = ".elNetworkExplorerLib-rCollectionRenamer-actionButtons-buttonsBlock-submitButton")
    private WebElement renameSaveButton;

    @FindBy(css = ".elNetworkExplorerLib-wActionPanel-actionButtons-submit")
    private WebElement saveButton;

    public boolean isFlyoutVisible() {
        return waitGuiVisible(root, driver).isDisplayed();
    }

    public void writeName(final String name) {
        waitGuiVisible(nameInput, driver).sendKeys(name);
    }

    public void inputName(final String name) {
         waitGuiVisible(renameInput, driver).sendKeys(name);
    }
    public void inputCompanyName(final String name) {
         waitGuiVisible(companyNameInput, driver).sendKeys(name);
    }
    public void inputNetworkName(final String name) {
         waitGuiVisible(networkNameInput, driver).sendKeys(name);
    }
    public void inputLocation(final String name) {
         waitGuiVisible(locationInput, driver).sendKeys(name);
    }

    public void clickOnBranchOption() {
        waitGuiVisible(branchRadioSelection, driver).click();
    }

    public void clickOnLeafOption() { waitGuiVisible(leafRadioSelection, driver).click(); }

    public void clickOnCreate() { waitGuiVisible(submitButton, driver).click(); }

    public void clickOnSave() { waitGuiVisible(saveButton, driver).click(); }

    public void clickOnRenameSave() { waitGuiVisible(renameSaveButton, driver).click(); }

    public void clickOnSearchCriteriaOption() { waitGuiVisible(searchCriteriaRadioSelection, driver).click(); }

    public void clickOnSearchCriteria() { waitGuiVisible(searchCriteria, driver).click(); }

    public void waitFlyoutTOClose() {
        waitGuiNotVisible(root, driver);
    }
}