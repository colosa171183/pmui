global.dom = require('jsdom');
global.window = global.dom.jsdom().createWindow();
global.document = global.window.document;
global.jQuery = require("jquery");
global.$ = global.jQuery;
global.PMUI = require('../src/pmui.js');

var ArrayList = require('../src/util/ArrayList.js'),
    Style = require('../src/util/Style.js'),
    Factory = require('../src/util/Factory.js'),
    Base = require('../src/core/Base.js'),
    Event = require('../src/event/Event.js'),
    Element = require('../src/core/Element.js'),
    Layout = require('../src/layout/Layout.js'),
    LayoutFactory = require('../src/layout/LayoutFactory.js'),
    HBox = require('../src/layout/HBox.js'),
    VBox = require('../src/layout/VBox.js'),
    Box = require('../src/layout/Box.js'),
    LayoutFactory = require('../src/layout/LayoutFactory.js'),
    Container = require('../src/core/Container.js'),
    Panel = require('../src/core/Panel.js');
describe('Class "Panel"', function () {
    var a, b, c;
    describe('Class Behavior', function () {
        /*it("[US-1,f] Constructor should create a new instance of the Class", function () {
            panel1 = new Panel();
            expect(panel1).toBeDefined();
            expect(panel1.type).toEqual('Panel');
        });
        it('[US-1,g] Should accept to create and remove a new container', function () {
            panel1 = new Panel();
            panel2 = new Panel();
            var i = panel1.getItems().length;
            panel1.addItem(panel2);
            expect(panel1.getItems().length).toEqual(i + 1);
            panel1.removeItem(panel2);
            expect(panel1.getItems().length).toEqual(i);
        });*/

    });
    /*describe('method "isDirectParentOf"', function () {
        it('should return a false boolean value', function () {
            panel1 = new Panel();
            panel2 = new Panel();
            expect(panel1.isDirectParentOf(panel2)).not.toBeTruthy();
        });
    });
    describe('method "isDirectParentOf"', function () {
        it('should return a true boolean value', function () {
            panel1 = new Panel();
            panel2 = new Panel();
            panel1.addItem(panel2);
            expect(panel1.isDirectParentOf(panel2)).toBeTruthy();
        });
    });
    describe('method "clearItems"', function () {
        it('should remove all the child items', function () {
            panel1 = new Panel();
            panel2 = new Panel();
            panel3 = new Panel();
            var i = panel1.getItems().length;
            panel1.addItem(panel2);
            panel1.addItem(panel3);
            expect(panel1.getItems().length).toEqual(i + 2);
            panel1.clearItems();
            expect(panel1.getItems().length).toEqual(i);
        });
    });
    describe('method "setItems"', function () {
        it('should remove all current child items and set a new child', function () {
            var panel1 = new Panel(),
                panel2 = new Panel(),
                panel3 = new Panel();
            panel1.addItem(panel2);
            panel1.setItems(panel3);
            expect(panel1.getItems().length).toEqual(1);
        });
    });
    describe('method "createHTML"', function () {
        it('should create a new HTML element', function () {
            var html = panel1.createHTML();
            panel1 = new Panel();
            expect(html).toBeDefined();
            expect(html.tagName).toBeDefined();
            expect(html.nodeType).toBeDefined();
            expect(html.nodeType).toEqual(document.ELEMENT_NODE);
        });
    });
    describe('method "getItems"', function () {
        it('should return an array with all items defined as child elements', function () {
            var a = panel1.getItems();
            panel1 = new Panel();
            panel2 = new Panel();
            panel3 = new Panel();
            panel1.addItem(panel2);
            panel1.addItem(panel3);
            expect(a).toBeDefined();
        });
    });
    describe('method "getItem"', function () {
        it('should return an specific item from the array already created', function () {
            var a;
            panel1 = new Panel();
            panel2 = new Panel();
            panel3 = new Panel();
            panel1.addItem(panel2);
            panel1.addItem(panel3);
            expect(panel1.getItem(1)).toBeDefined();
            expect(panel1.getItem(1)).toBe(panel3);
        });
    });*/
    describe('method "setPanel"', function () {
        it('should set a new Panel object', function () {
            a = new PMUI.core.Panel();
            b = new PMUI.core.Panel();
            expect(a.panel).toBeNull();
            a.setPanel(b);
            expect(a.panel).not.toBeNull();
            expect(a.panel).toBeDefined();
            expect(a.panel === b).toBeTruthy();
        });
    });
    describe('method "setParent"', function () {
        it('should set a parent for the object', function () {
            a = new PMUI.core.Panel();
            b = new PMUI.core.Panel();
            expect(a.parent).toBeNull();
            a.setParent(b);
            expect(a.parent).not.toBeNull();
            expect(a.parent).toBeDefined();
            expect(a.parent === b).toBeTruthy();
        });
    });
    describe('method "setLayout"', function () {
        it('should set a Layout for the Object', function () {
            a = new PMUI.core.Panel();
            a.setLayout({});
            expect(a.layout).not.toBeNull();
            expect(a.layout).toBeDefined();
        });
    });
    describe('method "getParent"', function () {
        it('should get the parent from the object', function () {
            a = new PMUI.core.Panel();
            b = new PMUI.core.Panel();
            a.setParent(b);
            expect(a.getParent()).not.toBeNull();
            expect(a.getParent()).toBeDefined();
            expect(a.getParent() === b).toBeTruthy();
        });
    });
});