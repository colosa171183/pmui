(function () {
    /**
     * @class PMUI.draw.Oval
     * A regular shape that represents an oval, in the PMDraw framework instances of the class Oval
     * are used to represent a Port.
     *
     * Some examples of use:
     *
     *      var oval = new PMUI.draw.Oval({
     *          width: 8,
     *          height: 8,
     *          center: new PMUI.util.Point(100, 100)
     *      });
     *
     * @extend PMUI.draw.RegularShape
     *
     * @constructor Creates an instance of the class Oval
     * @param {Object} options Initialization options
     * @cfg {number} [width=4] The width of this oval
     * @cfg {number} [height=4] The height of this oval
     * @cfg {number} [center=new Center(0, 0)] The center of this oval
     */
    var Oval = function (options) {
        Oval.superclass.call(this, options);

        Oval.prototype.init.call(this, options);
    };

    PMUI.inheritFrom('PMUI.draw.RegularShape', Oval);

    /**
     * The type of each instance of this class
     * @property {String} [type=Oval]
     */
    Oval.prototype.type = "Oval";

    /**
     * Instance initializer which uses options to extend the config options to initialize the instance
     * @param {Object} options The object that contains the config
     * @private
     */
    Oval.prototype.init = function (options) {
        /**
         * Default options for the object
         * @property {Object}
         */
        var defaults = {
            center: new PMUI.util.Point(0, 0),
            width: 4,
            height: 4
        };

        // extend recursively the defaultOptions with the given options
        $.extend(true, defaults, options);

        // call setters using the defaults object
        this.setCenter(defaults.center)
            .setWidth(defaults.width)
            .setHeight(defaults.height);
    };

    /**
     * Paints a **red** oval using the configuration options (the HTML is not appended to
     * the DOM)
     * @chainable
     */
    Oval.prototype.paint = function () {

        // show or hide the oval
        this.setVisible(this.visible);

        if (this.html) {
            // apply predefined style
            this.style.applyStyle();

    //        this.setOpacity(8);
            this.graphic = new JSGraphics(this.id);
            this.graphic.setColor("red");
            this.graphic.fillOval(0, 0, this.getWidth(), this.getHeight());
            this.graphic.paint();
        }
        return this;
    };

    /**
     * Creates the HTML representation of the Oval
     * @returns {HTMLElement}
     */
    Oval.prototype.createHTML = function () {

        Oval.superclass.prototype.createHTML.call(this);
    //  this.html.style.backgroundColor = this.color.getCSS();
        return this.html;
        //return this;
    };

    PMUI.extendNamespace('PMUI.draw.Oval', Oval);

    if (typeof exports !== 'undefined') {
        module.exports = Oval;
    }

}());
