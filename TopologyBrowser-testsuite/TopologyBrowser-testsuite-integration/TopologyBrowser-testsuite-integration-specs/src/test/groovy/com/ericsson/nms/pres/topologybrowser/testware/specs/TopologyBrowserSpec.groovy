package com.ericsson.nms.pres.topologybrowser.testware.specs

import com.ericsson.nms.pres.topologybrowser.testware.pages.TopologyBrowserPage
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Specification


@RunWith(ArquillianSputnik)
class TopologyBrowserSpec extends Specification {
    @Page
    TopologyBrowserPage topologyBrowserPage

    def 'Open Topology Browser'() {
        given: 'Topology Browser is open'
        topologyBrowserPage.openTopologyBrowser(false)
        expect: 'Title to be Topology Browser'
        assert "Topology Browser" == topologyBrowserPage.getTitle().getText()
    }
}