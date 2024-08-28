package com.ericsson.nms.pres.topologybrowser.testware.utils;

import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.DOWN;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.RIGHT;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.PRIVATE_NETWORK;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathRelatives.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.*;

public class CommonTopologyUtils {

     private static final String DATAVIZ_ITEM_SELECTED  = "elDataviz-Item elDataviz-Item_selected";
     private static final String DATAVIZ_TREE_ITEMS  = "elDataviz-Tree-items";
     private static final String STATE_ICONS_CLASS = "elNetworkObjectLib-NodeItem-stateIcons";
     private static final String MORE_CONTENT_CLASS = "elNetworkObjectLib-NodeItem-moreContent";

    private CommonTopologyUtils() {
    }

    public static WebElement getNodeByName(final String name, final WebDriver driver) {
        return waitGuiVisible(SPAN + CONTAINS + TITLE + name + CLOSE, driver);
    }

    public static WebElement getPrivateNetwork(final WebDriver driver) {
        return waitGuiVisible(SPAN + CONTAINS + TEXT + PRIVATE_NETWORK + CLOSE, driver);
    }

    public static boolean isNodeExist(final String name, final WebDriver driver) {
        try {
            return getNodeByName(name,driver) != null;
        } catch (final NoSuchElementException ignored) {
            return false;
        }
    }

    public static boolean isNodeNotExist(final String name, final WebDriver driver) {
        waitGuiNotPresent(name,driver);
        return true;
    }

    public static void clickNodeByName(final String name, final WebDriver driver) {
        waitGuiClickable(getNodeByName(name, driver), driver).click();
    }

    public static void expandNodeByName (final String name, final WebDriver driver) {
        if (!isNodeArrowDown(name, driver)) {
            waitGuiClickable(getArrowByName(name, driver),driver).click();
        }
    }

    public static void collapseNodeByName (final String name, final WebDriver driver) {
        if (isNodeArrowDown(name, driver)) {
           click(waitGuiClickable(getArrowByName(name, driver),driver), driver);
        }
    }
    public static WebElement getIconByName(final String name, final WebDriver driver) {
        return waitGuiVisible(SPAN + CONTAINS + TITLE + name + CLOSE + PRECEDING_SIBLING + ICON_INSIDE , driver);
    }
    public static WebElement getArrowByName(final String name, final WebDriver driver) {
        final String xPath = DIV+CONTAINS+CLASS+"elDataviz-Tree"+CLOSE+SPAN + TITLE_EQ + name + CLOSE_SHORT
                             + ANY_ANCESTOR + CONTAINS + CLASS + "elDataviz-Item" + CLOSE
                             + ICON + CONTAINS + CLASS + "Arrow" + CLOSE;
        return waitGuiVisible(xPath, driver );
    }

    public static boolean isNodeArrowRight (final String name, final WebDriver driver) {
        return getArrowByName(name, driver).getAttribute(CommonConstants.ATTR_CLASS).contains(RIGHT);
    }

    public static boolean isNodeArrowDown (final String name, final WebDriver driver) {
        return getArrowByName(name, driver).getAttribute(CommonConstants.ATTR_CLASS).contains(DOWN);
    }

    public static boolean isNodeSelected(final String name, final WebDriver driver) {
        return waitGuiVisible(SPAN + CONTAINS + TITLE + name + CLOSE + ANCESTOR + DIV_INSIDE + CLASS_EQ
                + DATAVIZ_TREE_ITEMS + CLOSE_SHORT + DESCENDANT + DIV_INSIDE + CLASS_EQ + DATAVIZ_ITEM_SELECTED
                + CLOSE_SHORT, driver).isDisplayed();
    }
    public static boolean isNodeNotSelected(final String name, final WebDriver driver) {
        return waitGuiNotPresent(SPAN + CONTAINS + TITLE + name + CLOSE + ANCESTOR + DIV_INSIDE + CLASS_EQ
                + DATAVIZ_ITEM_SELECTED + CLOSE_SHORT, driver);
    }

    public static WebElement getNodeById(final String id, final WebDriver driver) {
        return waitGuiVisible(DIV + DATA_ID_EQ + id + CLOSE_SHORT + CHILD + "span", driver);
    }

    public static boolean isNodeExistForId(final String id,  final WebDriver driver) {
        try {
            return getNodeById(id,  driver) != null;
        } catch (final NoSuchElementException ignored) {
            return false;
        }
    }

    public static void clickNodeById(final String id, final WebDriver driver) {
        waitGuiClickable(getNodeById(id, driver),driver).click();
    }

    public static boolean isNodeSelectedForId(final String id, final WebDriver driver) {
        return waitGuiVisible(DIV + DATA_ID_EQ + id + CLOSE_SHORT + ANCESTOR + DIV_INSIDE + CLASS_EQ + DATAVIZ_ITEM_SELECTED + CLOSE_SHORT, driver).isDisplayed();
    }

    public static boolean isNodeNotSelectedForId(final String id, final WebDriver driver) {
        return !waitGuiNotPresent(DIV + DATA_ID_EQ + id + CLOSE_SHORT + ANCESTOR + DIV_INSIDE + CLASS_EQ + DATAVIZ_ITEM_SELECTED + CLOSE_SHORT, driver);
    }

    public static boolean isIconVisible(final String node, final String iconClassName, final WebDriver driver) {
        return getIconByClassName(node, iconClassName,driver).isDisplayed();
    }

    public static WebElement getIconByClassName(final String node, final String iconClassName, final WebDriver driver) {
        return waitGuiVisible(SPAN + TEXT_EQ + node + CLOSE_SHORT + NEXT_SIBLING + DIV_INSIDE  + CLASS_EQ + STATE_ICONS_CLASS + CLOSE_SHORT  + DESCENDANT
                + ICON_INSIDE + OPEN_BRACKET + CONTAINS + CLASS +iconClassName + CLOSE, driver);
    }

    public static boolean isIconNotVisible(final String node, final String iconClassName, final WebDriver driver) {
        return waitGuiNotPresent(SPAN + TEXT_EQ + node + CLOSE_SHORT + NEXT_SIBLING + ICON_INSIDE + OPEN_BRACKET + CONTAINS + CLASS +iconClassName + CLOSE, driver);
    }

    public static boolean isMoreContentVisible(final WebDriver driver){
        return waitGuiVisible(DIV +  CLASS_EQ + MORE_CONTENT_CLASS + CLOSE_SHORT, driver).isDisplayed();
    }

    public static List<WebElement> getMoreContentIcons(final WebDriver driver){
        return waitGuiVisibleForListOfElements(DIV +  CLASS_EQ + MORE_CONTENT_CLASS + CLOSE_SHORT + ICON_SHORT, driver);
    }

    public static boolean isIconVisibleInsideMoreContent(final String iconClassName, final WebDriver driver){
        return waitGuiVisible(DIV +  CLASS_EQ + MORE_CONTENT_CLASS + CLOSE_SHORT + ICON + CONTAINS + CLASS + iconClassName+ CLOSE, driver).isDisplayed();
    }
}