global.window = require("jsdom")
                .jsdom()
                .createWindow();
global.document = global.window.document;
global.jQuery = require("jquery");
global.$ = global.jQuery;
global.PMUI = require('../src/pmui.js');

var PMUI = require('../src/pmui.js'),
	Style = require('../src/util/Style.js'),
	Base = require('../src/core/Base.js'),
	Element = require('../src/core/Element.js');

describe('An Element instance', function() {
	var myElement, settings = {
		style: {
			cssProperties: {
				position: "absolute"
			},
			cssClasses: ["any-class"]
		},
		x: 12,
		y: 24,
		width: 36, 
		height: 48,
		zOrder: 60,
		visible: true
	};

	beforeEach(function() {
		myElement = new Element(settings);
		document.body.appendChild(myElement.getHTML());
        $(document.body).css({
            "font-family": "Arial",
            "font-size": "16px"
        });
	});

	afterEach(function() {
		$(myElement.getHTML()).remove();
        $(document.body).empty();
	});

	it("[US-1,c] should accept create a new object (with all the settings specified) when constructor is called", function () {
        expect(myElement instanceof Element).toBeTruthy();
        expect(myElement.getX()).toEqual(settings.x);
        expect(myElement.getY()).toEqual(settings.y);
        expect(myElement.getWidth()).toEqual(settings.width);
        expect(myElement.getHeight()).toEqual(settings.height);
        expect(myElement.getZOrder()).toEqual(settings.zOrder);
        expect(myElement.isVisible()).toEqual(settings.visible);
        expect(myElement.style.cssClasses.indexOf(settings.style.cssClasses[0])).toBeGreaterThan(-1);
        for(key in settings.style) {
        	expect(myElement.style.cssProperties[key]).toEqual(settings.style.cssProperties[key]);
        }
    });

    it("should allow set the style property using a JSON object", function() {
    	var key, style = {
    		cssProperties: {
				position: "relative",
				left: "10px"
			},
			cssClasses: ["another-class"]
    	};
    	myElement.setStyle(style);
    	expect(myElement.style.cssClasses).toEqual(style.cssClasses);
    	expect(myElement.style.cssProperties).toEqual(style.cssProperties);
    });

    it("[US-1,d] should allow set the style property using a Style object", function() {
    	var style = new Style();
    	myElement.setStyle(style);
    	expect(myElement.style).toBe(style);
    });

    it("should allow set the x property using a number and a string and then get it back as a number", function() {
    	var the_number = 34,
    		the_string = "12px";

    	myElement.setX(the_number);
    	expect(myElement.getX()).toEqual(the_number);
    	expect(myElement.getHTML().style.left).toEqual(the_number + "px");
    	myElement.setX(the_string);
    	expect(myElement.getX()).toEqual(parseInt(the_string, 10));
    	expect(myElement.getHTML().style.left).toEqual(the_string);
    });

    it("should allow set the y property using a number and a string and then get it back as a number", function() {
    	var the_number = 34,
    		the_string = "12px";

    	myElement.setY(the_number);
    	expect(myElement.getY()).toEqual(the_number);
    	expect(myElement.getHTML().style.top).toEqual(the_number + "px");
    	myElement.setY(the_string);
    	expect(myElement.getY()).toEqual(parseInt(the_string, 10));
    	expect(myElement.getHTML().style.top).toEqual(the_string);
    });

    it("[US-1,d] should allow set the width property using a number and a string (number and css property) and then get it back", function() {
    	var the_number = 340,
    		the_string = "120px",
    		the_css_property = "inherit";

    	myElement.setWidth(the_number);
    	expect(myElement.getWidth()).toEqual(the_number);
    	myElement.setWidth(the_string);
    	expect(myElement.getWidth()).toEqual(parseInt(the_string, 10));
    	myElement.setWidth(the_css_property);
    	expect(myElement.getWidth()).toEqual(the_css_property);
    });

    it("[US-1,d] should allow set the height property using a number and a string (number and css property) and then get it back", function() {
    	var the_number = 340,
    		the_string = "120px",
    		the_css_property = "inherit";

    	myElement.setHeight(the_number);
    	expect(myElement.getHeight()).toEqual(the_number);
    	myElement.setHeight(the_string);
    	expect(myElement.getHeight()).toEqual(parseInt(the_string, 10));
    	myElement.setHeight(the_css_property);
    	expect(myElement.getHeight()).toEqual(the_css_property);
    });

    it("[US-1,d] should allow set the zOrder property using a number and then get it back", function() {
        var the_number = 6,
            the_string = "auto",
            the_invalid = "haha";

        myElement.setZOrder(the_number);
        expect(myElement.getZOrder()).toEqual(parseInt(the_number, 10));
        expect(myElement.style.cssProperties["z-index"]).toEqual(parseInt(the_number, 10));
        myElement.setZOrder(the_string);
        expect(myElement.getZOrder()).toEqual(the_string);
        expect(myElement.style.cssProperties["z-index"]).toEqual(the_string);
        expect(function(){myElement.setZOrder(the_invalid);}).toThrow();
        expect(myElement.getZOrder()).toEqual(the_string);
        expect(myElement.style.cssProperties["z-index"]).toEqual(the_string);
    });

    it("[US-1,d] should allow show/hide the html element", function() {
        myElement.setVisible(false);
        expect($(myElement.html).is(":visible")).toBeFalsy();
        expect(myElement.isVisible()).toBeFalsy();
        myElement.setVisible(true);
        expect($(myElement.html).is(":visible")).toBeTruthy();
        expect(myElement.isVisible()).toBeTruthy();
    });

    it("[US-1,d] should allow set the position for its html element", function() {
        var pos = {
            x: 36,
            y: 62
        };

        spyOn(myElement, "setX");
        spyOn(myElement, "setY");
        myElement.setPosition(pos);
        expect(myElement.setX).toHaveBeenCalledWith(pos.x);
        expect(myElement.setY).toHaveBeenCalledWith(pos.y);
    });

    it("[US-1,d] should allow set the dimension for its html element", function() {
        var dim = {
            width: 46,
            height: 63
        };

        spyOn(myElement, "setWidth");
        spyOn(myElement, "setHeight");
        myElement.setDimension(dim);
        expect(myElement.setWidth).toHaveBeenCalledWith(dim.width);
        expect(myElement.setHeight).toHaveBeenCalledWith(dim.height);
    });

    it("should return its html element (if it doesn't exist it should be created and then returned) when the getHTML", function() {
        //spyOn(myElement, "createHTML");
        expect(myElement.getHTML().tagName).toBeDefined();
        myElement.html = null;
        expect(myElement.getHTML().tagName).toBeDefined();
        //expect(myElement.createHTML).toHaveBeenCalled();
    });

    it("should return the html element (or create a new one if it doesn't exist) when the createHTML() method is ivoked", function() {
        expect(myElement.createHTML()).toBe(myElement.html);
        myElement.html = null;
        expect(myElement.createHTML().tagName).toBeDefined();
    });

    it('should calculate the text width based in the font size and family', function() {
        /*var testText = "Hello, this is a test text",
            span = document.createElement("span"),
            w, font;
        span.appendChild(document.createTextNode(testText));
        document.body.appendChild(span);
        w = $(span).width();
        font = $(span).css("font");
        expect(myElement.calculateWidth(testText, font)).toEqual(w + 1);
        expect(font).toBe(null);*/

        //This spec can be tested since the DOM simulation doesn't work properly
    });
});

