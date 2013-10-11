(function () {
    /**
     * @class PMUI.core.Element
     * Base class to handle HTML Divs or any other HTML element
     * @extends PMUI.core.Base
     *
     * @constructor
     * Create a new instace of the class 'Element'
     * @param {Object} options
     */
    var Element = function(settings) {
        Element.superclass.call(this, settings);

        /**
         * HTML element
         * @type {HTMLElement}
         */
        this.html = null;
        /**
         * @property {Object|PMUI.util.Style} [style={
                cssProperties: {},
                cssClasses: []
            }]
         * A {@link PMUI.util.Style Style} object or a JSON object with the settings to create a new 
         {@link PMUI.util.Style Style} object for the current's HTML element
         */
        this.style = null;
        /**
         * X coordinate for the HTML element
         * @type {Number}
         */
        this.x = null;
        /**
         * @property {Number} [y=0]
         * Y Coordinate for the HTML element
         */
        this.y = null;
        /**
         * Width for the HTML element, it can be a number or a string with the following format: 
         ##px when ## is a number
         * @type {Number|String}
         */
        this.width = null;
        /**
         * Height for the HTML element, it can be a number or a string with the following format: 
         ##px when ## is a number
         * @type {Number|String}
         */
        this.height = null;
        /**
         * A boolean value that indicates if the HTML element is visible or not
         * @type {Boolean}
         */
        this.visible = null;
        /**
         * A Number that indicates the HTML element's position on the Z axis
         * @type {Number}
         */
        this.zOrder = null;
        /**
         * @property {String} [elementTag="div"]
         * Tag name for the element to be created, it defaults to "div"
         */
        this.elementTag = null;
        /**
         * @property {String} [positionMode="relative"]
         * Position for the object's html element, it must be a valid value for the "position" CSS property
         */
        this.positionMode = null;

        /**
         * Defines the proportion of the html
         * @type {Number}
         */
        this.proportion = null;
        /**
         * @property {String} [display=""] The display mode for the element.
         */
        this.display = null;

        /**
         * Defines an obejct to handle/register events
         * @type {Object}
         */
        this.events = {};

        Element.prototype.init.call(this, settings);
    };

    PMUI.inheritFrom('PMUI.core.Base', Element);
    /**
     * The Object's type
     * @type {String}
     */
    Element.prototype.type = 'Element';

    Element.prototype.init = function(settings) {
        var defaults = {
            elementTag: "div",
            positionMode: "relative",
            style: {
                cssProperties: {},
                cssClasses: []
            },
            x: 0,
            y: 0,
            width: "auto", 
            height: "auto",
            zOrder: "auto",
            display: "",
            visible: true,
            proportion: 1
        };

        jQuery.extend(true, defaults, settings);

        this.setElementTag(defaults.elementTag)
            .setStyle(defaults.style)
            .setPositionMode(defaults.positionMode)
            .setDisplay(defaults.display)
            .setX(defaults.x)
            .setY(defaults.y)
            .setWidth(defaults.width)
            .setHeight(defaults.height)
            .setZOrder(defaults.zOrder)
            .setVisible(defaults.visible)
            .setProportion(defaults.proportion);
    };
    /**
     * Sets the display mode for the Element
     * @param {String} display It can take one of the following values:
     *
     * - ""
     * - "block"
     * - "inline"
     * - "inline-block"
     * - "none"
     */
    Element.prototype.setDisplay = function(display) {
        if(display === "" || display === 'block' || display === 'inline' 
            || display === 'inline-block' || display === 'none') {
            this.display = display;
            this.applyStyle();
        } else {
            throw new Error('The setDisplay() method only accepts one od the following options: ' + 
                ' "", "block", "inline", "inline-block", "none"');
        }

        return this;
    };
    /**
     * Sets the position mode for the Element
     * @param {String} position It can take one ot the following values:
     *
     * - "static"
     * - "asolute"
     * - "fixed"
     * - "relative"
     * - "inherit"
     */
    Element.prototype.setPositionMode = function(position) {
        if(position === 'static' || position === 'absolute' || position === 'fixed' || position === 'relative' || 
            position === 'inherit') {
            this.positionMode = position;
            this.applyStyle();
        } else {
            throw new Error('The setPosition() method only accepts one of the following options:' + 
                ' "static", "absolute", "fixed", "relative", "inherit"');
        }

        return this;
    };
    /**
     * Set the HTML tag for the HTML element to be created, note that it'll only work when its html property
      is still not set.
     * @param {String} tag a HTML tag
     */
    Element.prototype.setElementTag = function(tag) {
        if(!this.html && typeof tag === 'string') {
            this.elementTag = tag;
        }

        return this;
    };
    /**
     * Set the style properties for the HTML element
     * @param {Object} style an JSON structure with attributes cssProperties (another object) and cssClasses (array) 
     * @chainable
     */
    Element.prototype.setStyle = function(style) {
        if(style instanceof PMUI.util.Style) {
            this.style = style;
            style.belongsTo = this;
        } else if(typeof style === 'object') {
            style.belongsTo = this;
            this.style = new PMUI.util.Style(style);
        }
        return this;
    };
    /**
     * Set the x position coordinate for the HTML element
     * @chainable
     * @param {Number} x
     */
    Element.prototype.setX = function(x) {
        if(typeof x === 'number') {
            this.x = x;
        } else if(/^\d+(\.\d+)?px$/.test(x)) {
            this.x = parseInt(x, 10);
        } else {
            throw new Error('setX: x param is not a number');
        }
        this.style.addProperties({left: this.x});

        return this;
    };
    /**
     * Returns the x position coordinate for the HTML element
     * @return {Number}
     */
    Element.prototype.getX = function() {
        return this.x;
    };
    /**
     * Set the y position coordinate for the HTML element
     * @param {Number} y
     * @chainable
     */
    Element.prototype.setY = function(y) {
        if(typeof y === 'number') {
            this.y = y;
        } else if(/^\d+(\.\d+)?px$/.test(y)) {
            this.y = parseInt(y, 10);
        } else {
            throw new Error('setY: y param is not a number');
        }
        this.style.addProperties({top: this.y});
        return this;
    };
    /**
     * Returns the y position coordinate for the HTML element
     * @return {Number}
     */
    Element.prototype.getY = function() {
        return this.y;
    };
    /**
     * Set the width for the HTML element
     * @param {Number|String} width height it can be a number or a string.
      In case of using a String you only can use 'auto' or 'inherit' or ##px or ##% or ##em when ## is a number
     * @chainable
     */
    Element.prototype.setWidth = function(width) {
        if(typeof width === 'number') {
            this.width = width;
        } else if(/^\d+(\.\d+)?px$/.test(width)) {
            this.width = parseInt(width, 10);
        } else if(/^\d+(\.\d+)?%$/.test(width)) {
            this.width = width;
        } else if(/^\d+(\.\d+)?em$/.test(width)) {
            this.width = width;
        } else if(width === 'auto' || width === 'inherit') {
            this.width = width;
        } else {
            throw new Error('setWidth: width param is not a number');
        }
        this.style.addProperties({width: this.width});
        return this;
    };
    /**
     * Returns the HTML element's width
     * @return {Number}
     */
    Element.prototype.getWidth = function() {
        return this.width;
    };
    /**
     * Set the height for the HTML element
     * @param {Number|String} height it can be a number or a string.
      In case of using a String you only can use 'auto' or 'inherit' or ##px or ##% or ##em when ## is a number.
     * @chainable
     */
    Element.prototype.setHeight = function(height) {
        if(typeof height === 'number') {
            this.height = height;   
        } else if(/^\d+(\.\d+)?px$/.test(height)) {
            this.height = parseInt(height, 10);
        } else if(/^\d+(\.\d+)?%$/.test(height)) {
            this.height = height;
        } else if(/^\d+(\.\d+)?em$/.test(height)) {
            this.height = height;
        } else if(height === 'auto' || height === 'inherit') {
            this.height = height;
        } else {
            throw new Error('setHeight: height param is not a number');
        }
        this.style.addProperties({height: this.height});
        return this;
    };
    /**
     * Returns the HTML element's height
     * @return {Number}
     */
    Element.prototype.getHeight = function() {
        return this.height;
    };
    /**
     * Set the position index om the z axis for the HTML element
     * @param {Number|String} zOrder it can be a Number or a String.
      In case of using a String you only can use 'auto' or 'inherit'
     * @chainable
     */
    Element.prototype.setZOrder = function(zOrder) {
        if(typeof zOrder === 'number') {
            this.zOrder = parseInt(zOrder, 10);
        } else if(zOrder === 'auto' || zOrder === 'inherit') {
            this.zOrder = zOrder;
        } else {
            throw new Error('setZOrder: zOrder param is not a number'); 
        }
        if(this.html) {
            this.style.addProperties({"z-index": this.zOrder});
        }
        return this;
    };
    /**
     * Returns the HTML element's zOrder
     * @return {Number}
     */
    Element.prototype.getZOrder = function() {
        return this.zOrder;
    };
    /**
     * Set if the HTML element is visible or not
     * @param {Boolean} visible
     * @chainable
     */
    Element.prototype.setVisible = function (visible) {
        visible = !!visible;
        this.visible = visible;
        if(this.html) {
            this.style.addProperties({"display": this.visible ? this.display : "none"});
        }        

        return this;
    };
    /**
     * Returns a boolean value that indicates if the HTML element is visible or not
     * @return {Boolean} [description]
     */
    Element.prototype.isVisible = function() {
        return this.visible;
    };
    /**
     * Set the HTML element's position
     * @param {Object} position an object with x and y properties, both of them are Numbers
     * @chainable
     */
    Element.prototype.setPosition = function(position) {
        this.setX(position.x);
        this.setY(position.y);

        return this;
    };
    /**
     * Returns and object which contains the x and y positions from the HTML element
     * @return {Object}
     */
    Element.prototype.getPosition = function() {
        return {
            x: this.getX(),
            y: this.getY()
        };
    };
    /**
     * Set the HTML element's dimension (width and height)
     * @param {Object} dimension
     * @chainable
     */
    Element.prototype.setDimension = function(dimension) {
        this.setWidth(dimension.width);
        this.setHeight(dimension.height);

        return this;
    };
    /**
     * Returns the HTML element's dimension
     * @return {Object} and object with width and height properties
     */
    Element.prototype.getDimension = function() {
        return {
            width: this.getWidth(),
            height: this.getHeight()
        };
    };
    /**
     * Applies the css classes and ptoperties to the element's html which the object is related
     * @chainable
     */
    Element.prototype.applyStyle = function() {
        if(this.html) {
            this.style.applyStyle();

            this.style.addProperties({
                display: this.visible ? this.display: "none",
                position: this.positionMode,
                left: this.x,
                top: this.y,
                width: this.width,
                height: this.height,
                zIndex: this.zOrder
            });
        }
        return this;
    };
    
    /**
     * Creates the object's HTML element
     * @return {HTMLElement} returns a HTML element
     */
    Element.prototype.createHTML = function() {
        var html;
        if(this.html) {
            return this.html;
        }
        
        html = PMUI.createHTMLElement(this.elementTag || "div");
        html.id = this.id;
        this.html = html;

        this.applyStyle();

        return this.html;
    };
    /**
     * Returns the object's HTML element, if it doesn't exist it's created then it is returned
     * @return {HTMLElement}
     */
    Element.prototype.getHTML = function() {
        if(!this.html) {
            this.html = this.createHTML();
        }
        //this.applyStyle();
        return this.html;
    };

    /**
     * Set the proportion of the html element
     * @param {Number} p Proportion value
     */
    Element.prototype.setProportion = function (p) {
        this.proportion = p;
        return this;
    };

    /**
     * Creates and Instanciate an event
     * @param {String} type  Event type
     * @param {String} [alias] Registered Name
     * @return {PMUI.event.Event}
     */
    Element.prototype.addEvent = function (type, alias) {
        var factory = new PMUI.event.EventFactory(),
            newEvent = factory.make(type),
            registerName = alias || PMUI.generateUniqueId();
        this.events[registerName] = newEvent;
        return newEvent;
    };

    /**
     * @abstract
     * Defines the events associated with the element
     */
    Element.prototype.defineEvents = function () {
    }; 
   
    // Declarations created to instantiate in NodeJS environment
    if (typeof exports !== "undefined") {
        module.exports = Element;
    }

    PMUI.extendNamespace('PMUI.core.Element', Element);

}());