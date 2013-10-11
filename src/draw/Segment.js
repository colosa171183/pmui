(function () {
    /**
     * @class PMUI.draw.Segment
     * A class that represents a segment, a segment is defined with two points 
     (`startPoint` and `enPoint`).
     * In the PMDraw library a segment is used as a the key part of connections, 
     it has also the following characteristics:
     *
     * - Since a segment is used as part of a connection, it has neighbors (`previousNeighbor` and `nextNeighbor`).
     * - A segment is parallel to an axis if it forms part of a connection.
     * - A segment has a move handler to move the segment.
     * - A segment has info of other connections it has intersections with
     *
     * Some examples of usage:
     *
     *      // let's assume that we want to connect two shapes, the shapes are connected
     *      // through the creation of a segment (the start point is the mouse position where
     *      // the user fired the mouse down event and the end point is the mouse position where the user
     *      // fired the mouse up event)
     *      // let's assume that canvas is an instance of the class Canvas and it's creating the segment
     *      var redSegment = new PMUI.draw.Segment({
     *          startPoint: new PMUI.util.Point(100, 100),        // a random point
     *          endPoint: new PMUI.util.Point(200, 200),          // a random point
     *          parent: canvas,
     *          color: new PMUI.util.Color(255, 0, 0)             // red !!
     *      });
     *
     * @extend PMUI.draw.Core
     *
     * @constructor Creates an instance of the class Segment
     * @param {Object} options Initialization options
     * @cfg {PMUI.util.Point} [startPoint=new Point(0, 0)] The start point of the segment
     * @cfg {PMUI.util.Point} [endPoint=new Point(0, 0)] The end point of the segment
     * @cfg {PMUI.draw.Canvas / PMUI.draw.Connection} [parent=null] The parent of the segment
     * @cfg {PMUI.util.Color} [color=new Color(0, 0, 0)] The color of this segment
     */
    var Segment = function (options) {
        Segment.superclass.call(this, options);

        /**
         * The parent of the segment.
         * @property {PMUI.draw.Canvas / PMUI.draw.Connection} [parent=null]
         */
        this.parent = null;
        /**
         * The start point of the segment.
         * @property {PMUI.util.Point} [startPoint=null]
         */
        this.startPoint = null;

        /**
         * The end point of the segment.
         * @property {PMUI.util.Point} [endPoint=null]
         */
        this.endPoint = null;

        /**
         * zOrder of the segment.
         * @property {number} [zOrder=Shape.prototype.MAX_ZINDEX]
         */
        this.zOrder = PMUI.draw.Shape.prototype.MAX_ZINDEX;

        /**
         * The segment to the left of this segment.
         * @property {PMUI.draw.Segment} [previousNeighbor=null]
         */
        this.previousNeighbor = null;

        /**
         * The segment to the right of this segment.
         * @property {PMUI.draw.Segment} [nextNeighbor=null]
         */
        this.nextNeighbor = null;

        /**
         * Orientation of the segment, the possible values are: 
         *
         * - Vertical
         * - Horizontal
         *
         * @property {String} [orientation=""]
         */
        this.orientation = "";

        /**
         * The width of the segment.
         * @property {number} [width=1]
         */
        this.width = 1;

        /**
         * Graphics object
         * @property {PMUI.draw.Graphics} [graphics=null]
         */
        this.graphics = null;

        /**
         * This segment style, the possible values are: 
         *
         * - "dotted"
         * - "segmented"
         * - "segmentdot"
         * @property {string} [segmentStyle=null]
         */
        this.segmentStyle = null;

        /**
         * This segment color.
         * @property {PMUI.util.Color} [segmentColor=null]
         */
        this.segmentColor = null;

        /**
         * The move handler is the segment move handler of this segment.
         * @property {PMUI.draw.SegmentMoveHandler} [moveHandler=null]
         */
        this.moveHandler = null;

        /**
         * Creates an ArrayList of the intersections with other connections.
         *
         *      // the structure is like: 
         *      //intersections = [
         *      //    {
         *      //        center:  point of intersection,
         *      //        IdOtherConnection:  id of the other connection
         *      //    }
         *      //]
         * @property {PMUI.util.ArrayList} [intersections=new PMUI.ArrayList()]
         */
        this.intersections = new PMUI.util.ArrayList();

        /**
         * True if this segment has a move handler.
         * @property {boolean} [hasMoveHandler=false]
         */
        this.hasMoveHandler = false;

        // set defaults
        Segment.prototype.init.call(this, options);
    };

    PMUI.inheritFrom('PMUI.draw.Core', Segment);

    /**
     * The type of each instance of this class
     * @property {String}
     */
    Segment.prototype.type = "Segment";

    /**
     * Instance initializer which uses options to extend the config options to initialize the instance.
     * @param {Object} options The object that contains the config
     * @private
     */
    Segment.prototype.init = function (options) {
        /**
         * Default options for the constructor
         * @property {Object}
         */
        var defaults = {
            startPoint: new PMUI.util.Point(0, 0),
            endPoint: new PMUI.util.Point(0, 0),
            parent: null,
            color: new PMUI.util.Color(0, 0, 0)
        };

        // extend recursively the defaultOptions with the given options
        $.extend(true, defaults, options);

        // init
        this.setStartPoint(defaults.startPoint)
            .setEndPoint(defaults.endPoint)
            .setColor(defaults.color)
            .setParent(defaults.parent);
    };

    /**
     * Creates the HTML Representation of the Segment.
     * @returns {HTMLElement}
     */
    Segment.prototype.createHTML = function () {
        this.html = document.createElement('div');
        this.html.id = this.id;
        this.html.style.position = "absolute";
        this.html.style.left = "0px";
        this.html.style.top = "0px";
        this.html.style.height = "0px";
        this.html.style.width = "0px";
        this.html.style.zIndex = this.zOrder;
        return this.html;
    };

    /**
     * Paints a segment by creating an instance of the class {@link PMUI.draw.Graphics} and
     * calling {@link PMUI.draw.Graphics#drawLine}, it also append it's HTML to its parent's HTML.
     * @chainable
     */
    Segment.prototype.paint = function () {
        if (this.getHTML() === null) {
            return this;
        }
        if (this.graphics === null) {
            this.graphics = new PMUI.draw.Graphics(this.html);
        }
        //dibujas linea llamar a drawLine de la clase graphics con los puntos
        this.graphics.drawLine(this.startPoint.x, this.startPoint.y,
            this.endPoint.x, this.endPoint.y, this.segmentStyle, this.segmentColor);
        this.parent.html.appendChild(this.html);
        return this;
    };

    /**
     * Removes its HTML from the DOM.
     * @chainable
     */
    Segment.prototype.destroy = function () {
        $(this.html).remove();
        return this;
    };

    /**
     * Paint this segment with the intersections it has stored (this method is called from
     * {@link PMUI.draw.Connection#checkAndCreateIntersectionsWithAll}), it also append it's HTML to its parent's HTML.
     * @chainable
     */
    Segment.prototype.paintWithIntersections = function () {

        // we have to paint the segment again so destroy the previous one
        this.destroy();

        var startPoint,
            endPoint,
            diff,
            i,
            reverse = false;

        if (this.getHTML() === null) {
            return this;
        }
        if (this.graphics === null) {
            this.graphics = new PMUI.draw.Graphics(this.html);
        }

        //console.log(this.hasMoveHandler);
        if (this.hasMoveHandler) {
            $(this.moveHandler.html).remove();
            this.addSegmentMoveHandler();
        }


        // default differentials to split the segment
        if (this.orientation === this.HORIZONTAL) {
            diff = new PMUI.util.Point(PMUI.draw.Shape.prototype.DEFAULT_RADIUS, 0);
            if (this.startPoint.x > this.endPoint.x) {
                reverse = true;
            }

            // for this to work we need to sort the intersections
            this.intersections.sort(function (i, j) {
                return i.center.x >= j.center.x;
            });

        } else {
            diff = new PMUI.util.Point(0, PMUI.draw.Shape.prototype.DEFAULT_RADIUS);
            if (this.startPoint.y > this.endPoint.y) {
                reverse = true;
            }

            // for this to work we need to sort the intersections
            this.intersections.sort(function (i, j) {
                return i.center.y >= j.center.y;
            });
        }
        this.graphics.graphics.clear();

        startPoint = this.startPoint.clone();
        for (i = 0; i < this.intersections.getSize(); i += 1) {
            // if the direction is reverse then we get the
            // inverse position for i in the array
            if (reverse) {
                endPoint = this.intersections
                    .get(this.intersections.getSize() - i - 1).center;
            } else {
                endPoint = this.intersections.get(i).center;
            }

            if (reverse) {
                endPoint = endPoint.add(diff);
            } else {
                endPoint = endPoint.subtract(diff);
            }
            this.graphics.drawLine(startPoint.x, startPoint.y,
                endPoint.x, endPoint.y, this.segmentStyle,
                this.segmentColor, 0, 0, true);
            if (reverse) {
                startPoint = endPoint.subtract(diff.multiply(2));
            } else {
                startPoint = endPoint.add(diff.multiply(2));
            }
        }

        // draw last segment
        endPoint = this.endPoint.clone();
        this.graphics.drawLine(startPoint.x, startPoint.y,
            endPoint.x, endPoint.y, this.segmentStyle, this.segmentColor,
            0, 0, true);
        this.parent.html.appendChild(this.html);
        return this;
    };

    /**
     * Adds a segmentMoveHandler to this segment, it also append the segmentMoveHandler instance HTML to this HTML
     * @chainable
     */
    Segment.prototype.addSegmentMoveHandler = function () {
        var midX = (this.startPoint.x + this.endPoint.x) / 2,
            midY = (this.startPoint.y + this.endPoint.y) / 2;
        this.moveHandler = new PMUI.draw.SegmentMoveHandler({
            parent: this,
            orientation: this.orientation,
            style: {
                cssProperties: {
                    border: "1px solid black"
                }
            }
        });
        midX -= this.moveHandler.width / 2;
        midY -= this.moveHandler.height / 2;
        this.moveHandler.setPosition(midX, midY);
        this.html.appendChild(this.moveHandler.getHTML());
        this.moveHandler.paint();
        this.moveHandler.attachListeners(this.moveHandler);
        return this;
    };

    /**
     * Returns the parent of the segment
     * @returns {PMUI.draw.Canvas / PMUI.draw.Connection}
     */
    Segment.prototype.getParent = function () {
        return this.parent;
    };

    /**
     * Returns the start point of the segment.
     * @returns {PMUI.util.Point}
     */
    Segment.prototype.getStartPoint = function () {
        return this.startPoint;
    };

    /**
     * Returns the end point of the segment.
     * @returns {PMUI.util.Point}
     */
    Segment.prototype.getEndPoint = function () {
        return this.endPoint;
    };

    /**
     * Sets the parent of the segment.
     * @param {Object} newParent
     * @chainable
     */
    Segment.prototype.setParent = function (newParent) {
        this.parent = newParent;
        return this;
    };

    /**
     * Sets the start point of the segment.
     * @param {PMUI.util.Point} newPoint
     * @chainable
     */
    Segment.prototype.setStartPoint = function (newPoint) {
        this.startPoint = newPoint;
        return this;
    };

    /**
     * Sets the end point of the segment.
     * @param {PMUI.util.Point} newPoint
     * @chainable
     */
    Segment.prototype.setEndPoint = function (newPoint) {
        this.endPoint = newPoint;
        return this;
    };

    /**
     * Sets the segmentStyle of this segment
     * @param {string} newStyle
     * @chainable
     *
     */
    Segment.prototype.setStyle = function (newStyle) {
        this.segmentStyle = newStyle;
        return this;
    };

    /**
     * Sets the color of this segment
     * @param {PMUI.util.Color} newColor
     * @chainable
     */
    Segment.prototype.setColor = function (newColor) {
        this.segmentColor = newColor;
        return this;
    };

    /**
     * Creates an intersection with `otherSegment` and saves it in `this.intersections`.
     * If it doesn't have an intersection point passed as a parameter it will determine the
     * intersection point and add it to `this.intersections` (`this.intersections` considers only unique points)
     * @param {PMUI.draw.Segment} otherSegment
     * @param {PMUI.util.Point} [ip] Intersection Point
     * @chainable
     */
    Segment.prototype.createIntersectionWith = function (otherSegment, ip) {
        var intersectionObject,
            intersectionPoint,
            i,
            goodToInsert = true;
        if (ip) {
            intersectionPoint = ip;
        } else {
            intersectionPoint = PMUI.draw.Geometry.segmentIntersectionPoint(this.startPoint,
                this.endPoint, otherSegment.startPoint, otherSegment.endPoint);
        }

        // let's consider the case when an intersection point is the same e.g. when a segment crosses two
        // other segments in the same point
        for (i = 0; i < this.intersections.getSize(); i += 1) {
            if (ip.equals(this.intersections.get(i).center)) {
                goodToInsert = false;
            }
        }

        if (goodToInsert) {
            intersectionObject = new PMUI.draw.Intersection(intersectionPoint,
                otherSegment.parent.getID(), this);
            this.html.appendChild(intersectionObject.getHTML());
            intersectionObject.paint();
            this.intersections.insert(intersectionObject);
        }

        //console.log(intersectionObject);
        //console.log(this.intersections);
        return this;
    };

    /**
     * Clear all the intersections in this segment.
     * @chainable
     */
    Segment.prototype.clearIntersections = function () {
        var i,
            intersection,
            size = this.intersections.getSize();
        while (size > 0) {
            intersection = this.intersections.get(size - 1);
            $(intersection.html).remove();
            this.intersections.popLast();
            size -= 1;
        }
        return this;
    };

    /**
     * Moves the segment either to x or y but not both 
     (this method is called from {@link PMUI.draw.SegmentMoveHandler#event-drag}).
     * @param {number} x new x coordinate of the segment in the canvas
     * @param {number} y new y coordinate of the segment in the canvas
     */
    Segment.prototype.moveSegment = function (x, y) {
        var handler = this.moveHandler,
            prevNeighbor = this.previousNeighbor,
            nextNeighbor = this.nextNeighbor,
            midX,
            midY;

        if (handler.orientation === handler.VERTICAL) {
            this.startPoint.x = x
                + handler.width / 2;
            this.endPoint.x = x
                + handler.width / 2;
            prevNeighbor.endPoint.x =
                this.startPoint.x;
            nextNeighbor.startPoint.x =
                this.endPoint.x;
        } else {
            this.startPoint.y = y
                + handler.height / 2;
            this.endPoint.y = y
                + handler.height / 2;
            prevNeighbor.endPoint.y =
                this.startPoint.y;
            nextNeighbor.startPoint.y =
                this.endPoint.y;
        }

        // fix handler for the this segment
        if (this.moveHandler) {     // of course yes!
            midX = (this.startPoint.x + this.endPoint.x) / 2
                - this.moveHandler.width / 2;
            midY = (this.startPoint.y + this.endPoint.y) / 2
                - this.moveHandler.height / 2;
            this.moveHandler.setPosition(midX, midY);
        }

        // paint the previous segment
        prevNeighbor.paint();
        // fix handler for the prev segment if possible
        if (prevNeighbor.moveHandler) {
            midX = (prevNeighbor.startPoint.x + prevNeighbor.endPoint.x) / 2
                - prevNeighbor.moveHandler.width / 2;
            midY = (prevNeighbor.startPoint.y + prevNeighbor.endPoint.y) / 2
                - prevNeighbor.moveHandler.height / 2;
            prevNeighbor.moveHandler.setPosition(midX, midY);
        }

        // paint the next segment
        nextNeighbor.paint();
        // fix moveHandler for the next segment if possible
        if (nextNeighbor.moveHandler) {
            midX = (nextNeighbor.startPoint.x + nextNeighbor.endPoint.x) / 2
                - nextNeighbor.moveHandler.width / 2;
            midY = (nextNeighbor.startPoint.y + nextNeighbor.endPoint.y) / 2
                - nextNeighbor.moveHandler.height / 2;
            nextNeighbor.moveHandler.setPosition(midX, midY);
        }

        this.paint();
        return this;
    };

    PMUI.extendNamespace('PMUI.draw.Segment', Segment);

    if (typeof exports !== 'undefined') {
        module.exports = Segment;
    }   

}());
