(function() {
	/**
	 * @class  PMUI.form.FormItemFactory
	 * @extend PMUI.util.Factory
	 * Extends the factory class to produce objects to be included in containers for forms. 
	 * 
	 * Its default products are:
	 * 
	 * - {@link PMUI.form.FormPanel FormPanel} objects: using "panel".
	 * - {@link PMUI.field.TextField TextField} objects: using "text".
	 *
	 * @constructor
	 * Creates a new instance od the class
	 */
	var FormItemFactory = function() {
		FormItemFactory.superclass.call(this);
		FormItemFactory.prototype.init.call(this);
	};

	PMUI.inheritFrom('PMUI.util.Factory', FormItemFactory);

	FormItemFactory.prototype.init = function() {
		var defaults = {
			products: {
				"panel": PMUI.form.FormPanel,
				"text": PMUI.field.TextField
			}, 
			defaultProduct: "panel"
		};
		this.setProducts(defaults.products)
			.setDefaultProduct(defaults.defaultProduct);
	};

	PMUI.extendNamespace('PMUI.form.FormItemFactory', FormItemFactory);

}());