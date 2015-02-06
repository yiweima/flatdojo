console.log("\"esri/\" elements");

require(["dojo/parser",
         "dojo/on",
         "dojo/_base/array",
         "dojo/query",
         "dojo/io-query",
         "dojo/dom-class",
         "dijit/registry",

	    "esri/dijit/InfoWindow",
        "esri/InfoTemplate",
        "esri/dijit/Popup",
		"esri/map",
		"esri/layers/FeatureLayer",
        "esri/layers/GraphicsLayer",
		"esri/tasks/query",
		"esri/tasks/geometry",
		"esri/tasks/identify",
        "esri/dijit/Geocoder",
		"esri/dijit/Scalebar",
        "esri/dijit/BasemapGallery",
		"esri/dijit/Legend",
		"esri/dijit/OverviewMap",
		"esri/dijit/Bookmarks",
		"esri/dijit/Measurement"],
function (parser, on, array, query, ioQuery, domClass, registry) {

    var _direction = "ltr";
    var map1, map2;


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
        _initMap1();
        _initMap2();
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

        //// Event handler to disable all dijits
        //registry.byId("disableCheckbox").on("change", function (checked) {
        //    var allDijits = registry.findWidgets(document.getElementById("main-content"));
        //    array.forEach(allDijits, function (dijit) {
        //        dijit.set("disabled", checked);
        //    });
        //});

        //// Event handler to switch to TRL mode
        //registry.byId("rtlCheckbox").on("change", function (checked) {
        //    var uri = window.location.href,
            //uriHash = window.location.hash;
            //if (uriHash)
            //    uri = uri.substring(0, uri.indexOf(uriHash));

            //if (checked) {
            //    if (_direction === "rtl") return;
            //    window.location.href = uri + "?dir=rtl"
            //} else {
            //    window.location.href = uri.substring(0, uri.indexOf("?"));
            //}
        //});
    }

    function _initMap1() {
        map1 = new esri.Map("mapNode1", {
            basemap: "topo",
            center: [-99.557, 39.712],
            zoom: 4
        });

        var map1GraphicLayer = new esri.layers.GraphicsLayer();
        map1.addLayer(map1GraphicLayer);

        //map1.on("click", function () {
        //    map1.infoWindow.hide();
        //});

        map1.on("load", function () {
            var scalebar = new esri.dijit.Scalebar({
                map: map1,
                scalebarUnit: "dual", // ["english", "metric", "dual"]
                attachTo: "bottom-left"
            });

            var infoTemplate = new esri.InfoTemplate();
            infoTemplate.setTitle("infoWindow widget");

            var symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 12,
                new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                new dojo.Color([210, 105, 30, 0.5]), 8),
                new dojo.Color([210, 105, 30, 0.9])
            );
            var point = new esri.geometry.Point({ "x": -117.197, "y": 34.057, " spatialReference": { " wkid": 4326 } });
            var graphic = new esri.Graphic(point, symbol);
            graphic.setAttributes({ "XCoord": "1", "YCoord": "2", "Plant": "Mesa Mint" });
            graphic.setInfoTemplate(infoTemplate);
            map1GraphicLayer.add(graphic);

            //basemap gallery
            _initBasemapGallery(map1);
        });


    };

    function _initMap2() {
        /* map 2 */
        var popup = new esri.dijit.Popup({
            anchor: "left", //"right", "bottom", "top", "bottom-left", "bottom-right", "top-left", "top-right"
        }, document.createElement("div"));

        map2 = new esri.Map("mapNode2", {
            basemap: "topo",
            center: [-99.557, 39.712],
            zoom: 3,
            sliderPosition: "top-left",
            sliderStyle: "large",
            //sliderOrientation: "horizontal",
            infoWindow: popup
        });

        var template = new esri.InfoTemplate();
        template.setTitle("<b>${NAME}</b>");

        var sampleLayer1 = new esri.layers.FeatureLayer("http://server.arcgisonline.com/ArcGIS/rest/services/Demographics/USA_Median_Household_Income/MapServer/4", {
            infoTemplate: template,
            outFields: ["NAME","ST_ABBREV", "LANDAREA"]
        });
        map2.addLayer(sampleLayer1);

        map2.on("load", function () {
            _initLegend(this);
            _initGeoCoder(this);
            _initOverview(this);
            _initMeasurement(this);
            _initBookmarks(this);
        });

    };

    function _initBasemapGallery(map) {
        //var basemaps = [];
        //var imageryLayer = new esri.dijit.BasemapLayer({
        //    url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
        //});
        //var imageryBasemap = new esri.dijit.Basemap({
        //    layers: [imageryLayer],
        //    title: "Imagery",
        //    id: "basemap1",
        //    thumbnailUrl: "img/basemaps/imagery.png"
        //});
        //basemaps.push(imageryBasemap);
        //var topoLayer = new esri.dijit.BasemapLayer({
        //    url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"
        //});
        //var topoBasemap = new esri.dijit.Basemap({
        //    layers: [topoLayer],
        //    title: "Topo",
        //    id:"basemap2",
        //    thumbnailUrl: "img/basemaps/topographic.jpg"
        //});
        //basemaps.push(topoBasemap);

        var basemapGallery = new esri.dijit.BasemapGallery({
            id: "basemapGallery",
            "class": "simple",
            //basemaps: basemaps,
            //showArcGISBasemaps: false,
            map: map,
            onSelectionChange: function () {
                var selectedBasemap = this.getSelected();
                if (selectedBasemap.id == "basemap1") {
                    domClass.add(map.container, "dark");
                }
                else {
                    domClass.remove(map.container, "dark");
                }
            }
        }, "basemapGallery");

        basemapGallery.startup();

        basemapGallery.select("basemap2");
    };

    function _initLegend(map) {
        var legend = new esri.dijit.Legend({
            map: map,
        }, "legendNode");
        legend.startup();
    };

    function _initGeoCoder(map) {
        var geocoders = [
            {
                url: "http://tasks.arcgisonline.com/ArcGIS/rest/services/Locators/TA_Address_EU/GeocodeServer",
                name: "Sample Geocoder (EU Geocoder)"
            }
        ];

        var geocoder = new esri.dijit.Geocoder({
            map: map,
            theme: "arcgisGeocoder", // ["simpleGeocoder", "arcgisGeocoder"]
            geocoders: geocoders,
            arcgisGeocoder: true,
            autoComplete: true
        }, "geocoder");
        geocoder.startup();
    };

    function _initOverview(map) {
        var overviewMapDijit = new esri.dijit.OverviewMap({
            map: map,
            attachTo: "top-right",
            visible: true,
            maximizeButton: true
        });
        overviewMapDijit.startup();
    };

    function _initMeasurement(map) {
        var bookmark = new esri.dijit.Bookmarks({
            map: map,
            bookmarks: [],
            editable: true
        }, "bookmarksNode");

        // Add bookmarks to the widget
        var bookmarkCA = {
            "extent": {
                "spatialReference": {
                    "wkid": 102100
                },
                "xmin": -14201669,
                "ymin": 4642975,
                "xmax": -13021482,
                "ymax": 5278931
            },
            "name": "Northern California"
        }
        var bookmarkPA = {
            "extent": {
                "spatialReference": {
                    "wkid": 102100
                },
                "xmin": -8669334,
                "ymin": 4982379,
                "xmax": -8664724,
                "ymax": 4984864
            },
            "name": "Central Pennsylvania"
        }
        bookmark.addBookmark(bookmarkCA);
        bookmark.addBookmark(bookmarkPA);

        // Fix auto focus 
        window.scrollTo(0, 0);
    };

    function _initBookmarks(map) {
        var measurement = new esri.dijit.Measurement({
            map: map,
            style: "width: 300px"
        }, "measurementNode");
        measurement.startup();
    };
});