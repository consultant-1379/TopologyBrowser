package com.ericsson.nms.pres.topologybrowser.testware.pages;

import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.fragment.Root;
import org.jboss.arquillian.graphene.page.Location;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.waitGuiVisible;

@Location("")
public class FailureFeedbackFragment {

    @Drone
    private WebDriver driver;

    @Root
    @FindBy(xpath = DIV + CLASS_EQ + "elNetworkExplorerLib-wFailureFeedback" + CLOSE_SHORT)
    private WebElement root;

    @FindBy(xpath = DIV + CLASS_EQ + "elTablelib-Table" + CLOSE_SHORT)
    private WebElement failureDetails;

    @FindBy(xpath = DIV + CLASS_EQ + "elNetworkExplorerLib-wFailureFeedback-resultCounters" + CLOSE_SHORT)
    private WebElement resultCounters;

    public boolean isFailureFeedbackVisible() {
        return waitGuiVisible(root, driver).isDisplayed();
    }

    public String getResultCountersText() {
        return waitGuiVisible(resultCounters, driver).getText();
    }

    public String getFailureDetailsText() {
        return waitGuiVisible(failureDetails, driver).getText();
    }
}
