(function () {
    /**
     * @class PMUI.util.Factory
     * This class encapsulate the way to construct object using the product definition inside
     *
     * @constructor
     * This method creates a new instance of this object
     * @param {Object} settings Constructor setiings
     */
    var Factory = function (settings) {
        /**
         * Defines the products can be make by the factory
         * @type {Object}
         */
        this.products = null;
        
        /**
         * Defines the default product to make
         * @type {String}
         */
        this.defaultProduct = null;
        Factory.prototype.init.call(this, settings);
    };

    /**
     * Defines the object type
     * @type {String}
     */
    Factory.prototype.type = "Factory";

    /**
     * Defines the object family
     * @type {String}
     */
    Factory.prototype.family = "Factory";
    /**
     * Initializes the object with the default values
     * @param  {Object} options Contructor options
     */
    Factory.prototype.init = function (options) {
        var defaults;
        if (!options) {
            options = {};
        }
        defaults = {
            defaultProduct: options.defaultProduct || "element",
            products: options.products || {"element": PMUI.core.Element}
        };
        this.setDefaultProduct(defaults.defaultProduct)
            .setProducts(defaults.products);
    };

    /**
     * Sets the default product property
     * @param {String} def Default value
     */
    Factory.prototype.setDefaultProduct = function (def) {
        this.defaultProduct = def;
        return this;
    };

    /**
     * Sets the product object
     * @param {Object} products Products object
     */
    Factory.prototype.setProducts = function (products) {
        this.products = products;
        return this;
    };

    /**
     * Register a new product into the products object
     * @param  {String} name  Product type
     * @param  {Object} classObj Product Class 
     * @chainable
     */
    Factory.prototype.register = function (name, classObj) {
        var aux = this.products || {};
        aux[name] = classObj;
        this.products = aux;
        return this;
    };  

    /**
     * Retuns a new instance (product)
     * @param  {String} type    Product type
     * @param  {Object} options Settings object
     * @return {Object}         Instance of the object
     */
    Factory.prototype.build = function (type, options) {
        var constructor;
        if (this.isValidName(type)){
            constructor = this.products[type];
            return new constructor(options);
        } else {
            throw new Error('The type "' + type + '" has not valid constructor or is undefined.');
        }
    };

    /**
     * Retuns true if the type is valid into the products object
     * @param  {String}  name Product Name
     * @return {Boolean}   
     */
    Factory.prototype.isValidName = function (name) {
        var test = this.products[name];
        return test;
    };

    /**
     * Returns true if the class input is instance of one class into the product object
     * @param  {Object}  className [description]
     * @return {Boolean}           [description]
     */
    Factory.prototype.isValidClass = function (className) {
        var valid = false;
        $.each(this.products, function(type, classProduct){
            if (className instanceof classProduct){
                valid = true;
            }
        });
        return valid;
    };

    
    /**
     * Comprobes the obj in and returns the instance of the object
     * @param  {Object} obj Input can be an isntance or an object with the pmType property or simply a JSON
     * @return {Object}     Returns an instance made from the products object.
     */
    Factory.prototype.make = function (obj) {
        var product,
            productType = obj.pmType || '';
        if (this.isValidClass(obj)){
            product = obj;
        } else if (this.isValidName(productType)) {
            product = this.build.call(this, productType, obj);
        } else {
            product = this.build.call(this, this.defaultProduct, obj);
        }
        return product;
    };

    //Create a namespace for Factory class
    PMUI.extendNamespace('PMUI.util.Factory', Factory);

    // Publish to NodeJS environment
    if (typeof exports !== 'undefined'){
        module.exports = Factory;
    }

}());