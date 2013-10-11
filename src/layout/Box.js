(function () {
	/**
	 * @class  PMUI.layout.Box
	 * @extends PMUI.layout.Layout
	 * Class created to no layout changes
	 *
	 * @constructor
	 * Creates a new isntance of the object
	 * @param {Object} options Constructor object
	 */
	var Box = function (options) {
		Box.superclass.call(this, options);
		Box.prototype.init.call(this, options);
	};

	PMUI.inheritFrom('PMUI.layout.Layout', Box);
	
	/**
	 * Defines the object's type
	 * @type {String}
	 */
	Box.prototype.type = "Box";

	/**
	 * @private
	 * Initializes the object with default values
	 * @param  {Object} options 
	 */
	Box.prototype.init = function (options) {
		var defaults = {

		};
		jQuery.extend(true, defaults, options);
	};

	/**
	 * Applies the layout to the current element
	 */
	Box.prototype.applyLayout = function () {

	};

	PMUI.extendNamespace('PMUI.layout.Box', Box);

	if (typeof exports !== 'undefined') {
		module.exports = Box;	
	}

}());