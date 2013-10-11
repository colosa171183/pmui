(function() {
    /**
     * @class PMUI.control.HTMLControl
     * Class that encapsulates the HTML native control's behavior.
     * Since this class is abstract it shouldn't be instantiated.
     * @extends PMUI.control.Control
     * @abstract
     *
     * @constructor
     * While it is true that this class must not be instantiated, 
     * it is useful to mention that the settings parameter for the constructor function
     * has the same structure that the one for the superclass 
     * (for more info see the {@link PMUI.control.Control#constructor constructor} method for Control class).
     */
    var HTMLControl = function(settings) {
        HTMLControl.superclass.call(this, settings);
    };

    PMUI.inheritFrom('PMUI.control.Control', HTMLControl);
    /**
     * Sets the value for the control
     * @param {String} value
     * @chainable
     */
    HTMLControl.prototype.setValue = function(value) {
        HTMLControl.superclass.prototype.setValue.call(this, value);
        if(this.html) {
            this.html.value = this.value;           
        }

        return this;
    };
    /**
     * Disables/enables the control
     * @param {Boolean} disable If the value is evaluated as true then the control 
     is disabled, otherwise the control is enabled.
     * @chainable
     */
    HTMLControl.prototype.disable = function(disable) {
        HTMLControl.superclass.prototype.disable.call(this, disable);
        if(this.html) {
            this.html.disabled = this.disabled;
        }

        return this;
    };
    /**
     * Returns the control's value directly from the control's HTML element.
     * 
     * This method is used internally by the object, so in most of the cases you won't need to invocated. 
     * To get the control's value please use the {@link PMUI.control.Control#getValue getValue()} method.
     * @return {String}
     */
    HTMLControl.prototype.getValueFromRawElement = function() {
        return this.html.value;
    };
    /**
     * Attach the event listeners for the control's HTML element
     * @chainable
     */
    HTMLControl.prototype.attachListeners = function() {
        var that = this;

        $(this.html).on("change", function() {
            that.onChangeHandler();
        });

        return this;
    };
    /**
     * Creates the HTML element for the control.
     * @return {HTMLElement}
     */
    HTMLControl.prototype.createHTML = function() {
        if(this.html) {
            return this.html;
        }
        this.html = PMUI.createHTMLElement('input');
        this.html.id = this.id;
        this.setName(this.name)
            .setValue(this.value)
            .disable(this.disabled);

        return this.html;
    };

    PMUI.extendNamespace('PMUI.control.HTMLControl', HTMLControl);

    // Declarations created to instantiate in NodeJS environment
    if (typeof exports !== "undefined") {
        module.exports = HTMLControl;
    }
}());