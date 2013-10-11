(function () {
    /**
     * @class PMUI.draw.Arc
     * @extend PMUI.draw.RegularShape
     * Class arc that draws arcs using the HTMLElement draw engine.
     * Since the canvas is inverted in the y-axis the angles are:
     *      TOP    270
     *      RIGHT  0
     *      BOTTOM 90
     *      LEFT   180
     * An arc can be defined with the following elements:
     *
     * - *startAngle* start angle `0 <= startAngle < 360`.
     * - *endAngle* end angle `0 <= endAngle < 360`.
     * - *radius* the radius of the circle.
     *
     * Besides, the HTMLElement draw engine needs another parameter called *step*, this field tells the engine to
     * draw only at '*step*' steps
     *      e.g.
     *      startAngle = 90
     *      endAngle = 150
     *      engine.paint() with step = 10:
     *          90, 100, 110, 120, 130, 140, 150
     *      engine.paint() with step = 20:
     *          90, 110, 130, 150
     * As a consequence of the y-axis being inverted,we start drawing from the end angle towards the start angle,
     * therefore to draw an arc from 0 deg to 90 deg we must invert the parameters
     *      ´var a = new PMUI.draw.Arc({
     *          center: new PMUI.util.Point(10, 10),
     *          radius: 200,
     *          startAngle: 270,
     *          endAngle: 0
     *      });´
     *
     * @param {Object} options Initialization options
     * @cfg {PMUI.util.Point} [center=new PMUI.util.Points(0, 0)] Point representing the center of the arc
     * @cfg {number} [radius=Shape.prototype.DEFAULT_RADIUS] radius of the arc
     * @cfg {number} [startAngle=270] start angle of the arc
     * @cfg {number} [endAngle=90] end angle of the arc
     * @cfg {number} [step=10] steps to jump from end angle (to get to start angle)
     * @constructor Creates a new instance of arc
     */
    var Arc = function (options) {
        Arc.superclass.call(this);

        /**
         * Start angle of this arc
         * @property {number}
         */
        this.startAngle = null;

        /**
         * End angle of this arc
         * @property {number}
         */
        this.endAngle = null;

        /**
         * Radius of the arc
         * @property {number}
         */
        this.radius = null;

        /**
         * Steps to draw the arc
         * @property {number}
         */
        this.step = null;

        // set defaults
        Arc.prototype.init.call(this, options);
    };

    // prototype chaining
    PMUI.inheritFrom('PMUI.draw.RegularShape', Arc);

    /**
     * Type of this shape
     * @property {String}
     */
    Arc.prototype.type = "Arc";

    /**
     * Instance initializer which uses options to extend the config options to
     * initialize the instance
     * @private
     * @param {Object} options
     */
    Arc.prototype.init = function (options) {

        // Default options for the object
        var defaults = {
            center: new PMUI.util.Point(0, 0),
            radius: PMUI.draw.Shape.prototype.DEFAULT_RADIUS,
            startAngle: 270,
            endAngle: 90,
            step: 10
        };

        // extend recursively defaults with the given options
        $.extend(true, defaults, options);

        // call setters using the defaults object
        this.setCenter(defaults.center)
            .setStartAngle(defaults.startAngle)
            .setEndAngle(defaults.endAngle)
            .setRadius(defaults.radius)
            .setStep(defaults.step);

        // change the id (to debug easier)
        this.id += "-ARC";
    };

    /**
     * In charge of the painting / positioning of the figure on
     * the DOM and setting the styles
     * @chainable
     */
    Arc.prototype.paint = function () {

        this.setVisible(this.visible);

        if (this.html) {
            this.style.applyStyle();
            // this.graphic is inherited from RegularShape
            this.graphics = new PMUI.draw.Graphics(this.id);
            this.graphics.setColor("black");
            this.graphics.drawArc(this.center.x, this.center.y, this.radius,
                this.startAngle, this.endAngle, this.step);
            this.graphics.graphics.paint();
        }
        return this;
    };

    /**
     * Creates the HTML representation of the Arc
     * @returns {HTMLElement}
     */
    Arc.prototype.createHTML = function () {
        Arc.superclass.prototype.createHTML.call(this);
        return this.html;
    };

    /**
     * Returns the startAngle of the arc
     * @returns {number}
     */
    Arc.prototype.getStartAngle = function () {
        return this.startAngle;
    };

    /**
     * Sets the startAngle of the arc
     * @param {number} newAngle
     * @chainable
     */
    Arc.prototype.setStartAngle = function (newAngle) {
        this.startAngle = newAngle;
        return this;
    };

    /**
     * Returns the endAngle of the arc
     * @returns {number}
     */
    Arc.prototype.getEndAngle = function () {
        return this.endAngle;
    };

    /**
     * Sets the endAngle of the arc
     * @param {number} newAngle
     * @chainable
     */
    Arc.prototype.setEndAngle = function (newAngle) {
        this.endAngle = newAngle;
        return this;
    };

    /**
     * Returns the radius of the arc
     * @returns {number}
     */
    Arc.prototype.getRadius = function () {
        return this.radius;
    };

    /**
     * Sets the radius of the arc
     * @param {number} newRadius
     * @chainable
     */
    Arc.prototype.setRadius = function (newRadius) {
        this.radius = newRadius;
        return this;
    };

    /**
     * Returns the radius of the arc
     * @returns {number}
     */
    Arc.prototype.getStep = function () {
        return this.step;
    };

    /**
     * Sets the step to draw the arc (steps jumped from startAngle to endAngle)
     * @param {number} newStep
     * @chainable
     */
    Arc.prototype.setStep = function (newStep) {
        this.step = newStep;
        return this;
    };

    PMUI.extendNamespace('PMUI.draw.Arc', Arc);

    if (typeof exports !== 'undefined') {
        module.exports = Arc;
    }

}());
