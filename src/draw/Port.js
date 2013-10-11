(function () {
    /**
     * @class PMUI.draw.Port
     * Class Port represent a special point in a shape where each point is one end point of a connection
     * (a customShape has many ports and each port has a reference to the connection it belongs to).
     *
     * The relation of this class with customShape and connections are described below:
     *
     * - Each port is one end point of a connection (the connection has links to the start port and the end port,
     *      the port has a link to the connection)
     * - A custom shape might have *n* ports (the parent of the port is the custom shape)
     *      so the custom shape has the HTML of the port on it.
     *
     * Some examples of usage:
     *
     *      // let's assume the connection is an instance of the class Connection
     *      // let's assume the customShape is an instance of the class CustomShape
     *      var port = new PMUI.draw.Port({
     *          width: 8,
     *          height: 8,
     *          visible: true,
     *          parent: customShape
     *      })
     *
     *      // after a port is created, it need to be added to the customShape
     *      // let's add it at position [100, 100]
     *      customShape.addPort(port, 100, 100)
     *
     *      // finally when a connection is created it needs to have links to the ports
     *      // let's assume that another port is an instance of the class Port
     *      // i.e
     *      connection = new PMUI.draw.Connection({
     *          srcPort: port,
     *          destPort: anotherPort,
     *          segmentColor: new PMUI.util.Color(0, 200, 0),
     *          segmentStyle: "regular"
     *      });
     *
     * @extend PMUI.draw.Core
     *
     *
     * @param {Object} options Initialization options
     * @cfg {number} [width=4] The width of this port
     * @cfg {number} [height=4] The height of this port
     * @cfg {boolean} [visible=false] The visibility of this port
     * @cfg {PMUI.draw.CustomShape} [parent=null] The parent of this port
     *
     * @constructor Creates an instance of the class Port
     */
    var Port = function (options) {

        Port.superclass.call(this);

        /**
         * Connection to whom this port belongs to
         * @property {PMUI.draw.Connection}
         */
        this.connection = null;

        /**
         * Representation (Shape) of the port when it is connected (currently it's represented as an 
         {@link PMUI.draw.Oval})
         * @property {PMUI.draw.Shape}
         */
        this.representation = null;

        /**
         * Parent of this port.
         * @property {PMUI.draw.CustomShape}
         */
        this.parent = null;

        /**
         * Old parent of this port.
         * @property {PMUI.draw.CustomShape}
         */
        this.oldParent = null;

        /**
         * Port direction respect to its parent (its parent is an instance of {@link PMUI.draw.CustomShape}).
         * @property {number}
         */
        this.direction = null;

        /**
         * The percentage relative to where the port is located regarding one of
         * the shape dimensions (useful to recalculate the ports position while resizing).
         * @property {number}
         */
        this.percentage = null;

        /**
         * Current zIndex of the port.
         * @property {number} [zOrder=1]
         */
        this.zOrder = 1;

        /**
         * Default zIndex of the ports.
         * @property {number} [defaultZOrder=1]
         */
        this.defaultZOrder = 1;

        /**
         * X coordinate sent to the database
         * @property {number} [realX=0]
         */
        this.realX = 0;
        /**
         * Y coordinate sent to the database
         * @property {number} [realY=0]
         */
        this.realY = 0;

        Port.prototype.init.call(this, options);
    };

    PMUI.inheritFrom('PMUI.draw.Core', Port);

    /**
     * The distance moved when a connection is selected (when a connection is
     * selected the ports move towards the center of the shape so that it's
     * easier to drag the ports)
     * @property {number} [TOWARDS_CENTER=5]
     */
    Port.prototype.TOWARDS_CENTER = 5;

    /**
     * Type of each instance of this class
     * @property {String}
     */
    Port.prototype.type = "Port";

    /**
     * Instance initializer which uses options to extend the config options to initialize the instance.
     * @param {Object} options The object that contains the config
     * @private
     */
    Port.prototype.init = function (options) {
        /**
         * Default options for the object
         * @property {Object}
         */
        var defaults = {
            width: 4,
            height: 4,
            visible: false,
            parent: null
        };

        // extend recursively the defaultOptions with the given options
        $.extend(true, defaults, options);
        $.extend(true, defaults, {
            // oval is initialized with default values
            representation: new PMUI.draw.Oval({
                width: defaults.width,
                height: defaults.height,
                center: new PMUI.util.Point(0, 0),
                visible: true
            })
        });

        // call setters using the defaults object
        this.setVisible(defaults.visible)
            .setParent(defaults.parent)
            .setDimension(defaults.width, defaults.height)
            .setRepresentation(defaults.representation);
    };

    /**
     * Creates the HTML Representation of the Port
     * @returns {HTMLElement}
     */
    Port.prototype.createHTML = function () {
        Port.superclass.prototype.createHTML.call(this);
        this.style.addClasses(["port"]);
        return this.html;
    };

    /**
     * Moves this port (considering the borders) after executing the zoom operation.
     * @param {number} positive
     * @chainable
     */
    Port.prototype.applyBorderMargin = function (positive) {
        var factor = (positive) ? 1 :  -1;
        this.x += factor * this.parent.border[this.direction].x;
        this.y += factor * this.parent.border[this.direction].y;
        this.zoomX = this.x;
        this.zoomY = this.y;
        this.setAbsoluteX();
        this.setAbsoluteY();

        if (this.html) {
            this.style.addProperties({
                left: this.zoomX,
                top: this.zoomY
            });
        }
        return this;
    };

    /**
     * Sets the x coordinate of this port
     * @param {number} newX
     * @chainable
     */
    Port.prototype.setX = function (newX) {
        this.x = newX;
        this.zoomX = this.x;
        if (this.canvas) {
            this.realX = this.x / this.canvas.zoomFactor;
        } else {
            this.realX = this.x;
        }
        this.setAbsoluteX();
        if (this.html) {
            this.style.addProperties({left: this.zoomX});
    //            this.html.style.top = this.zoomY + "px";
        }
        return this;
    };

    /**
     * Sets the y coordinate of this port
     * @param {number} newY
     * @chainable
     */
    Port.prototype.setY = function (newY) {
        this.y = newY;
        this.zoomY = this.y;
        this.setAbsoluteY();
        if (this.canvas) {
            this.realY = this.y / this.canvas.zoomFactor;
        } else {
            this.realY = this.y;
        }
        if (this.html) {
            this.style.addProperties({top: this.zoomY});
    //            this.html.style.top = this.zoomY + "px";
        }
        return this;
    };

    /**
     * Sets the width of this port
     * @param {number} newWidth
     * @chainable
     */
    Port.prototype.setWidth = function (newWidth) {
        this.width = newWidth;
        this.zoomWidth = this.width;
        if (this.html) {
            this.style.addProperties({width: this.zoomWidth});
    //            this.html.style.width = this.zoomWidth + "px";
        }
        return this;
    };

    /**
     * Sets the width of this port
     * @param {number} newHeight
     * @chainable
     */
    Port.prototype.setHeight = function (newHeight) {
        this.height = newHeight;
        this.zoomHeight = this.height;
        if (this.html) {
            this.style.addProperties({height: this.zoomHeight});
    //            this.html.style.width = this.zoomWidth + "px";
        }
        return this;
    };

    /**
     * Paint the port appending its `representation` HTML to `this` HTML.
     * @chainable
     */
    Port.prototype.paint = function () {

        // this line is reworked: 
        // original:  Oval.prototype.paint.call(this);
        this.html.appendChild(this.representation.getHTML());
        this.representation.paint();

        // sets the visibility of this port
        this.setVisible(this.visible);

        // apply predefined style
        this.style.applyStyle();

        return this;
    };

    /**
     * Repaints the port re-applying its left and top position.
     * @param {PMUI.draw.Port} port
     * @chainable
     */
    Port.prototype.repaint = function (port) {

        port.style.addProperties({
            left: port.x,
            top: port.y
        });
        port.connection.connect();
        port.connection.setSegmentMoveHandlers();
        port.connection.checkAndCreateIntersectionsWithAll();
        return this;
    };

    /**
     * @event dragStart
     * DragStart callback fired when the port is dragged (it's executed only once).
     * It does the following: 
     *
     * 1. Moves the port away from the center
     * 2. Moves the otherPort away from the center
     * 3. Disconnects the connection
     *
     * @param {PMUI.draw.Port} port
     * @param {PMUI.draw.Port} otherPort
     */
    Port.prototype.onDragStart = function (port, otherPort) {
        return function (e, ui) {

            // move the ports off the center, they'll be correctly repositioned
            // later (in "onDragEnd")
            otherPort.moveTowardsTheCenter(true);
            port.moveTowardsTheCenter(true);

            port.connection.disconnect();
            return true;
        };
    };

    /**
     * @event drag
     * Drag callback fired when the port is being dragged.
     * It makes a new segment from the other port to the current position of the mouse.
     *
     * @param {PMUI.draw.Port} port
     * @param {PMUI.util.Point} endPoint
     * @param {PMUI.draw.Port} otherPort
     * @param {PMUI.draw.Canvas} canvas
     */
    Port.prototype.onDrag = function (port, endPoint, otherPort, canvas) {
        return function (e, ui) {
            if (canvas.connectionSegment) {
                $(canvas.connectionSegment.getHTML()).remove();
            }

            endPoint.x = e.pageX - canvas.getX() + canvas.getLeftScroll();
            endPoint.y = e.pageY - canvas.getY() + canvas.getTopScroll();
            //make connection segment
            canvas.connectionSegment = new PMUI.draw.Segment({
                startPoint: otherPort.getPoint(false),
                endPoint: endPoint,
                parent: canvas
            });
            canvas.connectionSegment.pointsTo = port;
            canvas.connectionSegment.createHTML();
            canvas.connectionSegment.paint();
        };
    };

    /**
     * @event dragEnd
     * DragEnd callback fired when the port stops being dragged.
     * It does the following: 
     *
     * 1. Repaints the port
     * 2. Moves otherPort towards the center of the shape
     * 3. Moves port towards the center of the shape
     * 4. Shows the handlers of the connection
     *
     * @param {PMUI.draw.Port} port
     * @param {PMUI.draw.Port} otherPort
     * @param {PMUI.draw.Canvas} canvas
     */
    Port.prototype.onDragEnd = function (port, otherPort, canvas) {
        return function (e, ui) {

            if (canvas.connectionSegment) {
                $(canvas.connectionSegment.getHTML()).remove();
            }
            port.repaint(port);

            // move the ports towards the center of its parent
            // (they were moved off the center in "onDragStart")
            otherPort.moveTowardsTheCenter();
            port.moveTowardsTheCenter();

            // show the segmentMoveHandlers
            port.connection.showMoveHandlers();
        };
    };

    /**
     * Determine the percentage relative to the shape where the port is located.
     * The range of `this.percentage` is from 0 to 1 (inclusive).
     * @return {boolean}
     */
    Port.prototype.determinePercentage = function () {
        //Shape and port dimension to consider, it can be either width or height
        var shapeDimension,
            portDimension;
        if (!this.parent) {
            return false;
        }
        if (this.direction === this.TOP || this.direction === this.BOTTOM) {
            shapeDimension = this.parent.getZoomWidth();
            portDimension = this.x;
        } else {
            shapeDimension = this.parent.getZoomHeight();
            portDimension = this.y;
        }

        this.percentage = Math.round((portDimension / shapeDimension) * 100.0);
        return true;
    };

    /**
     * Shows this port (moving it's HTML representation towards the center for easy dragging).
     * @chainable
     */
    Port.prototype.show = function () {
        this.visible = true;
        this.paint();

        // move the ports towards the center
        this.moveTowardsTheCenter();

        return this;
    };

    /**
     * Hides this port (moving it's HTML representation off the center of the shape).
     * @chainable
     */
    Port.prototype.hide = function () {
        this.visible = false;
        this.paint();

        // move the ports off the center of the shape
        this.moveTowardsTheCenter(true);  //reverse:  true

        return this;
    };

    /**
     * Detaches the HTML of the port from the DOM (saving it in `this.html`), it also removes the port
     * from its parent.
     * @chainable
     */
    Port.prototype.saveAndDestroy = function () {
        this.parent.removePort(this);  //remove from shape

        // save the html but detach it from the DOM
        this.html = $(this.html).detach()[0];
        return this;
    };

    /**
     * Attaches event listeners to this port, currently it has the draggable and mouse over events.
     * @param {PMUI.draw.Port} currPort
     * @return {PMUI.draw.Port}
     */
    Port.prototype.attachListeners = function (currPort) {
        var otherPort,
            portDragOptions;
        otherPort = currPort.connection.srcPort.getPoint(false)
            .equals(currPort.getPoint(false)) ? currPort.connection.destPort :
                    currPort.connection.srcPort;

        portDragOptions = {
            //containment :  "parent"
            start: currPort.onDragStart(currPort, otherPort),
            drag: currPort.onDrag(currPort, currPort.getPoint(false),
                otherPort, currPort.parent.canvas),
            stop: currPort.onDragEnd(currPort, otherPort, currPort.parent.canvas)

            //revert:  false,
            //revertDuration:  0

        };
        $(currPort.html).draggable(portDragOptions);
        $(currPort.html).mouseover(
            function () {
                $(currPort.html).css('cursor', 'Move');

            }
        );
        return currPort;
    };

    /**
     * Moves a port towards or off the center (for easy dragging).
     * @param {boolean} reverse If it's set to true then it will move it off the center
     * @chainable
     */
    Port.prototype.moveTowardsTheCenter = function (reverse) {
        var towardsCenterDistance = Port.prototype.TOWARDS_CENTER,
            dx = [0, -towardsCenterDistance, 0, towardsCenterDistance],
            dy = [towardsCenterDistance, 0, -towardsCenterDistance, 0],
            multiplier = 1;

        if (reverse) {
            multiplier = -1;
        }
        this.setPosition(this.x + dx[this.direction] * multiplier,
            this.y + dy[this.direction] * multiplier);
        return this;
    };

    /**
     * Sets the Direction to the port.
     * @param {number} newDirection
     * @chainable
     */
    Port.prototype.setDirection = function (newDirection) {
        if (newDirection >= 0 && newDirection < 4) {
            this.direction = newDirection;
        } else {
            throw new Error("setDirection():  parameter '" + newDirection +
                "'is not valid");
        }
        return this;
    };

    /**
     * Get the direction to the port. (0 = TOP, 1 = RIGHT, 2 = BOTTOM, 3 = LEFT)
     * @returns {number}
     */
    Port.prototype.getDirection = function () {
        return this.direction;
    };

    /**
     * Sets the parent of the port.
     * @param {PMUI.draw.Shape} newParent
     * @param {boolean} triggerChange If set to true it'll fire {@link PMUI.draw.Canvas#event-changeelement}
     * @chainable
     */
    Port.prototype.setParent = function (newParent, triggerChange) {
        //if(newParent.type === "Shape" || newParent.type === "StartEvent" ||
        //newParent.type === "EndEvent")
        if (this.canvas && triggerChange) {
            this.canvas.updatedElement = {
                "id": this.id,
                "type": this.type,
                "fields": [
                    {
                        "field": "parent",
                        "oldVal": this.parent,
                        "newVal": newParent
                    }
                ]
            };
            $(this.canvas.html).trigger("changeelement");
        }
        this.parent = newParent;
        return this;
    };

    /**
     * Gets the parent of the port.
     * @return {PMUI.draw.Port}
     */
    Port.prototype.getParent = function () {
        return this.parent;
    };

    /**
     * Sets the old parent of this port
     * @param {PMUI.draw.CustomShape} parent
     * @chainable
     */
    Port.prototype.setOldParent = function (parent) {
        this.oldParent = parent;
        return this;
    };
    /**
     * Gets the old parent of this port.
     * @return {PMUI.draw.Port}
     */
    Port.prototype.getOldParent = function () {
        return this.oldParent;
    };

    /**
     * Sets the connection associated with this port.
     * @param {PMUI.draw.Connection} newConn
     * @chainable
     */
    Port.prototype.setConnection = function (newConn) {
        if (newConn && newConn.family === "Connection") {
            this.connection = newConn;
        } else {
            throw new Error("setConnection():  parameter is not valid");
        }
        return this;
    };

    /**
     * Gets the connection associated with this port
     * @returns {PMUI.draw.Connection}
     */
    Port.prototype.getConnection = function () {
        return this.connection;
    };

    /**
     * Returns the representation of the port (currently an instance of the class {@link PMUI.draw.Oval})
     * @returns {PMUI.draw.Oval}
     */
    Port.prototype.getRepresentation = function () {
        return this.representation;
    };

    /**
     * Sets the representation of this port (not supported yet)
     * @param {PMUI.draw.Shape} newRep
     * @chainable
     */
    Port.prototype.setRepresentation = function (newRep) {
        if (newRep instanceof PMUI.draw.RegularShape) {
            this.representation = newRep;
        } else {
            throw new Error("setRepresentation():  parameter must be an instance" +
                " of any regularShape");
        }
        return this;
    };

    /**
     * Gets the ports position (if `relativeToShape` is set to true it'll return the position
     * respect to the shape, otherwise it'll return its position respect to the canvas)
     * @param {boolean} relativeToShape
     * @returns {PMUI.util.Point}
     */
    Port.prototype.getPoint = function (relativeToShape) {
        var border = parseInt(this.parent.style.getProperty('border'), 10) || 0;
        if (relativeToShape) {
            return new PMUI.util.Point(this.getX() + Math.round(this.getWidth() / 2),
                this.getY() + Math.round(this.getHeight() / 2));
        }
    //    console.log(this.getAbsoluteX());
    //    console.log(this.getAbsoluteY());
    //    console.log(new Point(this.getAbsoluteX() + Math.round(this.getWidth() / 2),
    //        this.getAbsoluteY() + Math.round(this.getHeight() / 2)));
        return new PMUI.util.Point(
            this.getAbsoluteX() + Math.round(this.getWidth() / 2),
            this.getAbsoluteY() + Math.round(this.getHeight() / 2)
        );

    };

    /**
     * Gets the percentage of this port relative to its parent.
     * @return {number}
     */
    Port.prototype.getPercentage = function () {
        return this.percentage;
    };

    /**
     * Serializes this port.
     * @return {Object}
     * @return {number} return.x
     * @return {number} return.y
     * @return {number} return.realX
     * @return {number} return.realY
     * @return {string} return.parent The ID of its parent.
     */
    Port.prototype.stringify = function () {
        var inheritedJSON = {},
            thisJSON = {
    //            id:  this.getID(),
                x: this.getX(),
                y: this.getY(),
                realX: this.realX,
                realY: this.realY,
    //            direction:  this.getDirection(),
    //            percentage:  this.getPercentage(),
                parent: this.getParent().getID()
            };
        $.extend(true, inheritedJSON, thisJSON);
        return inheritedJSON;
    };

    PMUI.extendNamespace('PMUI.draw.Port', Port);

    if (typeof exports !== 'undefined') {
        module.exports = Port;
    }

}());
