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

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.CLASS;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.CLASS_EQ;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.TEXT;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.BUTTON;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.DIV;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.SPAN;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.CLOSE;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.CLOSE_SHORT;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.CONTAINS;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.*;

import java.util.ArrayList;
import java.util.List;

import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.page.Location;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

@Location("")
public class ActionsBarFragment {

    @Drone
    private WebDriver driver;

    private static final String ACTIONS = "Actions";
    private static final String RECENT = "Recent";

    public List<WebElement> actionBarButtons() {
        return waitGuiVisibleForListOfElements(DIV + CONTAINS + CLASS + "elLayouts-QuickActionBar-items" + CLOSE + "//button", driver);
    }

    public List<String> actionsBarButtonsWithDropDownActions() {
        final List<String> names = new ArrayList<>();
        final List<WebElement> buttons = waitGuiVisibleForListOfElements(DIV + CONTAINS + CLASS + "elLayouts-QuickActionBar-items" + CLOSE + "//button", driver);
        for (WebElement button:buttons) {
            names.add(button.getText());
        }
        if(names.contains(ACTIONS)) {
            names.remove(ACTIONS);
            clickActionDropDown();
            final List<WebElement> dropDownItems = waitGuiVisibleForListOfElements(DIV + CLASS_EQ + "ebComponentList-items" + CLOSE_SHORT + DIV + CONTAINS + CLASS + "ebComponentList-item" + CLOSE, driver);
            for (WebElement dropDownItem:dropDownItems) {
                names.add(dropDownItem.getText());
            }
            if (!dropDownItems.isEmpty()) {
                clickActionDropDown();
            }
        }
        return names;
    }

    private WebElement getDropdownActions(final String dropDown) {
        return waitGuiVisible(DIV + CLASS_EQ + "elLayouts-ActionBarDropdown" + CLOSE_SHORT + SPAN + CONTAINS + TEXT +  dropDown + CLOSE, driver);
    }

    private void clickActionDropDown() {
        getDropdownActions(ACTIONS).click();
    }

    public void clickRecentActionDropDown() {
        getDropdownActions(RECENT).click();
    }

    public WebElement getActionButton(final String button) {
        return waitGuiVisible(BUTTON + CONTAINS + TEXT + button + CLOSE, driver);
    }

    public void clickActionButton(final String button) {
        getActionButton(button).click();
    }

    public boolean isButtonVisible(final String button) {
        final List<WebElement> elements = waitGuiVisibleForListOfElements(BUTTON + CONTAINS + TEXT + button + CLOSE, driver);
        return !elements.isEmpty()  && elements.get(0).isDisplayed();
    }

    public boolean isButtonNotPresent(final String button) {
        return waitGuiNotPresent(BUTTON + CONTAINS + TEXT + button + CLOSE, driver);

    }

    public boolean isActionVisible(final String action) {
        return actionsBarButtonsWithDropDownActions().contains(action);
    }
}
