global.dom = require('jsdom');
global.window = global.dom.jsdom().createWindow();
global.document = global.window.document;
global.jQuery = require("jquery");
global.$ = global.jQuery;
global.PMUI = require('../src/pmui.js');

var ArrayList = require('../src/util/ArrayList.js'),
    Util = require('../src/util/Style.js'),
    Base = require('../src/core/Base.js'),
    Element = require('../src/core/Element.js'),
    Factory = require('../src/util/Factory.js'),
    Container = require('../src/core/Container.js'),
    TooltipMessage = require('../src/ui/TooltipMessage.js'),
    Control = require('../src/control/Control.js'),
    HTMLControl = require('../src/control/HTMLControl.js'),
    TextControl = require('../src/control/TextControl.js'),
    Field = require('../src/form/Field.js'),
    TextField = require('../src/field/TextField.js'),
    Panel = require("../src/core/Panel.js"),
    Layout = require("../src/layout/Layout.js"),
    Box = require("../src/layout/Box.js"),
    HBox = require("../src/layout/HBox.js"),
    VBox = require("../src/layout/VBox.js"),
    LayoutFactory = require("../src/layout/LayoutFactory.js"),
    LayoutPanel = require("../src/panel/LayoutPanel.js"),
    Field = require("../src/form/Field.js"),
    TextField = require("../src/field/TextField.js"),
    FormItemFactory = require("../src/form/FormItemFactory.js"),
    FormPanel = require("../src/form/FormPanel.js");
describe('class "FormPanel"', function () {
    var a, b, c, x, y;
    describe('class behavior', function () {
        it('[US-10,a]should add items to a FormPanel object', function () {
            a = new PMUI.form.FormPanel();
            b = new PMUI.field.TextField();
            x = a.getItems().length;
            a.addItem(b);
            y = a.getItems().length;
            expect(x === y).toBeFalsy(); 
        });
        it('[US-10,b]should clear items added from a FormPanel object', function () {
            a = new PMUI.form.FormPanel();
            b = new PMUI.field.TextField();
            a.addItem(b);
            x = a.getItems().length;
            a.clearItems();
            y = a.getItems().length;
            expect(x === y).toBeFalsy(); 
        });
        it('[US-10,c]should get all formPanels from the main FromPanel', function () {
            a = new PMUI.form.FormPanel();
            b = new PMUI.form.FormPanel();
            a.addItem(b);
            expect(a.getItems().length === 1).toBeTruthy();
        });   
    });
    describe('method "setFactory"', function () {
        it('should set the factory property to a FormPanel object', function () {
            a = new PMUI.form.FormPanel();
            c = new PMUI.util.Factory();
            x = a.factory.defaultProduct;
            a.setFactory(c);
            y = a.factory.defaultProduct;
            expect(x === y).toBeFalsy();
        });
    });
});