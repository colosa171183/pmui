(function () {
    /**
     * @class PMUI.draw.Connection
     * Class that represents a connection between two elements in the diagram.
     *
     * A connection is defined with a set of points, there's a segment between two points e.g. `point[i]`
     * and `point[i + 1]` with `i >= 0` and `i < points.length - 1`, there are two ways to paint a connection: 
     *
     * - given *2* {@link PMUI.draw.Port Ports}, use the algorithm 'ManhattanConnection' to define the points
     * - given *n* points, make the segments with the rule defined above (but first let's use the first and
     *      the last points to make them {@link PMUI.draw.Port Ports}).
     *
     * Some characteristics of the connection: 
     *
     * - The connection has references to its source port and end port.
     * - The `state` of the connection is the set of points that define that connection.
     * - The connections can have a color, the color is an instance of the class Color.
     *
     * The connections can have the following types of segments: 
     *
     * - regular (a complete segment)
     * - dotted
     * - segmented
     * - segmented and dotted (mixed)
     *
     * Some examples of the configuration: 
     *
     *      // e.g.
     *      // let's assume that there are two shapes (sourceShape and destShape)
     *      // let's assume that srcPort is a port that is stored in sourceShape
     *      // let's assume that destPort is a port that is stored in destShape
     *      // to create an instance of Connection with regular light green segments
     *      var connectionGreen = new PMUI.draw.Connection({
     *          srcPort:  srcPort,
     *          destPort:  destPort,
     *          segmentColor:  new Color(0, 200, 0),
     *          segmentStyle:  "regular"
     *      });
     *      // to create an instance of Connection with dotted red segments
     *      var connectionRed = new PMUI.draw.Connection({
     *          srcPort:  srcPort,
     *          destPort:  destPort,
     *          segmentColor:  new Color(255, 0, 0),
     *          segmentStyle:  "dotted"
     *      });
     *
     * @extend PMUI.draw.Core
     *
     * @constructor Creates an instance of the class Connection
     * @param {Object} options Initialization options
     * @cfg {PMUI.util.Point} [srcPort=new Port()] Source port of the connection
     * @cfg {PMUI.util.Point} [destPort=new Port()] Destination port of the connection
     * @cfg {PMUI.util.Color} [segmentColor=new Color(0, 0, 0)] Color of the connection (by default it's black)
     * @cfg {string} [segmentStyle="regular"] Type of segments as defined above
     */
    var Connection = function (options) {

        Connection.superclass.call(this, options);

        /**
         * The source port of the connection
         * @property {PMUI.draw.Port}
         */
        this.srcPort = null;

        /**
         * The end port of the connection
         * @property {PMUI.draw.Port}
         */
        this.destPort = null;

        /**
         * The decorator of the source of the connection
         * @property {PMUI.draw.ConnectionDecorator}
         */
        this.srcDecorator = null;

        /**
         * The decorator of the target of the connection
         * @property {PMUI.draw.ConnectionDecorator}
         */
        this.destDecorator = null;

        /**
         * List of the lines that forms the connection
         * @property {PMUI.util.ArrayList}
         */
        this.lineSegments = new PMUI.util.ArrayList();

        /**
         * Saves a copy of the line segments' points when a flag is passed to the
         * disconnect method (NOTE:  this array is used in the
         * userDefinedRoute method)
         * @property {PMUI.util.ArrayList}
         */
        this.points = [];

        /**
         * Saves a copy of the line segments' points when a flag is passed to the
         * disconnect method (NOTE:  this array is used while creating the object
         * updatedElement in Canvas.triggerConnectionStateChangeEvent)
         * @property {PMUI.util.ArrayList}
         */
        this.oldPoints = [];

        /**
         * Current segment style
         * @property {"dotted" / "regular" / "segmented" / "segmentdot"}
         */
        this.segmentStyle = null;

        /**
         * This segment style ej. "dotted", "segmented", "segmentdot" (it's the
         * original style set in `this.initObject()`)
         * @property {"dotted" / "regular" / "segmented" / "segmentdot"}
         */
        this.originalSegmentStyle = null;

        /**
         * Actual color of all the segment in this connection
         * @property {PMUI.util.Color}
         */
        this.segmentColor = null;

        /**
         * Original color of all the segments in this connection (set in `this.initObject()`)
         * @property {PMUI.util.Color}
         */
        this.originalSegmentColor = null;

        /**
         * default zIndex of the connection
         * @property {number}
         */
        this.defaultZOrder = 2;

        /**
         * Current zIndex of the connection
         * @property {number}
         */
        this.zOrder = 2;

        /**
         * ArrayList which contains the ids of the Connections it has an
         * intersection with: 
         *
         *      // e.g.
         *      // let's assume that there's an instance of the class Connection called anotherConnection
         *      intersectionWith = new PMUI.util.ArrayList();
         *      intersectionWith.insert(anotherConnection);
         *
         * @property {PMUI.util.ArrayList}
         */
        this.intersectionWith = new PMUI.util.ArrayList();


        Connection.prototype.init.call(this, options);
    };

    PMUI.inheritFrom('PMUI.draw.Core', Connection);

    /**
     * The type of each instance of this class
     * @property {String}
     */
    Connection.prototype.type = "Connection";

    /**
     * The family of each instance of this class
     * @property {String}
     */
    Connection.prototype.family = "Connection";

    /**
     * Router associated with the connection
     * @property {PMUI.draw.Router}
     */
    Connection.prototype.router = new PMUI.draw.ManhattanConnectionRouter();

    /**
     * Instance initializer which uses options to extend the config options to initialize the instance.
     * @param {Object} options The object that contains the config
     * @private
     */
    Connection.prototype.init = function (options) {
        var defaultOptions = {
            srcPort: new PMUI.draw.Port(),
            destPort: new PMUI.draw.Port(),
            segmentColor: new PMUI.util.Color(0, 0, 0),
            segmentStyle: "regular"
        };

        // extend recursively the defaultOptions with the given options
        $.extend(true, defaultOptions, options);

        //console.log(options);
        // init
        this.setSrcPort(defaultOptions.srcPort)
            .setDestPort(defaultOptions.destPort)
            .setSegmentStyle(defaultOptions.segmentStyle, false)
            .setSegmentColor(defaultOptions.segmentColor, false);

        // init originals
        this.originalSegmentStyle = defaultOptions.segmentStyle;
        this.originalSegmentColor = defaultOptions.segmentColor;

        // set the connections for each port as this
        this.getSrcPort().setConnection(this);
        this.getDestPort().setConnection(this);
    };

    /**
     * Creates the HTML Representation of the Connection.
     * @returns {HTMLElement}
     */
    Connection.prototype.createHTML = function () {
        this.html = document.createElement('div');
        this.html.id = this.id;

        this.style.addProperties({
            position: "absolute",
            left: 0,
            top: 0,
            height: 0,
            width: 0,
            zIndex: this.zOrder
        });
        return this.html;
    };

    /**
     * Sets the handlers for each segment.
     * This method sets the handler for each segment, also sets a variable called hasMoveHandler on each segment to
     * either true or false (it'll be false if the current segment is either the first or the last segment of
     * the connection)
     * @chainable
     */
    Connection.prototype.setSegmentMoveHandlers = function () {
        var i,
            currentSegment,
            orientationOptions = [this.HORIZONTAL, this.VERTICAL],
            segmentOrientation = (this.destPort.direction === this.TOP ||
                this.destPort.direction === this.BOTTOM) ? 1 :  0;
        for (i = this.lineSegments.getSize() - 1; i >= 0; i -= 1) {
            currentSegment = this.lineSegments.get(i);
            currentSegment.orientation =
                orientationOptions[segmentOrientation];
            currentSegment.hasMoveHandler = false;

            // set prev and next segments
            if (i < this.lineSegments.getSize() - 1 && i > 0) {
                currentSegment.nextNeighbor = this.lineSegments.get(i + 1);
                currentSegment.previousNeighbor = this.lineSegments.get(i - 1);
                currentSegment.hasMoveHandler = true;
                currentSegment.addSegmentMoveHandler();
            }
            segmentOrientation = 1 - segmentOrientation;
        }
        return this;
    };

    /**
     * Remove all the segmentHandlers of this connection
     * (removing its html)
     * @chainable
     */
    Connection.prototype.removeAllSegmentHandlers = function () {
        // delete previous handlers
        var segment,
            i;
        for (i = 0; i < this.lineSegments.getSize(); i += 1) {
            segment = this.lineSegments.get(i);
            if (segment.hasMoveHandler) {
                $(segment.moveHandler.html).remove();
            }
        }
        return this;
    };

    /**
     * Show the moveHandlers of the connections
     * @chainable
     */
    Connection.prototype.showMoveHandlers = function () {
        var i,
            currentHandler;
        for (i = 0; i < this.lineSegments.getSize(); i += 1) {
            currentHandler = this.lineSegments.get(i).moveHandler;
            if (currentHandler) {
                currentHandler.setVisible(true);
            }
        }
        return this;
    };

    /**
     * Hide the moveHandlers of the connection
     * @chainable
     */
    Connection.prototype.hideMoveHandlers = function () {
        var i,
            currentHandler;
        for (i = 0; i < this.lineSegments.getSize(); i += 1) {
            currentHandler = this.lineSegments.get(i).moveHandler;
            if (currentHandler) {
                currentHandler.setVisible(false);
            }
        }
        return this;
    };

    /**
     * Hides the ports and handlers of this connection.
     * @chainable
     */
    Connection.prototype.hidePortsAndHandlers = function () {
        this.hidePorts();
        this.hideMoveHandlers();
        return this;
    };

    /**
     * Shows the ports and handlers of this connection.
     * @chainable
     */
    Connection.prototype.showPortsAndHandlers = function () {
        this.showPorts();
        this.showMoveHandlers();
        return this;
    };

    /**
     * Paints the connection according to the parameters given as config options, this method `paint()`
     * unlike other similar `paint()` does not append the HTML to the DOM, this is done with a call
     * to `canvas.addConnection(connection)`.
     * @param {Object} options Configuration options
     * @param {string} [options.algorithm="manhattan"] The algorithm used to draw the connection
     * @param {Array} [options.points=[]] Points to be used if the algorithm is "user"
     * @param {number} [options.dx=0] Move the points dx
     * @param {number} [options.dy=0] Move the points dy
     * @chainable
     */
    Connection.prototype.paint = function (options) {
        var defaults = {
            algorithm: 'manhattan',
            points: [],
            dx: 0,
            dy: 0
        };
        $.extend(true, defaults, options);
        try {
            if (this.html === null) {
                this.createHTML();
            }

            $(this.html).empty();
            this.oldPoint = null;

            switch (defaults.algorithm) {
            case 'manhattan':
                this.createManhattanRoute();
                break;
            case 'user':
                this.createUserDefinedRoute(defaults.points,
                    defaults.dx, defaults.dy);
                break;
            default:
                throw new Error('Connection.paint():  the algorithm provided ' +
                    'is not correct');
            }

            // apply predefined style
            this.style.applyStyle();

            // the inline style might have changed in this.move()
            // so restore the style to the original setting
            this.style.addProperties({
                top: 0,
                left: 0
            });

            // paint the decorator if any exists
            if (this.destDecorator !== null) {
                this.destDecorator.paint();
                this.destDecorator.attachListeners();
            }

            if (this.srcDecorator !== null) {
                this.srcDecorator.paint();
            }

            this.oldPoint = null;

        } catch (e) {
            console.log(e.message);
        }
        return this;
    };

    /**
     * Hides the connection and its intersections
     * @param {boolean} [savePoints] If set to true, the connection state will be saved in `this.points
     * (see the definition of {@link PMUI.draw.Connection#property-points} in the definition of the class).
     * @chainable
     */
    Connection.prototype.disconnect = function (savePoints) {
        this.clearAllIntersections();

        // hide the segment handlers
        this.hideMoveHandlers();

        // save the line segments and use them in the createCustomRoute method
        if (savePoints) {
            this.savePoints();
        }
        this.lineSegments.clear();

        // empty the contents
        $(this.html).empty();

        return this;
    };

    /**
     * Connects two elements using options as a parameter (alias for `this.paint`)
     * @param {Object} options Configuration options
     * @param {string} [options.algorithm="manhattan"] The algorithm used to draw the connection
     * @param {Array} [options.points=[]] Points to be used if the algorithm is "user"
     * @param {number} [options.dx=0] Move the points dx
     * @param {number} [options.dy=0] Move the points dy
     * @chainable
     */
    Connection.prototype.connect = function (options) {
        this.paint(options);
        return this;
    };

    /**
     * Hides the ports of the connection
     * @chainable
     */
    Connection.prototype.hidePorts = function () {
        this.srcPort.hide();
        this.destPort.hide();
        return this;
    };

    /**
     * Shows the ports of the connection
     * @chainable
     */
    Connection.prototype.showPorts = function () {
        this.srcPort.show();
        this.destPort.show();
        return this;
    };

    /**
     * Saves the state of the connection.
     * @param {Object} options
     * @param {boolean} [options.saveToOldPoints=false] If set to true then it will save the state
     * to `this.oldPoints` array
     * @chainable
     */
    Connection.prototype.savePoints = function (options) {
        var i,
            segment,
            point,
            arrayChosen = 'points',
            defaults = {
                saveToOldPoints: false
            };

        $.extend(true, defaults, options);

        if (defaults.saveToOldPoints) {
            arrayChosen = "oldPoints";
        }

        this[arrayChosen] = [];
        for (i = 0; i < this.lineSegments.getSize(); i += 1) {
            segment = this.lineSegments.get(i);
            if (i === 0) {
                // insert the startPoint only for the first segment
                this[arrayChosen].push(new PMUI.util.Point(
                    segment.startPoint.x,
                    segment.startPoint.y
                ));
            }
            this[arrayChosen].push(new PMUI.util.Point(
                segment.endPoint.x,
                segment.endPoint.y
            ));
        }
    //    console.log(this[arrayChosen]);
        return this;
    };

    /**
     * Creates the segments of the connection using points and moving the segments dx and dy
     * @param {Array} points
     * @param {number} dx
     * @param {number} dy
     * @chainable
     */
    Connection.prototype.createUserDefinedRoute = function (points, dx, dy) {
        var i,
            segment,
            diffPoint = new PMUI.util.Point(dx, dy);
        for (i = 1; i < points.length; i += 1) {
            segment = new PMUI.draw.Segment({
                startPoint: new PMUI.util.Point(
                    parseInt(points[i - 1].x, 10),
                    parseInt(points[i - 1].y, 10)
                ).add(diffPoint),
                endPoint: new PMUI.util.Point(
                    parseInt(points[i].x, 10),
                    parseInt(points[i].y, 10)
                ).add(diffPoint),
                parent: this,
                canvas: this.canvas,
                color: this.segmentColor
            });
            this.addSegment(segment);
        }
        return this;
    };

    /**
     * Create the segments of the connection using the points defined by the algorithm "ManhattanConnection"
     * @chainable
     */
    Connection.prototype.createManhattanRoute = function () {
        var points = this.router.createRoute(this),
            i,
            segment;
        // create the segments now that we have the points
        for (i = 1; i < points.length; i += 1) {
            segment = new PMUI.draw.Segment({
                startPoint: new PMUI.util.Point(
                    parseInt(points[i - 1].x - this.canvas.absoluteX, 10),
                    parseInt(points[i - 1].y - this.canvas.absoluteY , 10)
                ),
                endPoint: new PMUI.util.Point(
                    parseInt(points[i].x - this.canvas.absoluteX, 10),
                    parseInt(points[i].y - this.canvas.absoluteY, 10)
                ),
                parent: this,
                canvas: this.canvas,
                color: this.segmentColor
            });
            this.addSegment(segment);
        }
        return this;
    };

    /**
     * Add a segment to the line segments arrayList (painting it first)
     * @param {PMUI.draw.Segment} segment
     * @chainable
     */
    Connection.prototype.addSegment = function (segment) {
        segment.setStyle(this.segmentStyle);
        segment.paint();
        this.lineSegments.insert(segment);
        return this;
    };

    /**
     * Destroys the connection but saving its HTML first
     * @chainable
     */
    Connection.prototype.saveAndDestroy = function () {

        if (this.canvas.currentConnection) {
            this.hidePortsAndHandlers();
            this.canvas.currentConnection = null;
        }

        // remove this from the canvas connections arrayList
        this.canvas.removeConnection(this);

        //this.canvas.removeFromList(this);
        this.srcPort.saveAndDestroy(); //destroy srcPort
        this.destPort.saveAndDestroy(); //destroy destPort

        // save the html but detach it from the DOM
        this.html = $(this.html).detach()[0];

        return this;
    };

    /**
     * Fixes the zIndex of the connection based on the parents of the connection ports (which are
     * shapes), the zIndex is defined as the maximum zIndex the ports parents + 2
     * @chainable
     */
    Connection.prototype.fixZIndex = function () {
        var sourceShape = this.srcPort.parent,
            destShape = this.destPort.parent,
            sourceShapeParent,
            destShapeParent,
            sourceShapeParentZIndex,
            destShapeParentZIndex;

        if (sourceShape.parent) {
            sourceShapeParent = sourceShape.parent;
        } else {
            sourceShapeParent = sourceShape.canvas;
        }
        sourceShapeParentZIndex = Math.min(sourceShapeParent.getZOrder(),
            sourceShape.getZOrder() - 1);

        if (destShape.parent) {
            destShapeParent = destShape.parent;
        } else {
            destShapeParent = destShape.canvas;
        }
        destShapeParentZIndex = Math.min(destShapeParent.getZOrder(),
            destShape.getZOrder() - 1);

        this.setZOrder(Math.max(sourceShapeParentZIndex, destShapeParentZIndex) +
            2);
        return this;
    };
    /**
     * Checks and creates intersections of `this` connection with the `otherConnection`
     * @param {PMUI.draw.Connection} otherConnection
     * @return {boolean} True if there is at least one intersection
     */
    Connection.prototype.checkAndCreateIntersections = function (otherConnection) {
        // iterate over all the segments of this connection
        var i,
            j,
            segment,
            testingSegment,
            hasAtLeastOneIntersection = false,
            ip; // intersectionPoint

        for (i = 0; i < this.lineSegments.getSize(); i += 1) {
            segment = this.lineSegments.get(i);
            for (j = 0; j < otherConnection.lineSegments.getSize(); j += 1) {
                testingSegment = otherConnection.lineSegments.get(j);

                // create the intersection of the segments if possible
                ip = PMUI.draw.Geometry.perpendicularSegmentIntersection(segment.startPoint,
                        segment.endPoint, testingSegment.startPoint,
                        testingSegment.endPoint);
                if (ip) {
                    hasAtLeastOneIntersection = true;
                    segment.createIntersectionWith(testingSegment, ip);
                }
            }
        }
        //console.log("There was an intersection? " + hasAtLeastOneIntersection);
        if (hasAtLeastOneIntersection) {
            if (!this.intersectionWith.find('id', otherConnection.getID())) {
                this.intersectionWith.insert(otherConnection);
            }
            if (!otherConnection.intersectionWith.find('id', this.getID())) {
                otherConnection.intersectionWith.insert(this);
            }
        }
        return hasAtLeastOneIntersection;
    };

    /**
     * Checks and creates intersections with all the other connections found in this canvas.
     * This method also repaints the segments that have intersections.
     * @chainable
     */
    Connection.prototype.checkAndCreateIntersectionsWithAll = function () {
        var i,
            otherConnection,
            segment;
        // create the intersections of this connection
        // each segment of this connection saves the intersections it has with
        // other segments as an ArrayList of Intersections
    //    console.log(this.canvas.connections.getSize());
        for (i = 0; i < this.canvas.connections.getSize(); i += 1) {
            otherConnection = this.canvas.connections.get(i);
            if (otherConnection.getID() !== this.getID()) {
                this.checkAndCreateIntersections(otherConnection);
            }
        }

        // after we've got all the intersections
        // paint the segments with their intersections
        for (i = 0; i < this.lineSegments.getSize(); i += 1) {
            segment = this.lineSegments.get(i);
            if (segment.intersections.getSize()) {
                segment.paintWithIntersections();
            }
        }
        return this;
    };

    /**
     * Clears all the intersections with the otherConnection that exist in this connection
     * @param {PMUI.draw.Connection} otherConnection
     * @chainable
     */
    Connection.prototype.clearIntersectionsWith = function (otherConnection) {
        var i,
            segment,
            intersectionObject,
            intersectionWasErased;
        for (i = 0; i < this.lineSegments.getSize(); i += 1) {
            intersectionWasErased = false;
            segment = this.lineSegments.get(i);
            while (true) {
                intersectionObject = segment.
                    intersections.find('idOtherConnection',
                        otherConnection.getID());
                if (intersectionObject) {
                    segment.intersections.remove(intersectionObject);
                    intersectionObject.destroy();
                } else {
                    break;
                }
                intersectionWasErased = true;
            }
            if (intersectionWasErased) {
                segment.paintWithIntersections();
            }
        }
        // remove other connection from this connection intersectionWith ArrayList
        this.intersectionWith.remove(otherConnection);
        otherConnection.intersectionWith.remove(this);
        return this;
    };

    /**
     * Clear all the intersections of this connection calling clearIntersectionsWith
     * many times (one for each connection that exists in the canvas)
     * @chainable
     */
    Connection.prototype.clearAllIntersections = function () {
        var otherIntersection;
    //    console.log("Clearing all:  " + this.intersectionWith.getSize());
        while (this.intersectionWith.getSize() > 0) {
            otherIntersection = this.intersectionWith.get(0);
    //        console.log(otherIntersection);
            otherIntersection.clearIntersectionsWith(this);
        }
        return this;
    };

    /**
     * Moves the connection [dx, dy]
     * @param {number} dx
     * @param {number} dy
     * @chainable
     */
    Connection.prototype.move = function (dx, dy) {
        var top,
            left;

        // moving with inline style
        top = parseFloat(this.html.style.top);
        left = parseFloat(this.html.style.left);
        $(this.html).css({
            'top': top + dy,
            'left': left + dx
        });
        return this;
    };

    /**
     * Serializes this object (as a JavaScript object)
     * @return {Object}
     * @return {string} return.segmentStyle The style of each segment of this connection
     * @return {Object} return.srcPort The serialization of `this.srcPort`
     * @return {Object} return.destPort The serialization of `this.destPort`
     * @return {Array} return.state The array of points that represent this connection a.k.a. state
     * @return {string} return.srcDecoratorPrefix The source decorator prefix
     * @return {string} return.destDecoratorPrefix The destination decorator prefix
     */
    Connection.prototype.stringify = function () {
        return {
    //        id:  this.getID(),
            segmentStyle: this.getSegmentStyle(),
            srcPort: this.getSrcPort().stringify(),
            destPort: this.getDestPort().stringify(),
            state: this.savePoints() && this.points,
            srcDecoratorPrefix: this.getSrcDecorator().getDecoratorPrefix(),
            destDecoratorPrefix: this.getDestDecorator().getDecoratorPrefix()
        };
    };

    /**
     * Sets the color of the segments of this connection
     * @param {PMUI.util.Color} newColor
     * @param {boolean} [repaint] True if the segment are to be painted immediately
     * @chainable
     */
    Connection.prototype.setSegmentColor = function (newColor, repaint) {
        var i,
            segment;
        this.segmentColor = newColor;
        if (this.html && repaint) {
            for (i = 0; i < this.lineSegments.getSize(); i += 1) {
                segment = this.lineSegments.get(i);
                segment.setColor(this.segmentColor);
                segment.paint();
            }
        }
        return this;
    };

    /**
     * Get the segment color of this connection
     * @return {PMUI.util.Color}
     */
    Connection.prototype.getSegmentColor = function () {
        return this.segmentColor;
    };

    /**
     * Sets the style of each segment of this connection
     * @param {string} newStyle
     * @param {boolean} [repaint] True if the segment are to be painted immediately
     * @chainable
     */
    Connection.prototype.setSegmentStyle = function (newStyle, repaint) {
        var i,
            segment;
        this.segmentStyle = newStyle;
        if (this.html && repaint) {
            for (i = 0; i < this.lineSegments.getSize(); i += 1) {
                segment = this.lineSegments.get(i);
                segment.setStyle(this.segmentStyle);
                segment.paint();
            }
        }
        return this;
    };

    /**
     * Get the segment style of this connection
     * @return {string}
     */
    Connection.prototype.getSegmentStyle = function () {
        return this.segmentStyle;
    };

    /**
     * Sets the source port
     * @param {PMUI.draw.Port} newSrcPort
     * @chainable
     */
    Connection.prototype.setSrcPort = function (newSrcPort) {
        this.srcPort = newSrcPort;
        return this;
    };

    /**
     * Gets the source port
     * @return {PMUI.draw.Port}
     */
    Connection.prototype.getSrcPort = function () {
        return this.srcPort;
    };

    /**
     * Sets the destination port
     * @param {PMUI.draw.Port} newDestPort
     * @chainable
     */
    Connection.prototype.setDestPort = function (newDestPort) {
        this.destPort = newDestPort;
        return this;
    };

    /**
     * Gets the destination port
     * @return {PMUI.draw.Port}
     */
    Connection.prototype.getDestPort = function () {
        return this.destPort;
    };

    /**
     * Returns the source decorator of the connection
     * @returns {PMUI.draw.ConnectionDecorator}
     */
    Connection.prototype.getSrcDecorator = function () {
        return this.srcDecorator;
    };
    /**
     * Returns the target decorator of the connection
     * @returns {PMUI.draw.ConnectionDecorator}
     */
    Connection.prototype.getDestDecorator = function () {
        return this.destDecorator;
    };
    /**
     * Returns a list of the lines associated with this connection
     * @returns {PMUI.util.ArrayList}
     */
    Connection.prototype.getLineSegments = function () {
        return this.lineSegments;
    };

    /**
     * Sets the source decorator of the connection
     * @param {PMUI.draw.ConnectionDecorator} newDecorator
     * @chainable
     */
    Connection.prototype.setSrcDecorator = function (newDecorator) {
        if (newDecorator.type === 'ConnectionDecorator') {
            this.srcDecorator = newDecorator;
        }
        return this;
    };

    /**
     * Sets the destination decorator of the connection
     * @param {PMUI.draw.ConnectionDecorator} newDecorator
     * @chainable
     */
    Connection.prototype.setDestDecorator = function (newDecorator) {
        if (newDecorator.type === 'ConnectionDecorator') {
            this.destDecorator = newDecorator;
        }
        return this;
    };

    /**
     * Gets the zOrder of the connection
     * @return {number}
     */
    Connection.prototype.getZOrder = function () {
        return PMUI.draw.Shape.prototype.getZOrder.call(this);
    };

    /**
     * Gets the oldPoints of the connection
     * @return {Array}
     */
    Connection.prototype.getOldPoints = function () {
        return this.oldPoints;
    };

    /**
     * Gets the points of the connection
     * @return {Array}
     */
    Connection.prototype.getPoints = function () {
        return this.points;
    };

    PMUI.extendNamespace('PMUI.draw.Connection', Connection);

    if (typeof exports !== 'undefined') {
        module.exports = Connection;
    }

}());
