(function () {
    /**
     * @class PMUI.command.CommandReconnect
     * Class CommandReconnect determines the actions executed when a connection is reconnected, e.g. when a connection
     * source port or end port are dragged to another shape or another position in the same shape (redo)
     * and the actions executed to revert the last drag to another shape or another position in the same shape (undo).
     *
     * Instances of this class are created in {@link PMUI.behavior.ConnectionDropBehavior#onDrop}.
     * @extends PMUI.command.Command
     *
     * @constructor Creates an instance of the class CommandReconnect
     * @param {Object} receiver The object that will execute the command
     */
    var CommandReconnect = function (receiver) {
        CommandReconnect.superclass.call(this, receiver);

        /**
         * Object that represents the state of the shape before changing
         * its dimension
         * @property {Object}
         */
        this.before = {
            x: this.receiver.getOldX(),
            y: this.receiver.getOldY(),
            parent: this.receiver.getOldParent()
        };

        /**
         * Object that represents the state of the shape after changing
         * its dimension
         * @property {Object}
         */
        this.after = {
            x: this.receiver.getX(),
            y: this.receiver.getY(),
            parent: this.receiver.getParent()
        };
    };

    PMUI.inheritFrom('PMUI.command.Command', CommandReconnect);

    /**
     * Type of command.
     * @property {String}
     */
    CommandReconnect.prototype.type = "CommandReconnect";

    /**
     * Executes the command
     * The steps are: 
     *
     * 1. Hide the currentConnection of the canvas if there's one
     * 2. If the new parent of the dragged port is different than the old parent
     *      - Remove the port from its old parent
     *      - Add the port to the new parent
     * 3. If the new parent of the dragged port is equal to the old parent
     *      - Redefine its position in the shape
     * 4. Reconnect the connection (using the new ports) and check for intersections
     * 4. Trigger the port change event
     *
     * @chainable
     */
    CommandReconnect.prototype.execute = function () {

        var port = this.receiver,
            parent = this.after.parent,
            oldParent = this.before.parent;

        // hide the connection if its visible
        if (parent.canvas.currentConnection) {
            parent.canvas.currentConnection.hidePortsAndHandlers();
            parent.canvas.currentConnection = null;
        }

        if (parent.getID() !== oldParent.getID()) {
            oldParent.removePort(port);
            parent.addPort(port, this.after.x, this.after.y, true);
    //        port.canvas.regularShapes.insert(port);
        } else {
            parent.definePortPosition(port,
                new PMUI.util.Point(this.after.x, this.after.y));
        }

        port.connection
            .disconnect()
            .connect()
            .setSegmentMoveHandlers()
            .checkAndCreateIntersectionsWithAll();

        // custom trigger
        this.receiver.canvas.triggerPortChangeEvent(port);
        return this;
    };

    /**
     * Inverse executes a command e.g. undo.
     * The steps are: 
     *
     * 1. Hide the currentConnection of the canvas if there's one
     * 2. If the old parent of the port is different than the new parent
     *      - Remove the port from its new parent
     *      - Add the port to the old parent
     * 3. If the old parent of the port is equal to the new parent
     *      - Redefine its position in the shape
     * 4. Reconnect the connection (using the new ports) and check for intersections
     * 4. Trigger the port change event
     *
     * @chainable
     */
    CommandReconnect.prototype.undo = function () {
        var port = this.receiver,
            parent = this.after.parent,
            oldParent = this.before.parent;

        // hide the connection if its visible
        if (parent.canvas.currentConnection) {
            parent.canvas.currentConnection.hidePortsAndHandlers();
            parent.canvas.currentConnection = null;
        }

        if (parent.getID() !== oldParent.getID()) {
            parent.removePort(port);
            oldParent.addPort(port, this.before.x, this.before.y, true);
            port.canvas.regularShapes.insert(port);
        } else {
            parent.definePortPosition(port,
                new PMUI.util.Point(this.before.x, this.before.y));
        }

        port.connection
            .disconnect()
            .connect()
            .setSegmentMoveHandlers()
            .checkAndCreateIntersectionsWithAll();

        // custom trigger
        this.receiver.canvas.triggerPortChangeEvent(port);
        return this;
    };

    /**
     * Inverse executes a command e.g. undo
     * @chainable
     */
    CommandReconnect.prototype.redo = function () {
        this.execute();
        return this;
    };

    PMUI.extendNamespace('PMUI.command.CommandReconnect', CommandReconnect);
}());