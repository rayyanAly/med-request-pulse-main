<?php


define("STAGING_SERVER_URL", "https://staging.800pharmacy.ae/api/1.0/?c=");
define("PARTNER_ID", "296ea244-a25c-11ea-a0b9-acde48001122");
define("PARTNER_SECRET_CODE", "147ce0fc-a25d-11ea-a0b9-acde48001122");

define("OBJECT_FORMAT", "object");
define("JSON_FORMAT", "json");
define("XML_FORMAT", "xml");

// API End Points
define("CUSTOMERS", "customers");
define("REGISTER", "customers&m=register");
define("LOGIN", "customers&m=login");
define("GET_PROFILE", "customers&m=profiles?id=");
define("FORGOT", "customers&m=forgot");
define("LOG_OUT", "customers&m=logout");

define("CATEGORIES", "categories");
define("BROWSE_CATEGORIES", "categories&parent=");
define("CATEGORY_PRODUCTS", "products&category=");
define("PRODUCT_DETAIL", "products&id=");

define("ORDERS", "orders");
define("CREATE_ORDER", "orders&m=create");

define("AREAS", "address&m=areas");

define("BROWSE_BY_SYMPTONS", '1');
define("BROWSE_BY_CATEGORY", '198');



?>