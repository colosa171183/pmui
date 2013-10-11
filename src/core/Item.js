(function (){
	/**
	 * @class  PMUI.core.Item
	 * @extends PMUI.core.Container
	 * Create a items container
	 *
	 * @constructor
	 * Creates a new instance of the class
	 * @param {Object} options Contructor object
	 */
	var Item = function (options) {
		Item.superclass.call(this, options);

		/**
		 * Parent object associated to this item
		 * @type {Object}
		 */
		this.parent = null;
		Item.prototype.init.call(this, options);
	};

	PMUI.inheritFrom('PMUI.core.Container', Item);

	/**
	 * Defines the object's type
	 * @type {String}
	 */
	Item.prototype.type = "Item";

	/**
	 * Defines the object's family
	 * @type {String}
	 */
	Item.prototype.family = "Item";

	/**
	 * @private
	 * Initializes the object with default values
	 * @param  {Object} options 
	 */
	Item.prototype.init = function (options) {
		var defaults = {
			parent: null
		};
		jQuery.extend(true, defaults, options);
		this.setParent(defaults.parent);
	};

	/**
	 * Sets the parent object of the current item
	 * @param {Object} parent Parent object
	 */
	Item.prototype.setParent = function (parent) {
		this.parent = parent;
		return this;
	};

	/**
	 * Returns the parent object pointer
	 * @return {Object}
	 */
	Item.prototype.getParent = function () {
		return this.parent;
	};

	PMUI.extendNamespace('PMUI.core.Item', Item);

	if (typeof exports !== 'undefined') {
		module.exports = Item;
	}
	
}());