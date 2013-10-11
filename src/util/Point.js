(function () {
    /**
     * @class PMUI.util.Point
     * Class to represent points in the PMDraw library
     *
     *        // e.g.
     *        var p = new PMUI.util.Point(100, 100);
     *
     * @constructor Creates an instance of this class
     * @param {number} xCoordinate x-coordinate of the point
     * @param {number} yCoordinate y-coordinate of the point
     * @return {PMUI.util.Point}
     */
    var Point = function (xCoordinate, yCoordinate) {
        /**
         * x coordinate of the point in the plane
         */
        this.x = xCoordinate;
        /**
         * y coordinate of the point in the plane
         */
        this.y = yCoordinate;
    };

    /**
     * Type of this class
     * @property {String}
     */
    Point.prototype.type = "Point";

    /**
     * Returns the X coordinate
     * @property {number}
     **/
    Point.prototype.getX = function () {
        return this.x;
    };

    /**
     * Returns the Y coordinate
     * @property {number}
     **/
    Point.prototype.getY = function () {
        return this.y;
    };

    /**
     * Adds `other` point to `this` point and returns a new point with those coordinates.
     *
     *      // e.g.
     *      var p1 = new PMUI.util.Point(3, 5),
     *          p2 = new PMUI.util.Point(2, 3);
     *      p1.add(p2);     // new Point(5, 8)
     *
     * @param {PMUI.util.Point} other Point to be added to the current point
     * @returns {PMUI.util.Point}
     */
    Point.prototype.add = function (other) {
        return new Point(this.x + other.x, this.y + other.y);
    };

    /**
     * Subtracts the other point to the one that called the function.
     *
     *      // e.g.
     *      var p1 = new PMUI.util.Point(3, 5),
     *          p2 = new PMUI.util.Point(2, 3);
     *      p1.subtract(p2);     // new Point(1, 2)
     *
     * @param {PMUI.util.Point} other Point to be added to the current point
     * @returns {PMUI.util.Point}
     */
    Point.prototype.subtract = function (other) {
        return new Point(this.x - other.x, this.y - other.y);
    };

    /**
     * Multiplies the point with a scalar k.
     *
     *      // e.g.
     *      var p1 = new PMUI.util.Point(3, 5),
     *          k = 3;
     *      p1.multiply(k);     // new Point(9, 15)
     *
     * @param {number} k
     * @return {PMUI.util.Point}
     */
    Point.prototype.multiply = function (k) {
        return new Point(this.x * k, this.y * k);
    };

    /**
     * Determine if the points are equal.
     *
     *      // e.g.
     *      var p1 = new PMUI.util.Point(3, 5),
     *          p2 = new PMUI.util.Point(2, 3),
     *          p3 = new PMUI.util.Point(3, 5);
     *      p1.equals(p2);     // false
     *      p1.equals(p3);     // true
     *      p1.equals(p1);     // true
     *
     * @param {PMUI.util.Point} other Point to be compared with the current point
     * @returns {boolean}
     */
    Point.prototype.equals = function (other) {
        return (Math.abs(this.x - other.x) < PMUI.draw.Geometry.eps) &&
                (Math.abs(this.y - other.y) < PMUI.draw.Geometry.eps);
    };

    /**
     * Determine the distance between two Points
     *
     *      // e.g.
     *      // distance = sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2))
     *      var p1 = new PMUI.util.Point(3, 5),
     *          p2 = new PMUI.util.Point(2, 3);
     *      p1.getDistance(p2);         // sqrt(1 + 4)
     *
     * @param {PMUI.util.Point} other Point to be calculated from current point
     * @returns {number}
     **/
    Point.prototype.getDistance = function (other) {
        return Math.sqrt(
            (this.x - other.x) * (this.x - other.x) +
                (this.y - other.y) * (this.y - other.y)
        );
    };

    /**
     * Determine the squared distance between two Points
     *
     *      // e.g.
     *      // distance = sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2))
     *      // but since it's the squared distance then
     *      // distance = pow(distance, 2)
     *      var p1 = new PMUI.util.Point(3, 5),
     *          p2 = new PMUI.util.Point(2, 3);
     *      p1.getSquaredDistance(p2);         // (1 + 4)
     *
     * @param {PMUI.util.Point} other Point to be calculated from current point
     * @returns {number}
     **/
    Point.prototype.getSquaredDistance = function (other) {
        return (this.x - other.x) * (this.x - other.x) +
            (this.y - other.y) * (this.y - other.y);
    };

    /**
     * Determine the manhattan distance between two Points
     *
     *      // e.g.
     *      var p1 = new PMUI.util.Point(3, 5),
     *          p2 = new PMUI.util.Point(2, 3);
     *      p1.getManhattanDistance(p2);         // (1 + 2)
     *
     * @param {PMUI.util.Point} other Point to be calculated from current point
     * @returns {number}
     **/
    Point.prototype.getManhattanDistance = function (other) {
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
    };

    /**
     * Makes a clone of this
     *
     *      // e.g.
     *      var p1 = new PMUI.util.Point(3, 5),
     *          cloneP1;
     *      cloneP1 = p1.clone();       // cloneP1 is Point(3, 5)
     *
     * @returns {PMUI.util.Point} This point
     */
    Point.prototype.clone = function () {
        return new Point(this.x, this.y);
    };

    // Declarations created to instantiate in NodeJS environment
    if (typeof exports !== 'undefined') {
        module.exports = Point;
    }

    // extend namespace
    PMUI.extendNamespace('PMUI.util.Point', Point);

}());
