(function(){
    /**
     * @class PMUI.control.Control
     * Class that encapsulates the basic bahavior for a form control.
     * Since this class is abstract it shouldn't be instantiated.
     * @extends PMUI.core.Element
     * @abstract
     * 
     * @constructor
     * While it is true that this class must not be instantiated, 
     * it is useful to mention the settings parameter for the constructor 
     function (which will be used for the non abstract subclasses).
     * @param {Object} [settings] A JSON object which can be contain the following fields:
     * 
     * - name: The name for the control.
     * - value: The initial value to be set to the control.
     * - field: The parent {@link PMUI.form.Field Field} object for the control.
     * - disabled: A boolean value which determines if the control will be enabled or not.
     * - onChange: a callback function to be invoked when the control changes. 
     For info about the parameters received: {@link PMUI.control.Control#onChange onChange} property.
     */
    var Control = function(settings) {
        Control.superclass.call(this, settings);
        /**
         * @property {String} [name=id] The control's name, it defaults to null.
         * @readonly
         */
        this.name = null;
        /**
         * @property {String} [value=""] The control's value.
         * @readonly
         */
        this.value = null;
        /**
         * @property {PMUI.form.Field} [field=null] The {@link PMUI.form.Field Field} 
         object the current object belongs to.
         * @readonly
         */
        this.field = null;
        /**
         * @property {Boolean} [disabled=false] If the control is disabled or not.
         * @readonly
         */
        this.disabled = null;
        /**
         * @property {Function} [onChange=null] A callback function to be called every time the control changes.
         * Everytime this callback function be called it will receive two parameters: 
         * 
         * - first argument: the current control's value
         * - second argument: the previous control's value
         *      //Remember, this is an abstract class so it shouldn't be instantiate,
         *      //anyway we are instantiating it just for this example
         *      var myControl = new PMUI.control.Control({
         *          name: "phrase",
         *          value: "Sometimes the sun goes down!",
         *          disabled: false,
         *          onChange: function(currentValue, previousValue) {
         *              console.log(this.name + " has changed!");
         *              console.log("Its previous value was: " + previousValue);
         *              console.log("Its current value is: " + currentValue);
         *          }
         *      });
         */
        this.onChange = null;
        Control.prototype.init.call(this, settings);
    };

    PMUI.inheritFrom('PMUI.core.Element', Control);

    Control.prototype.init = function(settings) {
        var defaults = {
            name: this.id, 
            value: "",
            field: null, 
            disabled: false,
            onChange: null
        };

        $.extend(true, defaults, settings);

        this.setName(defaults.name)
            .setValue(defaults.value)
            .setField(defaults.field)
            .disable(defaults.disabled)
            .setOnChangeHandler(defaults.onChange);
    };
    /**
     * Sets the control's name
     * @param {String} name
     */
    Control.prototype.setName = function(name) {
        if(typeof name === "string" || typeof name === "number") {
            this.name = name.toString();
            if(this.html) {
                this.html.setAttribute("name", name);
            }
        } else {
            throw new Error("The setName() method only accepts string or number values");
        }

        return this;
    };
    /**
     * Returns the control's name
     * @return {String}
     */
    Control.prototype.getName = function() {
        return this.name;
    };
    /**
     * Sets the control's value
     * @param {String} value
     */
    Control.prototype.setValue = function(value) {
        if(typeof value !== 'undefined') {
            this.value = value.toString();
        } else {
            throw new Error("setValue(): a parameter is required.");
        }

        return this;
    };
    /**
     * Returns the control's value
     * @return {String}
     */
    Control.prototype.getValue = function() {
        return this.value;
    };
    /**
     * Sets the control's parent {@link PMUI.form.Field Field} object
     * @param {PMUI.form.Field}
     */
    Control.prototype.setField = function(field) {
        if(field instanceof PMUI.form.Field) {
            this.field = field;
        }

        return this;
    };
    /**
     * Returns the control's parent {@link PMUI.form.Field Field} object
     * @return {PMUI.form.Field}
     */
    Control.prototype.getField = function() {
        return this.field;
    };
    /**
     * Disables/enables the control
     * @param {Boolean} disable If the value is evaluated as true then the control is disabled, 
     otherwise the control is enabled.
     * @chainable
     */
    Control.prototype.disable = function(disable) {
        this.disabled = !!disable;
        return this;
    };
    /**
     * Returns true if the control is enabled, if it don't then it returns false
     * @return {Boolean}
     */
    Control.prototype.isEnabled = function() {
        return !this.disabled;
    };
    /**
     * Sets the callback function which will be executed everytime the control changes.
     *
     * The callback function will receive two parameters:
     *
     * - first argument: the current control's value
     * - second argument: the previous control's value
     *      //Remember, this is an abstract class so it shouldn't be instantiate,
     *      //anyway we are instantiating it just for this example
     *      var myControl = new PMUI.control.Control({
     *          name: "phrase",
     *          value: "Sometimes the sun goes down!",
     *          disabled: false
     *      });
     *
     *      myControl.setOnChangeHandler(function(currentValue, previousValue) {
     *          console.log(this.name + " has changed!");
     *          console.log("Its previous value was: " + previousValue);
     *          console.log("Its current value is: " + currentValue);
     *      });
     * @chainable
     */
    Control.prototype.setOnChangeHandler = function(handler) {
        if(typeof handler === 'function') {
            this.onChange = handler;
        }

        return this;
    };
    /**
     * Returns the control's value directly from the control's HTML element.
     * 
     * This method is used internally by the object, so in most of the cases you won't need to invocated. 
     * To get the control's value please use the {@link PMUI.control.Control#getValue getValue()} method.
     *
     * Since this is an abstract method, it must be implemented in its non-abstract subclasses
     * @return {String}
     * @abstract
     */
    Control.prototype.getValueFromRawElement = function() {
        throw new Error("Calling getValueFromRawElement() from PMUI.control.Control: this is an abstract method!");
    };
    /**
     * A method which is called everytime the control changes.
     * 
     * This method is used internally by the object, so in most of the cases you won't need to invocated. 
     * To execute instructions when the control changes, please use the 
     {@link PMUI.control.Control#setOnChangeHandler setOnChangeHandler()} method.
     * 
     * @chainable
     */
    Control.prototype.onChangeHandler = function() {
        var prevValue = this.value;
        this.value = this.getValueFromRawElement();
        if(typeof this.onChange === 'function') {
            this.onChange(this.value, prevValue);
        }

        return this;
    };
    /**
     * Attach the event listeners for the control's HTML element.
     * 
     * Since this is an abstract method, it must be implemented in its non-abstract subclasses
     * @abstract
     * @chainable
     */
    Control.prototype.attachListeners = function() {
        throw new Error("Calling attachListeners() from PMUI.control.Control: this is an abstract method!");
    };
    /**
     * Creates the HTML element for the control.
     * 
     * Since this is an abstract method, it must be implemented in its non-abstract subclasses
     * @return {HTMLElement}
     * @abstract
     */
    Control.prototype.createHTML = function() {
        throw new Error("Calling createHTML() from PMUI.control.Control: this is an abstract method!");
    };
    /**
     * Returns the HTML element for the control
     * @return {HTMLElement}
     */
    Control.prototype.getHTML = function() {
        if(!this.html) {
            this.html = this.createHTML();
            this.attachListeners();
        }

        return Control.superclass.prototype.getHTML.call(this);
    };

    PMUI.extendNamespace('PMUI.control.Control', Control);

    // Declarations created to instantiate in NodeJS environment
    if (typeof exports !== "undefined") {
        module.exports = Control;
    }
}());