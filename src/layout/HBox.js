(function () {
	/**
	 * @class  PMUI.layout.HBox
	 * @extends PMUI.layout.Layout
	 * Class created to handle Horizontal Box layout changes
	 *
	 * @constructor
	 * Creates a new isntance of the object
	 * @param {Object} options Constructor object
	 */
	var HBox = function (options) {
		HBox.superclass.call(this, options);
		HBox.prototype.init.call(this, options);
	};

	PMUI.inheritFrom('PMUI.layout.Layout', HBox);
	
	/**
	 * Defines the object's type
	 * @type {String}
	 */
	HBox.prototype.type = "HBox";

	/**
	 * @private
	 * Initializes the object with default values
	 * @param  {Object} options 
	 */
	HBox.prototype.init = function (options) {
		var defaults = {

		};
		jQuery.extend(true, defaults, options);
	};

	/**
	 * Applies the layout to the current element
	 */
	HBox.prototype.applyLayout = function () {
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
            item.setWidth(owner.getWidth() * (item.proportion / totalProportion));
            item.setHeight(owner.getHeight());
        }
        return this;
	};

	PMUI.extendNamespace('PMUI.layout.HBox', HBox);

	if (typeof exports !== 'undefined') {
		module.exports = HBox;	
	}

}());