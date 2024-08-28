package com.ericsson.nms.pres.topologybrowser.testware.pages;

import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.fragment.Root;
import org.jboss.arquillian.graphene.page.Location;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.waitGuiNotVisible;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.waitGuiVisible;

@Location("")
public class DialogFragment {

    @Drone
    private WebDriver driver;

    @Root
    @FindBy(xpath = DIV + CLASS_EQ + "ebDialogBox" + CLOSE_SHORT)
    private WebElement root;

    @FindBy(xpath = DIV + CLASS_EQ + "ebDialogBox-contentBlock ebDialogBox-contentBlock_type_error" + CLOSE_SHORT)
    private WebElement errorDialog;

    @FindBy(xpath = DIV + CLASS_EQ + "ebDialogBox-contentBlock" + CLOSE_SHORT + DIV + CLASS_EQ + "ebDialogBox-primaryText" + AND + CONTAINS + TEXT + "Confirm Save" + CLOSE)
    private WebElement confirmDialog;

    @FindBy(xpath = DIV + CLASS_EQ + "ebDialogBox-primaryText" + CLOSE_SHORT)
    private WebElement primaryText;

    @FindBy(xpath = DIV + CLASS_EQ + "ebDialogBox-secondaryText" + CLOSE_SHORT)
    private WebElement secondaryText;

    @FindBy(xpath = DIV + CLASS_EQ + "ebDialogBox-thirdText" + CLOSE_SHORT)
    private WebElement thirdText;

    @FindBy(xpath = DIV + CLASS_EQ + "ebDialogBox-actionBlock" + CLOSE_SHORT + BUTTON + TYPE_EQ + ATTR_BUTTON + CLOSE_SHORT)
    private WebElement okButton;

    public boolean isDialogVisible() {
        return waitGuiVisible(root, driver).isDisplayed();
    }

    public boolean isDialogNotVisible() {
        return waitGuiNotVisible(root, driver);
    }

    public boolean isErrorDialogVisible() {
        return waitGuiVisible(errorDialog, driver).isDisplayed();
    }
    public boolean isConfirmDialogVisible() {
        return waitGuiVisible(confirmDialog, driver).isDisplayed();
    }

    public boolean isButtonVisible(final String buttonName) {
        return waitGuiVisible(SPAN + CONTAINS + TEXT + buttonName + CLOSE, driver).isDisplayed();
    }

    public void clickOk() {
        waitGuiVisible(okButton, driver).click();
    }

    public void clickActionButton(final String actionName) {
        waitGuiVisible(DIV + CLASS_EQ + "ebDialogBox-actionBlock" + CLOSE_SHORT + SPAN + CONTAINS + TEXT + actionName + CLOSE, driver).click();
    }

    public String getPrimaryText() {
        return waitGuiVisible(primaryText, driver).getText();
    }

    public String getSecondaryText() {
        return waitGuiVisible(secondaryText, driver).getText();
    }

    public String getThirdText() { return waitGuiVisible(thirdText, driver).getText(); }

    public void buttonClick(final String buttonName) {
       waitGuiVisible(SPAN + CONTAINS + TEXT + buttonName + CLOSE, driver).click();
    }

    public void clickChangesAccordion() {
        waitGuiVisible(DIV + CONTAINS + TEXT + "Changes" + CLOSE, driver).click();
    }

    public boolean isNodeExistOnChanges(final String node) {
        return waitGuiVisible(TD + CONTAINS + TEXT + node + CLOSE, driver) .isDisplayed();
    }

    public String getCount(final String name) {
        return waitGuiVisible(DIV + CLASS_EQ + "elNetworkExplorerLib-wFailureFeedback-resultCounters-failed" + CLOSE_SHORT + SPAN + CONTAINS + TEXT + name + CLOSE, driver).getText();
    }

    public boolean checkCount(final String name, final String count) {
        return getCount(name).startsWith(count);
    }

    public boolean isDialogWithGivenTittleVisible(final String dialogTittle) {
        return waitGuiVisible(root, driver)
                .findElement(By.xpath( DIV + CLASS_EQ + "ebDialogBox-contentBlock" + CLOSE_SHORT
                        + DIV + CLASS_EQ + "ebDialogBox-primaryText" + AND + CONTAINS + TEXT + dialogTittle + CLOSE)).isDisplayed();
    }
}
