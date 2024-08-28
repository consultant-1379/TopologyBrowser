package com.ericsson.nms.pres.topologybrowser.testware.pages;

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.ATTR_CLASS;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.BASE_URL;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.CLEAR;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.CUSTOM_TOPOLOGY_DB_URL;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.DROPDOWN_SETTINGS_URL;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.FIND_AND_LOCATE_URL;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.RESET;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.SET_DATA;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.TOPOLOGY_DB_URL;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.ERROR_RESPONSE_URL;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.CLASS;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.TEXT;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.TITLE;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.ANY_ELEMENT;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.DIV;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.ICON;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.SPAN;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.CLOSE;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.CLOSE_PARENTHESIS_AND;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.CONTAINS;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathRelatives.ANY_ANCESTOR;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.waitGuiClickable;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.waitGuiNotPresent;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.waitGuiVisible;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.Graphene;
import org.jboss.arquillian.graphene.fragment.Root;
import org.jboss.arquillian.graphene.page.Location;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;

import com.ericsson.nms.pres.topologybrowser.testware.utils.CommonTopologyUtils;
import com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils;

@Location("")
public class TreeViewFragment {
    private static final String TRANS_TOPOL_ROOT_SELECTOR = SPAN + CONTAINS + TITLE + "Transport Topology" + CLOSE
                                                               + ANY_ANCESTOR + CONTAINS + CLASS + "elDataviz-Item"  + CLOSE;

    private static final String CUSTOM_ROOT_SELECTOR = SPAN + CONTAINS + TITLE + "Root Non Custom Topology" + CLOSE
            + ANY_ANCESTOR + CONTAINS + CLASS + "elDataviz-Item" + CLOSE;
    @Drone
    private WebDriver browser;

    @Root
    @FindBy(css = ".elNetworkObjectLib-rTopologyVisualisation-tree")
    private WebElement root;

    @FindBy(xpath = TRANS_TOPOL_ROOT_SELECTOR + ICON + CONTAINS + CLASS + "Arrow" + CLOSE)
    private WebElement tranportTopologyRootArrow;

    @FindBy(xpath = CUSTOM_ROOT_SELECTOR + ICON + CONTAINS + CLASS + "Arrow" + CLOSE)
    private WebElement customRootTopologyRootArrow;

    @FindBy(css = ".elWidgets-Loader-content")
    private WebElement loader;

    private WebElement getTransportTopologyRootArrow() {
        return waitGuiVisible(tranportTopologyRootArrow, browser);
    }

    private WebElement getCustomTopologyRootArrow() {
        return waitGuiVisible(customRootTopologyRootArrow, browser);
    }

    public String getIconTooltip(final String name) {
        return CommonTopologyUtils.getIconByName(name, browser).getAttribute("title");
    }

    public boolean isRootArrowRight() {
        return getTransportTopologyRootArrow().getAttribute(ATTR_CLASS).contains("ebIcon_rightArrow");
    }

    public boolean isCustomRootArrowRight() {
        return getCustomTopologyRootArrow().getAttribute(ATTR_CLASS).contains("ebIcon_rightArrow");
    }

    public boolean isLoadingVisible(){
        return waitGuiVisible(loader, browser).isDisplayed();
    }

    public boolean isLoadingNotVisible(){
        waitGuiNotPresent(loader, browser);
        return true;
    }

    public WebElement getTreeRoot() {
        return waitGuiVisible(TRANS_TOPOL_ROOT_SELECTOR, browser);
    }

    public boolean isCustomTopology(final boolean should) throws InterruptedException{
        final String xpath = DIV + CONTAINS + CLASS + root.getAttribute(ATTR_CLASS) + CLOSE + ANY_ELEMENT + "[" + CONTAINS + CLASS + "rCustomTopology" + CLOSE;
        if(should){
            return waitGuiVisible(xpath, browser).isDisplayed();
        } else {
            return waitGuiNotPresent(xpath,browser);
        }
    }

    public boolean isNetworkData() {
        final WebElement element =
                waitGuiVisible(DIV + CONTAINS + CLASS + root.getAttribute(ATTR_CLASS) + CLOSE + ANY_ELEMENT, browser);
        return element.getAttribute(ATTR_CLASS).contains("rTopologyTree");
    }

    public void setTopologyOnDB(final String branch) throws IOException {
        Graphene.guardNoRequest(((HttpURLConnection) new URL(BASE_URL + CUSTOM_TOPOLOGY_DB_URL + SET_DATA + branch).openConnection()).getResponseCode());
    }

    public void clearDB() throws IOException {
        Graphene.guardNoRequest(((HttpURLConnection) new URL(BASE_URL + CUSTOM_TOPOLOGY_DB_URL + CLEAR).openConnection()).getResponseCode());
    }

    public void resetDropdownSettings() throws IOException {
        Graphene.guardNoRequest(((HttpURLConnection) new URL(BASE_URL + DROPDOWN_SETTINGS_URL + RESET).openConnection()).getResponseCode());
    }

    public void setFindAndLocateResponse(final String query) throws IOException {
        Graphene.guardNoRequest(((HttpURLConnection) new URL(BASE_URL + FIND_AND_LOCATE_URL + "/*?query=" + query).openConnection()).getResponseCode());
    }

    public void setNetworkDataOnDB(final String network) throws IOException {
        Graphene.guardNoRequest(((HttpURLConnection) new URL(BASE_URL + TOPOLOGY_DB_URL + SET_DATA + network).openConnection()).getResponseCode());
    }

    public void clearNetworkDataDB() throws IOException {
        Graphene.guardNoRequest(((HttpURLConnection) new URL(BASE_URL + TOPOLOGY_DB_URL + CLEAR).openConnection()).getResponseCode());
    }

    public void addNode(final String node) throws IOException {
        Graphene.guardNoRequest(((HttpURLConnection) new URL(BASE_URL + TOPOLOGY_DB_URL +"/add-data/" + node).openConnection()).getResponseCode());
    }

    public void removeNode(final String id) throws IOException {
        Graphene.guardNoRequest(((HttpURLConnection) new URL(BASE_URL + TOPOLOGY_DB_URL +"/delete-data/" + id).openConnection()).getResponseCode());
    }

    public void setErrorResponse(final String errorName, final int statusCode) throws IOException {
        Graphene.guardNoRequest(((HttpURLConnection) new URL(BASE_URL + ERROR_RESPONSE_URL +"/set/" + errorName + "/" + statusCode).openConnection()).getResponseCode());
    }

    public void resetErrorResponse() throws IOException {
        Graphene.guardNoRequest(((HttpURLConnection) new URL(BASE_URL + ERROR_RESPONSE_URL +"/reset").openConnection()).getResponseCode());
    }

    public void remove(final String poid) throws IOException {
        Graphene.guardNoRequest(((HttpURLConnection) new URL(BASE_URL + CUSTOM_TOPOLOGY_DB_URL + "/remove/"+ poid).openConnection()).getResponseCode());
    }

    public void restore() throws IOException {
        Graphene.guardNoRequest(((HttpURLConnection) new URL(BASE_URL + TOPOLOGY_DB_URL + "/restore").openConnection()).getResponseCode());
    }

    public WebElement getNodeByName(final String name) {
        return CommonTopologyUtils.getNodeByName(name, browser);
    }

    public WebElement getPrivateNetwork() {
        return CommonTopologyUtils.getPrivateNetwork(browser);
    }

    public boolean isNodeExist(final String name) {
        return CommonTopologyUtils.isNodeExist(name, browser);
    }

    public boolean isNodeNotExist(final String name) {
        return CommonTopologyUtils.isNodeNotExist(name, browser);
    }

    public void clickNodeByName(final String name) {
        CommonTopologyUtils.clickNodeByName(name, browser);
    }

    public void expandNodeByName (final String name) {
        CommonTopologyUtils.expandNodeByName(name, browser);
    }

    public void collapseNodeByName (final String name) {
        CommonTopologyUtils.collapseNodeByName(name, browser);
    }

    public WebElement getArrowByName(final String name) {
        return CommonTopologyUtils.getArrowByName(name, browser);
    }

    public boolean isNodeArrowRight (final String name) {
        return CommonTopologyUtils.isNodeArrowRight(name, browser);
    }

    public boolean isNodeArrowDown (final String name) {
        return CommonTopologyUtils.isNodeArrowDown(name, browser);
    }

    public boolean isNodeSelected(final String name) {
        return CommonTopologyUtils.isNodeSelected(name,  browser);
    }

    public boolean isNodeNotSelected(final String name) {
        return CommonTopologyUtils.isNodeNotSelected(name,  browser);
    }

    public boolean isNodeExistForId(final String id) { return CommonTopologyUtils.isNodeExistForId(id, browser); }

    public void clickNodeById(final String id) {
        CommonTopologyUtils.clickNodeById(id, browser);
    }

    public boolean isNodeSelectedForId(final String id) {
        return CommonTopologyUtils.isNodeSelectedForId(id, browser);
    }

    public boolean isNodeNotSelectedForId(final String id) {
        return CommonTopologyUtils.isNodeNotSelectedForId(id, browser);
    }

    public boolean nodeHasIcon(final String node, final String iconClassName) {
        return CommonTopologyUtils.isIconVisible(node, iconClassName, browser);
    }

    public WebElement getNodeIcon(final String node, final String iconClassName) {
        return CommonTopologyUtils.getIconByClassName(node, iconClassName, browser);
    }

    public boolean nodeHasNoIcon(final String node, final String iconClassName) {
        return CommonTopologyUtils.isIconNotVisible(node, iconClassName, browser);
    }

    public void clickNodeIcon(final String node, final String iconClassName) {
        CommonTopologyUtils.getIconByClassName(node,iconClassName,browser).click();
    }

    public void pressCtrl() {
        CommonUtils.pressCtrl(browser);
    }

    public void releaseCtrl() {
        CommonUtils.releaseCtrl(browser);
    }

    public String getCurrentUrl() {
        return browser.getCurrentUrl();
    }

    public void pressShift() { CommonUtils.pressShift(browser); }

    public void releaseShift() { CommonUtils.releaseShift(browser); }

    public void rightClick(final String name){
        final WebElement element = CommonTopologyUtils.getNodeByName(name, browser);
        CommonUtils.rightClick(browser, element);
    }

    public void clickInOption(final String optionName){
        waitGuiClickable(DIV + CONTAINS + CLASS + "ebComponentList-item" + CLOSE_PARENTHESIS_AND + CONTAINS + TEXT + optionName + CLOSE, browser).click();
    }

    public void clickInDropdownOption(final String optionName){
        waitGuiClickable(DIV + CONTAINS + CLASS + "ebComponentList-group-name" + CLOSE_PARENTHESIS_AND + CONTAINS + TEXT + optionName + CLOSE, browser).click();
    }

    public boolean isMoreContentVisible(){
       return CommonTopologyUtils.isMoreContentVisible(browser);
    }

    public List<WebElement> getMoreContentIcons(){
        return CommonTopologyUtils.getMoreContentIcons(browser);
    }

    public boolean isIconVisibleInsideMoreContent(final String iconClassName){
        return CommonTopologyUtils.isIconVisibleInsideMoreContent(iconClassName, browser);
    }

    public void moveMouseOver(final WebElement element){
        final Actions actions = new Actions(browser);
        actions.moveToElement(element);
        actions.build().perform();
    }

}
