(function () {
    /**
     * @abstract
     * @class PMUI.draw.Handler
     * Abstract class which provides methods to represent a handler.
     * @extends PMUI.draw.Core
     *
     * @constructor Creates an instance of the class Handler (for inheritance purposes only).
     * @param {Object} options Initialization options.
     */
    var Handler = function (options) {

        Handler.superclass.call(this, options);

        /**
         * Representation of this handler.
         * @property {Object}
         */
        this.representation = null;

        /**
         * The parent of this handler.
         * @property {PMUI.draw.Shape}
         */
        this.parent = null;

        /**
         * Color of this handler.
         * @property {PMUI.util.Color}
         */
        this.color = null;

        /**
         * The orientation of this handler.
         * @property {string}
         */
        this.orientation = null;
    };

    PMUI.inheritFrom('PMUI.draw.Core', Handler);

    /**
     * Sets the parent of this handler
     * @param newParent
     * @chainable
     */
    Handler.prototype.setParent = function (newParent) {
        this.parent = newParent;
        return this;
    };

    /**
     * Gets the parent of this handler
     * @return {PMUI.draw.Shape}
     */
    Handler.prototype.getParent = function () {
        return this.parent;
    };

    /**
     * Sets the representation of this handler
     * @param representation
     * @chainable
     */
    Handler.prototype.setRepresentation = function (representation) {
        this.representation = representation;
        return this;
    };

    /**
     * Gets the representation of this handler
     * @return {Object}
     */
    Handler.prototype.getRepresentation = function () {
        return this.representation;
    };

    /**
     * Sets the orientation of this handler
     * @param newOrientation
     * @chainable
     */
    Handler.prototype.setOrientation = function (newOrientation) {
        this.orientation = newOrientation;
        return this;
    };

    /**
     * Gets the orientation of this handler
     * @return {string}
     */
    Handler.prototype.getOrientation = function () {
        return this.orientation;
    };

    /**
     * Paint the handler method which will call `this.representation.paint()`
     * @chainable
     */
    Handler.prototype.paint = function () {
        // paint the representation (by default a rectangle)
        this.representation.paint.call(this);

        // apply predefined style
        this.style.applyStyle();

        return this;
    };

    /**
     * The color representation of this object
     * @param {PMUI.util.Color} newColor
     * @chainable
     */
    Handler.prototype.setColor = function (newColor) {
        this.color = newColor;
        return this;
    };

    /**
     * Get the color representation of this object
     * @return {PMUI.util.Color}
     */
    Handler.prototype.getColor = function () {
        return this.color;
    };

    PMUI.extendNamespace('PMUI.draw.Handler', Handler);

    if (typeof exports !== 'undefined') {
        module.exports = Handler;
    }
    
}());