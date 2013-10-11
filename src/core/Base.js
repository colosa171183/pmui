(function (){
    /**
     * @class PMUI.core.Base
     * Base class for any other class in PMUI, this class is an abstract so it shouldn't be instantiated.
     * @param {Object} settings All the settings the the class requires
     */
    var Base = function(settings) {
        /**
         * Unique ID
         * @type {String}
         */
        this.id = null;
        Base.prototype.init.call(this, settings);
    };
    /**
     * Class type
     * @type {String}
     */
    Base.prototype.type = 'Base';
    /**
     * Class family
     * @type {String}
     */
    Base.prototype.family = 'Core';
    /**
     * Initialize the object
     * @param  {Object} settings Settings for Base Class
     * @return {String}          the generated id
     */
    Base.prototype.init = function(settings) {
        var defaults = {
            id: PMUI.generateUniqueId()
        };

        jQuery.extend(true, defaults, settings);

        this.setID(defaults.id);
    };
    /**
     * Set the id property for the object
     * @param {String} id
     * @chainable
     */
    Base.prototype.setID = function(id) {
        this.id = id;
        return this;
    };
    /**
     * Returns the id property from the object
     * @return {String} [description]
     */
    Base.prototype.getID = function() {
        return this.id;
    };
    /**
     * Returns the object's type
     * @return {String}
     */
    Base.prototype.getType = function () {
        return this.type;
    };
    /**
     * Return's the object's family name
     * @return {String} 
     */
    Base.prototype.getFamily = function() {
        return this.family;
    };

    // Declarations created to instantiate in NodeJS environment
    if (typeof exports !== "undefined") {
        module.exports = Base;
    }

    PMUI.extendNamespace('PMUI.core.Base', Base);
}());