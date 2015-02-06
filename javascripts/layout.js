console.log("\"dijit/layout\" elements");

require(["dojo/parser",
         "dojo/on",
         "dojo/_base/array",
         "dojo/query",
         "dojo/io-query",
         "dojo/dom-class",
         "dijit/registry",
         "dijit/form/CheckBox",
         "dijit/layout/BorderContainer",
         "dijit/layout/ContentPane",
         "dijit/layout/TabContainer",
         "dijit/layout/AccordionContainer"],
function (parser, on, array, query, ioQuery, domClass, registry) {

    var _direction = "ltr";

    var uri = location.href;
    var queryString = uri.substring(uri.indexOf("?") + 1, uri.length);
    var queryObject = ioQuery.queryToObject(queryString);

    if (queryObject.dir && queryObject.dir === "rtl") {
        document.body.dir = "rtl";
        _direction = "rtl";
    }

    parser.parse().then(function () {
        if (_direction === "rtl") {
            registry.byId("rtlCheckbox").set("checked", true);
        }

        _attachEventHanlders();
        domClass.remove("content-wrapper", "loading");
    });

    (function () {
       
    })();

    function _attachEventHanlders() {
        on(window, "scroll", function (e) {
            var distanceY = window.pageYOffset || document.documentElement.scrollTop,
                shrinkOn = 80,
                targetNode = document.body;
            if (distanceY > shrinkOn) {
                domClass.add(targetNode, "away-from-top");
            } else {
                if (domClass.contains(targetNode, "away-from-top")) {
                    domClass.remove(targetNode, "away-from-top");
                }
            }
        });

        // Event handler to disable all dijits
        registry.byId("disableCheckbox").on("change", function (checked) {
            var allDijits = dojo.query("[widgetid]", "main-content").map(dijit.byNode).filter(function (wid) { return wid; }); // find all widgets including nested ones
            array.forEach(allDijits, function (dijit) {
                dijit.set("disabled", checked);
            });
        });

        // Event handler to switch to TRL mode
        registry.byId("rtlCheckbox").on("change", function (checked) {
            var uri = window.location.href,
                    uriHash = window.location.hash;
            if (uriHash)
                uri = uri.substring(0, uri.indexOf(uriHash));

            if (checked) {
                if (_direction === "rtl") return;
                window.location.href = uri + "?dir=rtl"
            } else {
                window.location.href = uri.substring(0, uri.indexOf("?"));
            }
        });
    }
});