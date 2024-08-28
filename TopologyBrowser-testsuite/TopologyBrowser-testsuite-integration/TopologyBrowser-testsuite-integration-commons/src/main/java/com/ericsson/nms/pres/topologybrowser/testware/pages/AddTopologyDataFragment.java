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

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.ERBS_SUBNETWORK;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.DIV;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.SPAN;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.CLOSE;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.CLOSE_SHORT;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.CONTAINS;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.waitGuiVisible;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.waitGuiNotVisible;

import com.ericsson.nms.pres.topologybrowser.testware.utils.CommonTopologyUtils;
import com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils;
import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.fragment.Root;
import org.jboss.arquillian.graphene.page.Location;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

@Location("")
public class AddTopologyDataFragment {
	private static final String ADD = "Add";

	@Drone
	private WebDriver driver;

	@Root
	@FindBy(xpath = DIV + CLASS_EQ + "elScopingPanel-rManualScopingPanel" + CLOSE_SHORT)
	private WebElement scopingPanel;

	@FindBy(xpath = DIV + CLASS_EQ + "elScopingPanel-rTabTopology" + CLOSE_SHORT)
	private WebElement scopingPanelTopologyTab;

	@FindBy(xpath = SPAN + CONTAINS + TITLE + ERBS_SUBNETWORK + CLOSE)
	private WebElement node;

	public boolean isScopingPanelVisible() {
		return waitGuiVisible(scopingPanel, driver).isDisplayed();
	}

	public boolean isTopologyTabDefaultInScopingPanel() {
		return scopingPanelTopologyTab.isEnabled() && scopingPanelTopologyTab.isDisplayed();
	}

	public void waitScopingPanelToClose() {
		waitGuiNotVisible(DIV + CLASS_EQ + "eaFlyout" + CLOSE_SHORT, driver);
	}

	public void selectNode() { node.click(); }

	public void clickOnAddButton() { getButton(ADD).click(); }

	public WebElement getButton(final String buttonCaption) {
		return waitGuiVisible(SPAN + CONTAINS + TEXT + buttonCaption + CLOSE, driver);
	}

	public WebElement getNodeByName(final String name) {
		return CommonTopologyUtils.getNodeByName(name, driver);
	}

	public boolean isNodeExist(final String name) {
		return CommonTopologyUtils.isNodeExist(name, driver);
	}

	public void clickNodeByName(final String name) {
		CommonTopologyUtils.clickNodeByName(name, driver);
	}

	public void expandNodeByName (final String name) {
		CommonTopologyUtils.expandNodeByName(name, driver);
	}

	public void collapseNodeByName (final String name) {
		CommonTopologyUtils.collapseNodeByName(name, driver);
	}

	public WebElement getArrowByName(final String name) {
		return CommonTopologyUtils.getArrowByName(name, driver);
	}

	public boolean isNodeArrowRight (final String name) {
		return CommonTopologyUtils.isNodeArrowRight(name, driver);
	}

	public boolean isNodeArrowDown (final String name) {
		return CommonTopologyUtils.isNodeArrowDown(name, driver);
	}

	public boolean isNodeSelected(final String name) {
		return CommonTopologyUtils.isNodeSelected(name,  driver);
	}

	public void clickNodeById(final String id) {
		CommonTopologyUtils.clickNodeById(id,  driver);
	}

	public void multiSelect(final List<String> ids) {
		CommonUtils.pressCtrl(driver);
		for (String id : ids) {
			clickNodeById(id);
		}
		CommonUtils.releaseCtrl(driver);
	}
}
