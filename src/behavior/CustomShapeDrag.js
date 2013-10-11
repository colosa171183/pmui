(function () {
    /**
     * @class PMUI.behavior.CustomShapeDragBehavior
     * Encapsulates the drag behavior of a custom shape (with ports and connections)
     * , it also encapsulates the behavior for multiple drag
     * @extends PMUI.behavior.DragBehavior
     *
     * @constructor Creates a new instance of the class
     *
     */
    var CustomShapeDragBehavior = function () {
    };

    PMUI.inheritFrom('PMUI.behavior.DragBehavior', CustomShapeDragBehavior);
    /**
     * Type of the instances
     * @property {String}
     */
    CustomShapeDragBehavior.prototype.type = "CustomShapeDragBehavior";
    /**
     * Attach the drag behavior and ui properties to the corresponding shape
     * @param {PMUI.draw.CustomShape} customShape
     */
    CustomShapeDragBehavior.prototype.attachDragBehavior = function (customShape) {
        var dragOptions,
            $customShape = $(customShape.getHTML());
        dragOptions = {
            revert: false,
            helper: "none",
            cursorAt: false,
            revertDuration: 0,
            disable: false,
            grid: [1, 1],
            start: this.onDragStart(customShape),
            drag: this.onDrag(customShape, true),
            stop: this.onDragEnd(customShape, true)
        };
        $customShape.draggable(dragOptions);
    };

//TODO Encapsulates behaviors for multiple drag, and simple custom shape drag
//TODO Initialize all oldX and oldY values
    /**
     * On drag start handler, it uses the {@link PMUI.behavior.RegularDragBehavior}.onDragStart
     * method to initialize the drag, but also initializes other properties
     * @param {PMUI.draw.CustomShape} customShape
     * @return {Function}
     */
    CustomShapeDragBehavior.prototype.onDragStart = function (customShape) {
        return function (e, ui) {
            PMUI.behavior.RegularDragBehavior.prototype.onDragStart.call(this,
                customShape)(e, ui);

            customShape.previousXDragPosition = customShape.getX();
            customShape.previousYDragPosition = customShape.getY();

        };
    };
    /**
     * Procedure executed while dragging, it takes care of multiple drag, moving
     * connections, updating positions and children of the shapes being dragged
     * @param {PMUI.draw.CustomShape} customShape shape being dragged
     * @param {boolean} root return whether this is the shape where the drag started
     * @param {number} childDiffX x distance needed for the non-root shapes to move
     * @param {number} childDiffY y distance needed for the non-root shapes to move
     * @param {Object} e jQuery object containing the properties when a drag event
     * occur
     * @param {Object} ui JQuery UI object containing the properties when a drag
     * event occur
     */
    CustomShapeDragBehavior.prototype.onDragProcedure = function (customShape, root, childDiffX, childDiffY, e, ui) {
        var i,
            j,
            sibling,
            diffX,
            diffY,
            port,
            child,
            connection,
            shape1,
            shape2,
            canvas = customShape.canvas;
        // shapes
        if (root) {
            customShape.setPosition(ui.helper.position().left / canvas.zoomFactor,
                ui.helper.position().top / canvas.zoomFactor);
            //console.log(customShape.x+','+customShape.y);
            diffX = customShape.x - customShape.previousXDragPosition;
            diffY = customShape.y - customShape.previousYDragPosition;

            customShape.previousXDragPosition = customShape.x;
            customShape.previousYDragPosition = customShape.y;

            for (i = 0; i < customShape.canvas.currentSelection.getSize(); i += 1) {
                sibling = customShape.canvas.currentSelection.get(i);
                if (sibling.id !== customShape.id) {
                    sibling.setPosition(sibling.x + diffX, sibling.y + diffY);
                }
            }
        } else {
            customShape.setPosition(customShape.x, customShape.y);
        }

        // children
        if (root) {
            for (i = 0; i < customShape.canvas.currentSelection.getSize(); i += 1) {
                sibling = customShape.canvas.currentSelection.get(i);
                for (j = 0; j < sibling.children.getSize(); j += 1) {
                    child = sibling.children.get(j);
                    PMUI.behavior.CustomShapeDragBehavior.prototype.onDragProcedure.call(this, child,
                        false, diffX, diffY, e, ui);
                }
            }
        } else {
            for (i = 0; i < customShape.children.getSize(); i += 1) {
                child = customShape.children.get(i);
                PMUI.behavior.CustomShapeDragBehavior.prototype.onDragProcedure.call(this, child,
                    false, childDiffX, childDiffY, e, ui);
            }
        }

        // connections
        if (root) {
            for (i = 0; i < customShape.canvas.currentSelection.getSize(); i += 1) {
                sibling = customShape.canvas.currentSelection.get(i);
                for (j = 0; j < sibling.ports.getSize(); j += 1) {
                    //for each port update its absolute position and repaint its connection
                    port = sibling.ports.get(j);
                    connection = port.connection;

                    port.setPosition(port.x, port.y);

                    if (customShape.canvas.sharedConnections.
                            find('id', connection.getID())) {
                        // move the segments of this connections
                        if (connection.srcPort.parent.getID() ===
                                sibling.getID()) {
                            // to avoid moving the connection twice
                            // (two times per shape), move it only if the shape
                            // holds the sourcePort
                            connection.move(diffX * canvas.zoomFactor,
                                diffY * canvas.zoomFactor);
                        }
                    } else {
                        connection
                            // repaint:  false
                            .setSegmentColor(PMUI.util.Color.GREY, false)
                            .setSegmentStyle("regular", false)// repaint:  false
                            .disconnect()
                            .connect();
                    }
                }
            }
        } else {
            for (i = 0; i < customShape.ports.getSize(); i += 1) {
                //for each port update its absolute position and repaint its connection
                port = customShape.ports.get(i);
                connection = port.connection;
                shape1 = connection.srcPort.parent;
                shape2 = connection.destPort.parent;

                port.setPosition(port.x, port.y);

                if (customShape.canvas.sharedConnections.
                        find('id', connection.getID())) {
                    // to avoid moving the connection twice
                    // (two times per shape), move it only if the shape
                    // holds the sourcePort
                    if (connection.srcPort.parent.getID() ===
                            customShape.getID()) {
                        connection.move(childDiffX * canvas.zoomFactor,
                                childDiffY * canvas.zoomFactor);
                    }
                } else {
                    connection
                        // repaint:  false
                        .setSegmentColor(PMUI.util.Color.GREY, false)
                        .setSegmentStyle("regular", false)
                        .disconnect()
                        .connect();
                }
            }
        }
    };
    /**
     * On drag handler, calls the drag procedure while the dragging is occurring,
     * and also takes care of the snappers
     * @param {PMUI.draw.CustomShape} customShape shape being dragged
     * @param {boolean} root return whether this is the shape where the drag started
     * @param {number} childDiffX x distance needed for the non-root shapes to move
     * @param {number} childDiffY y distance needed for the non-root shapes to move
     * @return {Function}
     */
    CustomShapeDragBehavior.prototype.onDrag = function (customShape, root, childDiffX, childDiffY) {
        var self = this;
        return function (e, ui) {

            // call to dragEnd procedure
            self.onDragProcedure(customShape, root, childDiffX,
                childDiffY, e, ui);

            // show or hide the snappers
            customShape.canvas.showOrHideSnappers(customShape);

        };
    };
    /**
     * Procedure executed on drag end, it takes care of multiple drag, moving
     * connections, updating positions and children of the shapes being dragged
     * @param {PMUI.draw.CustomShape} customShape shape being dragged
     * @param {boolean} root return whether this is the shape where the drag started
     * @param {Object} e jQuery object containing the properties when a drag event
     * occur
     * @param {Object} ui JQuery UI object containing the properties when a drag
     * event occur
     */
    CustomShapeDragBehavior.prototype.dragEndProcedure = function (customShape, root, e, ui) {
        var i,
            j,
            sibling,
            port,
            child,
            connection,
            shape1,
            shape2,
            canvas = customShape.canvas;

        // shapes
        if (root) {

            // the difference between this segment of code and the segment of code
            // found in dragProcedure is that it's not needed to move the shapes
            // anymore using differentials
            customShape.setPosition(ui.helper.position().left / canvas.zoomFactor,
                ui.helper.position().top / canvas.zoomFactor);
            customShape.wasDragged = true;
            for (i = 0; i < customShape.canvas.currentSelection.getSize();
                 i += 1) {
                sibling = customShape.canvas.currentSelection.get(i);
                sibling.setPosition(sibling.x, sibling.y);
            }

        } else {
            customShape.setPosition(customShape.x, customShape.y);
        }

        // children
        if (root) {
            for (i = 0; i < customShape.canvas.currentSelection.getSize();
                 i += 1) {
                sibling = customShape.canvas.currentSelection.get(i);
                for (j = 0; j < sibling.children.getSize(); j += 1) {
                    child = sibling.children.get(j);
                    child.changedContainer = true;
                    PMUI.behavior.CustomShapeDragBehavior.prototype.dragEndProcedure.call(this,
                        child, false, e, ui);
                }
            }
        } else {
            for (i = 0; i < customShape.children.getSize(); i += 1) {
                child = customShape.children.get(i);
                PMUI.behavior.CustomShapeDragBehavior.prototype.dragEndProcedure.call(this,
                    child, false, e, ui);
            }
        }

        // connections
        if (root) {
            for (i = 0; i < customShape.canvas.currentSelection.getSize();
                 i += 1) {
                sibling = customShape.canvas.currentSelection.get(i);
                for (j = 0; j < sibling.ports.getSize(); j += 1) {

                    // for each port update its absolute position and repaint
                    // its connection
                    port = sibling.ports.get(j);
                    connection = port.connection;

                    port.setPosition(port.x, port.y);

                    if (customShape.canvas.sharedConnections.
                            find('id', connection.getID())) {
                        // move the segments of this connections
                        if (connection.srcPort.parent.getID() ===
                                sibling.getID()) {
                            // to avoid moving the connection twice
                            // (two times per shape), move it only if the shape
                            // holds the sourcePort
                            connection.disconnect(true).connect({
                                algorithm: 'user',
                                points: connection.points,
                                dx: parseFloat($(connection.html).css('left')),
                                dy: parseFloat($(connection.html).css('top'))
                            });
                            connection.checkAndCreateIntersectionsWithAll();
                        }
                    } else {
                        connection
                            // repaint:  false
                            .setSegmentColor(connection.originalSegmentColor, false)
                            .setSegmentStyle(connection.originalSegmentStyle, false)
                            .disconnect()
                            .connect();
                        connection.setSegmentMoveHandlers();
                        connection.checkAndCreateIntersectionsWithAll();
                    }
                }
            }
        } else {
            for (i = 0; i < customShape.ports.getSize(); i += 1) {
                //for each port update its absolute position and repaint
                //its connection
                port = customShape.ports.get(i);
                connection = port.connection;
                shape1 = connection.srcPort.parent;
                shape2 = connection.destPort.parent;

                port.setPosition(port.x, port.y);
                if (customShape.canvas.sharedConnections.
                        find('id', connection.getID())) {
                    // to avoid moving the connection twice
                    // (two times per shape), move it only if the shape
                    // holds the sourcePort
                    if (connection.srcPort.parent.getID() ===
                            customShape.getID()) {
                        connection.checkAndCreateIntersectionsWithAll();
                    }
                } else {
                    connection
                        // repaint:  false
                        .setSegmentColor(connection.originalSegmentColor, false)
                        .setSegmentStyle(connection.originalSegmentStyle, false)
                        .disconnect()
                        .connect();
                    connection.setSegmentMoveHandlers();
                    connection.checkAndCreateIntersectionsWithAll();
                }
            }
        }

    };
    /**
     * On drag end handler, ot calls drag end procedure, removes the snappers and,
     * fires the command move if necessary
     * @param {PMUI.draw.CustomShape} customShape
     * @return {Function}
     */
    CustomShapeDragBehavior.prototype.onDragEnd = function (customShape) {
        var command,
            self = this;
        return function (e, ui) {

            // call to dragEnd procedure
            self.dragEndProcedure(customShape, true, e, ui);

            customShape.dragging = false;

            // hide the snappers
            customShape.canvas.verticalSnapper.hide();
            customShape.canvas.horizontalSnapper.hide();

            if (!customShape.changedContainer) {

                command = new PMUI.command.CommandMove(customShape.canvas.currentSelection);
                command.execute();
                customShape.canvas.commandStack.add(command);
            }
            customShape.changedContainer = false;

            // decrease the zIndex of the oldParent of customShape
            customShape.decreaseParentZIndex(customShape.oldParent);
        };
    };

    PMUI.extendNamespace('PMUI.behavior.CustomShapeDragBehavior', CustomShapeDragBehavior);

    if (typeof exports !== 'undefined') {
        module.exports = CustomShapeDragBehavior;
    }
    
}());
