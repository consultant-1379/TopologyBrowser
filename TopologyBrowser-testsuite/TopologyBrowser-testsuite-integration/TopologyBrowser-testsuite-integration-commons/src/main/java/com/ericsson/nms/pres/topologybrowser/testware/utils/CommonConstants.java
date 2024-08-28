package com.ericsson.nms.pres.topologybrowser.testware.utils;

public class CommonConstants {
    public static final String BASE_URL = "http://localhost:8585";
    public static final String TOPOLOGY_BROWSER_URL = "/#topologybrowser";
    public static final String TOPOLOGY_DB_URL = "/test/network-data-db";
    public static final String NETWORK_DATA_DETAILS_URL = "/test/network-data-details";
    public static final String CUSTOM_TOPOLOGY_DB_URL = "/test/custom-topology-db";
    public static final String ERROR_RESPONSE_URL = "/test/errorResponse";
    public static final String DROPDOWN_SETTINGS_URL = "/rest/ui/settings/topologybrowser/dropdownSettings";
    public static final String FIND_AND_LOCATE_URL = "/object-configuration/collections/v4/search";

    public static final String RIGHT = "right";
    public static final String DOWN = "down";
    public static final String ATTR_CLASS = "class";
    public static final String ATTR_BUTTON = "button";
    public static final String FAILED = "Failed";
    public static final String READ_ONLY_MODIFIER= "readOnly";

    public static final String TRANSPORT_TOPOLOGY = "Transport Topology";
    public static final String MODELLED_TOPOLOGIES = "Modelled Topologies";
    public static final String CUSTOM_TOPOLOGIES = "Custom Topologies";
    public static final String CREATE_PRIVATE_NETWORK_ACTION = "Create Private Network";
    public static final String NETWORK_DATA = "Network Data";
    public static final String ERBS_SUBNETWORK = "ERBS_Subnetwork";
    public static final String RNC = "RNC";
    public static final String CREATE_CUSTOM_TOPOLOGY = "Create a Custom Topology";
    public static final String CUSTOM_TOPOLOGY = "CUSTOM-TOPOLOGY-01";
    public static final String ALL_OTHER_NODES = "All other nodes";
    public static final String MECONTEXT = "MeContext";
    public static final String MANAGEDELEMENT = "ManagedElement";
    public static final String RBS = "RBS";
    public static final String ERBS = "ERBS";
    public static final String SUBNETWORK = "SubNetwork";
    public static final String PRIVATE_NETWORK = "Private Network";
    public static final String NOTIFICATIONS = "Notifications";
    public static final String ENABLE_SUPERVISION = "ENABLE SUPERVISION";
    public static final String LOCATE_NODE = "Locate Node";
    public static final String VIEW_STATUS = "View Status";

    public static final String ADD_TOPOLOGY_DATA_ACTION = "Add Topology Data";
    public static final String CREATE_COLLECTION_ACTION = "Create Collection";
    public static final String WIDGET_LIST = ".elWidgets-ComponentList";
    public static final String DELETE_ACTION = "Delete";
    public static final String REMOVE_ACTION = "Remove from Collection";
    public static final String RENAME_ACTION = "Rename";
    public static final String SET_TO_PUBLIC_ACTION = "Set To Public";
    public static final String EXPORT_COLLECTION_ACTION = "Export Collection";
    public static final String EXPORT_TOPOLOGY_ACTION = "Export Topology";
    public static final String UPDATE_CONTENTS_ACTION = "Update Contents";
    public static final String EDIT_CRITERIA_ACTION = "Edit Criteria";

    public static final String NO_CHILDREN_FOUND = "No children found";

    public static final String BRANCH_NAME = "BRANCH-01";
    public static final String PRIVATE_NETWORK_NAME = "PRIVATE-NETWORK-01";
    public static final String PRIVATE_NETWORK_NETWORK_NAME = "PRIVATE-NETWORK-NetworkName";
    public static final String PRIVATE_NETWORK_LOCATION = "PRIVATE-NETWORK-Location";
    public static final String PRIVATE_NETWORK_COMPANY_NAME = "PRIVATE-NETWORK-CompanyName";
    public static final String CHILD_BRANCH = "child_branch_";
    public static final String CHILD_LEAF = "child_leaf_";
    public static final String CHILD_SEARCH_CRITERIA = "child_search_criteria_";
    public static final String LEAF_NAME = "LEAF-01";
    public static final String RADIO_NODE_13 = "ieatnetsimv6035-12_RNC01RBS13";
    public static final String RADIO_NODE_14 = "ieatnetsimv6035-12_RNC01RBS14";
    public static final String OTHER_RADIO_NODE = "RNC01MSRBS-V2259";
    public static final String SET_DATA = "/set-data/";
    public static final String CLEAR = "/clear";
    public static final String RESET = "/reset";
    public static final String EMPTY = "empty";

    public static final String UNABLE_TO_LOCATE_OBJECT_TITLE = "Unable to Locate Object";
    public static final String UNABLE_TO_RETRIEVE_DATA_TITLE = "Unable to Retrieve Data";
    public static final String NO_CAPACITY_AVAILABLE_MESSAGE = "There is currently no capacity to process the request " +
            "due to a large amount of activity on the server. Please try again later.";
    public static final String ACCORDION_CONTAINER = "accordionContainer";

    public static final String CREATE = "create";
    public static final String READ = "read";
    public static final String UPDATE = "update";
    public static final String DELETE = "delete";
    public static final String EXEC = "exec";

    public class MockActions {

        private MockActions() { }

        public static final String TYPE = "type";
        public static final String NE_TYPE = "neType";
        public static final String TYPE_MECONTEXT = TYPE + " " + MECONTEXT;
        public static final String TYPE_MANAGEDELEMENT = TYPE + " " + MANAGEDELEMENT;
        public static final String NE_TYPE_RBS = NE_TYPE +  " " + RBS;
        public static final String NE_TYPE_ERBS = NE_TYPE +  " " + ERBS;
        public static final String NE_TYPE_NULL = NE_TYPE +  " " + "null";
        public static final String NE_TYPE_EPG = NE_TYPE +  " " + "EPG-OI";
        public static final String CM_SYNC = "Initiate CM Sync";
        public static final String SINGLE_SELECT = "Single Select";
        public static final String MULTI_SELECT = "Multi Select";
        public static final String TYPE_SUB_NETWORK = TYPE + " " + SUBNETWORK;
    }

    public class XPathRelatives {

        private XPathRelatives() { }

        public static final String PARENT = "/parent::";
        public static final String NEXT_SIBLING = "/following-sibling::";
        public static final String PRECEDING_SIBLING = "/preceding-sibling::";
        public static final String ANY_ANCESTOR = "/ancestor::*[";
        public static final String ANCESTOR = "//ancestor::";
        public static final String CHILD = "/child::";
        public static final String DESCENDANT = "/descendant::";
    }

    public class XPathElements {

        private XPathElements() {}

        public static final String DIV = "//Div[";
        public static final String PAR = "//p[";
        public static final String DIV_INSIDE = "div[";
        public static final String SPAN = "//Span[";
        public static final String BUTTON = "//Button[";
        public static final String ICON = "//i[";
        public static final String ICON_SHORT = "//i";
        public static final String ROW = "//tr[";
        public static final String ICON_INSIDE = "i";
        public static final String INPUT = "//input[";
        public static final String TEXTAREA = "//TEXTAREA[";
        public static final String PARAGRAPH = "//p[";
        public static final String ANY_ELEMENT = "//*";
        public static final String ANY_ELEMENT_INSIDE = "*[";
        public static final String A = "//a[";
        public static final String TD = "//td[";
        public static final String LABEL = "//label[";
        public static final String DIV_PLAIN = "div";
        public static final String SPAN_PLAIN = "span";
        public static final String BUTTON_PLAIN = "button";
        public static final String H2 = "//h2[";
        public static final String TBODY = "//tbody[";
    }

    public class XPathAttributes {

        private XPathAttributes() {}

        public static final String CLASS = "@class,'";
        public static final String CLASS_EQ = "@class='";
        public static final String TITLE = "@title,'";
        public static final String TITLE_EQ = "@title='";
        public static final String TYPE_EQ = "@type='";
        public static final String TEXT = "text(),'";
        public static final String TEXT_EQ = "text()='";
        public static final String DATA_ID_EQ = "@data-id='";

    }

    public class XPathOthers {

        private XPathOthers() {}

        public static final String CONTAINS = "contains(";
        public static final String OR = "' or ";
        public static final String AND = "' and ";
        public static final String AND_PARENTHENSIS = "') and ";
        public static final String CLOSE = "')]";
        public static final String CLOSE_SHORT = "']";
        public static final String OPEN_BRACKET = "[";
        public static final String CLOSE_BRACKET = "]";
        public static final String CLOSE_PARENTHESIS_AND = "') and ";
    }

    public class NetworkData {

        private NetworkData() {}

        private static final String RNC01_RBS = "ieatnetsimv6035-12_RNC01RBS";
        private static final String RNC02_RBS = "ieatnetsimv6035-12_RNC02RBS";
        public static final String NO_CHILDREN_FOUND = "No children found";
        public static final String SUB_NETWORK_1 = "RNC01";
        public static final String SUB_NETWORK_2 = "RNC02";
        public static final String SUB_NETWORK_3 = "Failure Cases";
        public static final String ALL_OTHER_NODES = "All other nodes";
        public static final String NODE_1 = RNC01_RBS + "03";
        public static final String NODE_2 = RNC01_RBS + "13";
        public static final String NODE_3 = RNC01_RBS + "14";
        public static final String NODE_4 = RNC01_RBS + "21";
        public static final String NODE_5 = RNC02_RBS + "02";
        public static final String NODE_6 = RNC02_RBS + "03";
        public static final String NODE_7 = RNC02_RBS + "09";
        public static final String NODE_8 = RNC02_RBS + "13";
        public static final String NODE_9 = RNC02_RBS + "16";
        public static final String NODE_10 = "RNC01MSRBS-V2259";
        public static final String NODE_11 = "LTE02ERBS00111";
        public static final String NODE_12 = "ieatnetsimv6035-12_M01";
        public static final String NODE_FORBIDDEN_READ = "Read: Forbidden Access";
        public static final String NODE_UNAUTHORIZED_READ = "Read: Unauthorized";
        public static final String NODE_DB_UNAVAILABLE_READ = "Read: Database Unavailable";
        public static final String NODE_EXCEPTION_READ = "Read: Exception";
        public static final String NODE_FORBIDDEN_UPDATE = "Update: Forbidden Access";
        public static final String NODE_UNAUTHORIZED_UPDATE = "Update: Unauthorized";
        public static final String NODE_DB_UNAVAILABLE_UPDATE = "Update: Database Unavailable";
        public static final String NODE_EXCEPTION_UPDATE = "Update: Exception";
        public static final String BITS_PARENT_NODE = "CORE59EPGOI001";
        public static final String BITS_NODE_1 = "ericsson-swim-1";
        public static final String BITS_NODE_2 = "ericsson-swm-2";
        public static final String BITS_NODE_3 = "ericsson_bits";
    }
}
