(function () {
    /**
     * @class PMUI.util.Color
     * This class holds the representation and operations of RGBa representation of color,
     * it's very useful if we want to save color constants as an instance and later get the representation
     * in CSS.
     *
     *      //e.g.
     *      var color = new PMUI.util.Color(
     *          128,    // red
     *          128,    // green
     *          128,    // blue
     *          1       // opacity
     *      )
     *
     * @constructor Creates an instance of this class.
     * @param {number} red
     * @param {number} green
     * @param {number} blue
     * @param {number} opacity
     * @return {PMUI.util.Color}
     */
    var Color = function (red, green, blue, opacity) {
        /**
         * Red value of the RGB Color
         * @property {number} [red=0]
         */
        this.red = (!red) ? 0 : red;
        /**
         * Green value of the RGB Color
         * @property {number} [green=0]
         */
        this.green = (!green) ? 0 : green;
        /**
         * Blue value of the RGB Color
         * @property {number} [blue=0]
         */
        this.blue = (!blue) ? 0 : blue;
        /**
         * Opacity of the RGB Color
         * @property {number} [opacity=1]
         */
        this.opacity = (!opacity) ? 1 : opacity;
    };

    /**
     * Type of this class
     * @property {String}
     */
    Color.prototype.type = "Color";

    /**
     * Constant for the color grey
     * @property {PMUI.util.Color} [GREY=new Color(192, 192, 192, 1)]
     */
    Color.GREY = new Color(192, 192, 192, 1);

    /**
     * Returns the red value of the RGB Color
     * @returns {number}
     */
    Color.prototype.getRed = function () {
        return this.red;
    };

    /**
     * Returns the green value of the RGB Color
     * @returns {number}
     */
    Color.prototype.getGreen = function () {
        return this.green;
    };

    /**
     * Returns the blue value of the RGB Color
     * @returns {number}
     */
    Color.prototype.getBlue = function () {
        return this.blue;
    };

    /**
     * Returns the opacity of the RGB Color
     * @returns {number}
     */
    Color.prototype.getOpacity = function () {
        return this.opacity;
    };

    /**
     * Sets the red value of the RGB Color
     * @param {number} newRed
     * @chainable
     */
    Color.prototype.setRed = function (newRed) {
        if (typeof newRed === "number" && newRed >= 0 && newRed <= 255) {
            this.red = newRed;
        }
        return this;
    };

    /**
     * Sets the green value of the RGB Color
     * @param {number} newRed
     * @chainable
     */
    Color.prototype.setGreen = function (newGreen) {
        if (typeof newGreen === "number" && newGreen >= 0 && newGreen <= 255) {
            this.green = newGreen;
        }
        return this;
    };

    /**
     * Sets the blue value of the RGB Color
     * @param {number} newBlue
     * @chainable
     */
    Color.prototype.setBlue = function (newBlue) {
        if (typeof newBlue === "number" && newBlue >= 0 && newBlue <= 255) {
            this.blue = newBlue;
        }
        return this;
    };

    /**
     * Sets the opacity of the RGB Color
     * @param {number} newOpacity
     * @chainable
     */
    Color.prototype.setOpacity = function (newOpacity) {
        if (typeof newOpacity === "number" && newOpacity >= 0 && newOpacity <= 255) {
            this.opacity = newOpacity;
        }
        return this;
    };

    /**
     * Returns the css representation of the RGB color
     *      //e.g.
     *      var color = new PMUI.util.Color(10, 20, 30, 0.1);
     *      color.getCSS();         // "rgba(10, 20, 30, 0.1)"
     * @returns {String}
     */
    Color.prototype.getCSS = function () {
        var css = "rgba(" + this.red + "," + this.green + "," + this.blue +
            "," + this.opacity + ")";
        return css;
    };

    PMUI.extendNamespace('PMUI.util.Color', Color);
}());
