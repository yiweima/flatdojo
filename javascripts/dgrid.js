console.log("\"dgrid/\" elements");

require(["dojo/_base/declare",
         "dojo/_base/array",
         "dojo/parser",
         "dojo/on",
         "dojo/io-query",
         "dojo/dom-class",
         "dijit/registry",
         "dojo/_base/lang",
         "dijit/form/Button",
         "dijit/form/ToggleButton",
         "dgrid/Grid",
         "dgrid/OnDemandList",
         "dgrid/OnDemandGrid",
         "dgrid/tree",
         "dgrid/Keyboard",
         "dgrid/Selection",
         "dgrid/editor",
         "dgrid/extensions/ColumnHider",
         "dgrid/extensions/ColumnResizer",
         "dgrid/extensions/ColumnReorder",
         "dgrid/extensions/Pagination",
         "dijit/form/DateTextBox",
         "dijit/form/HorizontalSlider",
         "dijit/form/NumberSpinner",
         "dojo/store/Memory",
         "dojo/store/Observable"
],
function (declare, array, parser, on, ioQuery, domClass, registry, lang,
          Button, ToggleButton,
          Grid, OnDemandList, OnDemandGrid, tree, Keyboard, Selection, editor,
          ColumnHider, ColumnResizer, ColumnReorder, Pagination,
          DateTextBox, HorizontalSlider, NumberSpinner,
          Memory, Observable) {

    var _direction = "ltr", simpleGrid = null, extendedGrid = null, treeGrid = null,
        testTypesStore = null,
        emptyStore = null;

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
        _initSimpleGrid();
        _initExtendedGrid();
        _initTreeGrid();
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

        on(registry.byId("showRowsPerPageBtn"), "change", _showRowsPerPageDropdown);
        on(registry.byId("setToStoreBtn"), "click", _setStore);
        on(registry.byId("setToEmptyStoreBtn"), "click", _setEmptyStore);
    };

    function _initSimpleGrid() {

        /* Sample code from http://dgrid.io/js/dgrid/test/simple_grid.html */

        var columns = {
            order: "step", // give column a custom name
            name: {},
            description: { label: "what to do", sortable: false }
        };

        var data = [
					{ order: 1, name: "preheat", description: "Preheat your oven to 350F" },
					{ order: 2, name: "mix dry", description: "In a medium bowl, combine flour, salt, and baking soda" },
					{ order: 3, name: "mix butter", description: "In a large bowl, beat butter, then add the brown sugar and white sugar then mix" },
					{ order: 4, name: "mix together", description: "Slowly add the dry ingredients from the medium bowl to the wet ingredients in the large bowl, mixing until the dry ingredients are totally combined" },
					{ order: 5, name: "chocolate chips", description: "Add chocolate chips" },
					{ order: 6, name: "make balls", description: "Scoop up a golf ball size amount of dough with a spoon and drop in onto a cookie sheet" },
					{ order: 7, name: "bake", description: "Put the cookies in the oven and bake for about 10-14 minutes" },
					{ order: 8, name: "remove", description: "Using a spatula, lift cookies off onto wax paper or a cooling rack" },
					{ order: 9, name: "eat", description: "Eat and enjoy!" }
        ];

        simpleGrid = new Grid({
            columns: columns
        }, "simpleGrid");
        simpleGrid.renderArray(data);
    };

    function _initExtendedGrid() {
        var CustomGrid = declare([OnDemandGrid, Selection, ColumnHider, ColumnResizer, ColumnReorder, Keyboard, Pagination]);
        var columns = [
            editor({ label: 'Number', field: 'floatNum' }, HorizontalSlider),
            editor({ label: 'Integer', field: 'integer', editorArgs: { style: 'width: 5em;' } }, NumberSpinner),
            editor({ label: 'Date', field: 'date' }, DateTextBox, "focus")
        ];

        var typesData = [];
        for (var i = 0; i < 25; i++) {
            typesData.push({
                id: i,
                integer: Math.floor(Math.random() * 100),
                floatNum: Math.random() * 100,
                date: new Date(new Date().getTime() * Math.random() * 2)
            });
        }
        testTypesStore = Observable(new Memory({ data: typesData }));
        emptyStore = Observable(new Memory({ data: [] }));

        extendedGrid = new CustomGrid({
            sort: "id",
            store: testTypesStore,
            columns: columns,
            selectionMode: "single",
            rowsPerPage: 5,
            noDataMessage: "No data.",
            loadingMessage: "Loading..."
        }, "extendedGrid");

    };

    function _initTreeGrid() {

        /* Sample code from http://dgrid.io/js/dgrid/test/Tree.html */

        var testCountryData = [
		{
		    id: 'AF', name: 'Africa', type: 'continent', population: '900 million', area: '30,221,532 sq km',
		    timezone: '-1 UTC to +4 UTC'
		},
			{ id: 'EG', name: 'Egypt', type: 'country', parent: 'AF' },
				{ id: 'Cairo', name: 'Cairo', type: 'city', parent: 'EG' },
			{ id: 'KE', name: 'Kenya', type: 'country', parent: 'AF' },
				{ id: 'Nairobi', name: 'Nairobi', type: 'city', parent: 'KE' },
				{ id: 'Mombasa', name: 'Mombasa', type: 'city', parent: 'KE' },
			{ id: 'SD', name: 'Sudan', type: 'country', parent: 'AF' },
				{ id: 'Khartoum', name: 'Khartoum', type: 'city', parent: 'SD' },
			{ id: 'AS', name: 'Asia', type: 'continent', population: '3.2 billion' },
				{ id: 'CN', name: 'China', type: 'country', parent: 'AS' },
					{ id: 'Shanghai', name: 'Shanghai', type: 'city', parent: 'CN' },
				{ id: 'IN', name: 'India', type: 'country', parent: 'AS' },
					{ id: 'Calcutta', name: 'Calcutta', type: 'city', parent: 'IN' },
				{ id: 'RU', name: 'Russia', type: 'country', parent: 'AS' },
					{ id: 'Moscow', name: 'Moscow', type: 'city', parent: 'RU' },
				{ id: 'MN', name: 'Mongolia', type: 'country', parent: 'AS' },
					{ id: 'UlanBator', name: 'Ulan Bator', type: 'city', parent: 'MN' },
			{ id: 'OC', name: 'Oceania', type: 'continent', population: '21 million' },
			{ id: 'AU', name: 'Australia', type: 'country', population: '21 million', parent: 'OC' },
				{ id: 'Sydney', name: 'Sydney', type: 'city', parent: 'AU' },
			{ id: 'EU', name: 'Europe', type: 'continent', population: '774 million' },
			{ id: 'DE', name: 'Germany', type: 'country', parent: 'EU' },
				{ id: 'Berlin', name: 'Berlin', type: 'city', parent: 'DE' },
			{ id: 'FR', name: 'France', type: 'country', parent: 'EU' },
				{ id: 'Paris', name: 'Paris', type: 'city', parent: 'FR' },
			{ id: 'ES', name: 'Spain', type: 'country', parent: 'EU' },
				{ id: 'Madrid', name: 'Madrid', type: 'city', parent: 'ES' },
			{ id: 'IT', name: 'Italy', type: 'country', parent: 'EU' },
				{ id: 'Rome', name: 'Rome', type: 'city', parent: 'IT' },
		{ id: 'NA', name: 'North America', type: 'continent', population: '575 million' },
			{ id: 'MX', name: 'Mexico', type: 'country', population: '108 million', area: '1,972,550 sq km', parent: 'NA' },
				{ id: 'Mexico City', name: 'Mexico City', type: 'city', population: '19 million', timezone: '-6 UTC', parent: 'MX' },
				{ id: 'Guadalajara', name: 'Guadalajara', type: 'city', population: '4 million', timezone: '-6 UTC', parent: 'MX' },
			{ id: 'CA', name: 'Canada', type: 'country', population: '33 million', area: '9,984,670 sq km', parent: 'NA' },
				{ id: 'Ottawa', name: 'Ottawa', type: 'city', population: '0.9 million', timezone: '-5 UTC', parent: 'CA' },
				{ id: 'Toronto', name: 'Toronto', type: 'city', population: '2.5 million', timezone: '-5 UTC', parent: 'CA' },
			{ id: 'US', name: 'United States of America', type: 'country', parent: 'NA' },
				{ id: 'New York', name: 'New York', type: 'city', parent: 'US' },
		{ id: 'SA', name: 'South America', type: 'continent', population: '445 million' },
			{ id: 'BR', name: 'Brazil', type: 'country', population: '186 million', parent: 'SA' },
				{ id: 'Brasilia', name: 'Brasilia', type: 'city', parent: 'BR' },
			{ id: 'AR', name: 'Argentina', type: 'country', population: '40 million', parent: 'SA' },
				{ id: 'BuenosAires', name: 'Buenos Aires', type: 'city', parent: 'AR' }
        ];

        var testCountryStore = Observable(new Memory({
            data: testCountryData,
            getChildren: function (parent, options) {
                return this.query({ parent: parent.id }, options);
            },
            mayHaveChildren: function (parent) {
                return parent.type != "city";
            },

        }));

        var columns = [
            tree({ label: "Name", field: "name", sortable: false }),
			editor({ label: "Visited", field: "bool", sortable: false }, "checkbox"),
			{ label: "Type", field: "type", sortable: false },
			{ label: "Population", field: "population" },
			{ label: "Timezone", field: "timezone" }
        ];

        var TreeGrid = declare([OnDemandGrid, Keyboard, Selection, ColumnResizer]);

        treeGrid = new TreeGrid({
            store: testCountryStore,
            query: { type: "continent" },
            selectionMode: "none",
            allowSelectAll: true,
            columns: columns
        }, "treeGrid");
    };

    function _showRowsPerPageDropdown(checked) {
        if (!extendedGrid) return;
        if (checked) {
            extendedGrid.set({
                pagingLinks: false,
                pagingTextBox: true,
                firstLastArrows: true,
                pageSizeOptions: [5, 10, 15, 20]
            });
        } else {
            extendedGrid.set({
                pagingLinks: true,
                pagingTextBox: false,
                firstLastArrows: false,
                pageSizeOptions: null
            });
        }
        extendedGrid.refresh();
    };

    function _setStore() {
        if (!extendedGrid) return;

        extendedGrid.set("store", testTypesStore);
    };

    function _setEmptyStore() {
        if (!extendedGrid) return;

        extendedGrid.set("store", emptyStore);
    }

});