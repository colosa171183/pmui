(function () {
    /**
     * @class PMUI.draw.Geometry
     * A little object that encapsulates most geometry functions used in the designer, most of the examples
     * are in 'spec/draw/geometry.spec.js'
     *
     * @singleton
     */
    var Geometry = {
        /**
         * The number pi
         * @property {number} [pi=Math.acos(-1)]
         */
        pi : Math.acos(-1),
        /**
         * Epsilon used for the correctness in comparison of float numbers
         * @property {number} [eps=1e-8]
         */
        eps : 1e-8,
        /**
         * Calculates the cross product of 2-dimensional vectors
         * @param {PMUI.util.Point} p1
         * @param {PMUI.util.Point} p2
         * @return {number}
         */
        cross : function (p1, p2) {
            return p1.x * p2.y - p1.y * p2.x;
        },
        /**
         * Calculates the SIGNED area of a parallelogram given three points, these three points are the points
         * that conforms the triangle that is half of the parallelogram, so. the area of the triangle
         * defined with these points is half the returned number (this method can return negative values)
         *
         *      // e.g.
         *      var p1 = new PMUI.util.Point(0, 0),
         *          p2 = new PMUI.util.Point(0, 1),
         *          p3 = new PMUI.util.Point(1, 0),
         *          parallelogramArea,
         *          triangleArea;
         *
         *      parallelogramArea = Geometry.area(p1, p2, p3)   // -1 (area of the parallelogram)
         *      triangleArea = parallelogramArea / 2            // -0.5 (area of the triangle)
         *
         * @param {PMUI.util.Point} p1
         * @param {PMUI.util.Point} p2
         * @param {PMUI.util.Point} p3
         * @return {number}
         */
        area : function (p1, p2, p3) {
            var auxP2 = p2.clone(),
                auxP3 = p3.clone();
            return this.cross(auxP2.subtract(p1), auxP3.subtract(p1));
        },
        /**
         * Determines if the point P is on segment AB
         * @param {PMUI.util.Point} P
         * @param {PMUI.util.Point} A
         * @param {PMUI.util.Point} B
         * @return {boolean}
         */
        onSegment : function (P, A, B) {
            return (Math.abs(this.area(A, B, P)) < this.eps &&
                P.x >= Math.min(A.x, B.x) && P.x <= Math.max(A.x, B.x) &&
                P.y >= Math.min(A.y, B.y) && P.y <= Math.max(A.y, B.y));
        },
        /**
         * Checks if two perpendicular segments intersect, if so it returns the intersection point,
         * (this method only allows the perpendicular segment to be parallel to the x and y axis)
         * @param {PMUI.util.Point} A
         * @param {PMUI.util.Point} B
         * @param {PMUI.util.Point} C
         * @param {PMUI.util.Point} D
         * @return {Object}
         */
        perpendicularSegmentIntersection : function (A, B, C, D) {
            var clone,
                returnValue = null;

            // swap the segments if possible
            if (A.x > B.x || A.y > B.y) {
                clone = A.clone();
                A = B.clone();
                B = clone;
            }

            if (C.x > D.x || C.y > D.y) {
                clone = C.clone();
                C = D.clone();
                D = clone;
            }

            if (A.x === B.x) {
                if (C.y === D.y && C.x < A.x && A.x < D.x &&
                            A.y < C.y && C.y < B.y) {
                    returnValue = new PMUI.util.Point(A.x, C.y);
                }
            } else if (A.y === B.y) {
                if (C.x === D.x && A.x < C.x && C.x < B.x &&
                        C.y < A.y && A.y < D.y) {
                    returnValue = new PMUI.util.Point(C.x, A.y);
                }
            }
            return returnValue;
        },
        /**
         * Determines if segment AB intersects with segment CD (won't check infinite intersections),
         * if `strict` is set to `true` then it'll consider the case when one end of a segment is right in the
         * other segment
         * @param {PMUI.util.Point} A
         * @param {PMUI.util.Point} B
         * @param {PMUI.util.Point} C
         * @param {PMUI.util.Point} D
         * @param {boolean} [strict]
         * @return {boolean}
         */
        segmentIntersection : function (A, B, C, D, strict) {

            var area1 = this.area(C, D, A),
                area2 = this.area(C, D, B),
                area3 = this.area(A, B, C),
                area4 = this.area(A, B, D),
                returnValue;
            if (((area1 > 0 && area2 < 0) || (area1 < 0 && area2 > 0)) &&
                    ((area3 > 0 && area4 < 0) || (area3 < 0 && area4 > 0))) {
                return true;
            }

            returnValue = false;
            if (strict) {
                if (area1 === 0 && this.onSegment(A, C, D)) {
                    returnValue = true;
                } else if (area2 === 0 && this.onSegment(B, C, D)) {
                    returnValue = true;
                } else if (area3 === 0 && this.onSegment(C, A, B)) {
                    returnValue = true;
                } else if (area4 === 0 && this.onSegment(D, A, B)) {
                    returnValue = true;
                }
            }
            return returnValue;
        },
        /**
         * Checks if two segments intersect, if so it returns the intersection point
         * @param {PMUI.util.Point} A
         * @param {PMUI.util.Point} B
         * @param {PMUI.util.Point} C
         * @param {PMUI.util.Point} D
         * @return {PMUI.util.Point}
         */
        segmentIntersectionPoint: function (A, B, C, D) {
            return A.add((B.subtract(A))
                .multiply(this.cross(C.subtract(A), D.subtract(A)) /
                    this.cross(B.subtract(A), D.subtract(C))));
        },
        /**
         * Determines whether a point is in a given rectangle or not given its
         * upperLeft and bottomRight corner (consider that a rectangle is turned in the y-axis)
         * @param {PMUI.util.Point} point
         * @param {PMUI.util.Point} upperLeft
         * @param {PMUI.util.Point} bottomRight
         * @return {boolean}
         */
        pointInRectangle : function (point, upperLeft, bottomRight) {
            return (point.x >= upperLeft.x && point.x <= bottomRight.x &&
                point.y >= upperLeft.y && point.y <= bottomRight.y);
        },
        /**
         * Determines whether a point is in a circle or not given its center and
         * radius
         * @param {PMUI.util.Point} point
         * @param {PMUI.util.Point} center
         * @param {number} radius
         * @returns {boolean}
         */
        pointInCircle : function (point, center, radius) {
            return center.getDistance(point) <= radius;
        },
        /**
         * Determine whether a point is inside a rhombus or not given its center
         * and its points in clockwise order
         * @param {PMUI.util.Point} point
         * @param {Array} rhombus
         * @param {PMUI.util.Point} center
         * @return {boolean}
         */
        pointInRhombus : function (point, rhombus, center) {
            var i,
                j = rhombus.length - 1;
            for (i = 0; i < rhombus.length; j = i, i += 1) {
                if (this.segmentIntersection(center, point,
                        rhombus[j], rhombus[i], true) &&
                        this.onSegment(point, rhombus[j], rhombus[i]) === false) {
                    return false;
                }
            }
            return true;
        }
    };

    // Declarations created to instantiate in NodeJS environment
    if (typeof exports !== 'undefined') {
        module.exports = Geometry;
    }

    // extend the namespace
    PMUI.extendNamespace('PMUI.draw.Geometry', Geometry);
}());
