(function () {
    /**
     * @class PMUI.behavior.ConnectionDropBehavior
     * Class that encapsulates the drop behavior for dropped connections in shapes
     * @extends PMUI.behavior.DropBehavior
     *
     * @constructor
     * Creates a new instance of the class
     * @param selectors
     */
    var ConnectionDropBehavior = function (selectors) {
        ConnectionDropBehavior.superclass.call(this, selectors);
    };

    PMUI.inheritFrom('PMUI.behavior.DropBehavior', ConnectionDropBehavior);

    /**
     * Type of the instances
     * @property {String}
     */
    ConnectionDropBehavior.prototype.type = "ConnectionDropBehavior";
    /**
     * Defaults selectors for this drop behavior
     * @property {String}
     */
    ConnectionDropBehavior.prototype.defaultSelector = ".custom_shape,.port";

    /**
     * Sets the selectors for this drop behavior including the defaults
     * @param selectors
     * @param overwrite
     * @return {*}
     */
    ConnectionDropBehavior.prototype.setSelectors = function (selectors, overwrite) {
        ConnectionDropBehavior.superclass.prototype.setSelectors.call(this, selectors, overwrite);
        this.selectors.push(".port");
        this.selectors.push(".custom_shape");

        return this;
    };
    /**
     * Drag enter hook for this drop behavior, marks that a shape is over a
     * droppable element
     * @param {PMUI.draw.Shape} shape
     * @return {Function}
     */
    ConnectionDropBehavior.prototype.onDragEnter = function (shape) {
        return function (e, ui) {
            shape.entered = true;
        };
    };

    /**
     * Drag leave hook for this drop behavior, marks that a shape has left a
     * droppable element
     * @param {PMUI.draw.Shape} shape
     * @return {Function}
     */
    ConnectionDropBehavior.prototype.onDragLeave = function (shape) {
        return function (e, ui) {
            shape.entered = false;
        };
    };
    /**
     * On drop handler for this drop behavior, creates a connection between the
     * droppable element and the dropped element, or move ports among those shapes
     * @param {PMUI.draw.Shape} shape
     * @return {Function}
     */
    ConnectionDropBehavior.prototype.onDrop = function (shape) {
        var that = this;
        return function (e, ui) {
            var canvas = shape.getCanvas(),
                //regularShapes = shape.canvas.regularShapes,
                id = ui.draggable.attr('id'),
                //port = regularShapes.find('id', id),
                x,
                y,
                currLeft,
                currTop,
                startPoint,
                sourceShape,
                sourcePort,
                endPort,
                endPortXCoord,
                endPortYCoord,
                connection,
                currentConnection = canvas.currentConnection,
                srcPort,
                dstPort,
                port,
                success = false,
                command;
            shape.entered = false;
            if (!shape.drop.dropStartHook(shape, e, ui)) {
                return false;
            }
            if (shape.getConnectionType() === "none") {
                return true;
            }
            //shape.entered = false;
            if (currentConnection) {
                srcPort = currentConnection.srcPort;
                dstPort = currentConnection.destPort;
                if (srcPort.id === id) {
                    port = srcPort;
                } else if (dstPort.id === id) {
                    port = dstPort;
                } else {
                    port = null;
                }
            }
            if (ui.helper && ui.helper.attr('id') === "drag-helper") {

                //if its the helper then we need to create two ports and draw a
                // connection
                //we get the points and the corresponding shapes involved
                startPoint = shape.canvas.connectionSegment.startPoint;
                sourceShape = shape.canvas.connectionSegment.pointsTo;
                //determine the points where the helper was created
                if (sourceShape.parent && sourceShape.parent.id === shape.id) {
                    return true;
                }
                sourceShape.setPosition(sourceShape.oldX, sourceShape.oldY);

                //console.log(startPoint);

                //startPoint.x -= sourceShape.absoluteX;
                //startPoint.y -= sourceShape.absoluteY;

                //create the ports
                sourcePort = new PMUI.draw.Port({
                    width: 8,
                    height: 8
                });
                endPort = new PMUI.draw.Port({
                    width: 8,
                    height: 8
                });

                realPoint = shape.canvas.relativePoint(e);
                //endPortXCoord = realPoint.x;
                //endPortYCoord = realPoint.y;
                //determine the position where the helper was dropped
                endPortXCoord = ui.offset.left - shape.canvas.getX() -
                    shape.getAbsoluteX() + shape.canvas.getLeftScroll();
                endPortYCoord = ui.offset.top - shape.canvas.getY() -
                    shape.getAbsoluteY() + shape.canvas.getTopScroll();

                // add ports to the corresponding shapes
                // addPort() determines the position of the ports
                //console.log('Start Port');
                sourceShape.addPort(sourcePort, startPoint.x, startPoint.y);
                //console.log('End Port');
                shape.addPort(endPort, endPortXCoord, endPortYCoord,
                    false, sourcePort);

                //add ports to the canvas array for regularShapes
                //shape.canvas.regularShapes.insert(sourcePort).insert(endPort);

                //create the connection
                connection = new PMUI.draw.Connection({
                    srcPort: sourcePort,
                    destPort: endPort,
                    canvas: shape.canvas,
                    segmentStyle: shape.connectionType
                });

    //            console.log(sourcePort.direction);
    //            console.log(endPort.direction);

                //set its decorators
                connection.setSrcDecorator(new PMUI.draw.ConnectionDecorator({
                    width: 11,
                    height: 11,
                    canvas: canvas,
                    decoratorPrefix: "con_normal",
                    decoratorType: "source",
                    parent: connection
                }));
                connection.setDestDecorator(new PMUI.draw.ConnectionDecorator({
                    width: 11,
                    height: 11,
                    canvas: canvas,
                    decoratorPrefix: "con_normal",
                    decoratorType: "target",
                    parent: connection
                }));

                connection.canvas.commandStack.add(new PMUI.command.CommandConnect(connection));

                //connect the two ports
                connection.connect();
                connection.setSegmentMoveHandlers();

                // / fixes the zIndex of the connection
                //connection.fixZIndex();

                //add the connection to the canvas, that means insert its html to
                // the DOM and adding it to the connections array
                canvas.addConnection(connection);

                // now that the connection was drawn try to create the intersections
                connection.checkAndCreateIntersectionsWithAll();

                //attaching port listeners
                sourcePort.attachListeners(sourcePort);
                endPort.attachListeners(endPort);

                // finally trigger createEvent
                canvas.triggerCreateEvent(connection, []);
            } else if (port) {

                port.setOldParent(port.getParent());
                port.setOldX(port.getX());
                port.setOldY(port.getY());

                x = ui.position.left;
                y = ui.position.top;
                port.setPosition(x, y);
                shape.dragging = false;
                if (shape.getID() !== port.parent.getID()) {
                    port.parent.removePort(port);
                    currLeft = ui.offset.left - canvas.getX() -
                        shape.absoluteX + shape.canvas.getLeftScroll();
                    currTop = ui.offset.top - canvas.getY() -
                        shape.absoluteY + shape.canvas.getTopScroll();
                    shape.addPort(port, currLeft, currTop, true);
                    canvas.regularShapes.insert(port);
                } else {
                    shape.definePortPosition(port, port.getPoint(true));
                }

                // LOGIC: when portChangeEvent is triggered it gathers the state
                // of the connection but since at this point there's only a segment
                // let's paint the connection, gather the state and then disconnect
                // it (the connection is later repainted on, I don't know how)
                port.connection.connect();
                canvas.triggerPortChangeEvent(port);
                port.connection.disconnect();

                command = new PMUI.command.CommandReconnect(port);
                port.canvas.commandStack.add(command);
            }
    //        shape.dropBehavior.dropEndHook(shape, e, ui);
            return false;
        };
    };

    PMUI.extendNamespace('PMUI.behavior.ConnectionDropBehavior', ConnectionDropBehavior);
}());
