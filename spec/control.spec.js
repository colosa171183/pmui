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
	Control = require('../src/control/Control.js');

describe('Control class', function() {
	var theControl,
		value = "some value",
		newValue = "another value",
		name = "myFirstControl",
		theCallbackFunction = function(cur, prev) {

		};

	beforeEach(function() {
		theControl = new PMUI.control.Control({
			onChange: theCallbackFunction
		});
	});

	afterEach(function() {
		theControl = null;
	});

	describe('Class behavior [tests for acceptance criterias]', function() {
		it("[US-6, a] should be able to set a value for it and then get it back", function() {
			theControl.setValue(value);
			expect(theControl.getValue()).toEqual(value);
		});

		it("[US-6, b] should be able to set the enable property to true or false and then check its state", function() {
			theControl.disable(true);
			expect(theControl.isEnabled()).toBeFalsy();
			theControl.disable(false);
			expect(theControl.isEnabled()).toBeTruthy();
		});

		it('[US-6, c] should be able to set the name property and then get it back', function() {
			theControl.setName(name);
			expect(theControl.getName()).toBe(name);
		});

		it('[US-6, d] should be able to set the parent Field object and then get it back', function() {
			var theField = new PMUI.form.Field();
			theControl.setField(theField);
			expect(theControl.getField()).toBe(theField);
			console.log("TODO: complete the spec [US-6] when the Field object exists!");
		});

		it('[US-6, e] should be able to execute a callback function everytime the onChangeHandler() method is invoked', function() {
			spyOn(theControl, "onChange");
			theControl.setValue(value);
			//we hack a class method just to make the test functional
			theControl.getValueFromRawElement = function() {
				return newValue;
			};
			theControl.onChangeHandler();
			expect(theControl.onChange).toHaveBeenCalled();
			expect(theControl.onChange).toHaveBeenCalledWith(newValue, value);
		});

		it('[US-6, e] should be able to execute the callback function in the context of the same object in which the change was detected', function() {
			var obj;
			theControl.onChange = function() {
				obj = this;
			};
			//we hack a class method just to make the test functional
			theControl.getValueFromRawElement = function() {
				return newValue;
			};
			theControl.onChangeHandler();
			expect(obj).toBe(theControl);
		});
	});

	describe('Other tests', function() {
		it("should call its attachListeners() method when the getHTML() method is invoked (after creating the html)", function() {
			//we hack some class methods just to make the test functional
			theControl.attachListeners = function() {
			};
			theControl.createHTML = function() {
			};
			spyOn(theControl, "attachListeners");
			theControl.getHTML();
			expect(theControl.attachListeners).toHaveBeenCalled();
		});
	});
});