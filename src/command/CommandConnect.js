(function () {
    /**
     * @class PMUI.command.CommandConnect
     * Class CommandConnect determines the actions executed when a connection is created (redo) and the actions
     * executed when it's destroyed (undo).
     *
     * Instances of this class are created in {@link PMUI.draw.Canvas#removeElements}.
     *
     * @extends PMUI.command.Command
     *
     * @constructor Creates an instance of the class CommandConnect.
     * @param {Object} receiver The object that will execute the command
     */
    var CommandConnect = function (receiver) {
        CommandConnect.superclass.call(this, receiver);
    };
    PMUI.inheritFrom('PMUI.command.Command', CommandConnect);
    /**
     * Type of command
     * @property {String}
     */
    CommandConnect.prototype.type = "CommandConnect";
    /**
     * Executes the command.
     * The steps are:
     *
     * 1. Insert the ports in their respective parents (shapes)
     * 2. Append the html of the ports
     * 3. Add the connection html to the canvas
     * 4. Trigger the create event
     *
     * @chainable
     */
    CommandConnect.prototype.execute = function () {
        var connection = this.receiver,
            canvas = connection.canvas,
            srcPort = connection.getSrcPort(),
            destPort = connection.getDestPort();
        // save the ports in its parents' ports array
        srcPort.parent.ports.insert(srcPort);
        destPort.parent.ports.insert(destPort);
        // append the html of the ports to its parents (customShapes)
        srcPort.parent.html.appendChild(srcPort.getHTML());
        destPort.parent.html.appendChild(destPort.getHTML());
        // add the connection to the canvas (its html is appended)
        canvas.addConnection(connection);
        canvas.updatedElement = connection;
        canvas.triggerCreateEvent(connection, []);
        return this;
    };
    /**
     * Inverse executes the command a.k.a. undo.
     * The steps are:
     *
     * 1. Save the connection (detach it from the DOM)
     * 2. Trigger the remove event
     *
     * @chainable
     */
    CommandConnect.prototype.undo = function () {
        this.receiver.saveAndDestroy();
        this.receiver.canvas.triggerRemoveEvent(this.receiver, []);
        return this;
    };
    /**
     * Executes the command a.k.a. redo by calling `this.execute`
     * @chainable
     */
    CommandConnect.prototype.redo = function () {
        this.execute();
        return this;
    };

    // extend the namespace
    PMUI.extendNamespace('PMUI.command.CommandConnect', CommandConnect);
}());
