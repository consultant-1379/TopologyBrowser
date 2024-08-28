/*------------------------------------------------------------------------------
 *******************************************************************************
 * COPYRIGHT Ericsson 2023
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 *----------------------------------------------------------------------------*/
package com.ericsson.nms.pres.topologybrowser.testware.pages;

import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.page.Location;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.CLASS;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.CLASS_EQ;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.TEXT_EQ;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.DIV;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.BUTTON;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.TBODY;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.H2;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.SPAN;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.DIV_PLAIN;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.BUTTON_PLAIN;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.CLOSE;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.CLOSE_SHORT;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.CONTAINS;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.NOTIFICATIONS;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathRelatives.NEXT_SIBLING;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathRelatives.PARENT;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.waitGuiClickable;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.waitGuiVisible;

@Location("")
public class SupervisionsNotificationPanelFragment {

    @Drone
    private WebDriver driver;

    @FindBy(xpath = BUTTON + CONTAINS + CLASS + "elLayouts-PanelActionBar-button_Supervisions" + CLOSE)
    private WebElement superVisionsNotificationPanelButton;

    @FindBy(xpath = DIV + CLASS_EQ + "eaFlyout-panelHeader-header" + CLOSE_SHORT + H2 + TEXT_EQ + NOTIFICATIONS + CLOSE_SHORT)
    private WebElement superVisionsNotificationPanelHeader;

    @FindBy(xpath = TBODY + CLASS_EQ + "elTablelib-Table-body" + CLOSE_SHORT)
    private WebElement superVisionsNotificationTableBody;

    public void openSupervisionsNotificationPanel() {
        waitGuiClickable(superVisionsNotificationPanelButton, driver).click();
    }

    public boolean isSupervisionsNotificationPanelVisible() {
        return waitGuiVisible(superVisionsNotificationPanelHeader, driver).isDisplayed();
    }

    public boolean isSupervisionNotificationPanelTableVisible(){
        return !waitGuiVisible(superVisionsNotificationTableBody, driver).findElements(By.className("ebTableRow")).isEmpty();
    }

    public void isSupervisionNotificationVisible(final String node, final String supervisionType) {
        waitGuiVisible(DIV + CLASS_EQ + "ebTableCell" + CLOSE_SHORT
                + SPAN + TEXT_EQ + supervisionType + CLOSE_SHORT
                + PARENT + DIV_PLAIN + PARENT + DIV_PLAIN + NEXT_SIBLING + DIV_PLAIN + SPAN + TEXT_EQ + node + CLOSE_SHORT, driver);
    }

    public void clickButtonForNotification(final String node, final String supervisionType, final String button) {
        waitGuiClickable(DIV + CLASS_EQ + "ebTableCell" + CLOSE_SHORT
                + SPAN + TEXT_EQ + supervisionType + CLOSE_SHORT
                + PARENT + DIV_PLAIN + PARENT + DIV_PLAIN + NEXT_SIBLING + DIV_PLAIN + SPAN + TEXT_EQ + node + CLOSE_SHORT
                + PARENT + DIV_PLAIN + PARENT + DIV_PLAIN + NEXT_SIBLING + BUTTON_PLAIN + SPAN + TEXT_EQ + button + CLOSE_SHORT, driver).click();
    }
}
