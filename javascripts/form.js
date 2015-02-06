console.log("\"dijit/form\" elements");

require(["dojo/parser",
         "dojo/on",
         "dojo/_base/array",
         "dojo/query",
         "dojo/io-query",
         "dojo/dom-class",
         "dijit/registry",
         "dijit/form/TextBox",
         "dijit/form/ValidationTextBox",
         "dijit/form/NumberTextBox",
         "dijit/form/CurrencyTextBox",
         "dijit/form/TimeTextBox",
		 "dijit/form/Textarea",
         "dijit/form/Button",
         "dijit/form/ToggleButton",
         "dijit/form/DropDownButton",
         "dijit/TooltipDialog",
         "dijit/layout/BorderContainer",
         "dijit/layout/ContentPane",
         "dijit/form/CheckBox",
         "dijit/form/RadioButton",
         "dijit/form/Select",
         "dijit/form/ComboBox",
         "dijit/form/MultiSelect",
         "dijit/form/ComboButton",
         "dijit/DropDownMenu",
         "dijit/MenuItem",
         "dijit/form/DateTextBox",
         "dijit/form/HorizontalSlider",
         "dijit/form/VerticalSlider",
         "dijit/form/HorizontalRule",
         "dijit/form/VerticalRule",
         "dijit/form/HorizontalRuleLabels",
         "dijit/form/VerticalRuleLabels",
         "dijit/form/NumberSpinner"],
function (parser, on, array, query, ioQuery, domClass, registry) {
    var _direction = "ltr";

    var uri = location.href;
    var query = uri.substring(uri.indexOf("?") + 1, uri.length);
    var queryObject = ioQuery.queryToObject(query);

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
        _initSliders();
        _initNumberSpinner();
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

        // Event handler to change button node colors
        array.forEach(registry.findWidgets(document.getElementById("bgButtons")), function (button) {
            button.on("click", function (e) {
                var colorType = this.colorType;
                _updateButtonColor(colorType);
            });
        });

        var _updateButtonColor = function (type) {
            console.log("Change button node background color to: " + type);
            if (!type) return;
            var className = "btn-alt ";
            switch (type) {
                case "blue":
                    className += "btn-primary";
                    break;
                case "green":
                    className += "btn-success";
                    break;
                case "light-blue":
                    className += "btn-info";
                    break;
                case "yellow":
                    className += "btn-warning";
                    break;
                case "red":
                    className += "btn-danger";
                    break;
                case "dark":
                    className += "btn-inverse";
                    break;
                default:
                    className = "";
            }

            var dijits = query(".dijit", "main-content");
            array.forEach(dijits, function (dijit) {
                if (dijit.__typeClassName)
                    domClass.remove(dijit, dijit.__typeClassName);
                domClass.add(dijit, className);
                dijit.__typeClassName = className;
            });

        };

        // Event handler to disable all dijits
        registry.byId("disableCheckbox").on("change", function (checked) {
            var allDijits = registry.findWidgets(document.getElementById("main-content"));
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
    };

    function _initSliders() {
        //programmatically create horizontal sliders
        new dijit.form.HorizontalSlider({
            name: "default horizontal slider",
            value: 5,
            minimum: -10,
            maximum: 10,
            intermediateChanges: true,
            showButtons: false,
            dir: _direction
        }, "horizontalSlider");

        var sliderRulesH = new dijit.form.HorizontalRule({
            count: 11,
            style: { height: "5px" }
        });

        var sliderRuleLabelsH = new dijit.form.HorizontalRuleLabels({
            labels: ["low", "mid", "high"]
        });

        var horizontalSliderAdvanced = new dijit.form.HorizontalSlider({
            name: "default horizontal slider",
            value: 5,
            minimum: -10,
            maximum: 10,
            intermediateChanges: true,
            discreteValues: 11,
            dir: _direction
        }, "horizontalSliderAdvanced");

        sliderRulesH.placeAt(horizontalSliderAdvanced.containerNode);
        sliderRuleLabelsH.placeAt(horizontalSliderAdvanced.containerNode);

        //programmatically create vertical sliders
        new dijit.form.VerticalSlider({
            name: "default vertical slider",
            value: 5,
            minimum: -10,
            maximum: 10,
            intermediateChanges: true,
            style: "height:240px",
            showButtons: false,
            dir: _direction
        }, "verticalSlider");

        var sliderRulesV = new dijit.form.VerticalRule({
            count: 11,
            style: { width: "5px" }
        });

        var sliderRuleLabelsV = new dijit.form.VerticalRuleLabels({
            labels: ["low", "mid", "high"]
        });

        var verticalSliderAdvanced = new dijit.form.VerticalSlider({
            name: "default vertical slider",
            value: 5,
            minimum: -10,
            maximum: 10,
            intermediateChanges: true,
            discreteValues: 11,
            style: "height:240px;",
            dir: _direction
        }, "verticalSliderAdvanced");

        sliderRulesV.placeAt(verticalSliderAdvanced.containerNode);
        sliderRuleLabelsV.placeAt(verticalSliderAdvanced.containerNode);
    };

    function _initNumberSpinner() {
        new dijit.form.NumberSpinner({
            value: 1000,
            smallDelta: 10,
            constraints: { min: 9, max: 1550, places: 0 }
        }, "numberSpinner");
    };

});