(function () {
    /**
     * @class PMUI.draw.CustomShape
     * This is a custom shape, where there can be applied styles, sprites and
     * decoration, it can have connections associated to it by ports, different
     * layers and labels as well
     *              //e.g.
     *              var customShape = new PMUI.draw.CustomShape({
     *                  //Determines whether the shape will be connected only in its
     *                  //middle points
     *                  connectAtMiddlePoints : true,
     *                  //The layers that will be instantiated with this shape
     *                  layers: [
     *                      {
     *                                                          {
     *                        layerName : "first-layer",
     *                        priority: 2,
     *                        visible: true,
     *                        style: {
     *                        cssClasses: ['bpmn_zoom']
     *                      },
     *                        zoomSprites : ['img_50_start',
     *                        'img_75_start', 'img_100_start',
     *                        'img_125_start', 'img_150_start']
     *                        }, {
     *                        layerName: "second-layer",
     *                        priority: 3,
     *                        visible: true
     *                        }
     *
     *                  ],
     *                  //Labels that belong to this shape
     *                  labels : [
     *                      {
     *                          message: "this is one label",
     *                          position: {
     *                              location : "bottom",
     *                              diffX: 0,
     *                              diffY: 5
     *                          }
     *                      }
     *                  ],
     *                  //The type of connections that are made with this shape,
     *                  //Each type differs of one another for the type of lines
     *                  //used in the connection
     *                  connectionType: "regular"
     *
     *              });
     * @extends PMUI.draw.Shape
     *
     * @constructor
     * Creates an instance of a CustomShape
     * @param {Object} options configuration options used in a custom shape
     * @cfg {Boolean} [connectAtMiddlePoints=true] Determines whether shape's,
     * connections should be created only in the middle points of its sides
     * @cfg {Array} [layers=[]] Configuration options of all layers that will be,
     * instantiated with this shape
     * @cfg {Array} [labels=[]] Configuration options of all labels that will be
     * instantiated with this shape
     * @cfg {String} [connectionType="regular"] Type of lines that will be used in
     * all connections involving this shape
     */
    var CustomShape = function (options) {
        /**
         * List of all the layers associated to this shape
         * @property {PMUI.util.ArrayList}
         */
        this.layers = new PMUI.util.ArrayList();

        CustomShape.superclass.call(this, options);
        /**
         * List of all the ports associated to this shape
         * @property {PMUI.util.ArrayList}
         */
        this.ports = new PMUI.util.ArrayList();

        /**
         * List of all the labels associated to this shape
         * @property {PMUI.util.ArrayList}
         */
        this.labels = new PMUI.util.ArrayList();
        /**
         * List of all the zoom properties in different zoom scales
         * @property {PMUI.util.ArrayList}
         */
        this.zoomProperties = new PMUI.util.ArrayList();

        /**
         * Inner figure for drawing connection limits
         * @property {Array}
         */
        this.limits = [0, 0, 0, 0];
        /**
         * Border to be added to determine the new position of the port
         * @property {Array}
         */
        this.border = [
            {x: 0, y: 0},
            {x: 0, y: 0},
            {x: 0, y: 0},
            {x: 0, y: 0}
        ];
        /**
         * Determines which type of drag behavior should be assigned
         * @property {number}
         */
        this.dragType = this.CANCEL;
        /**
         * Reference to the point where a connection drag is being started
         * @property {PMUI.util.Point}
         */
        this.startConnectionPoint = null;
        /**
         * if set to true, a port will only be added at its middle points
         * @property {Boolean}
         */
        this.connectAtMiddlePoints = null;
        /**
         * Auxiliary property for saving the previous x coordinate in the dragging
         * procedure for multiple drag
         * @property {Number}
         */
        this.previousXDragPosition = 0;
        /**
         * Auxiliary property for saving the previous y coordinate in the dragging
         * procedure for multiple drag
         * @property {Number}
         */
        this.previousYDragPosition = 0;
        /**
         * The type of lines for connections made with this shape
         * @property {String}
         */
        this.connectionType = null;
        // init the custom shape
        CustomShape.prototype.init.call(this, options);
    };

    PMUI.inheritFrom('PMUI.draw.Shape', CustomShape);
    /**
     * Type the instances of this class
     * @property {String}
     */
    CustomShape.prototype.type = "CustomShape";
    /**
     * Family where this class and all its subclasses belong
     * @property {String}
     * @readonly
     */
    CustomShape.prototype.family = "CustomShape";
    /**
     * Reference to a drop behaviors for containers
     * @property {PMUI.behavior.ContainerDropBehavior}
     */
    CustomShape.prototype.containerDropBehavior = null;
    /**
     * Reference to a drop behavior that allows us to make connections
     * @property {PMUI.behavior.ConnectionDropBehavior}
     */
    CustomShape.prototype.connectionDropBehavior = null;
    /**
     * Reference to a drop behavior that has no acceptable droppables
     * @property {PMUI.behavior.NoDropBehavior}
     */
    CustomShape.prototype.noDropBehavior = null;
    /**
     * Constant that represents that a drag behavior for making connections should
     * be used
     * @property {Number}
     */
    CustomShape.prototype.CONNECT = 1;
    /**
     * Constant that represents that a drag behavior for moving the shape should be
     * used
     * @property {Number}
     */
    CustomShape.prototype.DRAG = 2;
    /**
     * Constant that represents that no drag behavior should be used
     * @property {Number}
     */
    CustomShape.prototype.CANCEL = 0;

    /**
     * Initializes the basic attributes for the custom shape, and also the
     * particular objects the shape needs to instantiate
     * //TODO Base limits on zoom
     * @param options
     */
    CustomShape.prototype.init = function (options) {

        var defaults = {
                connectAtMiddlePoints: true,
                layers: [],
                labels: [],
                connectionType: "regular",
                drag: "customshapedrag"
            },
            i;

        // init the object with NO configurable options
        this.limits = [5, 5, 5, 5, 5];
        this.setStartConnectionPoint(new PMUI.util.Point(0, 0));
            //.setDragBehavior(new RegularDragBehavior());

        // init the object with configurable options
        $.extend(true, defaults, options);
        for (i = 0; i < defaults.layers.length; i += 1) {
            this.createLayer(defaults.layers[i]);
        }
        for (i = 0; i < defaults.labels.length; i += 1) {
            this.createLabel(defaults.labels[i]);
        }
        this.setConnectAtMiddlePoints(defaults.connectAtMiddlePoints)
            .setConnectionType(defaults.connectionType)
            .setDragBehavior(defaults.drag);

    };
    /**
     * Creates a layer given its configuration options
     * @param {Object} options configuration options
     * @return {PMUI.draw.Layer}
     */
    CustomShape.prototype.createLayer = function (options) {

        var layer;
        options.parent = this;
        layer = new PMUI.draw.Layer(options);
        this.addLayer(layer);
        return layer;
    };
    /**
     * Creates a label given its configuration options
     * @param {Object} options configuration options for instantiating a label
     * @return {PMUI.draw.Label}
     */
    CustomShape.prototype.createLabel = function (options) {
        var label;
        options.canvas = this.canvas;
        options.parent = this;
        if (options.width === 0) {
            options.width = this.width * 0.9;
        }
        label = new PMUI.draw.Label(options);
        this.addLabel(label);
        return label;
    };

    /**
     * Adds a label to the array of labels and also appends its html
     * @param {PMUI.draw.Label} label
        */
    CustomShape.prototype.addLabel = function (label) {
        if (this.html) {
            //so we just append it to the parent
            label.parent = this;
            this.html.appendChild(label.getHTML());
        }
        if (!this.labels.contains(label)) {
            this.labels.insert(label);
        }
    };
    /**
     * Creates the html for the shape, its layers and labels
     * @returns {HTMLElement}
     */
    CustomShape.prototype.createHTML = function () {
        var i,
            label;
        CustomShape.superclass.prototype.createHTML.call(this);

        // this line:  this.html.className = "custom_shape"
        // replaced with: 
        this.style.addClasses(["custom_shape"]);

        this.layers.sort(PMUI.draw.Layer.prototype.comparisonFunction);

        for (i = 0; i < this.layers.getSize(); i += 1) {
            this.html.appendChild(this.layers.get(i).getHTML());

        }
        for (i = 0; i < this.labels.getSize(); i += 1) {
            label = this.labels.get(i);
            this.addLabel(label);
            label.attachListeners();

        }
        return this.html;
    };

    /**
     * This function will attach all the listeners corresponding to the CustomShape
     * @chainable
     */
    CustomShape.prototype.attachListeners = function () {
        if (this.html === null) {
            return this;
        }

        var $customShape = $(this.html)
            .click(this.onClick(this));
        //drag options for the added shapes
        $customShape.on("mousedown", this.onMouseDown(this));
        $customShape.mousemove(this.onMouseMove(this));
        $customShape.mouseup(this.onMouseUp(this));
        $customShape.on("contextmenu", function (e) {
            e.preventDefault();
        });

        this.updateBehaviors();
        return this;

    };

    /**
     * Apply the styles related to the shape, its layers and labels
     * @chainable
     */
    CustomShape.prototype.paint = function () {
        var i,
            label;

        CustomShape.superclass.prototype.paint.call(this);

        // apply predefined style
    //    console.log(this.style.cssProperties);
    //    this.style.applyStyle();

        //TODO Apply the style of the given shape
        for (i = 0; i < this.layers.getSize(); i += 1) {
            this.layers.get(i).paint();
        }
        for (i = 0; i < this.ports.getSize(); i += 1) {
            this.ports.get(i).paint();
        }
        for (i = 0; i < this.labels.getSize(); i += 1) {
            label = this.labels.get(i);
            label.paint();
        }
        return this;
    };

    /**
     * Updates properties obtained when the HTML is on the DOM
     * @chainable
     */
    CustomShape.prototype.updateHTML = function () {
        var i,
            label;
        this.setDimension(this.width, this.height);
        for (i = 0; i < this.labels.getSize(); i += 1) {
            label = this.labels.get(i);
            label.paint();
            label.updateDimension();
        }
        return this;
    };
    /**
     * Repaints connections related to this shape
     * @param {Boolean} inContainer Determines if the points of a connection should
     * be saved for its reconstruction
     * @chainable
     */
    CustomShape.prototype.refreshConnections = function (inContainer) {
        var i,
            connection,
            ports = this.ports,
            port;
        for (i = 0; i < ports.getSize(); i += 1) {
            port = ports.get(i);
            port.setPosition(port.getX(), port.getY());
            connection = port.connection;
            connection.disconnect(inContainer)
                .connect(inContainer)
                .setSegmentMoveHandlers()
                .checkAndCreateIntersectionsWithAll();
            this.canvas.triggerConnectionStateChangeEvent(connection);
        }
        return this;
    };
    /**
     * Updates the properties of this shape layers according to the shape itself
     * @chainable
     */
    CustomShape.prototype.updateLayers = function () {
        var i, j,
            layer;
        for (i = 0; i < this.getLayers().getSize(); i += 1) {
            layer = this.getLayers().get(i);
            layer.setProperties();
        }
        return this;
    };
    /**
     * Returns what it should be the next layer if there is such in the DOM tree
     * or null otherwise
     * @param {PMUI.draw.Layer} layer
     * @returns {PMUI.draw.Layer}
     */
    CustomShape.prototype.findLayerPosition = function (layer) {
        var nextLayer = null, //holds the next layer regarding the position where
        // the new layer should be inserted
            minVal = 10000000, //holds the minimum value of all the values greater
        // than the newLayer priority
            i,
            currLayer,
            currPriority;
        //iterate through all the layers and find the minimum priority of all
        // the priorities that are greater than the priority of the current layer
        for (i = 0; i < this.layers.getSize(); i += 1) {
            currLayer = this.layers.get(i);
            currPriority = currLayer.getPriority();
            if (currPriority > layer.getPriority()) {
                if (minVal > currPriority) {
                    minVal = currPriority;
                    nextLayer = currLayer;
                }
            }
        }
        return nextLayer;
    };

    /**
     * Adds a new layer to the corresponding shape
     * @param {PMUI.draw.Layer} newLayer
     * @chainable
     */
    CustomShape.prototype.addLayer = function (newLayer) {
        //gets the layer that would come next the new one
        var nextLayer = this.findLayerPosition(newLayer);
        //if there is none it means that the new layer has the highest priority
        // of all
        if (this.html) {
            if (!nextLayer) {
                //so we just append it to the parent
                this.html.appendChild(newLayer.getHTML());
            } else {
                //otherwise we append it before nextLayer
                this.html.insertBefore(newLayer.getHTML(), nextLayer.getHTML());
            }
            newLayer.paint();
        }
        this.layers.insert(newLayer);

        return this;
    };

    /**
     * Finds a given layer by ID or null of it doesn't exist
     * @param {String} layerID
     * @returns {PMUI.draw.Layer}
     */
    CustomShape.prototype.findLayer = function (layerID) {
        return this.layers.find('id', layerID);
    };

    /**
     * Set the dimension of the customShape
     * @param {Number} newWidth
     * @param {Number} newHeight
     */
    CustomShape.prototype.setDimension = function (newWidth, newHeight) {
        CustomShape.superclass.prototype.setDimension.call(this, newWidth, newHeight);
        this.updateLabels();
        this.updateLayers();
        return this;
    };
    /**
     * Updates the labels properties if necessary
     * @abstract
     * @template
     * @protected
     */
    CustomShape.prototype.updateLabels = function () {

    };
    /**
     * Makes a layer non-visible
     * @param {String} layerID
     * @returns {PMUI.draw.CustomShape}
     */
    CustomShape.prototype.hideLayer = function (layerID) {
        var currLayer;
        if (!layerID || typeof layerID !== "string") {
            return this;
        }
        currLayer = this.findLayer(layerID);
        if (!currLayer) {
            return this;
        }

        currLayer.setVisible(false);
        return this;

    };
    /**
     * Makes a layer visible
     * @param {String} layerID
     * @returns {PMUI.draw.CustomShape}
     */
    CustomShape.prototype.showLayer = function (layerID) {
        var currLayer;
        if (!layerID || typeof layerID !== "string") {
            return this;
        }

        currLayer = this.findLayer(layerID);
        if (!currLayer) {
            return this;
        }
        currLayer.setVisible(true);


        return this;
    };


    /**
     * Adds a port to the Shape
     * @param {PMUI.draw.Port} port
     * @param {Number} xPortCoord
     * @param {Number} yPortCoord
     * @chainable
     */
    CustomShape.prototype.addPort = function (port, xPortCoord, yPortCoord, triggerChange, sourcePort) {


        //where the user is attempting to create the port
        //TODO Fix trowing custom events by using properties of the objects
        var position = new PMUI.util.Point(xPortCoord, yPortCoord);
    //        oldX = port.x,
    //        oldY = port.y,
    //        oldAbsoluteX = port.absoluteX,
    //        oldAbsoluteY = port.absoluteY,
    //        oldParent = port.parent;
        //set the corresponding shape where the port would be created

        port.setParent(this);
        port.setCanvas(this.canvas);

        //set the port dimension
    //    port.setDimension(8, 8);

        //validate the position of the port in order to positionate it in one of
        // the corners of the shape, this is applied to all but activities

        //port.validatePosition(position);
        this.definePortPosition(port, position, sourcePort);

        //append the html to the DOM and paint the port
        this.html.appendChild(port.getHTML());

        port.paint();
    //    port.setColor(new Color(255, 0, 0));
        //insert the port to the ports array of the shape
        this.ports.insert(port);
    //    if (triggerChange) {
    //        port.changeParent(oldX, oldY, oldAbsoluteX,
    //            oldAbsoluteY, oldParent, port.canvas);
    //    }
        return this;
    };
    /**
     *
     * Removes a port from the Shape
     * @param {PMUI.draw.Port} port
     * @chainable
     */
    CustomShape.prototype.removePort = function (port) {
        this.ports.remove(port);
        return this;
    };
    /**
     * Determines the position where the port will be located
     * @param {PMUI.draw.Port} port
     * @param {PMUI.util.Point} point
     * @param {PMUI.draw.Port} sourcePort
     * @chainable
     */
    CustomShape.prototype.definePortPosition = function (port, point, sourcePort) {
        var canvas = this.canvas,
            directionArray = [this.TOP, this.RIGHT, this.BOTTOM, this.LEFT],
            // midPointArray is used when connectAtMiddlePoints is set to TRUE
            midPointArray = [
                new PMUI.util.Point(Math.round(this.zoomWidth / 2), 0), // TOP
                new PMUI.util.Point(this.zoomWidth, Math.round(this.zoomHeight / 2)), // RIGHT
                new PMUI.util.Point(Math.round(this.zoomWidth / 2), this.zoomHeight), // BOTTOM
                new PMUI.util.Point(0, Math.round(this.zoomHeight / 2))               // LEFT
            ],
            // sideArray is used when connectAtMiddlePoints is set to FALSE
            sideArray = [
                new PMUI.util.Point(point.x, 0), // TOP
                new PMUI.util.Point(this.getZoomWidth(), point.y), // RIGHT
                new PMUI.util.Point(point.x, this.getZoomHeight()), // BOTTOM
                new PMUI.util.Point(0, point.y)                           // LEFT
            ],
            usedArray, // selects either the midPointArray or the side array
            direction,
            i,
            candidateDistance,
            minDistance,
            option,
            border,
            directionBorderMultiplier = [-1, 1, 1, -1],
            rightBorderMultiplier = [0, 0, -2, 0],
            bottomBorderMultiplier = [0, -2, 0, 0];

        // if the shape has the connectAtMiddlePoints flag on then use the midPoints
        usedArray = this.connectAtMiddlePoints ? midPointArray :  sideArray;

        //console.log(this.connectAtMiddlePoints, usedArray, point, sourcePort);
        // if the shape has a source port available then use manhattan distance
        // instead of squaredDistance
        option = "getSquaredDistance";
        if (sourcePort && this.connectAtMiddlePoints) {
            option = "getManhattanDistance";
    //        point = new PMUI.util.Point(sourcePort.x + sourcePort.parent.absoluteX,
    //            sourcePort.y + sourcePort.parent.absoluteY);
        }
        direction = undefined;  //obtain location of the port
        minDistance = Infinity;
        // get the minimum distance between 2 points;
        for (i = 0; i < usedArray.length; i += 1) {
    //        if (sourcePort && this.connectAtMiddlePoints) {
    //            // use manhattan distance
    //            // logic:  manhattan_distance(
    //            //      new Point(srcPort.x + srcShape.x, srcPort.y + srcShape.y),
    //            //      new Point(destPort.x + destShape.x, destPort.y +
    //            //                  destShape.y)
    //            // )
    ////            candidateDistance = point[option](usedArray[i].
    ////                add(new Point(port.parent.absoluteX,
    //                                  port.parent.absoluteY)));
    //            candidateDistance = point[option](usedArray[i]);
    //        } else {
                // use squared distance
            candidateDistance = point[option](usedArray[i]);
    //        }
            if (minDistance > candidateDistance) {
                minDistance = candidateDistance;
                direction = directionArray[i];
            }
        }

        border = this.getBorderConsideringLayers();
        for (i = 0; i < 4; i += 1) {
            this.border[i].x =
                (border * directionBorderMultiplier[i] +
                    border * rightBorderMultiplier[i]);
            this.border[i].y =
                (border * directionBorderMultiplier[i] +
                    border * bottomBorderMultiplier[i]);
        }
        // because of the zIndex problem move the ports towards the center
        // of the shape (this is done when the destDecorator is selected)
        port.setDirection(direction);
        // setPosition logic: 
        // since the port must face the border of the shape (or the shape if it
        // doesn't have a border) first let's move the port according to the
        // direction of the port (up -> -1 * border, right -> 1 * border, bottom ->
        // 1 * border, left -> -1 * border)
        // after the port will be right in the edge of the shape but now the
        // multiplier has also affected the positioning of the port if it's located
        // in the right or in the bottom (the port will move 2 * border in the
        // y-axis or x-axis) so let's reverse that movement using another array
        port.setPosition(
            (
    //            this.border[direction].x +
                usedArray[direction].x
                    - port.getWidth() / 2
            ),
            (
    //            this.border[direction].y +
                usedArray[direction].y
                    - port.getHeight() / 2
            )
        );


        port.applyBorderMargin(true);

        // determines the percentage of port in relation with the shape's width or
        // height (useful to determine the new position of the port while resizing)
        port.determinePercentage();

        return this;
    };

    /**
     * Returns the border of this shape or the border of its layers (max)
     * @return {Number}
     */
    CustomShape.prototype.getBorderConsideringLayers = function () {
        var border = parseInt(this.style.getProperty('borderTopWidth') || 0, 10),
            layer,
            i;
        for (i = 0; i < this.getLayers().getSize(); i += 1) {
            layer = this.getLayers().get(i);
            border = Math.max(border, parseInt(
                layer.style.getProperty('borderTopWidth') || 0,
                10
            ));
        }
        return border;
    };

    /**
     * Show  all the ports of the Shape
     * @chainable
     */
    CustomShape.prototype.showPorts = function () {
        var i;
        for (i = 0; i < this.ports.getSize(); i += 1) {
            this.ports.get(i).show();
        }
        return this;
    };

    /**
     * hide  all the ports of the Shape
     * @chainable
     */
    CustomShape.prototype.hidePorts = function () {
        var i;
        for (i = 0; i < this.ports.getSize(); i += 1) {
            this.ports.get(i).hide();
        }
        return this;
    };

    /**
     * Updates the position of the ports regarding the CustomShape and two
     * differentials
     * TODO Improve triggering of events with ports own properties
     * @param {Number} xDiff
     * @param {Number} yDiff
     * @chainable
     */
    CustomShape.prototype.updatePortsPosition = function (xDiff, yDiff) {
        var i,
            port,
            ports = this.ports;
        for (i = 0; i < ports.getSize(); i += 1) {
            port = ports.get(i);
            if (port.direction === this.RIGHT || port.direction === this.BOTTOM) {
                port.oldX = port.x;
                port.oldY = port.y;
                port.oldAbsoluteX = port.absoluteX;
                port.oldAbsoluteY = port.absoluteY;
                port.setPosition(port.x + xDiff, port.y + yDiff, true);
                port.changePosition(port.oldX, port.oldY, port.oldAbsoluteX,
                    port.oldAbsoluteY);
            } else {
                port.setPosition(port.x, port.y, true);
            }
            port.connection.disconnect().connect();
            port.connection.setSegmentMoveHandlers();
        }
        return this;
    };

    /**
     * Recalculates a port position given the port
     * TODO Determine if this method is necessary
     * @param {PMUI.draw.Port} port
     * @chainable
     */
    CustomShape.prototype.recalculatePortPosition = function (port) {
    //    console.log(port.percentage);
        var xPercentage = Math.round((port.percentage *
                port.parent.getZoomWidth()) / 100),
            yPercentage = Math.round((port.percentage *
                port.parent.getZoomHeight()) / 100),
            xCoordinate = [xPercentage, port.parent.getZoomWidth(), xPercentage, 0],
            yCoordinate = [0, yPercentage,
                    port.parent.getZoomHeight(), yPercentage];
    //    console.log(xPercentage + " " + yPercentage);
        port.setPosition(
            this.border[port.direction].x + xCoordinate[port.direction] -
                Math.round(port.width / 2),
            this.border[port.direction].y + yCoordinate[port.direction] -
                Math.round(port.height / 2)
        );
        return this;
    };

    /**
     * Initializes properties to to save the current position of the ports
     * @chainable
     */
    CustomShape.prototype.initPortsChange = function () {
        var i,
            ports = this.ports,
            port;
        for (i = 0; i < ports.getSize(); i += 1) {
            port = ports.get(i);
            port.oldX = port.x;
            port.oldY = port.y;
            port.oldAbsoluteX = port.absoluteX;
            port.oldAbsoluteY = port.absoluteY;
        }
        return this;
    };

    /**
     * Trigger to save the port changes
     * @chainable
     */
    CustomShape.prototype.firePortsChange = function () {
        var i,
            ports = this.ports,
            port;
        for (i = 0; i < ports.getSize(); i += 1) {
            port = ports.get(i);
            // port is not a shape so use call
            CustomShape.superclass.prototype.changePosition.call(this, port.oldX, port.oldY,
                port.oldAbsoluteX, port.oldAbsoluteY);
        }
        return this;
    };
    /**
     * Updates ports and connections of the current shape
     * @chainable
     */
    CustomShape.prototype.refreshShape = function () {
        CustomShape.superclass.prototype.refreshShape.call(this);
        this.updatePortsOnZoom()
            .refreshConnections(false);
        this.paint();
        return this;
    };
    /**
     * Updates the position of the ports after applying a zoom scale
     * @chainable
     */
    CustomShape.prototype.updatePortsOnZoom = function () {
        var i,
            ports = this.ports,
            port,
            zoomFactor = this.canvas.zoomFactor,
            prevZoomFactor = (this.canvas.prevZoom * 25 + 50) / 100,
            portFactor = (ports.getSize() > 0) ? ports.get(0).width / 2 : 0,
            srcDecorator,
            destDecorator,
            xCoords = [
                this.zoomWidth / 2 - portFactor,
                this.zoomWidth - portFactor,
                this.zoomWidth / 2 - portFactor,
                -portFactor
            ],
            yCoords = [
                -portFactor,
                this.zoomHeight / 2 - portFactor,
                this.zoomHeight - portFactor,
                this.zoomHeight / 2 - portFactor
            ];

        for (i = 0; i < ports.getSize(); i += 1) {
            port = ports.get(i);
            port.applyBorderMargin(false);
            if (this.connectAtMiddlePoints) {
                port.setPosition(xCoords[port.direction], yCoords[port.direction]);
            } else {
                port.setPosition(port.x / prevZoomFactor * zoomFactor,
                    port.y / prevZoomFactor * zoomFactor);
            }
            port.applyBorderMargin(true);
            srcDecorator = port.connection.srcDecorator;
            destDecorator = port.connection.destDecorator;
            if (srcDecorator) {
                srcDecorator.applyZoom();
            }
            if (destDecorator) {
                destDecorator.applyZoom();
            }


//        port.connection.disconnect().connect();
//        port.connection.setSegmentMoveHandlers();
//        port.connection.checkAndCreateIntersectionsWithAll();
        }
        return this;
    };
    /**
     * TODO Determine if this method is necessary
     */
    CustomShape.prototype.calculateLabelsPercentage = function () {
        var i, label;
        for (i = 0; i < this.labels.getSize(); i += 1) {
            label = this.labels.get(i);
            label.xPercentage = label.getX() / this.getWidth();
            label.yPercentage = label.getY() / this.getHeight();
        }

    };

    /**
     * Updates the labels position according to its configuration properties
     * @chainable
     */
    CustomShape.prototype.updateLabelsPosition = function () {
        var i,
            label;
        for (i = 0; i < this.labels.getSize(); i += 1) {
            label = this.labels.get(i);
            label.setLabelPosition(label.location, label.diffX, label.diffY);
        }
        return this;
    };

    /**
     * Returns the respective drag behavior according to a given point
     * @return {Number}
     */
    CustomShape.prototype.determineDragBehavior = function (point) {
        // limit to consider inside the shape
        var Point = PMUI.util.Point,
            Geometry = PMUI.draw.Geometry,
            limit = this.limits[this.canvas.zoomPropertiesIndex],

            border = parseInt(this.style.getProperty('border') || 0, 10);

        // if the point is inside the rectangle determine the behavior
        // (drag or connect)
        if (Geometry.pointInRectangle(point, new Point(0, 0),
                new Point(this.zoomWidth + 2 * border,
                    this.zoomHeight + 2 * border))) {
            // if the shape is inside the inner rectangle then drag
            if (Geometry.pointInRectangle(point,
                    new Point(border + limit, border + limit),
                    new Point(this.zoomWidth + border - limit,
                        this.zoomHeight + border - limit))) {
                return this.DRAG;
            }
            return this.CONNECT;
        }

        // if the mouse pointer is outside then return cancel
        return this.CANCEL;
    };
    /**
     * Creates a drag helper for drag and drop operations for the helper property
     * in jquery ui draggable
     * TODO Create a singleton object for this purpose
     * @returns {String} html
     */
    CustomShape.prototype.createDragHelper = function () {
        var html = document.createElement("div");

        // can't use class style here
        html.style.width = 8 + "px";
        html.style.height = 8 + "px";
        html.style.backgroundColor = "black";
        html.style.zIndex = 2 * PMUI.draw.Shape.prototype.MAX_ZINDEX;
        html.id = "drag-helper";
        html.className = "drag-helper";
        // html.style.display = "none";
        return html;
    };

    /**
     * Handler for the onmousedown event, changes the draggable properties
     * according to the drag behavior that is being applied
     * @param {PMUI.draw.CustomShape} CustomShape
     * @returns {Function}
     */
    CustomShape.prototype.onMouseDown = function (customShape) {
        return function (e, ui) {
            var canvas = customShape.canvas;
            if (e.which === 3) {
                $(canvas.html).trigger("rightclick", [e, customShape]);
            } else {

                if (customShape.dragType === customShape.DRAG) {
                    customShape.setDragBehavior("customshapedrag");

                } else if (customShape.dragType === customShape.CONNECT) {
                    customShape.setDragBehavior("connection");
                } else {
                    customShape.setDragBehavior("nodrag");
                }
                customShape.dragging = true;
            }

            e.stopPropagation();
        };
    };


    /**
     * On Mouse Up handler it allows the shape to recalculate drag behavior
     * whenever there was a mouse down event but no drag involved
     * @param {PMUI.draw.CustomShape} customShape
     * @return {Function}
     */
    CustomShape.prototype.onMouseUp = function (customShape) {
        return function (e, ui) {
            customShape.dragging = false;

        };
    };

    /**
     * Handler for the onmousemove event, determines the drag behavior that is
     * being applied, the coordinates where the mouse is currently located and
     * changes the mouse cursor
     * @param {PMUI.draw.CustomShape} customShape
     * @returns {Function}
     */

    CustomShape.prototype.onMouseMove = function (customShape) {
        return function (e, ui) {
            var $customShape,
                canvas,
                realPoint, 
                auxPoint;

            if (customShape.dragging || customShape.entered) {
                return;
            }
    //TODO ADD TO UTILS A FUNCTION TO RETRIEVE A POINT RESPECTING THE SHAPE
            $customShape = $(customShape.html);
            canvas = customShape.getCanvas();

            realPoint = canvas.relativePoint(e);

            customShape.startConnectionPoint.x = realPoint.x - customShape.absoluteX;
            customShape.startConnectionPoint.y = realPoint.y - customShape.absoluteY;
            //console.log(customShape.startConnectionPoint);
            auxPoint = new PMUI.util.Point(e.pageX - canvas.getX() -
                customShape.absoluteX + canvas.getLeftScroll(),
                e.pageY - canvas.getY() -
                customShape.absoluteY + canvas.getTopScroll());

            customShape.dragType = customShape
                .determineDragBehavior(auxPoint);
            //customShape.startConnectionPoint = auxPoint;

            if (customShape.dragType === customShape.DRAG) {
                $customShape.css('cursor', 'move');
            } else if (customShape.dragType === customShape.CONNECT) {
                $customShape.css('cursor', 'crosshair');

            } else {
                $customShape.css('cursor', 'default');
            }
            //e.stopPropagation();
        };
    };

    /**
     * Handler of the onClick Event hides the selected ports and resize Handlers if
     * any and show its corresponding resize handler
     * @param {PMUI.draw.CustomShape} customShape
     * @returns {Function}
     */
    CustomShape.prototype.onClick = function (customShape) {
        return function (e, ui) {
            var isCtrl = false,
                canvas = customShape.canvas,
                currentSelection = canvas.currentSelection,
                currentLabel = canvas.currentLabel;

            if (e.ctrlKey) { // Ctrl is also pressed
                isCtrl = true;
            }

            // hide the current connection if there was one
            customShape.canvas.hideCurrentConnection();

            if (e.which === 3) {        // right click
                e.preventDefault();
                // trigger right click
                customShape.canvas.triggerRightClickEvent(customShape);
            } else {
                if (!customShape.wasDragged) {
                    // if the custom shape was not dragged (this var is set to true
                    // in custom_shape_drag_behavior >> onDragEnd)
                    if (isCtrl) {
                        if (currentSelection.contains(customShape)) {
                            // remove from the current selection
                            canvas.removeFromSelection(customShape);
                        } else {
                            // add to the current selection
                            canvas.addToSelection(customShape);
                        }

                    } else {
                        canvas.emptyCurrentSelection();
                        canvas.addToSelection(customShape);
                    }
                }
                if (!currentSelection.isEmpty()) {
                    canvas.triggerSelectEvent(currentSelection.asArray());
                }
            }

            if (this.helper) {
                $(this.helper.html).remove();
            }

            if (currentLabel) {
                currentLabel.loseFocus();
                $(currentLabel.textField).focusout();
            }
            customShape.wasDragged = false;
    //        customShape.canvas.setCurrentShape(customShape);
            e.stopPropagation();
        };
    };

    /**
     * Empty function to perform some actions when parsing a diagram (called
     * from Canvas.parse)
     * @template
     * @protected
     */
    CustomShape.prototype.parseHook = function () {
    };

    /**
     * Returns a list of ports related to the shape
     * @returns {PMUI.util.ArrayList}
     */
    CustomShape.prototype.getPorts = function () {
        return this.ports;
    };
    /**
     * Returns a list of Layers related to the shape
     * @returns {PMUI.util.ArrayList}
     */
    CustomShape.prototype.getLayers = function () {
        return this.layers;
    };

    /**
     * Returns the labels associated to the current shape
     * @return {PMUI.util.ArrayList}
     */
    CustomShape.prototype.getLabels = function () {
        return this.labels;
    };

    /**
     * Applies the current zoom to the corresponding shape its layers and labels
     * @chainable
     */
    CustomShape.prototype.applyZoom = function () {
        var i,
            label;

        CustomShape.superclass.prototype.applyZoom.call(this);

        for (i = 0; i < this.layers.getSize(); i += 1) {
            this.layers.get(i).applyZoom();
        }

        for (i = 0; i < this.labels.getSize(); i += 1) {
            label = this.labels.get(i);
            label.applyZoom();
            label.setLabelPosition(label.location, label.diffX, label.diffY);
            //label.setPosition(label.x, label.y);
        }

        return this;
    };

    /**
     * Sets the start point of a connection corresponding to this shape
     * @param {PMUI.util.Point} point
     * @chainable
     */
    CustomShape.prototype.setStartConnectionPoint = function (point) {
        this.startConnectionPoint = point;
        return this;
    };
    /**
     * Sets the connectAtMiddlePoints property
     * @param  {Boolean} connect
     * @chainable
     */
    CustomShape.prototype.setConnectAtMiddlePoints = function (connect) {
        this.connectAtMiddlePoints = connect;
        return this;
    };
    /**
     * Returns whether a shape connections will be done only in the middle points of
     * its sides or not
     * @return {Boolean}
     */
    CustomShape.prototype.getConnectAtMiddlePoints = function () {
        return this.connectAtMiddlePoints;
    };
    /**
     * Sets the connection type of the shape
     * @param {String} newConnType
     * @chainable
     */
    CustomShape.prototype.setConnectionType = function (newConnType) {
        this.connectionType = newConnType;
        return this;
    };
    /**
     * Returns the connection type of the shape
     * @return {String}
     */
    CustomShape.prototype.getConnectionType = function () {
        return this.connectionType;
    };
    /**
     * Serializes this object
     * @return {Object}
     */
    CustomShape.prototype.stringify = function () {
        /**
         * inheritedJSON = {
         *     id:  #
         *     x:  #,
         *     y:  #,
         *     width:  #,
         *     height:  #
         * }
         * @property {Object}
         */
        var sLayers = [],
            labels = [],
            i,
            inheritedJSON,
            thisJSON;

        // serialize layers
        for (i = 0; i < this.layers.getSize(); i += 1) {
            sLayers.push(this.layers.get(i).stringify());
        }

        // serialize labels
        for (i = 0; i < this.labels.getSize(); i += 1) {
            labels.push(this.labels.get(i).stringify());
        }

        inheritedJSON = CustomShape.superclass.prototype.stringify.call(this);
        thisJSON = {
            canvas: this.canvas.getID(),
            layers: sLayers,
            labels: labels,
            connectAtMiddlePoints: this.getConnectAtMiddlePoints(),
            connectionType: this.getConnectionType(),
            parent: this.parent.getID()
        };
        $.extend(true, inheritedJSON, thisJSON);
        return inheritedJSON;
    };

    /**
     * Builds a custom shape based on the parameter 'json'
     * @param {String} json
     * @chainable
     */
    CustomShape.prototype.parseJSON = function (json) {
        this.initObject(json);
        return this;
    };

    PMUI.extendNamespace('PMUI.draw.CustomShape', CustomShape);

    if (typeof exports !== 'undefined') {
        module.exports = CustomShape;
    }

}());
