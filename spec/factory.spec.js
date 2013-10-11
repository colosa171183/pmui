global.dom = require('jsdom');
global.window = global.dom.jsdom().createWindow();
global.document = global.window.document;
global.jQuery = require("jquery");
global.$ = global.jQuery;
global.PMUI = require('../src/pmui.js');
global.PMUI = require('../src/pmui.js');

var ArrayList = require('../src/util/ArrayList.js'),
    Util = require('../src/util/Style.js'),
    Style = require('../src/util/Style.js'),
    Base = require('../src/core/Base.js'),
    Element = require('../src/core/Element.js'),
    Factory = require('../src/util/Factory.js');

describe('class "Factory"', function () {
    var a, b, c;
    describe('class behavior', function () {

    });
    describe('method "setDefaultProduct"', function () {
        it('should set a product default property', function () {
            a = new PMUI.util.Factory();
            expect(a.defaultProduct).toBeDefined();
            expect(a.defaultProduct === 'element').toBeTruthy();
        });
    });
    describe('method "setProducts"', function () {
        it('should set the products for a factory object', function () {
            a = new PMUI.util.Factory();
            expect(a.products).toBeDefined();
            var obj = {"element": PMUI.core.Element};
            a.setProducts(obj);
            expect(a.products === obj).toBeTruthy();
        });
    });
    describe('method "register"', function () {
        it('should register the product name type and the product class', function () {
            a = new PMUI.util.Factory();
            var obj={"element": PMUI.core.element};
            a.register("element", obj);
            expect(a.defaultProduct === "element").toBeTruthy();

        });
    });
    describe('method "build"', function () {
        it('should build a new product into the products object', function () {
            a = new PMUI.util.Factory();
            var obj={"element": PMUI.core.element};
            a.build("element", obj);

        });
    });
    describe('method "isValidName"', function () {
        it('should return a value: true if the type is valid or false if it is invalid', function () {
            a = new PMUI.util.Factory();
            var obj={"element": PMUI.core.element};
            a.register("element", obj);
            expect(a.isValidName("element")).toBeDefined();
        });
    });
});