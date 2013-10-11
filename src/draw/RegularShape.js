(function () {
    /**
     * @abstract
     * @class PMUI.draw.RegularShape
     * @extend PMUI.draw.Shape
     * The class RegularShape represents all
     * regular shapes created in the canvas such as, rectangles, ovals, ports, and
     * handlers
     *
     * This class will hold all the common behavior of regular shapes
     * like rectangles or ovals
     *
     * @constructor
     * Initializes a regular shape
     */
    var RegularShape = function (options) {
        RegularShape.superclass.call(this, options);

        /**
         * color of the shape
         * @property {PMUI.util.Color}
         */
        this.color = new PMUI.util.Color();

        /**
         * Graphics for this regular shape
         */
        this.graphics = null;
    };

    PMUI.inheritFrom('PMUI.draw.Shape', RegularShape);

    /**
     * Type of the shape
     * @property {String}
     */
    RegularShape.prototype.type = "RegularShape";

//getters
    /**
     * Returns the color of the shape
     * @returns {PMUI.util.Color}
     */
    RegularShape.prototype.getColor = function () {
        return this.color;
    };

    /**
     * Sets the color of the shape
     * @returns {PMUI.draw.RegularShape}
     * @param {PMUI.util.Color} newColor
     */
    RegularShape.prototype.setColor = function (newColor) {
        if (newColor.type && newColor.type === "Color") {
            this.color = newColor;
        }
        return this;
    };

    PMUI.extendNamespace('PMUI.draw.RegularShape', RegularShape);

    if (typeof exports !== 'undefined') {
        module.exports = RegularShape;
    }

}());