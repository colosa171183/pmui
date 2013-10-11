(function (){
    /**
     * @class PMUI.layout.LayoutFactory
     * @extends {PMUI.util.Factory}
     * Extends the functionality of Factory to set the constructor for layouts
     * 
     * @constructor
     * Makes a new instance of the class
     * @param {Object} options 
     */
    var LayoutFactory = function (options) {
        LayoutFactory.superclass.call(this, options);
        LayoutFactory.prototype.init.call(this, options);
    };

    PMUI.inheritFrom('PMUI.util.Factory', LayoutFactory);

    /**
     * Defines the object's type
     * @type {String}
     */
    LayoutFactory.prototype.type = 'LayoutFactory';

    /**
     * @private
     * Initializes the object with default values
     * @param  {Object} options 
     */
    LayoutFactory.prototype.init = function (options) {
        var defaults = {
            products: {
                "hbox": PMUI.layout.HBox,
                "vbox": PMUI.layout.VBox,
                "box": PMUI.layout.Box
            },
            defaultProduct: "box"
        };
        jQuery.extend(true, defaults, options);
        this.setProducts(defaults.products)
            .setDefaultProduct(defaults.defaultProduct);
    };

    LayoutFactory.prototype.make = function(obj) {
        var product,
            productType = obj.pmType || '';
        if (this.isValidClass(obj)){
            product = obj;
        } else if (this.isValidName(productType)) {
            product = this.build.call(this, productType, obj);
        } else if(this.isValidName(obj)) {
            product = this.build.call(this, obj, {});
        } else {
            product = this.build.call(this, this.defaultProduct, obj);
        }
        return product;
    };

    PMUI.extendNamespace('PMUI.layout.LayoutFactory', LayoutFactory);

    if (typeof exports !== 'undefined') {
        module.exports = LayoutFactory;
    }

}());