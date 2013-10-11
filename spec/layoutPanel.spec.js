global.window = require("jsdom")
                .jsdom()
                .createWindow();
global.document = global.window.document;
global.navigator = global.window.navigator;
global.self = global.window;
global.jQuery = require("jquery");
global.$ = global.jQuery;
global.PMUI = require('../src/pmui.js');
global.alert = function() {};

require("../libraries/jquery.layout/jquery.layout.js");
var ArrayList = require('../src/util/ArrayList.js'),
    //Utils = require('../src/ui/utils.js'),
    Factory = require("../src/util/Factory.js");
    Style = require('../src/util/Style.js'),
    Base = require('../src/core/Base.js'),
    Element = require('../src/core/Element.js'),
    Container = require('../src/core/Container.js'),
    Panel = require("../src/core/Panel.js"),
    Layout = require('../src/layout/Layout.js'),
    HBox = require('../src/layout/HBox.js'),
    VBox = require('../src/layout/VBox.js'),
    Box = require('../src/layout/Box.js'),
    LayoutFactory = require('../src/layout/LayoutFactory.js'),
    LayoutPanel = require ("../src/panel/LayoutPanel.js");
    TreePanel = require("../src/panel/TreePanel.js");

var layout;
describe('Behavior Layout class', function(){

    it("[US-1,a] Should be able create a simple layout", function(){
        //Should create a center panel by default
        layout = new PMUI.panel.LayoutPanel();

        expect(layout).toBeDefined();
        expect(layout.type).toEqual('LayoutPanel');
        expect(layout.center instanceof PMUI.core.Panel).toBeTruthy();
        //expect(jQuery(layout.center.html).length).not.toEqual(0);
        
    });

    // it("[US-1,b] Should be able to destroy a layout", function() {
    //     layout.destroy();
    //     //expect(layout.instance).toEqual(null);
    //     expect(layout.id).toEqual(null);
    // });

    it ("[US-1,c] Should can create layouts in the north, south, west, east", function(){

        layout2 = new PMUI.panel.LayoutPanel({
            north: {
                id: "north"
            },
            south: {
                id: "south"
            },
            west: {
                id: "west"
            },
            east: {
                id: "east"
            }
        });
        expect(layout2.getItems().length).toEqual(5);
        //Verifying the object panels Center, north, south, west and east
        expect(layout2.center).toBeDefined();
        expect(layout2.north).toBeDefined();
        expect(layout2.south).toBeDefined();
        expect(layout2.west).toBeDefined();
        expect(layout2.east).toBeDefined();

    });

    it ("[US-1,d] Should can assign options (settings) to different panels (c, n, s, w & e)", function(){
        var i,
            totalItems = 0;

        //layout.destroy();
        layout = new PMUI.panel.LayoutPanel({
            north: {
                id: "north",
                size: 100,
                cssProperties: {
                    "backgroun-color": "red"
                },
                cssClasses: [
                    "cssClass-test"
                ]
            },
            south: {
                id: "south",
                size: 100
            },
            west: {
                id: "west",
                size: 200
            },
            east: {
                id: "east",
                closed:  true
            }
        });

        expect(layout.getItems().length).toEqual(5);
        panels = layout.getItems();
        for (i = 0; i < panels.length; i+=1) {
            if ( panels[i] instanceof  PMUI.core.Panel ) {
                expect(panels[i].html).toBeDefined();
                expect(panels[i].style).toBeDefined();
                totalItems+=1;
            }
        }
        expect(panels.length).toEqual(totalItems);
        //expect(typeof layout.instance).toEqual("object");

    });
});

describe("Verifying methods related to Layout class", function() {
    var layout3;
    beforeEach(function() {
        document.body.setAttribute("style", "height: 800px");
        document.height = 900;
    });
    // it("The constructor should create an instance Layout Class", function() {
    //     //layout.destroy();
    //     layout = new Layout();
    //     expect(layout).toBeDefined();
    //     expect(layout.type).toEqual('Layout');
    //     expect(layout.family).toEqual('Panel');
    // });

    /*it("Should have a height size assigned to content", function() {
        layout3 = new PMUI.panel.LayoutPanel();
        //jQuery(document.body).append(layout3.createHTML());
        //layout3.render();
        expect(typeof layout3.height).toEqual("number");
        expect(layout3.height).toBeGreaterThan(0);
    });*/

    it("Should exist a container class for the current layout setted by the Jquery-Layout plugin", function() {
        layout3 = new PMUI.panel.LayoutPanel();
        jQuery(document.body).append(layout3.createHTML())
        layout3.render();
        expect(layout3.html).toBeDefined();
        expect(document.getElementsByClassName('ui-layout-container').length).not.toEqual(0);
    });

    it("Should exist constants properties for the Jquery-Layout plugin", function() {
        expect(typeof layout3.getConfig().panels).toEqual('object');
        expect(layout3.getConfig().prefix).toEqual("ui-layout-");
    });

    it("Should create a center panel by default", function() {
        expect(layout3.center).toBeDefined();
        expect(typeof layout3.center).toEqual("object");
    });

})