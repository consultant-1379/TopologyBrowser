package com.ericsson.nms.pres.topologybrowser.testware.pages;

import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.page.Location;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.TEXT;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathRelatives.PARENT;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.waitGuiVisible;

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.CLASS_EQ;


@Location("")
public class TopologyFDNFragment {

    @Drone
    private WebDriver driver;

    @FindBy(xpath = DIV + CLASS_EQ + "ebDialogBox-actionBlock" + CLOSE_SHORT + SPAN + CONTAINS + TEXT + "Browse" + CLOSE + PARENT + "*")
    private WebElement browseButton;

    @FindBy(xpath = DIV + CLASS_EQ + "ebDialogBox-actionBlock" + CLOSE_SHORT + SPAN + CONTAINS + TEXT + "Cancel" + CLOSE + PARENT + "*")
    private WebElement cancelButton;

    @FindBy(css = ".elNetworkObjectLib-wFDNPath-input")
    private WebElement inputFDN;

    public void clickBrowseButton() {
        waitGuiVisible(browseButton, driver).click();
    }
    public void clickCancelButton() {
        waitGuiVisible(cancelButton, driver).click();
    }

    public boolean isBrowseButtonEnabled() {
        return waitGuiVisible(browseButton, driver).isEnabled();
    }

    public void clearFDNText() {
        waitGuiVisible(inputFDN, driver).clear();
    }

    public void enterFDN(final String FDN) {
        waitGuiVisible(inputFDN, driver).sendKeys(FDN);
    }

    public void pressEnter() {
        waitGuiVisible(inputFDN, driver).sendKeys(Keys.ENTER);
    }

    public String getFDNValue() {
        return waitGuiVisible(inputFDN, driver).getAttribute("value");
    }
}
