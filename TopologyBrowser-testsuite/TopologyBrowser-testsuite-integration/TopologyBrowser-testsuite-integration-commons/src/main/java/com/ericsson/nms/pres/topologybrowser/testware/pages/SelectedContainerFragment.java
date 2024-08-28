package com.ericsson.nms.pres.topologybrowser.testware.pages;

import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.page.Location;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.CLASS_EQ;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.TITLE_EQ;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.A;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.BUTTON;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.SPAN;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.CLOSE_SHORT;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.waitGuiNotVisible;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.waitGuiVisible;

@Location("")
public class SelectedContainerFragment {
    @Drone
    private WebDriver browser;

    @FindBy(xpath = A + CLASS_EQ + "elNetworkObjectLib-rTopologyHeader-clearSelection-Link" + CLOSE_SHORT)
    private WebElement clearLink;

    @FindBy(xpath = SPAN + CLASS_EQ + "elNetworkObjectLib-rTopologyHeader-selected-num" + CLOSE_SHORT)
    private WebElement selectedCount;

    public int getSelectedCount() {
        return Integer.parseInt(waitGuiVisible(selectedCount, browser).getText());
    }

    public void clickOnClear() {
        waitGuiVisible(clearLink, browser).click();
    }

    public boolean clearButtonNotVisible() {
        return waitGuiNotVisible(clearLink, browser);
    }

    public WebElement getRefreshButton() {
        return waitGuiVisible(BUTTON + TITLE_EQ + "Refresh" + CLOSE_SHORT, browser);
    }

    public void clickOnRefresh() {
        getRefreshButton().click();
    }
}

