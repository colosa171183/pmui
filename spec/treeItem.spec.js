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
    Container = require('../src/core/Container.js'),
    Panel = require('../src/core/Panel.js'),
    Item = require('../src/core/Item.js'),
    TreeItem = require('../src/item/TreeItem.js'),
    Event = require('../src/event/Event.js'),
    Action = require('../src/event/Action.js'),
    EventFactory = require('../src/event/EventFactory.js'),
    FormEvent = require('../src/event/FormEvent.js'),
    KeyboardEvent = require('../src/event/KeyboardEvent.js'),
    MouseEvent = require('../src/event/MouseEvent.js');
describe('class "TreeItem"', function () {
    var a, b;
    describe('class behavior', function () {
        it('[US-15,a]should create a new HTML element', function () {
            a = new PMUI.item.TreeItem();
            var h = a.createHTML();
            expect(h).toBeDefined();
            expect(h.tagName).toBeDefined();
            expect(h.nodeType).toBeDefined();
            expect(h.nodeType).toEqual(document.ELEMENT_NODE);
        });
        it('[US-15,b]should set children to a TreeItem element created', function () {
            var j = {id : "myTreeId", children: [{id: "12", text: "Element 3 Level 1"}]};
            a = new PMUI.item.TreeItem(j);
            expect(a.getItem(0)).toBeDefined();
        });
    });
    describe('method "setText"', function () {
        it('should set a new text to a TreeItem element created', function () {
            a = new PMUI.item.TreeItem();
            a.setText("text1");
            expect(a.text).toBeDefined();
            expect(a.text === "text1").toBeTruthy();
        });
    });
    describe('method "setCursor"', function () {
        it('should set the cursor to a TreeItem object', function () {
            a = new PMUI.item.TreeItem();
            expect(a.cursor === "pointer").toBeTruthy();
            a.setCursor("pointer_x");
            expect(a.cursor === "pointer_x").toBeTruthy();
        });
    });
    describe('method "setCollapsed"', function () {
        it('should set the Collapsed property', function () {
            a = new PMUI.item.TreeItem();
            expect(a.collapsed).toBeDefined();
            expect(a.collapsed).toBeFalsy();
            a.setCollapsed(true);
            expect(a.collapsed).toBeDefined();
            expect(a.collapsed).toBeTruthy();
        });
    });
    describe('method "setIcon"', function () {
        it('should set an icon to a TreeItem object', function () {
            a = new PMUI.item.TreeItem();
            expect(a.icon).toBeDefined();
            expect(a.icon === "../img/icons/leaf.gif").toBeTruthy();
            a.setIcon("../xicon.gif");
            expect(a.icon).toBeDefined();
            expect(a.icon === "../xicon.gif").toBeTruthy();

        });
    });
    describe('method "setIconParent"', function () {
        it('should set an icon parent to a TreeItem object', function () {
            a = new PMUI.item.TreeItem();
            expect(a.iconParent).toBeDefined();
            expect(a.iconParent === "../img/icons/folder.gif").toBeTruthy();
            a.setIconParent("../xiconParent.gif");
            expect(a.iconParent).toBeDefined();
            expect(a.iconParent === "../xiconParent.gif").toBeTruthy();
        });
    });
    describe('method "setIconNodeClosed"', function () {
        it('should set an icon for a closed node', function () {
            a = new PMUI.item.TreeItem();
            expect(a.iconNodeClosed).toBeDefined();
            expect(a.iconNodeClosed === "../img/icons/elbow-plus.gif").toBeTruthy();
            a.setIconNodeClosed("../xiconNode.gif");
            expect(a.iconNodeClosed).toBeDefined();
            expect(a.iconNodeClosed === "../xiconNode.gif").toBeTruthy();
        });
    });
    describe('method "setIconNodeExpanded"', function () {
        it('should set an icon for a expanded node', function () {
            a = new PMUI.item.TreeItem();
            expect(a.iconNodeExpanded).toBeDefined();
            expect(a.iconNodeExpanded === "../img/icons/elbow-minus.gif").toBeTruthy();
            a.setIconNodeExpanded("../xiconNodeE.gif");
            expect(a.iconNodeExpanded).toBeDefined();
            expect(a.iconNodeExpanded === "../xiconNodeE.gif").toBeTruthy();
        });
    });
    describe('method "isCollapsed"', function () {
        it('should get the collapsed property value', function () {
            a = new PMUI.item.TreeItem();
            a.setCollapsed(false);
            expect(a.isCollapsed()).toBeFalsy();
            a.setCollapsed(true);
            expect(a.isCollapsed()).toBeTruthy();
        });
    });
    describe('method "collapse"', function () {
        it('should collapse an item specified', function () {
            a = new PMUI.item.TreeItem();
            a.collapse();
            expect(a).toBeDefined();
        });
    });
    describe('method "expand"', function () {
        it('should collapse an item specified', function () {
            a = new PMUI.item.TreeItem();
            a.expand();
            expect(a).toBeDefined();
        });
    });
    describe('method "toggleCollapse"', function () {
        it('should toogle item depending on if the item is collapsed or expanded', function () {
            a = new PMUI.item.TreeItem();
            a.setCollapsed(true);
            a.toggleCollapse();
            expect(a).toBeDefined();
        });
    });
    describe('method "setChildren"', function () {
        it('should set children to a TreeItem object', function () {
            var j = {id : "myTreeId", children: [{id: "12", text: "Element 3 Level 1"}]};
            a = new PMUI.item.TreeItem();
            a.setChildren(j);
            expect(a.getItem(0)).toBeDefined();
        });
    });
});