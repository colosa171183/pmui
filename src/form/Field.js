(function(){
    /**
     * @class PMUI.form.Field
     * Abstract class that encapsulates the field behavior
     * @extends PMUI.core.Element
     *
     * @constructor
     * While it is true that this class must not be instantiated, 
     * it is useful to mention the settings parameter for the constructor function 
     * (which will be used for the non abstract subclasses).
     * @param {Object} [settings] A JSON object, it can be contain the following fields:
     * 
     * - {@link PMUI.form.Field#cfg-name name}.
     * - {@link PMUI.form.Field#cfg-label label}.
     * - {@link PMUI.form.Field#cfg-value value}.
     * - {@link PMUI.form.Field#cfg-helper helper}.
     * - {@link PMUI.form.Field#cfg-showHelper showHelper}.
     * - {@link PMUI.form.Field#cfg-validators validators}.
     * - {@link PMUI.form.Field#cfg-valueType valueType}.
     * - {@link PMUI.form.Field#cfg-controlPositioning controlPositioning}.
     * - {@link PMUI.form.Field#cfg-labelWidth labelWidth}.
     * - {@link PMUI.form.Field#cfg-showColon showColon}
     *
     * @cfg {String} name The name for the field.
     * @cfg {String} label The text to be shown as the field's label
     * @cfg {String} value The initial value to be set to the control.
     * @cfg {String} helper The helper text to be shown in the helper tooltip
     * @cfg {Boolean} showHelper A boolean value which determines if the helper tootltip will be shown or not.
     * @cfg {Object} validators An array where each array's item is a JSON object (with the validator setting data)
     *  or a {@link PMUI.form.Validator Validator} object. 
     *      {
     *          validators: [
     *              {
     *                  type: "maxlength",
     *                  criteria: 5
     *              },
     *              new LengthValidator({
     *                  min: 0,
     *                  max: 5
     *              })
     *          ]
     *      }
     * In example above, "validators" is an array in which their first element is an JSON object 
     * and the second one is a {@link PMUI.form.Validator Validator} object.
     * @cfg {String} valueType A string which specifies the data type for the Field value.
     * @cfg {String} controlPositioning A formatted string that specifies the order output for the control(s). 
     * A string  which specifies the output order for the field's controls. 
     * Basically this string uses a wildcard with the format "[cx]", each one is replaced by the control:
     *      "[c0]-[c1]-[c2]"
     * If you apply the string above to the controlPositioning property, it will render
     * the first three field's controls, each one separated from the other by a "-".
     *
     * Another wildcard is [c*], this represents all the controls or the ones that haven't been included yet:
     *      "[c*]-"
     * The example above will render all the controls and at the end it will add a "-".
     *
     *      "[c2]-[c*]"
     * The example above will render first the second control and then the other ones (starting from the first one).
     * @cfg {String|Number} labelWidth The width for the label.
     * It can be a Number or a String. 
     * In case to be a String it must be "auto" or any of the following values:
     *
     * - ##px
     * - ##em
     * - ##%
     *
     * Where ## is a numeric value. 
     * @cfg {Boolean} showColon If a colon is shown after the label text.
     */
    var Field = function(settings) {
        Field.superclass.call(this, settings);
        /**
         * @property {String} [name=[The object's id]] The field's name.
         * @readonly
         */
        this.name = null;
        /**
         * @property {String} [label = "[field]"] The field's label text.
         * @readonly
         */
        this.label = null;
        /**
         * @property {String} [value=""] The field's value.
         * @readonly
         */
        this.value = null;
        /**
         * @property {PMUI.ui.TooltipMessage} [helper] The field's help tooltip
         * @readonly
         */
        this.helper = null;
        /**
         * @property {PMUI.ui.TooltipMessage} [message] A {@link PMUI.ui.TooltipMessage TooltipMessage} 
         * object to show a message related to the field (i.e. validation error messages)
         * @private
         */
        this.message = null;
        /**
         * @property {Array} controls An array, it will contain all the necessary Control objects
         * @private
         */
        this.controls = [];
        /**
         * @property {Array} validators An array which will contain all the 
         {@link PMUI.form.Validator Validators} object.
         * @private
         */
        this.validators = [];
        /**
         * @property {String} [controlPositioning="[c*]"] A formatted string that specifies 
         * the order output for the field's controls.
         * @readonly
         */
        this.controlPositioning = null;
        /**
         * @property {Object} [dom] A JSON object which will contain important DOM object 
         for the Field object.
         * @private
         */
        this.dom = null;
        /**
         * @property {Boolean} [helperIsVisible=false] A Boolean that let us 
         know if the help tooltip will be shown or not.
         * @readonly
         */
        this.helperIsVisible = null;
        /**
         * @property {String} [labelWidth="30%"]
         * The width for the label.
         * @readonly
         */
        this.labelWidth = null;
        /**
         * @property {Boolean} [colonVisible="true"]
         * If a colon is shown after the label text.
         * @readonly
         */
        this.colonVisible = null;
        /**
         * @property {Function} [onChange] A function to be called when the field's value changes.
         */
        this.onChange = null;
        /**
         * @property {String} valueType The value data type for the field.
         */
        this.valueType = null;

        Field.prototype.init.call(this, settings);
    };

    PMUI.inheritFrom('PMUI.core.Element', Field);

    Field.prototype.type = "Field";

    Field.prototype.init = function(settings) {
        var defaults = {
            name: this.id,
            label: '[field]',
            value: '',
            helper: '',
            showHelper: false,
            validators: [],
            valueType: 'string',
            controlPositioning: '[c*]',
            labelWidth: '30%',
            width: '100%',
            showColon: true,
            onChange: null
        };

        $.extend(true, defaults, settings);

        this.helper = new PMUI.ui.TooltipMessage({
            category: 'help'
        });

        this.dom = {};

        this.message = new PMUI.ui.TooltipMessage({
            category: 'error',
            displayMode: 'block',
            mode: 'normal',
            visible: false
        });

        this.setName(defaults.name)
            .setLabel(defaults.label)
            .setValue(defaults.value)
            .setHelper(defaults.helper)
            .setValueType(defaults.valueType)
            .setControlPositioning(defaults.controlPositioning)
            .setOnChangeHandler(defaults.onChange)
            .setLabelWidth(defaults.labelWidth)
            .setWidth(defaults.width)
            .setControls();
            //.setValidators(defaults);
            //
        if(defaults.showHelper) {
            this.showHelper();  
        } else {
            this.hideHelper();
        }
        if(defaults.showColon) {
            this.showColon();
        } else {
            this.hideColon();
        }
    };
    /**
     * Shows a colon after the label text.
     * @chainable
     */
    Field.prototype.showColon = function() {
        this.colonVisible = true;
        return this.setLabel(this.label);
    };
    /**
     * Hides the colon after the label text.
     * @chainable
     */
    Field.prototype.hideColon = function() {
        this.colonVisible = false;
        return this.setLabel(this.label);
    };
    /**
     * Sets the width for the label.
     * @param {String|Number} width It can be a Number or a String. 
     * In case to be a String it must be "auto" or any of the following values:
     *
     * - ##px
     * - ##em
     * - ##%
     *
     * Where ## is a numeric value.
     * @chainable
     */
    Field.prototype.setLabelWidth = function(width) {
        if(typeof width === 'number') {
            this.labelWidth = width + "px";
        } else if(/^\d+(\.\d+)?(px|em|%)$/.test(width) || width === "auto") {
            this.labelWidth = width;
        } else {
            throw new Error('setLabelWidth(): invalid "width" parameter');
        }
        if(this.dom.labelTextContainer) {
            this.dom.labelTextContainer.style.width = this.labelWidth;
            this.message.style.addProperties({"margin-left": this.labelWidth});
        }
        return this;
    };
    /**
     * Sets the callback function to be called when the field's value changes.
     * @param {Function} handler
     * @chainable
     */
    Field.prototype.setOnChangeHandler = function(handler) {
        if(typeof handler === 'function') {
            this.onChange = handler;
        }

        return this;
    };
    /**
     * Sets the helper tooltip visible.
     * @chainable
     */
    Field.prototype.showHelper = function() {
        this.helperIsVisible = true;
        this.helper.setVisible(true);
        return this;
    };
    /**
     * Sets the helper tooltip non visible.
     * @chainable
     */
    Field.prototype.hideHelper = function() {
        this.helperIsVisible = false;
        this.helper.setVisible(false);
        return this;
    };
    /**
     * Returns an array with all the field's controls.
     * @return {Array}
     */
    Field.prototype.getControls = function() {
        return this.controls;
    };  
    /**
     * Returns an index based field's control.
     * @param  {Number} index An integer value.
     * @return {PMUI.control.Control}
     */
    Field.prototype.getControl = function(index) {
        index = index || 0;
        return this.controls[index];
    };
    /**
     * Sets the controlPositioning property.
     * @param {String} positioning The string must have the same format that the 
     {@link PMUI.form.Field#cfg-controlPositioning controlPositioning} config option.
     */
    Field.prototype.setControlPositioning = function(positioning) {
        var pos, controlPos, i, j, k, controls, span, addControl, that = this;
        if(typeof positioning === 'string') {
            this.controlPositioning = positioning;
            if(this.html && this.controls.length) {
                $(this.dom.controlContainer).empty();
                if(positioning !== "") {
                    controls = this.controls.slice();
                    pos = positioning.split(/\[c[\d|\*]\]/);
                    controlPos = positioning.match(/\[c[\d|\*]\]/g);
                    addControl = function(c) {
                        var k;
                        if(c === '[c*]') {
                            for(k = 0; k < controls.length; k++) {
                                if(controls[k] !== null) {
                                    that.dom.controlContainer.appendChild(controls[k].getHTML());
                                    controls[k] = null; 
                                }
                            }
                        } else {
                            k = c.match(/\d+/);
                            k = parseInt(k[0], 10);
                            if(controls[k] !== null) {
                                that.dom.controlContainer.appendChild(controls[k].getHTML());
                                controls[k] = null; 
                            }
                        }   
                    };

                    j = 0;
                    for(i = 0; i < pos.length; i++) {
                        if(pos[i] === "" && j < controlPos.length) {
                            addControl(controlPos[j]);
                            j++;
                        } else {
                            span = PMUI.createHTMLElement('span');
                            span.textContent = pos[i];
                            this.dom.controlContainer.appendChild(span);
                        }
                        if(j < controlPos.length) {
                            addControl(controlPos[j]);
                                j++;
                        }
                    }

                    this.dom.controlContainer.appendChild(this.helper.getHTML());
                }
            }
        } else {
            throw new Error("The setControlPositioning() method only accepts string values.");
        }

        return this;
    };
    /**
     * Sets the controls for the field.
     *
     * Since this is an abstract method, it must be implemented in its non-abstract subclasses
     * @abstract
     * @private
     */
    Field.prototype.setControls = function() {
    };
    /**
     * Sets the name for the Field
     * @param {String} name
     */
    Field.prototype.setName = function(name) {
        if(typeof name === 'string') {
            this.name = name;
        } else {
            throw new Error('The setName() method only accepts string values!');
        }
        return this;
    };
    /**
     * Returns the field's name
     * @return {String}
     */
    Field.prototype.getName = function() {
        return this.name;
    };
    /**
     * Sets the text for the field's label.
     * @param {String} label
     */
    Field.prototype.setLabel = function(label) {
        if(typeof label === 'string') {
            this.label = label;
        } else {
            throw new Error("The setLabel() method only accepts string values!");
        }
        if(this.dom.labelTextContainer) {
            this.dom.labelTextContainer.textContent = this.label + (this.colonVisible ? ':' : '');
        }
        return  this;
    };
    /**
     * Returns the text from the field's label.
     * @return {String}
     */
    Field.prototype.getLabel = function() {
        return this.label;
    };
    /**
     * Sets the value to the field's controls.
     * @protected
     * @param {String} value
     * @chainable
     */
    Field.prototype.setValueToControls = function(value) {
        var i;
        for(i = 0; i < this.controls.length; i += 1) {
            this.controls[i].setValue(value);
        }
        return this;
    };
    /**
     * Update the field's value property from the controls
     * @protected
     * @chainable
     */
    Field.prototype.updateValueFromControls = function() {
        var value = '', i;

        for(i = 0; i < this.controls.length; i++) {
            value += ' ' + this.controls[i].getValue();
        }

        this.value = value.substr(1);

        return this;
    };
    /**
     * Sets the field's value.
     * @param {String} value
     */
    Field.prototype.setValue = function(value) {
        if(typeof value === 'string') {
            this.value = value;
            this.setValueToControls(value);
        } else {
            throw new Error("The setValue() method only accepts string values!");
        }
        return this;
    };
    /**
     * Returns the field's value.
     * @return {String} [description]
     */
    Field.prototype.getValue = function() {
        return this.value;
    };
    /**
     * Sets the helper text.
     * @param {String} helper
     */
    Field.prototype.setHelper = function(helper) {
        this.helper.setMessage(helper);

        return this;
    };
    /**
     * Shows a message below the control.
     * @param  {String} message  The message
     * @param  {String} [category="info"] The message category,
     * It can be one of the accepted values for the {@link PMUI.form.TooltipMessage#setCategory 
     TooltipMessage's setCategory() method}, it defaults to "info".
     * @chainable
     */
    Field.prototype.showMessage = function(message, category) {
        this.message.setCategory(category || 'info')
            .setMessage(message)
            .setVisible(true);

        return this;
    };
    /**
     * Hides the message below the control.
     * @chainable
     */
    Field.prototype.hideMessage = function() {
        this.message.setVisible(false);

        return this;
    };
    /**
     * Sets the value type for the field.
     * @param {String} type
     */
    Field.prototype.setValueType = function(type) {
        if(typeof type === 'string') {
            this.valueType = type;
        } else {
            throw new Error("The setValueType() method onyl accepts string values!");
        }

        return this;
    };
    /**
     * Returns the field's value type.
     * @return {String}
     */
    Field.prototype.getValueType = function() {
        return this.valueType;
    };
    /**
     * The onChange event handler constructor.
     * @private
     * @return {Function} The handler.
     */
    Field.prototype.onChangeHandler = function() {
        var that = this;

        return function() {
            var previousValue = that.value;
            that.updateValueFromControls();
            if(typeof that.onChange === 'function') {
                that.onChange(previousValue, that.getValue());
            }
        };
    };
    /**
     * Attach the event listeners to the HTML element
     * @private
     * @chainable
     */
    Field.prototype.defineEvents = function() {
        var i;

        for(i = 0; i < this.controls.length; i++) {
            this.controls[i].setOnChangeHandler(this.onChangeHandler());
        }

        return this;
    };
    /**
     * Create the HTML Element for the Field.
     * @protected
     * @return {HTMLElement}
     */
    Field.prototype.createHTML = function() {
        var html, label, 
            labelTextContainer, 
            controlContainer, 
            messageContainer;

        if(!this.html) {
            //html = PMUI.createHTMLElement("div");
            Field.superclass.prototype.createHTML.call(this);
            label = PMUI.createHTMLElement("label");
            labelTextContainer = PMUI.createHTMLElement("span");
            labelTextContainer.className = 'pmui-field-label';
            controlContainer = PMUI.createHTMLElement("span");
            controlContainer.className = 'pmui-field-control';
            messageContainer = PMUI.createHTMLElement("span");
            messageContainer.className = 'pmui-field-message';

            labelTextContainer.textContent = this.label;
            messageContainer.appendChild(this.message.getHTML());
            
            label.appendChild(labelTextContainer);
            label.appendChild(controlContainer);
            label.appendChild(messageContainer);
            this.html.appendChild(label);

            this.dom.labelTextContainer = labelTextContainer;
            this.dom.controlContainer = controlContainer;
            this.dom.messageContainer = messageContainer;
            //this.html = html;

            this.setControlPositioning(this.controlPositioning);
            this.setLabelWidth(this.labelWidth);
            this.setLabel(this.label);
            this.defineEvents();
        }

        return this.html;
    };

    PMUI.extendNamespace('PMUI.form.Field', Field);

    if (typeof exports !== "undefined") {
        module.exports = Field;
    }
}());