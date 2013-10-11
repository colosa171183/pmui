(function () {
	/**
	 * @class  PMUI.layout.VBox
	 * @extends PMUI.layout.Layout
	 * Class created to handle Vertical Box layout changes
	 *
	 * @constructor
	 * Creates a new isntance of the object
	 * @param {Object} options Constructor object
	 */
	var VBox = function (options) {
		VBox.superclass.call(this, options);
		VBox.prototype.init.call(this, options);
	};

	PMUI.inheritFrom('PMUI.layout.Layout', VBox);
	
	/**
	 * Defines the object's type
	 * @type {String}
	 */
	VBox.prototype.type = "VBox";

	/**
	 * @private
	 * Initializes the object with default values
	 * @param  {Object} options 
	 */
	VBox.prototype.init = function (options) {
		var defaults = {

		};
		jQuery.extend(true, defaults, options);
	};

	/**
	 * Applies the layout to the current element
	 */
	VBox.prototype.applyLayout = function () {
		// get the object of this layout
        var owner = this.belongsTo,
            items = owner.items,
            totalProportion = 0,
            i,
            item;

        // compute totalProportion
        for (i = 0; i < items.getSize(); i += 1) {
            item = items.get(i);
            totalProportion += item.proportion;
        }

        // set the width of each object based on the width of its parent
        for (i = 0; i < items.getSize(); i += 1) {
            item = items.get(i);
            item.setHeight(owner.getHeight() * (item.proportion / totalProportion));
            item.setWidth(owner.getWidth());
        }
        return this;
	};

	PMUI.extendNamespace('PMUI.layout.VBox', VBox);

	if (typeof exports !== 'undefined') {
		module.exports = VBox;	
	}

}());