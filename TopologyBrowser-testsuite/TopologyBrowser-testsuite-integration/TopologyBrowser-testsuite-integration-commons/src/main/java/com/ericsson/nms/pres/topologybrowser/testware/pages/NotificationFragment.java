package com.ericsson.nms.pres.topologybrowser.testware.pages;

import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.fragment.Root;
import org.jboss.arquillian.graphene.page.Location;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.CLASS_EQ;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.DIV;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.LABEL;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.CLOSE_SHORT;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.waitGuiVisible;

@Location("")
public class NotificationFragment {

    @Drone
    private WebDriver driver;

    private static final String PARENTELEMENT = DIV + CLASS_EQ + "ebNotification elWidgets-Notification ebNotification_color_green ebNotification_toast" + CLOSE_SHORT;

    @Root
    @FindBy(xpath = PARENTELEMENT + DIV + CLASS_EQ + "ebNotification-content" + CLOSE_SHORT)
    private WebElement root;
    @FindBy(xpath = PARENTELEMENT + LABEL + CLASS_EQ + "ebNotification-label elWidgets-Notification-label" + CLOSE_SHORT)
    private WebElement label;

    public boolean isNotificationVisible() {
        return waitGuiVisible(root, driver).isDisplayed();
    }

    public String getText() {
        return waitGuiVisible(label, driver).getText();
    }


}
