(function () {
    /**
     * @class PMUI.draw.Intersection
     * An intersection in the designer is defined as an arc which has only one additional property: `idOtherConnection`
     * and it's the ID of the other connection this segment has intersection with.
     *
     * All the intersection of a segment are stored in `segment.intersections`.
     *
     * An example of instantiation:
     *
     *      // let's assume that 'segment' is an instance of the class Segment
     *      // let's assume that 'otherSegment' is an instance of the class Segment
     *      // let's assume that 'segment' has an intersection with 'otherSegment' at 'ip' (intersection point)
     *      var intersection = new PMUI.draw.Intersection(
     *          ip,
     *          otherSegment.parent,getID(),
     *          segment
     *      );
     *
     * @extends PMUI.draw.Arc
     *
     * @constructor Creates an instance of the class Intersection
     * @param {PMUI.util.Point} center
     * @param {String} idOtherConnection
     * @param {PMUI.draw.Segment} parent
     */
    var Intersection = function (center, idOtherConnection, parent) {

        Intersection.superclass.call(this);
        /**
         * The center of the arc
         * @property {PMUI.util.Point} [center=null]
         */
        this.center = (!center) ? null : center;
        /**
         * Visibility of this arc
         * @property {boolean}
         */
        this.visible = true;
        /**
         * Parent of this intersection is a segment
         * @property {PMUI.draw.Segment}
         */
        this.parent = parent;
        /**
         * Id of the other connection
         * @property {String}
         */
        this.idOtherConnection = idOtherConnection;
    };

    PMUI.inheritFrom('PMUI.draw.Arc', Intersection);

    /**
     * The type of each instance of the class Intersection
     * @property {String}
     */
    Intersection.prototype.type = "Intersection";

    /**
     * Paints this intersection (calling `Arc.paint()`) considering the orientation of its parent.
     *
     * It overwrites the properties `startAngle` and `endAngle` inherited from {@link PMUI.draw.Arc}
     * according to the orientation of its parent (segment), the calculation is as follows:
     *
     * - Segment is vertical
     *      - startAngle = 270
     *      - endAngle = 90
     * - Segment is horizontal
     *      - startAngle = 180
     *      - endAngle = 0
     *
     * @chainable
     */
    Intersection.prototype.paint = function () {

        // NOTE: it's always visible so do not call setVisible()

        if (this.parent.orientation === this.VERTICAL) {
            this.startAngle = 270;
            this.endAngle = 90;
        } else {
            this.startAngle = 180;
            this.endAngle = 0;
        }

        // call the representation (always an arc)
        Intersection.superclass.prototype.paint.call(this);

        // apply predefined style
        this.style.applyStyle();

        return this;
    };

    /**
     * Destroys the intersection by removing its HTML from the DOM.
     * @chainable
     */
    Intersection.prototype.destroy = function () {
        $(this.html).remove();
        return this;
    };

    /**
     * Creates the HTML representation of the Intersection.
     * @returns {HTMLElement}
     */
    Intersection.prototype.createHTML = function () {
        PMUI.draw.Shape.prototype.createHTML.call(this);
        return this.html;
    };

    PMUI.extendNamespace('PMUI.draw.Intersection', Intersection);

    if (typeof exports !== 'undefined') {
        module.exports = Intersection;
    }

}());
