(function () {
    /**
     * @class PMUI.draw.Polygon
     * Abstract class polygon to draw simple poly-lines
     *
     * An example of usage:
     *
     *      var polygon = new PMUI.draw.Polygon({
     *          points: []
     *      });
     *
     * @extend PMUI.draw.RegularShape
     *
     * @constructor Creates an instance of the class Polygon
     * @param {Object} options Initialization options
     * @cfg {Array} [points=[]] The points that make the polygon
     */
    var Polygon = function (options) {

        Polygon.superclass.call(this, options);

        /**
         * The points representing this polygon
         * @property {Array}
         */
        this.points = null;

        Polygon.prototype.init.call(this, options);
    };

    PMUI.inheritFrom('PMUI.draw.RegularShape', Polygon);

    /**
     * The type of each instance of this class
     * @property {String}
     */
    Polygon.prototype.type = "Polygon";

    /**
     * Instance initializer which uses options to extend the config options to initialize the instance
     * @param {Object} options The object that contains the config
     * @private
     */
    Polygon.prototype.init = function (options) {
        var defaults = {
            points: []
        };
        $.extend(true, defaults, options);
        this.setPoints(defaults.points);
    };

    /**
     * Sets the points of this polygon
     * @param {Array} newPoints
     * @chainable
     */
    Polygon.prototype.setPoints = function (newPoints) {
        var i, point;
        this.points = [];
        for (i = 0; i < newPoints.length; i += 1) {
            point = newPoints[i];
            this.points.push(new PMUI.util.Point(point.getX(), point.getY()));
        }
    };

    /**
     * Gets the points of this polygon
     * @return {Array}
     */
    Polygon.prototype.getPoints = function () {
        return this.points;
    };

    PMUI.extendNamespace('PMUI.draw.Polygon', Polygon);

    if (typeof exports !== 'undefined') {
        module.exports = Polygon;
    }

}());
