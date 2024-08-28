package com.ericsson.nms.pres.topologybrowser.testware.pages;

import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.page.Location;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.CLASS;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathAttributes.CLASS_EQ;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathElements.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonConstants.XPathOthers.*;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.waitGuiNotPresent;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.waitGuiVisible;
import static com.ericsson.nms.pres.topologybrowser.testware.utils.CommonUtils.waitGuiVisibleForListOfElements;


@Location("")
public class CMSyncFragment {

    @Drone
    private WebDriver driver;

    @FindBy(css = ".elNetworkObjectLib-progressRegion-footer")
    private WebElement progressRegionFooter;

    @FindBy(css = ".ebProgressBar-value")
    private WebElement progressBarValue;

    @FindBy(css = ".ebDialogBox-primaryText")
    private WebElement progressPrimaryText;

    public Map <String, String> tableItems() {
        final Map <String,String> map = new  HashMap <>();
        final List<String> headers = new ArrayList<>();
        final List<String> values = new ArrayList<>();
        final List<WebElement> tableHeaders =  waitGuiVisibleForListOfElements(DIV + CLASS_EQ + "elNetworkObjectLib-progressRegion" + CLOSE_SHORT + SPAN + CONTAINS + CLASS + "elNetworkObjectLib-wCounterBox-title" + CLOSE, driver);
        final List<WebElement> tableValues =  waitGuiVisibleForListOfElements(DIV + CLASS_EQ + "elNetworkObjectLib-progressRegion" + CLOSE_SHORT + SPAN + CONTAINS + CLASS + "elNetworkObjectLib-wCounterBox-value" + CLOSE, driver);
        for (WebElement header : tableHeaders) {
            headers.add(header.getText());
        }
        for (WebElement value : tableValues) {
            values.add(value.getText());
        }
        for (int index = 0; index < headers.size(); index++){
            map.put(headers.get(index), values.get(index));
        }

        return map;
    }
    public List<String> getResults () {
        final List<String> results = new ArrayList<>();
        final List<WebElement> tableResults =  waitGuiVisibleForListOfElements(DIV + CLASS_EQ + "elTablelib-Table" + CLOSE_SHORT + SPAN  + CONTAINS + CLASS  + "eaCellManagement-wLockInProgress-wIconCell-caption" + CLOSE, driver);
        for (WebElement header : tableResults) {
            results.add(header.getText());
        }
        return results;
    }

    public String progressRegionText() {
        return getElementText(progressRegionFooter);
    }

    public String progressBarText() {
        return getElementText(progressBarValue);
    }

    public String progressPrimaryText() {
        return getElementText(progressPrimaryText);
    }

    private String getElementText(final WebElement element) {
        return waitGuiVisible(element, driver).getText();
    }

}
