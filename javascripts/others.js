console.log("\"dijit/\" elements");

require(["dojo/parser",
         "dojo/on",
         "dojo/_base/array",
         "dojo/query",
         "dojo/io-query",
         "dojo/dom-class",
         "dijit/registry",

         "dojo/aspect",
         "dojo/dnd/Source",

         "dijit/form/CheckBox",
         "dijit/ProgressBar",
         "dijit/Dialog",
         "dijit/TooltipDialog",
         "dijit/Tooltip",
         "dijit/form/DropDownButton",
         "dijit/form/TextBox",
         "dijit/form/Button",
         "dijit/Menu",
         "dijit/MenuBar",
         "dijit/MenuBarItem",
         "dijit/MenuSeparator",
         "dijit/PopupMenuItem",
         "dijit/PopupMenuBarItem",
         "dijit/DropDownMenu",
         "dijit/MenuItem",
         "dijit/CheckedMenuItem",
         "dijit/ColorPalette",
         "dijit/TitlePane",
         "dijit/Tree",
         "dijit/tree/ObjectStoreModel",
         "dijit/tree/dndSource",
         "dojo/store/Memory",
         "dijit/InlineEditBox",
         "dijit/form/NumberTextBox",
         "dijit/Editor",
         "dijit/_editor/_Plugin",
         "dijit/_editor/plugins/AlwaysShowToolbar",
         "dijit/_editor/plugins/FontChoice",  // 'fontName','fontSize','formatBlock'
         "dijit/_editor/plugins/TextColor",
         "dijit/_editor/plugins/LinkDialog",
         "dijit/_editor/plugins/FullScreen",
         "dijit/_editor/plugins/ViewSource",
         "dijit/_editor/plugins/NewPage",
         "dijit/_editor/plugins/Print",
         "dijit/_editor/plugins/TabIndent",
         "dijit/_editor/plugins/ToggleDir"],
function (parser, on, array, query, ioQuery, domClass, registry, aspect, Source) {

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
        _initMenuBar();
        _initTooltipDialogs();
        _initTooltips();
        _initTree();
        _initEditBox();
        _initInlineEditBox();
        _initDnD();
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
    }

    function _initMenuBar() {
        var pMenuBar = new dijit.MenuBar({});

        var pSubMenu = new dijit.DropDownMenu({});
        pSubMenu.addChild(new dijit.CheckedMenuItem({
            label: "Checked menu item 1"
        }));
        pSubMenu.addChild(new dijit.CheckedMenuItem({
            label: "Checked menu item 2"
        }));
        pMenuBar.addChild(new dijit.PopupMenuBarItem({
            label: "File",
            popup: pSubMenu
        }));

        var pSubMenu2 = new dijit.DropDownMenu({});
        pSubMenu2.addChild(new dijit.MenuItem({
            label: "Cut",
            iconClass: "dijitEditorIcon dijitEditorIconCut"
        }));
        pSubMenu2.addChild(new dijit.MenuItem({
            label: "Copy",
            iconClass: "dijitEditorIcon dijitEditorIconCopy",
            disabled: true
        }));
        pSubMenu2.addChild(new dijit.MenuItem({
            label: "Paste",
            iconClass: "dijitEditorIcon dijitEditorIconPaste"
        }));
        pSubMenu2.addChild(new dijit.MenuSeparator());


        var pSubMenu3 = new dijit.Menu();
        pSubMenu3.addChild(new dijit.MenuItem({
            label: "Submenu item"
        }));
        pSubMenu3.addChild(new dijit.MenuItem({
            label: "Submenu item"
        }));
        pSubMenu2.addChild(new dijit.PopupMenuItem({
            label: "More...",
            popup: pSubMenu3
        }));

        pMenuBar.addChild(new dijit.PopupMenuBarItem({
            label: "Edit",
            popup: pSubMenu2
        }));

        pMenuBar.addChild(new dijit.MenuBarItem({
            label: "Info"
        }));

        pMenuBar.placeAt("menuBar");
        pMenuBar.startup();

    };

    function _initTooltipDialogs() {
        var myDialog = new dijit.Dialog({
            title: "My Dialog",
            content: "Test content.",
            style: "width: 300px"
        });

        var tooltipDialog1 = new dijit.TooltipDialog({
            content: '<form data-dojo-type="dijit/form/Form"><br/>This tooltip dialog has an action bar.<br/><br/>' +
                                '<div class="dijitDialogPaneActionBar">' +
                                '<button data-dojo-type="dijit/form/Button" type="reset">Reset</button>' +
                                '<button data-dojo-type="dijit/form/Button" type="submit" class="btn-alt btn-success">Login</button></div></form>'
        });
        registry.byId("tooltipdialogButton1").set("dropDown", tooltipDialog1);

        var tooltipDialog2 = new dijit.TooltipDialog({
            content: '<span><br/>This is the content.<br/><br/></span>'
        });

        registry.byId("tooltipdialogButton2").set("dropDown", tooltipDialog2);

        var tooltipDialog3 = new dijit.TooltipDialog({
            content: '<form data-dojo-type="dijit/form/Form"><br/>This tooltip dialog has an action bar.<br/><br/>' +
                                '<div class="dijitDialogPaneActionBar">' +
                                '<button data-dojo-type="dijit/form/Button" type="reset">Reset</button>' +
                                '<button data-dojo-type="dijit/form/Button" type="submit" class="btn-alt btn-success">Login</button></div></form>'
        });

        registry.byId("tooltipdialogButton3").set("dropDown", tooltipDialog3);

        var tooltipDialog4 = new dijit.TooltipDialog({
            content: '<span><br/>This is the content.<br/><br/></span>'
        });

        registry.byId("tooltipdialogButton4").set("dropDown", tooltipDialog4);

    };

    function _initTooltips() {
        new dijit.Tooltip({
            connectId: "tooltipAbove",
            label: "tooltip: above",
            position: ['above']
        });
        new dijit.Tooltip({
            connectId: "tooltipAboveCentered",
            label: "tooltip: above centered",
            position: ['above-centered']
        });
        new dijit.Tooltip({
            connectId: "tooltipBelow",
            label: "tooltip: below",
            position: ['below']
        });
        new dijit.Tooltip({
            connectId: "tooltipBelowCentered",
            label: "tooltip: below centered",
            position: ['below-centered']
        });
        new dijit.Tooltip({
            connectId: "tooltipBefore",
            label: "tooltip: before",
            position: ['before']
        });
        new dijit.Tooltip({
            connectId: "tooltipAfter",
            label: "tooltip: after",
            position: ['after']
        });
    };

    function _initTree() {
        // Sample code from: http://dojotoolkit.org/reference-guide/1.10/dijit/Tree.html
        // Create test store, adding the getChildren() method required by ObjectStoreModel
        var treeStore = new dojo.store.Memory({
            data: [
                { id: 'world', name: 'The earth', type: 'planet', population: '6 billion' },
                {
                    id: 'AF', name: 'Africa', type: 'continent', population: '900 million', area: '30,221,532 sq km',
                    timezone: '-1 UTC to +4 UTC', parent: 'world'
                },
                    { id: 'EG', name: 'Egypt', type: 'country', parent: 'AF' },
                    { id: 'KE', name: 'Kenya', type: 'country', parent: 'AF' },
                        { id: 'Nairobi', name: 'Nairobi', type: 'city', parent: 'KE' },
                        { id: 'Mombasa', name: 'Mombasa', type: 'city', parent: 'KE' },
                    { id: 'SD', name: 'Sudan', type: 'country', parent: 'AF' },
                        { id: 'Khartoum', name: 'Khartoum', type: 'city', parent: 'SD' },
                { id: 'AS', name: 'Asia', type: 'continent', parent: 'world' },
                    { id: 'CN', name: 'China', type: 'country', parent: 'AS' },
                    { id: 'IN', name: 'India', type: 'country', parent: 'AS' },
                    { id: 'RU', name: 'Russia', type: 'country', parent: 'AS' },
                    { id: 'MN', name: 'Mongolia', type: 'country', parent: 'AS' },
                { id: 'OC', name: 'Oceania', type: 'continent', population: '21 million', parent: 'world' },
                { id: 'EU', name: 'Europe', type: 'continent', parent: 'world' },
                    { id: 'DE', name: 'Germany', type: 'country', parent: 'EU' },
                    { id: 'FR', name: 'France', type: 'country', parent: 'EU' },
                    { id: 'ES', name: 'Spain', type: 'country', parent: 'EU' },
                    { id: 'IT', name: 'Italy', type: 'country', parent: 'EU' },
                { id: 'NA', name: 'North America', type: 'continent', parent: 'world' },
                { id: 'SA', name: 'South America', type: 'continent', parent: 'world' }
            ],
            getChildren: function (object) {
                return this.query({ parent: object.id });
            }
        });

        aspect.around(treeStore, "put", function (originalPut) {
            // To support DnD, the store must support put(child, {parent: parent}).
            // Since memory store doesn't, we hack it.
            // Since our store is relational, that just amounts to setting child.parent
            // to the parent's id.
            return function (obj, options) {
                if (options && options.parent) {
                    obj.parent = options.parent.id;
                }
                return originalPut.call(treeStore, obj, options);
            }
        });

        // Create the model
        var treeModel = new dijit.tree.ObjectStoreModel({
            store: treeStore,
            query: { id: 'world' }
        });

        // Create the Tree.
        var tree = new dijit.Tree({
            model: treeModel,
            dndController: dijit.tree.dndSource,
        }, "treeNode");
        tree.startup();
    };

    function _initEditBox() {
        var myEditor = new dijit.Editor({
            height: '300px',
            //extraPlugins: [dijit._editor.plugins.AlwaysShowToolbar],
            plugins: ['undo', 'redo', '|', 'cut', 'copy', 'paste', 'selectAll', 'delete', '|',
                      'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'removeFormat', '|',
                      'insertOrderedList', 'insertUnorderedList', 'indent', 'outdent', 'justifyLeft', 'justifyRight', 'justifyCenter', 'justifyFull', '|',
                      'insertHorizontalRule', 'insertImage', 'createLink', 'unlink', 'foreColor', 'hiliteColor', '|',
                      'fontSize', 'formatBlock', 'viewSource', '|', 'newpage', 'fullscreen', 'print', 'tabIndent', 'toggleDir']
            //,
            //dir: "rtl"
            //disabled: true
        }, "editorNode");
        myEditor.startup();
    };

    function _initInlineEditBox() {
        new dijit.InlineEditBox({
            editor: dijit.form.NumberTextBox,
            autoSave: false
        }, "InlineEditBoxNode").startup();
    };
                
    function _initDnD() {
        var dndList = new Source("DnDList", {});
		            
        dndList.insertNodes(false, [
            "Wrist watch",
            "Life jacket",
            "Toy bulldozer",
            "Vintage microphone",
            "TIE fighter"
        ]);
    };

});