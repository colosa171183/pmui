(function () {
    /**
     * @class PMUI.draw.Rectangle
     * A regular shape that represents a rectangle, in the PMDraw framework instances of the class Rectangle
     * are used to represent a resize handler and a segment move handler.
     *
     * Some examples of use:
     *
     *      var rectangle = new PMUI.draw.Rectangle();
     *
     * @extend PMUI.draw.Polygon
     *
     * @constructor Creates an instance of the class Rectangle
     * @param {Object} options Initialization options (currently there are no initialization options)
     */
    var Rectangle = function (options) {
        Rectangle.superclass.call(this, options);
        Rectangle.prototype.init.call(this, options);
    };

    PMUI.inheritFrom('PMUI.draw.Polygon', Rectangle);

    /**
     * The type of each instance of this class
     * @property {String}
     */
    Rectangle.prototype.type = "Rectangle";

    /**
     * Instance initializer which uses options to extend the config options to initialize the instance
     * @param {Object} options The object that contains the config
     * @private
     */
    Rectangle.prototype.init = function (options) {
    };

    /**
     * Paints the rectangle applying the predefined style and adding a background color if
     * it's possible (it's possible if this rectangle has an instance of the class Color).
     * @chainable
     */
    Rectangle.prototype.paint = function () {
        if (this.html) {
            // apply predefined style
            this.style.applyStyle();

            if (this.color) {
                this.style.addProperties({
                    backgroundColor: this.color.getCSS()
                });
            }
        }
        return this;
    };

    /**
     * Creates the HTML representation of the Rectangle
     * @returns {HTMLElement}
     */
    Rectangle.prototype.createHTML = function () {
        PMUI.draw.Shape.prototype.createHTML.call(this);
        return this.html;
    };

    PMUI.extendNamespace('PMUI.draw.Rectangle', Rectangle);

    if (typeof exports !== 'undefined') {
        module.exports = Rectangle;
    }

}());
