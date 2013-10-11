(function () {
	/**
	 * @class PMUI.proxy.Proxy
	 * Defines the proxy functionality to persist data
	 * @abstract
	 *
	 * @constructor
	 * Creates a new instance of this class
	 * @param {Object} options
	 *
	 * @cfg {Object} data Object that will be sent through the proxy 
	 */
	var Proxy = function (options){
		/**
		 * Data object used to send/receive through proxy
		 * @type {Object}
		 */
		this.data = null;
		Proxy.prototype.init.call(this, options);
	};

	/**
	 * Defines the object's type
	 * @type {String}
	 */
	Proxy.prototype.type = "Proxy";

	/**
	 * Defines the object's family
	 * @type {String}
	 */
	Proxy.prototype.family = "Proxy";

	/**
	 * @private
	 * Initilizes the object with the default values
	 * @param {Object} options
	 */
	Proxy.prototype.init = function (options) {
		var defaults = {
			data: null
		};
		jQuery.extend(true, defaults, options);
		this.setData(defaults.data);
	};

	/**
	 * Sets the data
	 * @param {Object} data Object to be sent 
	 */
	Proxy.prototype.setData = function (data) {
		this.data = data;
		return this;
	};

	/**
	 * Returns the data related to this class
	 * @return {Object} 
	 */
	Proxy.prototype.getData = function() {
		return this.data;
	};

	/**
	 * @abstract
	 * Sends the data to the target
	 */
	Proxy.prototype.send = function () {
	};

	/**
	 * @abstract
	 * Receives the data from the target
	 */
	Proxy.prototype.receive = function () {
	};

}());