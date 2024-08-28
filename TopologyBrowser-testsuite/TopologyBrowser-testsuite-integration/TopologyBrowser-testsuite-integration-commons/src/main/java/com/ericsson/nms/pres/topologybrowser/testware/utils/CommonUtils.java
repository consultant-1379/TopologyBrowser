package com.ericsson.nms.pres.topologybrowser.testware.utils;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import org.apache.commons.io.FileUtils;
import org.jboss.arquillian.graphene.Graphene;
import org.jboss.arquillian.graphene.proxy.GrapheneProxyInstance;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

import static java.lang.Thread.sleep;

public class CommonUtils {
    private static final long TIMEOUT = 30L;
    private static final TimeUnit SECONDS = TimeUnit.SECONDS;
    private static final Logger logger = LoggerFactory.getLogger(CommonUtils.class);

    private CommonUtils() {
    }

   @SuppressWarnings("Duplicates")
    public static List <WebElement> waitGuiVisibleForListOfElements(final String xpath, final WebDriver browser) {
        final String callerMethodName = Thread.currentThread().getStackTrace()[2].getMethodName();
        try {
            Graphene.waitGui(browser).withTimeout(TIMEOUT, SECONDS).until().element(By.xpath(xpath)).is().visible();
        } catch (final Exception e) {
            screenshot(callerMethodName, browser);
            throw e;
        }
       return browser.findElements(By.xpath(xpath));
    }

    @SuppressWarnings("Duplicates")
    public static WebElement waitGuiVisible(final WebElement element, final WebDriver browser) {
        final String callerMethodName = Thread.currentThread().getStackTrace()[2].getMethodName();
        try {
            Graphene.waitGui(browser).withTimeout(TIMEOUT, SECONDS).until().element(element).is().visible();
        } catch (final Exception e) {
            screenshot(callerMethodName, browser);
            throw e;
        }
        return element;
    }

    @SuppressWarnings("Duplicates")
    public static WebElement waitGuiVisible(final By by, final WebDriver browser) {
        final String callerMethodName = Thread.currentThread().getStackTrace()[2].getMethodName();
        try {
            Graphene.waitGui(browser).withTimeout(TIMEOUT, SECONDS).until().element(by).is().visible();
        } catch (final Exception e) {
            screenshot(callerMethodName, browser);
            throw e;
        }
        return browser.findElement(by);
    }

    @SuppressWarnings("Duplicates")
    public static WebElement waitGuiVisible(final String xpath, final WebDriver browser) {
        final String callerMethodName = Thread.currentThread().getStackTrace()[2].getMethodName();
        try {
            Graphene.waitGui(browser).withTimeout(TIMEOUT, SECONDS).until().element(By.xpath(xpath)).is().visible();
        } catch (final Exception e) {
            screenshot(callerMethodName, browser);
            throw e;
        }
        return browser.findElement(By.xpath(xpath));
    }

    public static WebElement waitGuiClickable(final WebElement element, final WebDriver browser) {
        final String callerMethodName = Thread.currentThread().getStackTrace()[2].getMethodName();
        try {
            Graphene.waitGui(browser).withTimeout(TIMEOUT, SECONDS).until().element(element).is().clickable();
        } catch (final Exception e) {
            screenshot(callerMethodName, browser);
            throw e;
        }
        return element;
    }

    public static WebElement waitGuiClickable(final String xpath, final WebDriver browser) {
        final String callerMethodName = Thread.currentThread().getStackTrace()[2].getMethodName();
        try {
            Graphene.waitGui(browser).withTimeout(TIMEOUT, SECONDS).until().element(By.xpath(xpath)).is().clickable();
        } catch (final Exception e) {
            screenshot(callerMethodName, browser);
            throw e;
        }
        return browser.findElement(By.xpath(xpath));
    }

    public static boolean waitGuiNotPresent(final WebElement element, final WebDriver browser) {
        final String callerMethodName = Thread.currentThread().getStackTrace()[2].getMethodName();
        try {
            Graphene.waitGui(browser).withTimeout(TIMEOUT, SECONDS).until().element(element).is().not().present();
        } catch (final Exception e) {
            screenshot(callerMethodName, browser);
            throw e;
        }
        return true;
    }

    public static boolean waitGuiNotPresent(final String xpath, final WebDriver browser) {
        final String callerMethodName = Thread.currentThread().getStackTrace()[2].getMethodName();
        try {
            Graphene.waitGui(browser).withTimeout(TIMEOUT, SECONDS).until().element(By.xpath(xpath)).is().not()
                    .present();
        } catch (final Exception e) {
            screenshot(callerMethodName, browser);
            throw e;
        }
        return true;
    }

    public static boolean waitGuiNotVisible(final WebElement element, final long timeout, final WebDriver browser) {
        final String callerMethodName = Thread.currentThread().getStackTrace()[2].getMethodName();
        try {
            Graphene.waitGui(browser).withTimeout(timeout, SECONDS).until().element(element).is().not().visible();
        } catch (final Exception e) {
            screenshot(callerMethodName, browser);
            throw e;
        }
        return true;

    }

    public static boolean waitGuiNotVisible(final WebElement element, final WebDriver browser) {
        return waitGuiNotVisible(element, TIMEOUT,  browser);
    }

    public static boolean waitGuiNotVisible(final String xpath, final WebDriver browser) {
        final String callerMethodName = Thread.currentThread().getStackTrace()[2].getMethodName();
        try {
            Graphene.waitGui(browser).withTimeout(TIMEOUT, SECONDS).until().element(By.xpath(xpath)).is().not()
                    .visible();
        } catch (final Exception e) {
            screenshot(callerMethodName, browser);
            throw e;
        }
        return true;
    }

    public static void pressCtrl(final WebDriver browser) {
        final Actions actions = new Actions(browser);
        actions.keyDown(Keys.CONTROL).build().perform();
    }

    public static void releaseCtrl(final WebDriver browser) {
        final Actions actions = new Actions(browser);
        actions.keyUp(Keys.CONTROL).build().perform();
    }

    public static void pressShift(final WebDriver browser) {
        final Actions actions = new Actions(browser);
        actions.keyDown(Keys.LEFT_SHIFT).build().perform();
    }

    public static void releaseShift(final WebDriver browser) {
        final Actions actions = new Actions(browser);
        actions.keyUp(Keys.LEFT_SHIFT).build().perform();
    }

    public static void rightClick(final WebDriver browser, final WebElement element) {
        waitGuiClickable(element, browser);
        final Actions actions = new Actions(browser);
        actions.moveToElement(element).contextClick(element).build().perform();
    }

    public static void screenshot(final String screenshotName, final WebDriver browser) {
        final File scrFile = ((TakesScreenshot) browser).getScreenshotAs(OutputType.FILE);
        final String date = new SimpleDateFormat("yy-MM-dd_HH-mm-ss-SSS").format(new Date());
        final String path =
                System.getProperty("user.dir") + File.separator + "target" + File.separator + "ScreenShot_" + date + "_"
                + screenshotName + ".png";
        try {
            FileUtils.copyFile(scrFile, new File(path));
            if (new File(path).exists()) {
                logger.info("Screen Shot saved to: {}", path);
            }
        } catch (final IOException ignored) {
            logger.error("Copy file failed");
        }
    }

    public static void click(final WebElement element, final WebDriver browser){
        long duration = ((GrapheneProxyInstance)browser).getGrapheneContext().getConfiguration().getWaitGuiInterval();
        while (duration > 0) {
            try {
                element.click();
                break;
            } catch (final WebDriverException e) {
                if (--duration <= 0) {
                    screenshot(Thread.currentThread().getStackTrace()[2].getMethodName(), browser);
                    throw e;
                }
                try {
                    sleep(1000);
                } catch (final InterruptedException interruptedException) {
                    logger.error("Interrupted Exception has been thrown");
                    Thread.currentThread().interrupt();
                }
            }
        }
    }
}
