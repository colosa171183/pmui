(function(){
	/**
	 * @class PMUI.event.Event
	 * Handles the events generated in the PMUI library
	 * @abstract
	 *
	 * @constructor
	 * Creates a new instance of class
	 * @param {Object} options 
	 *
	 * @cfg {Object} element Defines the HTMLElement
	 * @cfg {Function} handler Defines the callback Function to be executed
	 * @cfg {PMUI.event.Action} action Defines an Action to be used to handle the callback
	 * @cfg {String} name Event name
	 */
	var Event = function (options) {
		/**
		 * Stores the HTMLElement associated
		 * @type {Object}
		 */
		this.element = null;
		/**
		 * Stores the callback function to be executed
		 * @type {Function}
		 */
		this.handler = null;

		/**
		 * Event name
		 * @type {String}
		 */
		this.eventName = null;
		Event.prototype.init.call(this, options);
	};

	/**
	 * Defines the object's type
	 * @type {String}
	 */
	Event.prototype.type = "Event";

	/**
	 * Defines the object's family
	 * @type {String}
	 */
	Event.prototype.family = "Event";

	/**
	 * @private
	 * Initializes the object with default options
	 * @param  {Object} options 
	 */
	Event.prototype.init = function (options){
		var defaults = {
			handler: function(scope) {}
		};
		jQuery.extend(true, defaults, options);
		if (defaults.action && defaults.action instanceof PMUI.event.Action) {
			this.setHandler(defaults.action.handler);
		} else {	
			this.setHandler(defaults.handler);	
		}
		this.setElement(defaults.element)
			.setEventName(defaults.name);
		return this;
	};

	/**
	 * Sets the HTML Element
	 * @param {Object} element [description]
	 */
	Event.prototype.setElement = function (element){
		this.element = element;
		return this;
	};

	/**
	 * Sets the callback function
	 * @param {Function} fn 
	 */
	Event.prototype.setHandler = function (fn) {
		if (typeof fn === 'function') {
			this.handler = fn;
		}
		return this;
	};

	/**
	 * Sets the event name
	 * @param {String} name
	 */
	Event.prototype.setEventName = function (name) {
		this.eventName = name;
		return this;
	};

	/**
	 * @abstract
	 * Defines the way to listen the event (jquery)
	 * @param  {HTMLElement} element [description]
	 * @param  {Function} handler [description]
	 */
	Event.prototype.listen = function (element, handler){
	};

	PMUI.extendNamespace('PMUI.event.Event', Event);

	if (typeof exports !== 'undefined') {
		module.exports = Event;
	}

}());