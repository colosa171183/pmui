global.dom = require('jsdom');
global.window = global.dom.jsdom().createWindow();
global.document = global.window.document;
global.jQuery = require("jquery");
global.$ = global.jQuery;
global.PMUI = require('../src/pmui.js');

var ArrayList = require('../src/util/ArrayList.js'),
    Style = require('../src/util/Style.js'),
    Base = require('../src/core/Base.js'),
    Element = require('../src/core/Element.js'),
    Factory = require('../src/util/Factory.js'),
    Container = require('../src/core/Container.js'),
    Panel = require("../src/core/Panel.js"),
    Window = require('../src/ui/Window.js'),
    Button = require('../src/ui/Button.js'),
    Action = require('../src/event/Action.js'),
    Window = require('../src/ui/Window.js');

describe('class "Button"', function () {
    var a, b;
    describe('class behavior', function () {
        it('[US-16,d]should create a new button object with default properties', function () {
            a = new PMUI.ui.Button();
            expect(a.icon === null).toBeTruthy();
            expect(a.aliasButton === null).toBeTruthy();
            expect(a.height === "auto").toBeTruthy();
            expect(a.minWidth === "auto").toBeTruthy();
            expect(a.text === "undefined-button").toBeTruthy();
        });
        it('[US-16,f]should create a new HTML element', function () {
            a = new PMUI.ui.Button();
            var html = a.createHTML();
            expect(html).toBeDefined();
            expect(html.tagName).toBeDefined();
            expect(html.nodeType).toBeDefined();
            expect(html.nodeType).toEqual(document.ELEMENT_NODE);
        });
        it('[US-16,e]should set a new text for a button object', function () {
            a = new PMUI.ui.Button();
            expect(a.text === "undefined-button").toBeTruthy();
            a.setText("new_value_button");
            expect(a.text === "new_value_button").toBeTruthy();
        });
        it('[US-16,e]should set minimal Width different from "auto" to a button object', function () {
            a = new PMUI.ui.Button();
            expect(a.minWidth === "auto").toBeTruthy();
            a.setMinWidth(100);
            expect(a.minWidth === 100).toBeTruthy();
        });
        it('[US-16,e]should set a new icon different from null to a button object', function () {
            a = new PMUI.ui.Button();
            expect(a.icon === null).toBeTruthy();
            a.setIcon("icon1");
            expect(a.icon === "icon1").toBeTruthy();
        });
        it('[US-16,e]should set a new alias different from null to a button object', function () {
            a = new PMUI.ui.Button();
            expect(a.aliasButton === null).toBeTruthy();
            a.setAliasButton("button1");
            expect(a.aliasButton === "button1").toBeTruthy();
        });
    });/*
    describe('method "show"', function () {
        it('should show the button already created', function () {
            a = new PMUI.ui.Button();
            b = a.show();
            expect(b).toBeDefined();
            expect(b.tagName).toBeDefined();
            expect(b.nodeType).toBeDefined();
            expect(b.nodeType).toEqual(document.ELEMENT_NODE);
        });

    });*/
});

