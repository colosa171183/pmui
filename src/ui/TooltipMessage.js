(function() {
    /**
     * @class PMUI.form.TooltipMessage
     * @extends PMUI.core.Element
     * Class to handle tooltip elements and alert messages
     *      //usage example
     *      //creates 4 TooltipMessage instances:
     *      var a, b, c, d;
            $(function() {
                // Instantiates a simple info message
                a = new PMUI.ui.TooltipMessage({
                    message: "Hi folks! this is a info",
                    category: "info",
                    displayMode: "block",
                    mode: "normal"
                });
                //Instantiates an error tooltip with mouse tracking option enabled
                b = new PMUI.ui.TooltipMessage({
                    message: "Hi folks! this is an error",
                    category: "error",
                    track: true,
                    displayMode: "block"
                });
                //Instantiates a warning tooltip with a slide down effect when the tooltip is opened
                c = new PMUI.ui.TooltipMessage({
                    message: "Hi folks! this is a warning",
                    category: "warning",
                    displayMode: "block",
                    showEffect: {
                        effect: "slideDown",
                        delay: 250
                    }
                });
                //Instantiates a help tooltip with a explode effect when the tooltip is hidded
                d = new PMUI.ui.TooltipMessage({
                    message: "Hi folks! this is a help",
                    category: "help",
                    displayMode: "block",
                    hideEffect: {
                        effect: "explode",
                        delay: 250
                    }
                });
                document.body.appendChild(a.createHTML());
                document.body.appendChild(b.createHTML());
                document.body.appendChild(c.createHTML());
                document.body.appendChild(d.createHTML());
            });
     *
     * @constructor
     * Create a new instace of the class 'TooltipMessage'
     * @param {Object} settings 
     * A JSON object which can contain the following fields: 
     * 
     *  - message: (String) The message to show
     *  - category: (String) The object's category, it can be "info", "help", "warning" or "error"
     *  - displayMode: (String) Determines if the object will have an "inline" or "block" displaying
     *  - mode: (String) When is set to "tooltip" the object has a tooltip behavior, but when is set to "normal" it 
     has a regular message behavior
     *  - tooltipClass: (String) the css class for the HTML element which will contain the message
     *  - tooltipPosition: (Object) specifies the position for the tooltip, read the 
     {@link PMUI.ui.TooltipMessage#setTooltipPosition .setTooltipPosition()} for more info
     *  - showEffect: (Object) specifies the animation to apply when the tooltip is shown, read the 
     {@link PMUI.ui.TooltipMessage#setShowEffect .setShowEffect()} for more info
     *  - hideEffect: (Object) specifies the animation to apply when the tooltip is hidden, read the 
     {@link PMUI.ui.TooltipMessage#setHideEffect .setHideEffect()} for more info
     *  - onOpen: (Function) a callback function to be invoked when the tooltip is shown
     *  - onClose: (Function) a callback functio to be invoked when the tooltip is hidden
     *  - track: (Boolean) a turns on/off the tooltip to follow the mouse movement
     * Note: tooltipClass, tooltipPosition, showEffect, hideEffect, onOpen, onClose and track options 
     only are applied when the mode is set to "tooltip"  
     */
    var TooltipMessage = function(settings) {
        TooltipMessage.superclass.call(this, settings);
        /**
         * @property {PMUI.core.Element} icon
         * An {@link PMUI.core.Element} which is used to put the icon in
         * @private
         */
        this.icon = null;
        /**
         * An Element
         * @type {PMUI.core.Element} which is used to display the message when the mode is set to "normal"
         * @private
         */
        this.messageArea = null;
        /**
         * @property {String} [message=""] 
         * The message to be displayed
         * @readonly
         */
        this.message = null;
        /**
         * @property {String} [category="help"] 
         * The category for the message
         * @readonly
         */
        this.category = null;
        /**
         * @property {String} [displayMode="inline"]
         * The displaying mode for the object's HTML element
         * @readonly
         */
        this.displayMode = null;
        /**
         * @property {String} [mode="tooltip"]
         * The object's behavior mode
         * @readonly
         */
        this.mode = null;
        /**
         * @property {Object} [tooltipPosition={ 
                my: "left top+15", 
                at: "left bottom", 
                collision: "flipfit" 
            }]
         * The tooltip position
         * @readonly
         */
        this.tooltipPosition = null;
        /**
         * @property {String} [tooltipClass="pmui-tooltip-message"]
         * The CSS class name for the tooltip HTML element
         * @readonly
         */
        this.tooltipClass = null;
        /**
         * @property {Object|Boolean|String|Number} [showEffect=null]
         * The effect to apply when the tooltip is shown
         */
        this.showEffect = null;
        /**
         * @property {Object|Boolean|String|Number} [hideEffect=null]
         * The effect to apply when the tooltip is hidden
         */
        this.hideEffect = null;
        /**
         * @property {Function} [onOpen=null]
         * The function callback to be invoked when the tooltip is shown
         */
        this.onOpen = null;
        /**
         * @property {Function} [onClose=null]
         * The function callback to be invoked when the tooltip is hidden
         * @type {Function}
         */
        this.onClose = null;
        /**
         * @property {Boolean} [track=false]
         * A boolean that specifies if the the tooltip element must follow the mouse position
         */
        this.track = null;
        TooltipMessage.prototype.init.call(this, settings);
    };

    PMUI.inheritFrom('PMUI.core.Element', TooltipMessage);

    TooltipMessage.prototype.type = 'PMUITooltipMessage';

    TooltipMessage.prototype.family = 'PMUITooltipMessage';

    TooltipMessage.prototype.init = function(settings) {
        var defaults = {
            message: "",
            category: "help",
            displayMode: "inline",
            mode: "tooltip",
            tooltipClass: 'pmui-tooltip-message',
            tooltipPosition: { 
                my: "left top+15", 
                at: "left bottom", 
                collision: "flipfit" 
            },
            showEffect: null,
            hideEffect: null, 
            onOpen: null, 
            onClose: null,
            track: false
        };

        $.extend(true, defaults, settings);

        this.onClose = defaults.onClose;
        this.onOpen = defaults.onOpen;

        this.setTooltipClass(defaults.tooltipClass)
            .setTooltipPosition(defaults.tooltipPosition)
            .setShowEffect(defaults.showEffect)
            .setHideEffect(defaults.hideEffect)
            .setTrack(defaults.track)
            .setMessage(defaults.message)
            .setCategory(defaults.category)
            .setDisplayMode(defaults.displayMode)
            .setMode(defaults.mode);
    };
    /**
     * Set the CSS class for the HTML element which will contain the tooltip message.
     * This only takes effect when the mode property is set to "tooltip"
     * @param {String} tooltipClass
     */
    TooltipMessage.prototype.setTooltipClass = function(tooltipClass) {
        this.tooltipClass =  tooltipClass;
        return this;
    };
    /**
     * Establish if the HTML element which will be contain the tooltip message should track 
     (follow) the mouse position when it appears
     * * This only takes effect when the mode property is set to "tooltip"
     * @param {Boolean} [track=true]
     */
    TooltipMessage.prototype.setTrack = function(track) {
        this.track = !! track;
        if(this.html) {
            this.setMode(this.mode);
        }
        return this;
    };
    /**
     * [setHideEffect description]
     * If and how to animate the hiding of the tooltip.
     * This only takes effect when the mode property is set to "tooltip"
     * @param {Object|Boolean|String|Number} effect
     * - Boolean: When set to false, no animation will be used and the tooltip will be hidden 
     immediately. When set to true, the tooltip will fade out with the default duration and the 
     default easing.
     * - Number: The tooltip will fade out with the specified duration and the default easing.
     * - String: The tooltip will be hidden using the specified effect. The value can either be the 
     name of a built-in jQuery animation method, such as "slideUp", or the name of a jQuery UI effect, 
     such as "fold". In either case the effect will be used with the default duration and the default easing.
     * - Object: If the value is an object, then effect, delay, duration, and easing properties may be 
     provided. If the effect property contains the name of a jQuery method, then that method will be used; 
     otherwise it is assumed to be the name of a jQuery UI effect. When using a jQuery UI effect that supports 
     additional settings, you may include those settings in the object and they will be passed to the effect. 
     If duration or easing is omitted, then the default values will be used. If effect is omitted, 
     then "fadeOut" will be used. If delay is omitted, then no delay is used.
     */
    TooltipMessage.prototype.setHideEffect = function(effect) {
        this.hideEffect = effect;
        if(this.html) {
            this.setMode(this.mode);
        }
        return this;
    };
    /**
     * If and how to animate the showing of the tooltip.
     * This only takes effect when the mode property is set to "tooltip"
     * @param {Object|Boolean|String|Number} effect
     * - Boolean: When set to false, no animation will be used and the tooltip will be shown immediately. 
     When set to true, the tooltip will fade in with the default duration and the default easing.
     * - Number: The tooltip will fade in with the specified duration and the default easing.
     * - String: The tooltip will be shown using the specified effect. The value can either be the name of 
     a built-in jQuery animation method, such as "slideDown", or the name of a jQuery UI effect, such as 
     "fold". In either case the effect will be used with the default duration and the default easing.
     * - Object: If the value is an object, then effect, delay, duration, and easing properties may be 
     provided. If the effect property contains the name of a jQuery method, then that method will be used; 
     otherwise it is assumed to be the name of a jQuery UI effect. When using a jQuery UI effect that 
     supports additional settings, you may include those settings in the object and they will be passed 
     to the effect. If duration or easing is omitted, then the default values will be used. If effect is 
     omitted, then "fadeIn" will be used. If delay is omitted, then no delay is used.
     */
    TooltipMessage.prototype.setShowEffect = function(effect) {
        this.showEffect = effect;
        if(this.html) {
            this.setMode(this.mode);
        }
        return this;
    };
    /**
     * Identifies the position of the tooltip in relation to the associated target element. 
     * The of option defaults to the target element, but you can specify another element to position 
     against. You can refer to the [jQuery UI Position][1] utility for more details about the various options.
     * [1]: http://api.jqueryui.com/position
     * @param {Object} position
     */
    TooltipMessage.prototype.setTooltipPosition = function(position) {
        this.tooltipPosition = position;
        if(this.html) {
            this.setMode(this.mode);
        }
        return this;
    };
    /**
     * Sets the message to be shown in both normal and tooltip modes
     * @param {String} message
     */
    TooltipMessage.prototype.setMessage = function(message) {
        if(typeof message === 'string') {
            this.message = message;
            if(this.html) {
                if(this.messageArea) {
                    this.messageArea.getHTML().textContent = message;
                }

                if(this.mode === 'tooltip') {
                    this.icon.html.title = message;
                } else {
                    this.icon.html.title = "";
                }
            }
        } else {
            throw new Error("setMessage() method only accepts string values.");
        }
        return this;
    };
    /**
     * Set the category for the tooltip/message object
     * @param {String} category the value can be one of the following:
     * 
     * - help
     * - info
     * - error
     * - warning
     */
    TooltipMessage.prototype.setCategory = function(category) {
        var validCategories = [
                "help", "info", "error", "warning"
            ];
        if(typeof category === 'string' && validCategories.indexOf(category) > -1) {
            this.category = category;
            if(this.icon && this.messageArea) {
                this.icon.style.removeAllClasses();
                this.icon.style.addClasses(['pmui-icon', 'pmui-icon-' + category]);
                this.messageArea.className = 'pmui-tooltip-message pmui-tooltip-' + category + '-message';
            }
            if(this.html) {
                if(this.category === "error") {
                    this.style.addClasses(["pmui-tooltip-category-error"]);
                } else {
                    this.style.removeClasses(["pmui-tooltip-category-error"]);
                }
            }
        } else {
            throw new Error('setCategory() method only accepts' + 
                ' one of the following values: "help", "info", "warning", "info".');
        }

        return this;
    };
    /**
     * Sets the CSS displaying mode
     * @param {String} displayMode It can take the "block" or "inline" values
     */
    TooltipMessage.prototype.setDisplayMode = function(displayMode) {
        if(displayMode === 'block' || displayMode === 'inline') {
            this.displayMode = displayMode;
            if(this.html) {
                this.style.addProperties({"display": displayMode});
            }
        } else {
            throw new Error('setDisplayMode() method only accepts "inline" or "block" values');
        }

        return this;
    };
    /**
     * Sets the mode for the object, it determines if the current object has a tooltip or notification message behavior
     * @param {String} mode It only can take one of the following values:
     * - "tooltip"
     * - "normal"
     */
    TooltipMessage.prototype.setMode = function(mode) {
        if(mode === 'tooltip' || mode === 'normal') {
            this.mode = mode;
            if(this.html) {
                $(this.html).addClass('pmui-tooltip-mode-' + mode);
                if(mode === 'tooltip') {
                    this.messageArea.setVisible(false);
                    this.icon.html.title = this.message;
                    $(this.icon.html).tooltip({
                        tooltipClass: this.tooltipClass,
                        position: this.tooltipPosition,
                        show: this.showEffect,
                        hide: this.hideEffect,
                        open: this.onOpen,
                        track: this.track,
                        close: this.onClose
                    });
                } else {
                    try {
                        $(this.icon.html).tooltip('destroy');
                    } catch(ex) {}
                    this.icon.html.title = "";
                    this.messageArea.setVisible(true);
                }
            }
        } else {
            throw new Error('setMode() method only accepts "tooltip" or "normal" values');
        }

        return this;
    };
    /**
     * It creates the HTML Element for the current object
     * @return {HTMLElement}
     */
    TooltipMessage.prototype.createHTML = function() {
        var html, messageArea, icon;
        if(this.html) {
            return this.html;
        }

        html = PMUI.createHTMLElement("span");
        html.className = 'pmui-tooltip';
        icon = new PMUI.core.Element({
            elementTag: 'span',
            width: 16,
            height: 16,
            style: {
                cssClasses: ['pmui-icon'],
                cssProperties: {
                    display: "inline-block",
                    "vertical-align": "middle"
                }
            }
        });
        messageArea = new PMUI.core.Element({
            elementTag: 'span',
            style: {
                cssClasses: ['pmui-tooltip-message']
            }       
        });

        html.appendChild(icon.getHTML());
        html.appendChild(messageArea.getHTML());
        this.icon = icon;
        this.messageArea = messageArea;
        this.html = html;

        this.applyStyle();
        
        this.setCategory(this.category);
        this.setMessage(this.message);
        this.setMode(this.mode);

        return this.html;
    };

    PMUI.extendNamespace('PMUI.ui.TooltipMessage', TooltipMessage);

    if (typeof exports !== "undefined") {
        module.exports = TooltipMessage;
    }
}());
