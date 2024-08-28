/*------------------------------------------------------------------------------
 *******************************************************************************
 * COPYRIGHT Ericsson 2019
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
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.CLASS;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.TEXT;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathRelatives.NEXT_SIBLING;

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.waitGuiVisible;

@Location("")
public class ProgressRegionFragment {

    private static final String TABLE = "elNetworkObjectLib-wProgressDetailsTable-table";

    @Drone
    private WebDriver driver;

    public WebElement getStatusCount(final String status) {
        final int nextSibling = 1;
        return waitGuiVisible(SPAN + CONTAINS + TEXT + status + CLOSE + NEXT_SIBLING + ANY_ELEMENT_INSIDE + nextSibling + CLOSE_BRACKET, driver);
    }

    public WebElement getStateChangeResult(final int row) {
        final int column = 2;
        return waitGuiVisible(DIV + CONTAINS + CLASS + TABLE + CLOSE + ROW + row + CLOSE_BRACKET + TD + column + CLOSE_BRACKET, driver);
    }
}
