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
    HTMLControl = require("../src/control/HTMLControl.js"),
    TextControl = require("../src/control/TextControl.js"),
    Field = require('../src/form/Field.js'),
    TextField = require('../src/field/TextField.js');

describe('class "TextControl"', function () {
	var a, b, c;
	describe('class behavior', function () {
		it('[US-18,a] should set a placeholder to a TextControl', function () {
			a = new PMUI.control.TextControl();
			expect(a.placeholder === "").toBeTruthy();
			a.setPlaceholder("new_placeholder");
			expect(a.placeholder === "new_placeholder").toBeTruthy();
		});
		it('[US-18,b] should set the maximal length to a TextControl', function () {
			a = new PMUI.control.TextControl();
			expect(a.maxLength === 524288).toBeTruthy();
			a.setMaxLength(678900);
			expect(a.maxLength === 678900).toBeTruthy();
		});	
	});
	describe('method "createHTML"', function () {
		it('should create a new HTML element', function () {
			a = new PMUI.control.TextControl();
			var h = a.createHTML();
            expect(h).toBeDefined();
            expect(h.tagName).toBeDefined();
            expect(h.nodeType).toBeDefined();
            expect(h.nodeType).toEqual(document.ELEMENT_NODE);
		});
	});
});