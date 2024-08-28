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

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.BASE_URL;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.TOPOLOGY_BROWSER_URL;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.waitGuiVisible;

import com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils;
import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.Graphene;
import org.jboss.arquillian.graphene.page.Location;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.net.URLDecoder;

@Location(BASE_URL + "/#topologybrowser")
public class TopologyBrowserPage {

    @Drone
    private WebDriver driver;

    @FindBy(css = ".elLayouts-TopSection-title")
    private WebElement title;

    public void openTopologyBrowser(final boolean forceRefresh) {
        if (driver != null && (!driver.getCurrentUrl().contains("topologybrowser") || forceRefresh)) {
            Graphene.guardAjax(Graphene.goTo(this.getClass()));
            driver.manage().window().setSize(new Dimension(1280, 880));
        }
    }

    public void refreshTopologyBrowserPage() {
        driver.navigate().refresh();
    }

    public WebElement getTitle() {
        return waitGuiVisible(title, driver);
    }

    public boolean checkUrl(final String url) {
        try {
            final String currentUrl = URLDecoder.decode(driver.getCurrentUrl(), "UTF-8");
            if (url.isEmpty()) {
                return currentUrl.equals(BASE_URL + TOPOLOGY_BROWSER_URL);
            } else {
                return currentUrl.equals(BASE_URL + TOPOLOGY_BROWSER_URL + '?' + url);
            }
        } catch(Exception e) {
            CommonUtils.screenshot("checkUrl", driver);
            return false;
        }
    }

    public void changeUrl(final String url) {
        driver.get(BASE_URL + "/#topologybrowser" + url);
    }
}
