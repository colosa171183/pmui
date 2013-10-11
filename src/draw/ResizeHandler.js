(function () {
    /**
     * @class PMUI.draw.ResizeHandler
     * Defines a class resize handler to represent handlers used with jQueryUI' resizable plugin, currently
     * it has only support for rectangle resize handler (oval resize handlers were implemented but apparently
     * jQueryUI won't accept a child of the designated HTMLElement to be used as the resize handler).
     *
     * An example of use:
     *
     *      // e.g.
     *      // let's assume that shape is an instance of the class Shape
     *      // let's assume that rectangle is an instance of the class Rectangle
     *
     *      var resizableStyle = {
     *              cssProperties: {
     *                  'background-color': "rgb(0, 255, 0)",
     *                  'border': '1px solid black'
     *              }
     *          },
     *          nonResizableStyle = {
     *              cssProperties: {
     *                  'background-color': "white",
     *                  'border': '1px solid black'
     *              }
     *          },
     *          resizeHandler;
     *
     *      resizeHandler = new PMUI.draw.ResizeHandler({
     *          width: 8,
     *          height: 8,
     *          parent: shape,
     *          orientation: 'nw'                   // see jQueryUI's resizable plugin 'handles' option
     *          representation: rectangle,
     *          resizableStyle: resizableStyle,
     *          nonResizableStyle: nonResizableStyle,
     *          zOrder: 2
     *      });
     *
     * @extend PMUI.draw.Handler
     * @constructor Creates an instance of resize handler.
     * @param {Object} options
     * @cfg {number} [width=4] The width of this resize handler.
     * @cfg {number} [height=4] The height of this resize handler.
     * @cfg {PMUI.draw.Shape} [parent=null] The parent of this resize handler.
     * @cfg {string} [orientation=null] The orientation of this resize handler.
     * @cfg {string} [representation=null] The representation of this resize handler.
     * @cfg {Object} [resizableStyle={}] The parameters to create an instance of the class Style used
     * when the object is resizable.
     * @cfg {Object} [nonResizableStyle={}] The parameters to create an instance of the class Style used
     * when the object is not resizable.
     * @cfg {number} [zOrder=2] The z-index of this resize handler.
     */
    var ResizeHandler = function (options) {

        ResizeHandler.superclass.call(this, options);

        /**
         * Category of this resize handler
         * @type {"resizable"/"nonresizable"}
         */
        this.category = null;

        /**
         * Denotes whether the resize handle is visible or not.
         * @property boolean
         */
        this.visible = false;

        /**
         * JSON used to create an instance of the class Style used when the object is resizable.
         * @property {Object}
         */
        this.resizableStyle = null;

        /**
         * JSON used to create an instance of the class Style used when the object is not resizable.
         * @property {Object}
         */
        this.nonResizableStyle = null;

        // set defaults
        ResizeHandler.prototype.init.call(this, options);
    };

    PMUI.inheritFrom('PMUI.draw.Handler', ResizeHandler);

    /**
     * The type of each instance of this class.
     * @property {String}
     */
    ResizeHandler.prototype.type = "ResizeHandler";

    /**
     * Instance initializer which uses options to extend the config options to initialize the instance
     * @param {Object} options The object that contains the config
     * @private
     */
    ResizeHandler.prototype.init = function (options) {

        var defaults = {
            width: 4,
            height: 4,
            parent: null,
            orientation: null,
            representation: null,
            resizableStyle: {},
            nonResizableStyle: {},
            zOrder: 2
        };

        // extend recursively the defaultOptions with the given options
        $.extend(true, defaults, options);

        // add default zIndex to this handler
        if (defaults.resizableStyle.cssProperties) {
            defaults.resizableStyle.cssProperties.zIndex = defaults.zOrder;
        }
        if (defaults.nonResizableStyle.cssProperties) {
            defaults.nonResizableStyle.cssProperties.zIndex = defaults.zOrder;
        }

        // init
        this.setParent(defaults.parent)
            .setWidth(defaults.width)
            .setHeight(defaults.height)
            .setOrientation(defaults.orientation)
            .setRepresentation(defaults.representation)
            .setResizableStyle(defaults.resizableStyle)
            .setNonResizableStyle(defaults.nonResizableStyle);

        // create the id
        this.id = defaults.orientation + defaults.parent.id + "resizehandler";
    };

    /**
     * Sets the parent of this handler
     * @param {PMUI.draw.Shape} newParent
     * @chainable
     */
    ResizeHandler.prototype.setParent = function (newParent) {
        this.parent = newParent;
        return this;
    };

    /**
     * Gets the parent of this handler.
     * @return {PMUI.draw.Shape}
     */
    ResizeHandler.prototype.getParent = function () {
        return this.parent;
    };

    /**
     * Paints this resize handler by calling it's parent's `paint` and setting
     * the visibility of this resize handler
     * @chainable
     */
    ResizeHandler.prototype.paint = function () {
        if (!this.html) {
            throw new Error("paint():  This handler has no html");
        }

        // this line paints the representation (by default a rectangle)
        ResizeHandler.superclass.prototype.paint.call(this);

        this.setVisible(this.visible);
        return this;
    };

    /**
     * Sets the category of the resizeHandler (also adds the needed class to
     * make the element resizable)
     * @param newCategory
     * @chainable
     */
    ResizeHandler.prototype.setCategory = function (newCategory) {
        if (typeof newCategory === "string") {
            this.category = newCategory;
        }
        if (this.category === "resizable") {
            this.color = new PMUI.util.Color(0, 255, 0);
            this.style.addClasses([
                "ui-resizable-handle", "ui-resizable-" + this.orientation
            ]);
        } else {
            this.color = new PMUI.util.Color(255, 255, 255);
            this.style.removeClasses([
                "ui-resizable-handle", "ui-resizable-" + this.orientation
            ]);
        }
        return this;
    };


    /**
     * Sets the resizable style of this shape by creating an instance of the class Style
     * @param {Object} style
     * @chainable
     */
    ResizeHandler.prototype.setResizableStyle = function (style) {
        this.resizableStyle = new PMUI.util.Style({
            belongsTo: this,
            cssProperties: style.cssProperties,
            cssClasses: style.cssClasses
        });
        return this;
    };

    /**
     * Sets the non resizable style for this shape by creating an instance of the class Style
     * @param {Object} style
     * @chainable
     */
    ResizeHandler.prototype.setNonResizableStyle = function (style) {
        this.nonResizableStyle = new PMUI.util.Style({
            belongsTo: this,
            cssProperties: style.cssProperties,
            cssClasses: style.cssClasses
        });
        return this;
    };

    PMUI.extendNamespace('PMUI.draw.ResizeHandler', ResizeHandler);

    if (typeof exports !== 'undefined') {
        module.exports = ResizeHandler;
    }
    
}());
