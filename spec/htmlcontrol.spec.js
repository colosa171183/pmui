global.dom = require('jsdom');
global.window = global.dom.jsdom().createWindow();
global.document = global.window.document;
global.jQuery = require("jquery");
global.$ = global.jQuery;
global.PMUI = require('../src/pmui.js');

var Util = require('../src/util/Style.js'),
    Base = require('../src/core/Base.js'),
    Element = require('../src/core/Element.js'),
    Control = require('../src/control/Control.js'),
    HTMLControl = require("../src/control/HTMLControl.js");
describe('Class "HTMLControl"', function () {
    var a;
    describe('Class behavior', function () {
        it('[US-6,f]should return a value previously inserted only if the HTMLelement is created', function () {
            a = new PMUI.control.HTMLControl();
            a.createHTML();
            expect(a.getValueFromRawElement() !== null).toBeTruthy();
            a.setValue("value_1");
            expect(a.getValueFromRawElement() === "value_1").toBeTruthy();
        });
        it('[US-6,g]should create a new HTML element', function () {
            a = new PMUI.control.HTMLControl();
            var html = a.createHTML();
            expect(html).toBeDefined();
            expect(html.tagName).toBeDefined();
            expect(html.nodeType).toBeDefined();
            expect(html.nodeType).toEqual(document.ELEMENT_NODE);
        });
    });
    describe('method "setValue"', function () {
        it('should set a new value different from null', function () {
            a = new PMUI.control.HTMLControl();
            expect(a.value).not.toBeNull();
            a.setValue("value_1");
            expect(a.value).toBeDefined();
            expect(a.value).toEqual("value_1");
        });
    });
    describe('method "disable"', function () {
        it('should set a boolean value to an object in order to enable or disable the element', function () {
            a = new PMUI.control.HTMLControl();
            expect(a.disabled).toBeFalsy();
            a.disable(true);
            expect(a.disabled).toBeTruthy();
        });
    });
    describe('method "attachListeners"', function () {
        it('should attach the event listeners for the HTML element control', function () {
            var x = 1;
            a = new PMUI.control.HTMLControl({ onChange : function () {x = x + 1; }});
            a.getHTML();
            $(a.getHTML()).trigger("change");
            expect(x).toEqual(2);
        });
    });
});