(function () {
    /**
     * @class PMUI.core.Panel
     * Handles panels to be inserted into containers, it is composed by three main elements: header, body and footer
     * @abstract
     * @extend PMUI.core.Container
     *
     * @constructor 
     * Creates a new instacne of the object
     * @param {Object} settings
     */
    var Panel = function(settings) {
        Panel.superclass.call(this, settings);
        /**
         * The child {Panel} object
         * @type {PMUI.core.Panel}
         */
        this.panel = null;
        /**
         * The Panel's parent object
         * @type {PMUI.core.Container}
         */
        this.parent = null;
        /**
         * A {Layout} object which handles the position layout for the object's direct child elements
         * @property {PMUI.layout.Layout}
         */
        this.layout = null;
        Panel.prototype.init.call(this, settings);
    };

    PMUI.inheritFrom('PMUI.core.Container', Panel);

    /**
     * Defines the object's type
     * @type {String}
     */
    Panel.prototype.type = 'Panel';

    /**
     * @private
     * Initializes the object with default values
     * @param  {Object} options 
     */
    Panel.prototype.init = function(settings) {
        var defaults = {
            panel: null,
            parent: null,
            layout: 'box'
        };

        jQuery.extend(true, defaults, settings);

        this.setPanel(defaults.panel)
            .setParent(defaults.parent)
            .setLayout(defaults.layout);
    };

    /**
     * Sets the panel object
     * @param {Object} panel Panel object
     */
    Panel.prototype.setPanel = function(panel) {
        if(panel) {
            if(panel instanceof Panel) {
                this.panel = panel;
            } else if(typeof panel === 'object') {
                this.panel = new Panel(panel);
            }

            if(this.html) {
                jQuery(this.html).empty().append(panel.getHTML());
            }
        }

        return this;
    };

    /**
     * Sets the parent object
     * @param {Object} parent
     */
    Panel.prototype.setParent = function(parent) {
        this.parent = parent;
        return this;
    };

    /**
     * Sets the layout object
     * @param {Object} layout Layout object
     */
    Panel.prototype.setLayout = function(layout) {
        var factory = new PMUI.layout.LayoutFactory();
        this.layout = factory.make(layout);
        this.layout.setContainer(this);
        if (this.html) {
            this.layout.applyLayout();
        }
        return this;
    };

    /**
     * Add an item to the panel.
     * @param {PMUI.core.Element|Object} item
     * It can be a valid JSON object or an object that inherits from {@link PMUI.core.Element Element}.
     * @chainable
     */
    Panel.prototype.addItem = function(item) {
        Panel.superclass.prototype.addItem.call(this, item);
        if(this.layout) {
            this.layout.applyLayout();
        }

        return this;
    };
    /**
     * Sets the width for the Panel's HTML element
     * @param {Number|String} width height it can be a number or a string.
      In case of using a String you only can use 'auto' or 'inherit' or ##px or ##% or ##em when ## is a number
     * @chainable
     */
    Panel.prototype.setWidth = function(width) {
        Panel.superclass.prototype.setWidth.call(this, width);
        if(this.layout) {
            this.layout.applyLayout();
        }

        return this;
    };
    /**
     * Sets the height for the Panel's HTML element
     * @param {Number|String} width height it can be a number or a string.
      In case of using a String you only can use 'auto' or 'inherit' or ##px or ##% or ##em when ## is a number
     * @chainable
     */
    Panel.prototype.setHeight = function(height) {
        Panel.superclass.prototype.setHeight.call(this, height);
        if(this.layout) {
            this.layout.applyLayout();
        }
        return this;
    };
    /**
     * Returns the object pointed to the parent
     * @return {Object}
     */
    Panel.prototype.getParent = function() {
        return this.parent;
    };
    /**
     * Creates the HTML element for the Panel
     * @return {HTMLElement} 
     */
    Panel.prototype.createHTML = function() {
        if(this.html) {
            return this.html;
        }

        Panel.superclass.prototype.createHTML.call(this);
        if(this.layout) {
            this.layout.applyLayout();
        }

        return this.html;
    };

    // Declarations created to instantiate in NodeJS environment
    if (typeof exports !== "undefined") {
        module.exports = Panel;
    }

    PMUI.extendNamespace('PMUI.core.Panel', Panel);
}());