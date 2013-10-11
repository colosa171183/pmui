(function () {
    /**
     * @class PMUI.draw.Snapper
     * Class snapper represents the helper shown while moving shapes.
     * @extend PMUI.draw.Core
     *
     * @constructor Creates an instance of the class Snapper
     * @param {Object} options Initialization options
     * @cfg {PMUI.util.Point} [orientation="horizontal"] The default orientation of this snapper
     */
    var Snapper = function (options) {

        Snapper.superclass.call(this, options);

        /**
         * Orientation of this snapper, it can be either "horizontal" or "vertical".
         * @property {string} [orientation=null]
         */
        this.orientation = null;

        /**
         * Data saved to define the positioning of this snapper in the canvas.
         * @property {Array} [data=[]]
         */
        this.data = [];

        /**
         * The visibility of this snapper.
         * @property {boolean} [visible=false]
         */
        this.visible = false;

        Snapper.prototype.init.call(this, options);
    };

    PMUI.inheritFrom('PMUI.draw.Core', Snapper);

    /**
     * The type of each instance of this class
     * @property {String}
     */
    Snapper.prototype.type = "Snapper";

    /**
     * Instance initializer which uses options to extend the config options to initialize the instance.
     * @param {Object} options The object that contains the config
     * @private
     */
    Snapper.prototype.init = function (options) {

        var defaults = {
            orientation: "horizontal"
        };

        // extend recursively the defaultOptions with the given options
        $.extend(true, defaults, options);

        // call setters using the defaults object
        this.setOrientation(defaults.orientation);

        // create the html (it's hidden initially)
        //this.createHTML();
        //this.hide();
    };

    /**
     * Creates the HTML representation of the snapper.
     * @returns {HTMLElement}
     */
    Snapper.prototype.createHTML = function () {
        Snapper.superclass.prototype.createHTML.call(this);
        //$(this.canvas.getHTML()).append(this.html);
        
        return this.html;
    };

    Snapper.prototype.enable = function () {
        if (this.html) {
            this.graphic = new JSGraphics(this.id);
            this.graphic.setColor("#81DAF5");
            if (this.orientation === 'horizontal') {
                this.graphic.drawLine(0, 0, 4000, 0);
            } else {
                this.graphic.drawLine(0, 0, 0, 4000);
            }
            this.graphic.paint();
        }
        return this;
    };

    /**
     * Hides the snapper.
     * @chainable
     */
    Snapper.prototype.hide = function () {
        this.visible = false;
        this.setVisible(this.visible);
        return this;
    };

    /**
     * Shows the snapper.
     * @chainable
     */
    Snapper.prototype.show = function () {
        this.visible = true;
        this.setVisible(this.visible);
        return this;
    };

    /**
     * Fills the data for the snapper (using customShapes and regularShapes).
     * The data considered for each shape is:
     *
     * - Its absoluteX
     * - Its absoluteY
     * - Its absoluteX + width
     * - Its absoluteY + height
     *
     * @chainable
     */
    Snapper.prototype.createSnapData = function () {
        var i,
            index = 0,
            shape,
            border = 0;

        // clear the data before populating it
        this.data = [];

    //    console.log("Sizes:");
    //    console.log(this.canvas.customShapes.getSize());
    //    console.log(this.canvas.regularShapes.getSize());

        // populate the data array using the customShapes
        for (i = 0; i < this.canvas.customShapes.getSize(); i += 1) {
            shape = this.canvas.customShapes.get(i);
            border = parseInt($(shape.getHTML()).css('borderTopWidth'), 10);
            if (this.orientation === 'horizontal') {
                this.data[index * 2] = shape.getAbsoluteY() - border;
                this.data[index * 2 + 1] = shape.getAbsoluteY() + shape.getZoomHeight();
            } else {
                this.data[index * 2] = shape.getAbsoluteX() - border;
                this.data[index * 2 + 1] = shape.getAbsoluteX() + shape.getZoomWidth();
            }
            index += 1;
        }

        // populate the data array using the regularShapes
        for (i = 0; i < this.canvas.regularShapes.getSize(); i += 1) {
            shape = this.canvas.regularShapes.get(i);
            border = parseInt($(shape.getHTML()).css('borderTopWidth'), 10);
            if (this.orientation === 'horizontal') {
                this.data[index * 2] = shape.getAbsoluteY() - border;
                this.data[index * 2 + 1] = shape.getAbsoluteY() +
                    shape.getZoomHeight();
            } else {
                this.data[index * 2] = shape.getAbsoluteX() - border;
                this.data[index * 2 + 1] = shape.getAbsoluteX() +
                    shape.getZoomWidth();
            }
            index += 1;
        }
        return this;
    };

    /**
     * Sorts the data using the builtin `sort()` function, so that there's an strictly increasing order.
     * @chainable
     */
    Snapper.prototype.sortData = function () {
        this.data.sort(function (a, b) {
            return a > b;
        });
        return this;
    };

    /**
     * Performs a binary search for `value` in `this.data`, return true if `value` was found in the data.
     * @param {number} value
     * @return {boolean}
     */
    Snapper.prototype.binarySearch = function (value) {
        var low = 0,
            up = this.data.length - 1,
            mid;

        while (low <= up) {
            mid = parseInt((low + up) / 2, 10);
            if (this.data[mid] === value) {
                return value;
            }
            if (this.data[mid] > value) {
                up = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        return false;
    };

    /**
     * Attaches listeners to this snapper, currently it only has the
     * mouseMove event which hides the snapper.
     * @param {PMUI.draw.Snapper} snapper
     * @chainable
     */
    Snapper.prototype.attachListeners = function (snapper) {
        var $snapper = $(snapper.html).mousemove(
            function () {
                snapper.hide();
            }
        );
        return this;
    };

    /**
     * Sets the orientation of this snapper.
     * @param {string} orientation
     * @chainable
     */
    Snapper.prototype.setOrientation = function (orientation) {
        if (orientation === "horizontal" || orientation === "vertical") {
            this.orientation = orientation;
        } else {
            throw new Error("setOrientation(): parameter is not valid");
        }
        return this;
    };

    /**
     * Gets the orientation of this snapper.
     * @return {string}
     */
    Snapper.prototype.getOrientation = function () {
        return this.orientation;
    };

    PMUI.extendNamespace('PMUI.draw.Snapper', Snapper);

    if (typeof exports !== 'undefined') {
        module.exports = Snapper;
    }

}());
