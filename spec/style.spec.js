global.window = require("jsdom")
                .jsdom()
                .createWindow();

global.document = global.window.document;
global.PMUI = require('../src/pmui.js');

require("../src/util/Style.js");
global.jQuery = require("jquery");
global.$ = global.jQuery;


describe('Style Class', function() {
	var oStyle;

	oStyle = new PMUI.util.Style();
	
	it("[US-1,g] The Style class should create an object with constructor", function() {
	  	expect(oStyle instanceof PMUI.util.Style).toBeTruthy();
        expect(typeof oStyle ).toEqual("object");
	  	expect(oStyle.initObject).toBeDefined();
	  	expect(oStyle.cssClasses).toBeDefined();
	  	expect(oStyle.cssProperties).toBeDefined();
	  	expect(oStyle.belongsTo).toBeDefined();
	});

    it("[US-1,i] Should not apply styles because the object doesn't have a html property", function() {
        expect(oStyle.belongsTo).toEqual(null);
    });

	it("[US-1,i] The applyStyle method should apply all styles and Classes css to object", function() {
        var htmlInput,
            oStyleProperty,
            oStyleClasses;
        
        //Paramenters for example
        htmlInput = document.createElement("input");
        jQuery(document.body).append(htmlInput);
        oElement = {
            html: htmlInput,
            type: "style",
            family: "util"
        };
        oCssProperties = {
            color: "red",
            width: "50px",
            "font-size": "20px"
        };
        oCssClasses = [
            'firstClass',
            'SecondClass'
        ];
        //End paramenters for example

        oStyle = new PMUI.util.Style({
            belongsTo: oElement,
            cssProperties: oCssProperties,
            cssClasses: oCssClasses
        });
        //Apply all the styles assigned to current object
        oStyle.applyStyle();
        
        expect(oStyle.belongsTo.html).toBeDefined();
        expect(oStyle.cssProperties).toBeDefined();
        expect(oStyle.cssClasses).toBeDefined();

        oStyleProperty = jQuery(oStyle.cssProperties);
        oStyleClasses = jQuery(oStyle.cssClasses);
        for (var i = 0; i < oStyleClasses.length; i++) {
            expect(oStyleClasses[i]).toContain(oCssClasses[i]);
        }
        expect(oStyleProperty[0].color).toEqual(oCssProperties.color);
        
	});


	it("[US-1,h] The addProperties method should add properties to cssProperties object", function() {
        var oNewProperty = {
            "font-family": "Monaco"
        };
        oStyle.addProperties(oNewProperty);
        expect(oStyle.cssProperties).toBeDefined();
        expect(jQuery(oStyle.belongsTo.html).css('font-family')).not.toBeUndefined();
	});	   
    			
    it("The getProperty method should get the property from cssProperties object", function() {
        jQuery.each(oStyle.cssProperties,function(index, el) {
            expect(oStyle.getProperty(index)).not.toBe(null);
        });
	});

	it("[US-1,j] The removeProperties method should remove properties based in an array of parameters from cssProperties object", function() {
        var aProperties = [
            "color",
            "width"
        ];
        
        oStyle.removeProperties(aProperties);
        jQuery.each(oStyle.cssProperties,function(index, el) {
            expect(index).not.toEqual(aProperties[0]);
            expect(index).not.toEqual(aProperties[1]);
        });
	});

    /*it("The removeProperties method should remove all properties from cssProperties object", function() {
        //If don't send parameters by default the method should remove all properties
        oStyle.removeProperties();
        expect(jQuery.isEmptyObject(oStyle.cssProperties)).toBe(true);

    });*/

	it("The addClasses method should add classes css to cssClasses object ", function() {

        var aClasses = [
            "class-css-example-one",
            "class-css-example-two"
        ];

        oStyle.addClasses(aClasses);
        //Verify in the object
        for (var i = 0; i < aClasses.length; i++) {
            expect(jQuery.inArray(aClasses[i], oStyle.cssClasses)).toBeGreaterThan(0);
        }
        //Verify in the DOM
        jQuery.each(oStyle.cssClasses,function(index, el) {
            expect(jQuery(oStyle.belongsTo.html).hasClass(el)).toBeTruthy();
        });
	});

	it("The removeClasses method should remove the classs css sent as parameter from object", function() {
        var aClasses = [
            "class-css-example-one"
        ];
        oStyle.removeClasses(aClasses);
        expect(jQuery.inArray(aClasses[0]), oStyle.cssClasses).toEqual(-1);
	});

	it("The removeAllClasses method should remove all the classes assigned to object", function() {
        oStyle.removeAllClasses();
        expect(jQuery.isEmptyObject(oStyle.cssClasses)).toBe(true);
	});

	it("The contains method should check the class css from the object", function() {
         var aClasses = [
            "class-css-example-one",
            "class-css-example-two"
        ];
        oStyle.addClasses(aClasses);
        for (var i = 0; i < aClasses.length; i++) {
            expect(oStyle.containsClass(aClasses[i])).toBeTruthy();
        }
	});

	it("The getClasses method should get an array with all classes css", function() {
        expect(typeof oStyle.getClasses() == 'object').toBeTruthy();
	});

	it("The stringify method serialize the cssClasses object", function() {
        expect(oStyle.stringify().cssClasses).toBeDefined();
	});

})