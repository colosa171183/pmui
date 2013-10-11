(function () {
	/**
	 * @class PMUI.layout.Layout
	 * Defines the properties for the different layouts in the panels
	 * @abstract
	 **/
	var Layout = function (options) {
		/**
		 * Defines the container to apply the layout
		 * @type {Object}
		 */
		this.belongsTo = null;
		Layout.prototype.init.call(this, options);
	};

	/**
	 * Defines the object's type
	 * @type {String}
	 */
	Layout.prototype.type = "Layout";

	/**
	 * Defines the object's family
	 * @type {String}
	 */
	Layout.prototype.family = "Layout";

	Layout.prototype.init = function (options) {
		var defaults = {
			belongsTo :  null
		};

		jQuery.extend(true, defaults, options);
		this.setContainer(defaults.belongsTo);
	};

	/**
	 * Applies the layout to the container
	 * @abstract
	 */
	Layout.prototype.applyLayout = function () {
		return this;
	};

	/**
	 * Sets the parent container
	 * @param {Object} parent Container Object
	 */
	Layout.prototype.setContainer = function (parent) {
		this.belongsTo = parent;
		return this;
	};

	PMUI.extendNamespace('PMUI.layout.Layout', Layout);

	if (typeof exports !== 'undefined') {
		module.exports = Layout;
	}

}());