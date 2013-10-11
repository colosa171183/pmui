(function () {
	/**
	 * @class  PMUI.event.EventFactory
	 * @extend PMUI.util.Factory
	 * Extends the factory class to produce Events instances
	 *
	 * @constructor
	 * Creates a new instance od the class
	 */
	var EventFactory = function () {
		EventFactory.superclass.call(this);
		EventFactory.prototype.init.call(this);
	};

	PMUI.inheritFrom('PMUI.util.Factory', EventFactory);

	/**
	 * Defines the object's type
	 * @type {String}
	 */
	EventFactory.prototype.type = 'EventFactory';

	/**
	 * @private
	 * Define the event types supported
	 * @type {Object}
	 */
	EventFactory.prototype.eventTypes = {
		'click' : 'mouse',
        'mousedown' : 'mouse',
        'mouseup' : 'mouse',
        'mousemove' : 'mouse',
        'mouseover' : 'mouse',
        'mouseout' : "mouse",
        'mouseenter': "mouse",
        'mouseleave': "mouse",
        'dblclick' : "mouse",
        'drag': 'mouse',
        'drop' : 'mouse',
        'resize': 'mouse',
        'rightclick' : 'mouse',
        'contextmenu' : 'mouse',
        'blur': 'form',
        'change': 'form',
        'focus': 'form',
        'select': 'form',
        'submit': 'form',
        'keyup' : 'keyboard',
        'keydown': 'keyboard',
        'keypress': 'keyboard'
	};

	/**
	 * @private
	 * Initializes the object with default values
	 */
	EventFactory.prototype.init = function () {
		var defaults = {
			products: {
				"mouse" : PMUI.event.MouseEvent,
				"form" : PMUI.event.FormEvent,
				"keyboard" : PMUI.event.KeyboardEvent,
				"event": PMUI.event.Event				
			},
			defaultProduct: "event"
		};
		this.setProducts(defaults.products)
			.setDefaultProduct(defaults.defaultProduct);
	};

	/**
	 * Overwrite the make function to accept strings
	 * @param  {Object/String} type 
	 * @return {PMUI.event.Event} 
	 */
	EventFactory.prototype.make = function (type) {
		var eventInstance,
			eventType;
		if (this.isValidClass(type)){
			eventInstance = type;
		} else {
			eventType = this.eventTypes[type] || 'event';
			eventInstance = this.build(eventType, {name: type});
		}
		return eventInstance;
	};

	PMUI.extendNamespace('PMUI.event.EventFactory', EventFactory);

	if (typeof exports !== 'undefined') {
		module.exports = EventFactory;
	}

}());