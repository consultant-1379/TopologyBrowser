package com.ericsson.nms.pres.topologybrowser.testware.pages;

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.CLASS;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.TEXT;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.DIV;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.CLOSE;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.CONTAINS;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.WIDGET_LIST;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.*;

import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.fragment.Root;
import org.jboss.arquillian.graphene.page.Location;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Location("")
public class UDTDropdownFragment {

    private static final Logger logger = LoggerFactory.getLogger(UDTDropdownFragment.class);

    @Drone
    private WebDriver browser;

    @Root
    @FindBy(css = ".elNetworkObjectLib-rTopologyHeader-selected-dropdown")
    private WebElement root;

    @FindBy(css = ".ebComponentList-items")
    private WebElement listOfItems;

    @FindBy(css = ".elScopingPanel-rTabTopology .elNetworkObjectLib-rTopologyHeader-selected-dropdown")
    private WebElement rootScopingPanel;

    public void expandDropdown() {
        boolean isNotExpanded = false;
        try {
            isNotExpanded = waitGuiNotVisible(listOfItems, 5, browser);
        } catch (final TimeoutException | NoSuchElementException ignored) {
            // Need to ignore
        }

        if (isDropdownVisible() && isNotExpanded) {
            root.click();
        }

    }

    public boolean isDropdownVisible() {
        return waitGuiVisible(root, browser).isDisplayed();
    }

    public boolean checkDropDownItemIsVisible(final String name) {
        return this.getDropdownItemByName(name).isDisplayed();
    }

    public boolean checkSelectableByName(final String name) {
        final WebElement dropDownItem = this.getDropdownItemByName(name);
        final Actions actions = new Actions(browser);
        actions.moveToElement(dropDownItem);
        actions.build().perform();
        return dropDownItem.getAttribute("class").contains("ebComponentList-item_focused");
    }

    public void selectByName(final String name) {
        this.getDropdownItemByName(name).click();
        waitGuiNotPresent(DIV + CONTAINS + CLASS + WIDGET_LIST + CLOSE, browser);
    }

    public WebElement getDropdownItemByName(final String name) {
        return waitGuiVisible(DIV + CONTAINS + CLASS + listOfItems.getAttribute("class") + CLOSE
                + DIV + CONTAINS + TEXT + name + CLOSE + "//parent::*", browser);
    }

    public void selectByNameScopingPanel(final String name) {
        this.getDropdownItemByNameScopingPanel(name).click();
        waitGuiNotPresent(DIV + CONTAINS + CLASS + WIDGET_LIST + CLOSE, browser);
    }

    public WebElement getDropdownItemByNameScopingPanel(final String name) {
        return waitGuiVisible(DIV + CONTAINS + CLASS + listOfItems.getAttribute("class") + CLOSE
                + DIV + CONTAINS + TEXT + name + CLOSE, browser);
    }

    public void expandDropdownScopingPanel() throws InterruptedException {
        boolean isNotExpanded = false;
        try {
            Thread.sleep(1000);
            isNotExpanded = waitGuiNotVisible(listOfItems, 5, browser);
        } catch (final TimeoutException | NoSuchElementException exception) {
            logger.info("An exception occurred: {}", exception.getMessage());
        }

        if (isDropdownVisible() && isNotExpanded) {
            rootScopingPanel.click();
        }
    }
}
