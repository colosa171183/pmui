(function(){
    /**
     * @class PMUI.control.TextControl
     * Class for handle the HTML native text input control.
     * @extends PMUI.control.HTMlControl
     *
     * Quick usage example:
     *
     *      myTextbox = new PMUI.control.TextControl({
                name: "my_name",
                value: "John Doe",
                maxLength: 12,
                placeholder: "insert your name here",
                disabled: false,
                onChange: function(currentValue, previousValue) {
                    if(previousValue !== "") {
                        alert("Your name is not \"" + previousValue + "\" anymore.\nNow it's \"" + currentValue + "\"");
                    } else {
                        alert("Now your name is " + currentValue);
                    }
                }
            });

            document.body.appendChild(myTextbox.getHTML());
     *
     * @constructor
     * The constructor receives a JSON object with the same data structure 
     .setFooterHeight(defaults.FooterHeight)that the parent class 
     {@link PMUI.control.HTMLControl#constructor HTMLControl}, 
     * but additionally it accepts two fields:
     *
     * - placeholder: a string to be used as the control's placeholder
     * - maxLength: a number which specifies the maximum character length the control can accept
     *
     * Usage:
     *      myTextbox = new PMUI.control.TextControl({
                name: "my_name",
                value: "John Doe",
                maxLength: 12,
                placeholder: "insert your name here",
                disabled: false,
                onChange: function(currentValue, previousValue) {
                    if(previousValue !== "") {
                        alert("Your name is not \"" + previousValue + "\" anymore.\nNow it's \"" + currentValue + "\"");
                    } else {
                        alert("Now your name is " + currentValue);
                    }
                }
            });
     */
    var TextControl = function(settings) {
        TextControl.superclass.call(this, settings);
        /**
         * @property {String} [placeholder=""]
         * The control's placeholder (the text to be shown inside the control when there is not any text in it).
         */
        this.placeholder = null;
        /**
         * @property {Number} [maxLength=524288] The maximum character length the control accepts.
         */
        this.maxLength = null;
        TextControl.prototype.init.call(this, settings);
    };

    PMUI.inheritFrom('PMUI.control.HTMLControl', TextControl);

    TextControl.prototype.init = function(settings) {
        var defaults = {
            placeholder: "",
            maxLength: 524288
        };

        $.extend(true, defaults, settings);

        this.setPlaceholder(defaults.placeholder)
            .setMaxLength(defaults.maxLength);
    };
    /**
     * Sets the placeholder test to show in the control when there's not ant value in it.
     * @param {String} placeholder
     * @chainable
     */
    TextControl.prototype.setPlaceholder = function(placeholder) {
        if(typeof placeholder === 'string') {
            this.placeholder = placeholder;
            if(this.html) {
                this.html.placeholder = placeholder;
            }
        }

        return this;
    };
    /**
     * Sets the maximun character number to be accepted in the control.
     * @param {Number} maxLength The number must be an integer. 
     * If the value is minor or equal to 0 then the maxLength property is set to the default (524288)
     */
    TextControl.prototype.setMaxLength = function(maxLength) {
        if(typeof maxLength === 'number' && maxLength % 1 === 0) {
            this.maxLength = maxLength;
            if(this.html) {
                this.html.maxLength = maxLength > 0 ? maxLength : 524288;
            }
        } else {
            throw new Error("method setMaxLength() only accepts integer values.");
        }

        return this;
    };
    /**
     * Creates the HTML element for the object
     * @return {HTMLElement}
     */
    TextControl.prototype.createHTML = function() {
        TextControl.superclass.prototype.createHTML.call(this);
        this.html.type = "text";
        this.setPlaceholder(this.placeholder)
            .setMaxLength(this.maxLength);

        return this.html;
    };

    PMUI.extendNamespace('PMUI.control.TextControl', TextControl);

    // Declarations created to instantiate in NodeJS environment
    if (typeof exports !== "undefined") {
        module.exports = TextControl;
    }
}());