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
    Panel = require("../src/core/Panel.js"),
    Layout = require ("../src/panel/LayoutPanel.js"),
    TextField = require('../src/field/TextField.js');

describe('class "Field"', function () {
    var a, b, c;
    describe('class behavior', function () {
        it('[US-19,a] should create a new object with all default attributes', function () {
            a = new PMUI.form.Field();
            expect(a.name === a.id).toBeTruthy();
            expect(a.label === '[field]').toBeTruthy();
            expect(a.value === '').toBeTruthy();
            expect(a.controlPositioning === '[c*]').toBeTruthy();
            expect(a.labelWidth === '30%').toBeTruthy();
            expect(a.valueType === 'string').toBeTruthy();
        });
        it('[US-19,b]should set a name for the Field, the value must be only a string', function () {
            a = new PMUI.form.Field();
            expect(a.name).toBeDefined();
            expect(a.name).not.toBeNull();
            a.setName("new_field_name");
            expect(a.name).toBeDefined();
            expect(a.name).not.toBeNull();
            expect(a.name === "new_field_name").toBeTruthy();
        });
        it('[US-19,c]should set the value of the Field', function () {
            a = new PMUI.form.Field();
            expect(a.value).toBeDefined();
            expect(a.value === "").toBeTruthy();
            a.setValue("new_field");
            expect(a.value).toBeDefined();
            expect(a.value === "new_field").toBeTruthy();
        });
        it('[US-19,d]should set a label for a Field', function () {
            a = new PMUI.form.Field();
            expect(a.label).toBeDefined();
            expect(a.label === "[field]").toBeTruthy();
            a.setLabel("new_label");
            expect(a.label).toBeDefined();
            expect(a.label === "new_label").toBeTruthy();
        });
        it('[US-19,e]should set the message, type and the visible value of the TooltipMessage', function () {
            a = new PMUI.form.Field();
            a.showMessage("tooltip_new_message", "info");
            expect(a.message.message).toBeDefined();
            expect(a.message.message === "tooltip_new_message").toBeTruthy();
            expect(a.message.category).toBeDefined();
            expect(a.message.category === "info").toBeTruthy();
            expect(a.message.visible).toBeTruthy();
        });
        it('[US-19,f]should get the array of all the controls', function () {
            a = new PMUI.form.Field();
            expect(a.getControls()).toBeDefined();
            expect(a.getControls()).not.toBeNull();
            expect(a.getControls().length === 0).toBeTruthy();
        });
        it('[US-19,f]should get an specific element of the array, in this case the array is empty', function () {
            a = new PMUI.form.Field();
            expect(a.getControl(0)).not.toBeNull();
            expect(a.getControl(0)).not.toBeDefined();
        });
        it('[US-19,f]should set the controlPositioning property', function () {
            a = new PMUI.form.Field();
            expect(a.controlPositioning === "[c*]").toBeTruthy();
            a.setControlPositioning("f");
            expect(a.controlPositioning).toBeDefined();
            expect(a.controlPositioning === "f").toBeTruthy();
        });
        it('[US-19,g] should set the callback function to be called when the field´s value changes', function () {
            a = new PMUI.form.Field();
            c = function () {};
            expect(a.onChange).toBeNull();
            a.setOnChangeHandler(c);
            expect(a.onChange).not.toBeNull();
            expect(a.onChange).toBeDefined();
            expect(a.onChange === c).toBeTruthy();
        });
    });
    describe('method "showColon"', function () {
        it('should show a colon after the label text', function () {
            a = new PMUI.form.Field();
            a.showColon();
            expect(a.colonVisible).toBeDefined();
            expect(a.colonVisible).toBeTruthy();
        });
    });
    describe('method "hideColon"', function () {
        it('should hide the colon after the label text', function () {
            a = new PMUI.form.Field();
            a.showColon();
            expect(a.colonVisible).toBeDefined();
            expect(a.colonVisible).toBeTruthy();
            a.hideColon();
            expect(a.colonVisible).toBeDefined();
            expect(a.colonVisible).toBeFalsy();
        });
    });
    describe('method "setLabelWidth"', function () {
        it('should set the label width, the value should be a number', function () {
            a = new PMUI.form.Field();
            a.setLabelWidth(50);
            expect(a.labelWidth).toBeDefined();
            expect(a.labelWidth).not.toBeNull();
        });
        it('if the value is a string, should have the following format "auto", #%, #px, #em', function () {
            a = new PMUI.form.Field();
            a.setLabelWidth("auto");
            expect(a.labelWidth).toBeDefined();
            expect(a.labelWidth).not.toBeNull();
            a.setLabelWidth("10%");
            expect(a.labelWidth).toBeDefined();
            expect(a.labelWidth).not.toBeNull();
            a.setLabelWidth("100px");
            expect(a.labelWidth).toBeDefined();
            expect(a.labelWidth).not.toBeNull();
            a.setLabelWidth("40em");
            expect(a.labelWidth).toBeDefined();
            expect(a.labelWidth).not.toBeNull();
        });
    });
    describe('method "showHelper"', function () {
        it('should show the tooltip helper', function () {
            a = new PMUI.form.Field();
            a.showHelper();
            expect(a.helperIsVisible).toBeDefined();
            expect(a.helperIsVisible).toBeTruthy();
        });
    });
    describe('method "hideHelper"', function () {
        it('should hide the tooltip helper', function () {
            a = new PMUI.form.Field();
            a.showHelper();
            expect(a.helperIsVisible).toBeDefined();
            expect(a.helperIsVisible).toBeTruthy();
            a.hideHelper();
            expect(a.helperIsVisible).toBeDefined();
            expect(a.helperIsVisible).toBeFalsy();
        });
    });
    describe('method "getName"', function () {
        it('should get the name of the field', function () {
            a = new PMUI.form.Field();
            a.setName("new_field_name");
            expect(a.name).toBeDefined();
            expect(a.name).not.toBeNull();
            expect(a.getName() === "new_field_name").toBeTruthy();
        });
    });
    describe('method "getLabel"', function () {
        it('should get the label from the field', function () {
            a = new PMUI.form.Field();
            a.setLabel("new_label");
            expect(a.label).toBeDefined();
            expect(a.getLabel() === "new_label").toBeTruthy();
        });
    });
    describe('method "getValue"', function () {
        it('should get the value of the Field', function () {
            a = new PMUI.form.Field();
            a.setValue("new_field");
            expect(a.getValue()).toBeDefined();
            expect(a.getValue() === "new_field").toBeTruthy();

        });
    });
    describe('method "setHelper"', function () {
        it('should set the message for the field helper', function () {
            a = new PMUI.form.Field();
            a.setHelper("this is a helping message");
            expect(a.helper.message).toBeDefined();
            expect(a.helper.message === "this is a helping message").toBeTruthy();
        });
    });
    describe('method "hideMessage"', function () {
        it('should hide the message of the TooltipMessage', function () {
            a = new PMUI.form.Field();
            a.showMessage("tooltip_new_message", "info");
            expect(a.message.message === "tooltip_new_message").toBeTruthy();
            expect(a.message.category === "info").toBeTruthy();
            expect(a.message.visible).toBeTruthy();
            a.hideMessage();
            expect(a.message.visible).toBeFalsy();
        });
    });
    describe('method "setValueType"', function () {
        it('should set the value type of the field', function () {
            a = new PMUI.form.Field();
            a.setValueType("new_type");
            expect(a.valueType === "new_type").toBeTruthy();
        });
    });
    describe('method "getValueType"', function () {
        it('should get the value type of the field', function () {
            a = new PMUI.form.Field();
            a.setValueType("new_type");
            expect(a.getValueType()).toBeDefined();
            expect(a.getValueType() === "new_type").toBeTruthy();
        });
    });
    describe('method "createHTML"', function () {
        it('should create a new HTML element', function () {
            a = new PMUI.form.Field();
            var h = a.createHTML();
            expect(h).toBeDefined();
            expect(h.tagName).toBeDefined();
            expect(h.nodeType).toBeDefined();
            expect(h.nodeType).toEqual(document.ELEMENT_NODE);
        });
    });
});