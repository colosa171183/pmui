(function(){
	var TextField = function(settings) {
		TextField.superclass.call(this, settings);
		this.minLength = null;
		this.trimOnBlur = null;
		TextField.prototype.init.call(this, settings);
	};

	PMUI.inheritFrom('PMUI.form.Field', TextField);

	TextField.prototype.init = function(settings) {
		var defaults = {
			placeholder: "",
			maxLength: 0,
			minLength: 0,
			trimOnBlur: false
		};

		$.extend(true, defaults, settings);

		this.setPlaceholder(defaults.placeholder)
			.setMaxLength(defaults.maxLength)
			.setMinLength(defaults.minLength)
			.setTrimOnBlur(defaults.trimOnBlur);
	};

	TextField.prototype.setPlaceholder = function(placeholder) {
		this.controls[0].setPlaceholder(placeholder);
		return this;
	};

	TextField.prototype.getPlaceholder = function() {
		return this.controls[0].getPlaceholder();
	};

	TextField.prototype.setMaxLength = function(maxLength) {
		this.controls[0].setMaxLength(maxLength);
		return this;
	};

	TextField.prototype.getMaxLength = function() {
		this.controls[0].getMaxLength();
	};

	TextField.prototype.setMinLength = function(minLength) {
		//Add Validator to control the min length
		this.minLength = minLength;
		return this;
	};

	TextField.prototype.getMinLength = function() {
		return this.minLength;
	};
	TextField.prototype.setTrimOnBlur = function(trimOnBlur) {
		this.trimOnBlur = !! trimOnBlur;
		return this;
	};
	TextField.prototype.getTrimOnBlur = function() {
		return this.trimOnBlur;
	};

	TextField.prototype.setControls = function() {
		if(this.controls.length) {
			return this;
		}

		this.controls.push(new PMUI.control.TextControl());

		return this;
	};

	TextField.prototype.defineEvents = function() {
		var that = this, trimValue = new PMUI.event.Action({
			handler: function(e) {
				var value;
				if(that.trimOnBlur) {
					value = that.controls[0].getValue();
					jQuery.trim(value);
					that.controls[0].setValue();
					that.updateValueFromControls();
				}
			}
		});

		TextField.superclass.prototype.defineEvents.call(this);

		//this.addEvent('blur').listen(this.controls[0].getHTML(), trimValue);
		$(this.controls[0].getHTML()).on("blur", function() {
			var value;
			if(that.trimOnBlur) {
				value = that.controls[0].getValue();
				that.controls[0].setValue(jQuery.trim(value));
				that.updateValueFromControls();
			}
		});

		return this;
	};

	PMUI.extendNamespace('PMUI.field.TextField', TextField);

	if (typeof exports !== "undefined") {
        module.exports = TextField;
    }
}());