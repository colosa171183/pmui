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
    Event = require('../src/event/Event.js'),
    Action = require('../src/event/Action.js'),
    EventFactory = require('../src/event/EventFactory.js'),
    FormEvent = require('../src/event/FormEvent.js'),
    KeyboardEvent = require('../src/event/KeyboardEvent.js'),
    MouseEvent = require('../src/event/MouseEvent.js');
describe('class "TextField"', function () {
    var a, b, c;
    describe('class behavior', function () {
        it('[US-19,h]should set a placeholder to a textfield created', function () {
            a = new PMUI.field.TextField();
            a.setPlaceholder("placeholder1");
            expect(a.controls[0].placeholder).toBeDefined();
            expect(a.controls[0].placeholder === "placeholder1").toBeTruthy();
        });
        it('[US-19,i]should set maximal length to a Text Field', function () {
            a = new PMUI.field.TextField();
            expect(a.controls[0].maxLength === 0).toBeTruthy();
            a.setMaxLength(10);
            expect(a.controls[0].maxLength === 10).toBeTruthy();
        });
        it('[US-19,j]should set minimal length to a Text Field', function () {
            a = new PMUI.field.TextField();
            expect(a.minLength === 0).toBeTruthy();
            a.setMinLength(10);
            expect(a.minLength === 10).toBeTruthy();
        });
        it('[US-19,j]should get minimal length to a Text Field', function () {
            a = new PMUI.field.TextField();
            a.setMinLength(8);
            expect(a.getMinLength() === 8).toBeTruthy();
        });
        it('[US-19,k]should set function Trim on Blur to a text field', function () {
            a = new PMUI.field.TextField();
            expect(a.trimOnBlur === false).toBeTruthy();
            a.setTrimOnBlur(true);
            expect(a.trimOnBlur).toBeDefined();
            expect(a.trimOnBlur === true).toBeTruthy();
        });
        it('[US-19,k]should get the TrimOnBlur value from a text Field', function () {
            a = new PMUI.field.TextField();
            a.setTrimOnBlur(true);
            expect(a.getTrimOnBlur() === true).toBeTruthy();
        });
    });
    describe('method "defineEvents"', function () {
        it('should set the events for a text Field', function () {
            a = new PMUI.field.TextField();
            a.defineEvents();
            expect(a.events).not.toBeNull();
            expect(a.events).toBeDefined();
        });
    });
});