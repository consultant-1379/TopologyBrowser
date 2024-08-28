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
import org.jboss.arquillian.graphene.fragment.Root;
import org.jboss.arquillian.graphene.page.Location;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.CLASS;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.BUTTON;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.DIV;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.INPUT;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.CLOSE;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.CONTAINS;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.waitGuiVisible;

@Location("")
public class SearchNodeFragment {

    private static final Logger logger = LoggerFactory.getLogger(SearchNodeFragment.class);

    @Drone
    private WebDriver browser;

    @FindBy(xpath = BUTTON + CONTAINS + CLASS + "elNetworkObjectLib-wSearchNode-find-filter-searchUpBtn" + CLOSE)
    private WebElement upArrow;

    @FindBy(xpath = BUTTON + CONTAINS + CLASS + "elNetworkObjectLib-wSearchNode-find-filter-searchDownBtn" + CLOSE)
    private WebElement downArrow;

    @FindBy(xpath = DIV + CONTAINS + CLASS + "elNetworkObjectLib-wSearchNode-find-notFound" + CLOSE)
    private WebElement errorMessage;

    @FindBy(xpath = BUTTON + CONTAINS + CLASS + "elNetworkObjectLib-rTopologyHeader-find-button" + CLOSE)
    private WebElement icon;

    @Root
    @FindBy(xpath = INPUT + CONTAINS + CLASS + "elNetworkObjectLib-wSearchNode-find-filter-findInput" + CLOSE)
    private WebElement inputSearch;


    public void clickUpArrowButton() {waitGuiVisible(upArrow, browser).click(); }

    public void clickDownArrowButton() {
        waitGuiVisible(downArrow, browser).click();
    }

    public void selectSearch() {waitGuiVisible(inputSearch, browser).click();}

    public void enterSearch(final String Search) {waitGuiVisible(inputSearch, browser).sendKeys(Search);}

    public void pressEnter() {
        waitGuiVisible(inputSearch, browser).sendKeys(Keys.ENTER);
    }

    public void selectIcon() {waitGuiVisible(icon, browser).click();}

    public boolean isErrorMessageDisplayed() {
        try {
            return errorMessage.isDisplayed();
        } catch (final NoSuchElementException noSuchElementException){
            logger.info("No such element for error message therefore, return false. Exception: {}", noSuchElementException.getMessage());
            return false;
        }
    }


}
