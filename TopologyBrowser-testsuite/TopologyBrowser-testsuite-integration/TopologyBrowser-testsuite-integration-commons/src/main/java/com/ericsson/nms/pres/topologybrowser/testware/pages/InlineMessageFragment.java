/*------------------------------------------------------------------------------
 *******************************************************************************
 * COPYRIGHT Ericsson 2020
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
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.CLASS_EQ;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.DIV;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.waitGuiVisible;

@Location("")
public class InlineMessageFragment {

    @Drone
    private WebDriver driver;

    @Root
    @FindBy(xpath = DIV + CLASS_EQ + "ebInlineMessage" + CLOSE_SHORT)
    private WebElement root;

    @FindBy(xpath = DIV + CLASS_EQ + "ebInlineMessage-header" + CLOSE_SHORT)
    private WebElement header;

    @FindBy(xpath = DIV + CLASS_EQ + "ebInlineMessage-description" + CLOSE_SHORT)
    private WebElement description;

    public String getHeaderText() {
        return waitGuiVisible(header, driver).getText();
    }

    public String getDescriptionText() {
        return waitGuiVisible(description, driver).getText();
    }

}
