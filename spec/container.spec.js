global.window = require("jsdom")
                .jsdom()
                .createWindow();
global.document = global.window.document;
global.jQuery = require("jquery");
global.$ = global.jQuery;
global.PMUI = require('../src/pmui.js');
var ArrayList = require('../src/util/ArrayList.js'),
    Style = require('../src/util/Style.js'),
    Base = require('../src/core/Base.js'),
    Element = require('../src/core/Element.js'),
    Factory = require('../src/util/Factory.js'),
    Container = require('../src/core/Container.js');
describe('Class "Container"', function () {
    var container1, container2, container3;
    describe('Class Behavior', function () {
        it("[US-9,a] Constructor should create a new instance of the Class", function () {
            container1 = new PMUI.core.Container();
            expect(container1).toBeDefined();
            expect(container1.type).toEqual('Container');
        });
        it('[US-9,b] Should accept to create and remove a new container', function () {
            container1 = new PMUI.core.Container();
            container2 = new PMUI.core.Container();
            var i = container1.getItems().length;
            container1.addItem(container2);
            expect(container1.getItems().length).toEqual(i + 1);
            container1.removeItem(container2);
            expect(container1.getItems().length).toEqual(i);
        });

    });
    describe('method "setFactory"', function () {
        it('should return an object with a factory property', function () {
            container1 = new PMUI.core.Container();
        });
    });
    describe('method "isDirectParentOf"', function () {
        it('should return a false boolean value', function () {
            container1 = new PMUI.core.Container();
            container2 = new PMUI.core.Container();
            expect(container1.isDirectParentOf(container2)).not.toBeTruthy();
        });
    });
    describe('method "isDirectParentOf"', function () {
        it('should return a true boolean value', function () {
            container1 = new PMUI.core.Container();
            container2 = new PMUI.core.Container();
            container1.addItem(container2);
            expect(container1.isDirectParentOf(container2)).toBeTruthy();
        });
    });
    describe('method "clearItems"', function () {
        it('should remove all the child items', function () {
            container1 = new PMUI.core.Container();
            container2 = new PMUI.core.Container();
            container3 = new PMUI.core.Container();
            var i = container1.getItems().length;
            container1.addItem(container2);
            container1.addItem(container3);
            expect(container1.getItems().length).toEqual(i + 2);
            container1.clearItems();
            expect(container1.getItems().length).toEqual(i);
        });
    });
    describe('method "setItems"', function () {
        it('should remove all current child items and set a new child', function () {
            var container1 = new Container(),
                container2 = new Container(),
                container3 = new PMUI.core.Container();
            container1.addItem(container2);
            container1.setItems(container3);
            expect(container1.getItems().length).toEqual(1);
        });
    });
    describe('method "createHTML"', function () {
        it('should create a new HTML element', function () {
            var html = container1.createHTML();
            container1 = new PMUI.core.Container();
            expect(html).toBeDefined();
            expect(html.tagName).toBeDefined();
            expect(html.nodeType).toBeDefined();
            expect(html.nodeType).toEqual(document.ELEMENT_NODE);
        });
    });
    describe('method "getItems"', function () {
        it('should return an array with all items defined as child elements', function () {
            var a = container1.getItems();
            container1 = new PMUI.core.Container();
            container2 = new PMUI.core.Container();
            container3 = new PMUI.core.Container();
            container1.addItem(container2);
            container1.addItem(container3);
            expect(a).toBeDefined();
        });
    });
    describe('method "getItem"', function () {
        it('should return an specific item from the array already created', function () {
            var a;
            container1 = new PMUI.core.Container();
            container2 = new PMUI.core.Container();
            container3 = new PMUI.core.Container();
            container1.addItem(container2);
            container1.addItem(container3);
            expect(container1.getItem(1)).toBeDefined();
            expect(container1.getItem(1)).toBe(container3);
        });
    });
});