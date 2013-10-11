(function () {
    /**
     * @class PMUI.event.Action
     * Handles the action for buttons, menues, toolbars
     *
     * Example:
     * 
     *      var action = new PMUI.event.Action({
     *          text: 'Save Document',
     *          icon: 'pm-icon-save',
     *          disabled: false,
     *          handler: function () {
     *              alert('Action has been called!');
     *          }
     *      });
     *
     * Using action as parameter to create another objects:
     *
     *      var button = new PMUI.ui.Button(action);
     *
     *      var form = new PMUI.form.Form({
     *          ...
     *          buttons: [
     *              action,
     *              {
     *                  text: 'Refresh',
     *                  handler: function() {
     *                      obj.refresh()  //this object is fake used for sample purposes only
     *                  }
     *              }
     *          ]
     *          ...
     *      });
     *
     * Actions are created to handle user functionality you can extend or use over several places or components
     *
     * 
     * @constructor
     * Creates a new instance of object
     * @param {Object} options
     */
    var Action = function (options) {
        /**
         * Defines the text of the action
         * @type {String}
         */
        this.actionText = null;
        /**
         * Defines the icon asssociated with the action
         * @type {String}
         */
        this.actionIcon = null;
        /**
         * Defines the state of the action
         * @type {Boolean}
         */
        this.disabled = false;
        /**
         * Defines the action to be executed
         * @type {Function}
         */
        this.handler = null;

        Action.prototype.init.call(this, options);
    };

    /**
     * Defines the object's type
     * @type {String}
     */
    Action.prototype.type = 'Action';
    /**
     * Defines the object's family
     * @type {String}
     */
    Action.prototype.family = 'Action';

    /**
     * Defines the action flag
     * @type {Boolean}
     */
    Action.prototype.isAction = true;

    /**
     * @private
     * Initializes the object with the default values
     * @param  {Object} options Constructor options
     */
    Action.prototype.init = function (options) {
        var defaults;
        defaults = {
            icon : null,
            text : null,
            disabled: false,
            handler: function () {}
        };
        jQuery.extend(true, defaults, options);
        this.setActionIcon(defaults.icon)
            .setActionText(defaults.text)
            .setDisable(defaults.disabled)
            .setHandler(defaults.handler);
    };

    /**
     * Sets the action Icon
     * @param {String} icon Icon URL or class
     */
    Action.prototype.setActionIcon = function (icon) {
        this.actionIcon = icon;
        return this;
    };

    /**
     * Sets the action's text
     * @param {String} text Actions's name
     */
    Action.prototype.setActionText = function (text) {
        this.actionText = text;
        return this; 
    };

    /**
     * Sets the disabled value
     * @param {Boolean} value 
     */
    Action.prototype.setDisable = function (value) {
        if (typeof(value)==='boolean') {
            this.disabled = value;
        }
        return this;
    };

    /**
     * Returns the icon url or class
     * @return {String} [description]
     */
    Action.prototype.getIcon = function () {
        return this.actionIcon;
    };

    /**
     * Returns the action name
     * @return {String} [description]
     */
    Action.prototype.getText = function () {
        return this.actionText;
    };

    /**
     * Sets the handler function
     * @param {Function} fn
     */
    Action.prototype.setHandler = function (fn) {
        if (typeof(fn) === 'function') {
            this.handler = fn;
        }
        return this;
    };

    /**
     * Enables the action functionality
     */
    Action.prototype.enable = function () {
        this.setDisable(false);
    };

    /**
     * Disables the action functionality
     */
    Action.prototype.disabled = function () {
        this.setDisable(true);
    };

    /**
     * Returns if the action is enabled
     * @return {Boolean}
     */
    Action.prototype.isEnabled = function () {
        return !this.disabled;
    };

    /**
     * Executes the action if is enabled and has a valid handler
     */
    Action.prototype.execute = function () {
        if (!this.disabled && typeof this.handler === 'function') {
            this.handler();
        }
    };


    if (typeof exports !== "undefined") {
        module.exports = Action;
    }

    PMUI.extendNamespace('PMUI.event.Action', Action );

}());