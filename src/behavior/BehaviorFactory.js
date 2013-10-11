(function () {
	/**
	 * @class  PMUI.behavior.BehaviorFactory
	 * @extend PMUI.util.Factory
	 * Extends the factory class to produce Behavior instances
	 *
	 * @constructor
	 * Creates a new instance od the class
	 * @param {Object} options 
	 */
	var BehaviorFactory = function (options) {
		BehaviorFactory.superclass.call(this, options);
	};

	PMUI.inheritFrom('PMUI.util.Factory', BehaviorFactory);

	/**
	 * Defines the object's type
	 * @type {String}
	 */
	BehaviorFactory.prototype.type = 'BehaviorFactory';

	/**
	 * Overwrite the make function to accept strings
	 * @param  {Object/String} type 
	 * @return {Object} 
	 */
	BehaviorFactory.prototype.make = function (obj) {
		var behaviorInstance,
			behaviorType = obj.pmType;
		if (this.isValidClass(obj)){
			behaviorInstance = obj;
		} else if (this.isValidName(behaviorType)) {
			behaviorInstance = this.build(behaviorType, obj);
		} else if (this.isValidName(obj)) {
			behaviorInstance = this.build(obj, {});
		} else {
			behaviorInstance = this.build(this.defaultProduct, obj);
		}
		return behaviorInstance;
	};

	PMUI.extendNamespace('PMUI.behavior.BehaviorFactory', BehaviorFactory);

	if (typeof exports !== 'undefined') {
		module.exports = BehaviorFactory;
	}

}());