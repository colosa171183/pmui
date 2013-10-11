(function () {
    /**
     * @class PMUI.draw.Core
     * @extends PMUI.core.Element
     *
     * This class contains the common behavior of the main families of classes
     * in the library
     * This class should never be instantiated since its just an abstraction of
     * properties that classes in the library share
     *
     *      //e.g.
     *      //We will set the properties defined in this class, to a custom shape
     *      var customShape = new PMUI.draw.CustomShape({
     *          id : "someid",
     *          canvas : someCanvas //assuming there is a canvas instance
     *          style: { //style options regarding the objects
     *              cssProperties: {}, //These are the style properties we want the
     *              //object to have
     *              cssClasses: ["someclass"] //css classes that will be applied
     *              to the object
     *          },
     *          //now we set the width and height
     *          width : 30,
     *          height : 50,
     *          //and the coordinates we want the shape to be positioned
     *          x : 10,
     *          y : 5,
     *          //z-index of the element
     *          zOrder : 1,
     *          //set to true if we want to make it visible
     *          visible : true,
     *
     *      });
     *
     * @constructor
     * Creates an instance of the class
     * @param {Object} options options for initializing the object
     * @cfg {String} id id that will be assigned to the element
     * @cfg {Object} [style={
     *     cssProperties:  {},
     *     cssClasses:  []
     * }] style properties and classes that we want to assign to the element
     * @cfg {PMUI.draw.Canvas} [canvas=null] canvas associated to the element
     * @cfg {number} [width=0] width of the element
     * @cfg {number} [height=0] height of the element
     * @cfg {number} [x=0] x coordinate of the element
     * @cfg {number} [y=0] y coordinate of the element
     * @cfg {number} [zOrder=1] z-Index applied to the element
     * @cfg {boolean} [visible=true] Determines whether an element will be visible
     */

    var Core = function (options) {
        Core.superclass.call(this, options);

        /**
         * Defines the canvas object
         * @type {Object}
         */
        this.canvas = null;
        /**
         * previous width of the Core
         * @property {number}
         */
        this.oldWidth = 0;
        /**
         * previous height of the Core
         * @property {number}
         */
        this.oldHeight = 0;
        /**
         * previous x coordinate of the Core
         * @property {number}
         */
        this.oldX = 0;
        /**
         * previous y coordinate of the Core
         * @property {number}
         */
        this.oldY = 0;

        /**
         * The x coordinate relative to the canvas
         * @property {number}
         */
        this.absoluteX = 0;
        /**
         * The y coordinate relative to the canvas
         * @property {number}
         */
        this.absoluteY = 0;
        /**
         * Previous x coordinate relative to the canvas
         * @property {number}
         */
        this.oldAbsoluteX = 0;
        /**
         * Previous y coordinate relative to the canvas
         * @property {number}
         */
        this.oldAbsoluteY = 0;
        /**
         * Zoom in x
         * @property {number}
         */
        this.zoomX = 0;

        /**
         * Zoom in y
         * @property {number}
         */
        this.zoomY = 0;

        /**
         * Width after the zoom
         * @property {number}
         */
        this.zoomWidth = 0;

        /**
         * Height after the zoom
         * @property {number}
         */
        this.zoomHeight = 0;

        /**
         * Saved options is a copy of the default initializer extended
         * with the parameter 'options'
         * @property {Object}
         */
        this.savedOptions = {};

        /**
         * Defines the drag behavior object
         * @type {PMUI.behavior.DragBehavior}
         */
        this.drag = null;

        Core.prototype.init.call(this, options);
    };

    PMUI.inheritFrom('PMUI.core.Element', Core);

    /**
     * Denotes the type of the object
     * @property {String}
     */
    Core.prototype.type = "Core";
    /**
     * @abstract Method for applying the styles and preform tasks related to the
     * view of the object
     */
    Core.prototype.paint = function () {
    };

    
    /**
     * Initializes the element with the options given
     * @param {Object} options options for initializing the object
     */
    Core.prototype.init = function (options) {
        var defaults = {
            zOrder: 1,
            visible: true,
            drag: "nodrag"
        };
        $.extend(true, defaults, options);
        this.setZOrder(defaults.zOrder)
            .setVisible(defaults.visible)
            .setDragBehavior(defaults.drag)
            .setCanvas(defaults.canvas);
    };

    Core.prototype.createHTML = function () {
        if (!this.html) {
            this.html = PMUI.createHTMLElement('div');
            this.html.id = this.id;

            // if this shape had some style saved in the init
            // then call apply style first
            this.style.applyStyle();

            this.style.addProperties({
                position: "absolute",
                left: this.zoomX,
                top: this.zoomY,
                width: this.zoomWidth,
                height: this.zoomHeight,
                zIndex: this.zOrder
            });

        }
        return this.html;
    };

    /**
     * Sets the position of the Core to a given pair of coordinates
     * @param {Number} newX new x coordinate for the Core
     * @param {Number} newY new y coordinate for the Core
     * @chainable
     */
    Core.prototype.setPosition = function (newX, newY) {
        this.setX(newX);
        this.setY(newY);
        return this;
    };

    /**
     * Sets the dimension of the Core to a given width and height
     * @param {Number} newWidth new width of the Core
     * @param {Number} newHeight new height of the Core
     * @chainable
     */
    Core.prototype.setDimension = function (newWidth, newHeight) {
        this.setWidth(newWidth);
        this.setHeight(newHeight);
        return this;
    };

    /**
     * Sets the x coordinate of the Core, returns true if successful
     * @param {Number} newX
     * @chainable
     */
    Core.prototype.setX = function (newX) {
        if (typeof newX === "number") {
            newX = Math.round(newX);
            this.x = newX;
            if (this.canvas) {
                this.zoomX = this.x * this.canvas.zoomFactor;
            } else {
                this.zoomX = this.x;
            }
            this.setAbsoluteX();
            if (this.html) {
                this.style.addProperties({left: this.zoomX});
            }
        } else {
            throw new Error("setX :  parameter newX is not a number");
        }

        return this;
    };
    /**
     * Sets the y coordinate of the Core, returns true if successful
     * @param {Number} newY
     * @chainable
     */
    Core.prototype.setY = function (newY) {
        if (typeof newY === "number") {
            newY = Math.round(newY);
            this.y = newY;
            if (this.canvas) {
                this.zoomY = this.y * this.canvas.zoomFactor;
            } else {
                this.zoomY = this.y;
            }
            this.setAbsoluteY();
            if (this.html) {
                this.style.addProperties({top: this.zoomY});
            }
        }
        return this;
    };

    /**
     * Sets the x coordinate of the Core relative to the canvas
     * @chainable
     */
    Core.prototype.setAbsoluteX = function () {
        if (!this.parent) {
            this.absoluteX = this.zoomX;
        } else {
            this.absoluteX = this.zoomX + this.parent.absoluteX;
        }
        return this;
    };

    /**
     * Sets the value to an old X reference
     * @param {Number} newX
     * @chainable
     */
    Core.prototype.setOldX = function (newX) {
        if (typeof newX === "number") {
            this.oldX = newX;
        }
        return this;
    };
    /**
     * Sets the value to an old y reference
     * @param {Number} newY
     * @chainable
     */
    Core.prototype.setOldY = function (newY) {
        if (typeof newY === "number") {
            this.oldY = newY;
        }
        return this;
    };
    /**
     * Sets the y coordinate of the Core relative to the canvas
     * @chainable
     */
    Core.prototype.setAbsoluteY = function () {
        if (!this.parent) {
            this.absoluteY = this.zoomY;
        } else {
            this.absoluteY = this.zoomY + this.parent.absoluteY;
        }
        return this;
    };

    /**
     * Sets the width of the Core, returns true if successful
     * @param {Number} newWidth
     * @chainable
     */
    Core.prototype.setWidth = function (newWidth) {
        var intPart;
        if (typeof newWidth === "number" && newWidth >= 0) {
            this.width = newWidth;
            if (this.canvas) {
                this.zoomWidth = this.width * this.canvas.zoomFactor;
                intPart = Math.floor(this.zoomWidth);
                this.zoomWidth = (this.zoomWidth % 2 === 0) ? intPart + 1 : intPart;
            } else {
                this.zoomWidth = this.width;
            }
            if (this.html) {
                this.style.addProperties({width: this.zoomWidth});
            }
        }
        return this;
    };

    /**
     * Sets the height of the Core, returns true if successful
     * @param {Number} newHeight
     * @chainable
     */
    Core.prototype.setHeight = function (newHeight) {
        var intPart;
        if (typeof newHeight === "number" && newHeight >= 0) {
            this.height = newHeight;
            if (this.canvas) {
                this.zoomHeight = this.height * this.canvas.zoomFactor;
                intPart = Math.floor(this.zoomHeight);
                this.zoomHeight = (this.zoomHeight % 2 === 0) ? intPart + 1 : intPart;
            } else {
                this.zoomHeight = this.height;
            }
            if (this.html) {
                this.style.addProperties({height: this.zoomHeight});
            }
        }
        return this;
    };

    /**
     * Sets the zOrder of this element
     * @param {Number} newZOrder
     * @chainable
     */
    Core.prototype.setZOrder = function (newZOrder) {
        if (typeof newZOrder === "number" && newZOrder > 0) {
            this.zOrder = newZOrder;
            if (this.html) {
                this.style.addProperties({zIndex: this.zOrder});
            }
        }
        return this;
    };

    /**
     * Sets the canvas for the current object
     * @param {PMUI.draw.Canvas} newCanvas
     * @returns {PMUI.draw.Core}
     */
    Core.prototype.setCanvas = function (newCanvas) {
        if (newCanvas && newCanvas.family === "Canvas") {
            this.canvas = newCanvas;
        }
        return this;
    };

    /**
     * Sets this element to be visible or not if it has html, just sets the display
     * property to inline or none
     * @param {boolean} newVisible
     * @chainable
     */
    Core.prototype.setVisible = function (newVisible) {

        if (typeof newVisible === "boolean") {
            this.visible = newVisible;
            if (this.html) {
                if (newVisible) {
                    this.style.addProperties({display: "inline"});
                } else {
                    this.style.addProperties({display: "none"});
                }
            }
        }
        return this;
    };
    /**
     * Sets the id of this element and updates the html if there is such
     * @param {String} newID
     * @chainable
     */
    Core.prototype.setID = function (newID) {
        this.id = newID;
        if (this.html) {
            this.html.id = this.id;
        }
        return this;
    };
    
    /**
     * Returns the canvas related to this object
     * @returns {PMUI.draw.Canvas}
     */
    Core.prototype.getCanvas = function () {
        return this.canvas;
    };

    /**
     * Returns the x coordinate relative to the canvas of this object
     * @return {Number}
     */
    Core.prototype.getAbsoluteX = function () {
        return this.absoluteX;
    };
    /**
     * Returns the y coordinate relative to the canvas of this object
     * @return {Number}
     */
    Core.prototype.getAbsoluteY = function () {
        return this.absoluteY;
    };

    /**
     * Returns the style of this Core
     * @return {PMUI.util.Style}
     */
    Core.prototype.getStyle = function () {
        return this.style;
    };
    
    /**
     * Gets the x coordinate relative to the zoom scale
     * @return {Number}
     */
    Core.prototype.getZoomX = function () {
        return this.zoomX;
    };

    /**
     * Gets the y coordinate relative to the zoom scale
     * @return {Number}
     */
    Core.prototype.getZoomY = function () {
        return this.zoomY;
    };

    /**
     * Gets the width relative to the zoom scale
     * @return {Number}
     */
    Core.prototype.getZoomWidth = function () {
        return this.zoomWidth;
    };

    /**
     * Gets the height relative to the zoom scale
     * @return {Number}
     */
    Core.prototype.getZoomHeight = function () {
        return this.zoomHeight;
    };

    /**
     * Retrieves the previous value for coordinate x
     * @return {Number}
     */
    Core.prototype.getOldX = function () {
        return this.oldX;
    };

    /**
     * Retrieves the previous value for coordinate y
     * @return {Number}
     */
    Core.prototype.getOldY = function () {
        return this.oldY;
    };

    /**
     * Retrieves the previous value for width
     * @return {Number}
     */
    Core.prototype.getOldWidth = function () {
        return this.oldWidth;
    };

    /**
     * Retrieves the previous value for height
     * @return {Number}
     */
    Core.prototype.getOldHeight = function () {
        return this.oldHeight;
    };

    /**
     * Stringifies the basic data of this shape and the drag behavior of this shape
     * @return {Object}
     */
    Core.prototype.stringify = function () {
        return {
            id: this.getID(),
            x: this.getX(),
            y: this.getY(),
            width: this.getWidth(),
            height: this.getHeight(),
            type: this.type,
            style: this.getStyle().stringify(),
            drag: this.savedOptions.drag
        };
    };

    /**
     * Sets a valid drag behavior
     * @param {Object} obj
     */
    Core.prototype.setDragBehavior = function (obj) {
        var factory = new PMUI.behavior.BehaviorFactory({
                products: {
                    "customshapedrag" : PMUI.behavior.CustomShapeDragBehavior,
                    "regulardrag": PMUI.behavior.RegularDragBehavior,
                    "connectiondrag": PMUI.behavior.ConnectionDragBehavior,
                    "connection": PMUI.behavior.ConnectionDragBehavior,
                    "nodrag": PMUI.behavior.NoDragBehavior
                },
                defaultProduct: "nodrag"
            });
        this.drag = factory.make(obj);
        if (this.html && this.drag) {
            this.drag.attachDragBehavior(this);
        }
        return this;
    };

    /**
     * Functions that calculates the relative position over the canvas
     * @param  {Objecy} e jQuery Event
     * @return {Object}  
     */
    Core.prototype.relativePoint = function (e) {
        var auxX, auxY;
        auxX = e.pageX - this.absoluteX;
        auxY = e.pageY - this.absoluteY;
        if (this.canvas) {
            auxX += this.canvas.getLeftScroll();
            auxY += this.canvas.getTopScroll();
            auxX = Math.floor(auxX/this.canvas.zoomFactor);
            auxY = Math.floor(auxY/this.canvas.zoomFactor);
        }
        return {
            x: auxX,
            y: auxY
        };
    };

    /**
     * JSON parser for creating PMDrawObjects
     * @param {Object} json
     */
    Core.prototype.parseJSON = function (json) {
        this.initObject(json);
    };
    
    /**
     * Number that represents the top direction
     * @property {number}
     */
    Core.prototype.TOP = 0;
    /**
     * Number that represents the right direction
     * @property {number}
     */
    Core.prototype.RIGHT = 1;
    /**
     * Number that represents the bottom direction
     * @property {Number}
     */
    Core.prototype.BOTTOM = 2;
    /**
     * Number that represents the left direction
     * @property {Number}
     */
    Core.prototype.LEFT = 3;
    /**
     * Number that represents horizontal direction
     * @property {Number}
     */
    Core.prototype.HORIZONTAL = 0;
    /**
     * Number that represents  vertical direction
     * @property {Number}
     */
    Core.prototype.VERTICAL = 1;
    /**
     * Number of zoom scales available
     * @property {Number}
     */
    Core.prototype.ZOOMSCALES = 5;

    PMUI.extendNamespace('PMUI.draw.Core', Core);

    if (typeof exports !== 'undefined') {
        module.exports = Core;
    }

}());