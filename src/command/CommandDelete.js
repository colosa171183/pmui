(function () {
    /**
     * @class PMUI.command.CommandDelete
     * Class CommandDelete determines the actions executed when some shapes are deleted (redo) and the actions
     * executed when they're recreated (undo).
     *
     * Instances of this class are created in {@link PMUI.draw.Canvas#removeElements}.
     * @extends PMUI.command.Command
     *
     * @constructor Creates an instance of the class CommandDelete
     * @param {Object} receiver The object that will execute the command
     */
    var CommandDelete = function (receiver) {
        CommandDelete.superclass.call(this, receiver);
        /**
         * A stack of commandsConnect
         * @property {Array}
         */
        this.stackCommandConnect = [];
        /**
         * ArrayList that represents the selection that was active before deleting the elements
         * @property {PMUI.util.ArrayList}
         */
        this.currentSelection = new PMUI.util.ArrayList();
        /**
         * Reference to the current connection in the canvas
         * @property {PMUI.draw.Connection}
         */
        this.currentConnection = null;
        /**
         * List of all the elements related to the commands
         * @property {Array}
         */
        this.relatedElements = [];
        CommandDelete.prototype.initObject.call(this, receiver);
    };
    PMUI.inheritFrom('PMUI.command.Command', CommandDelete);
    /**
     * Type of command
     * @property {String}
     */
    CommandDelete.prototype.type = "CommandDelete";
    /**
     * Instance initializer which uses options to extend the config options to initialize the instance
     * @param {Object} receiver The object that will execute the command
     * @private
     */
    CommandDelete.prototype.initObject = function (receiver) {
        var i,
            shape;
        // move the current selection to this.currentSelection array
        for (i = 0; i < receiver.getCurrentSelection().getSize() > 0; i += 1) {
            shape = receiver.getCurrentSelection().get(i);
            this.currentSelection.insert(shape);
        }
        // save the currentConnection of the canvas if possible
        if (receiver.currentConnection) {
            this.currentConnection = receiver.currentConnection;
        }
    };
    /**
     * Saves and destroys connections and shapes
     * @private
     * @param {Object} shape
     * @param {boolean} root True if `shape` is a root element in the tree
     * @param {boolean} [fillArray] If set to true it'll fill `this.relatedElements` with the objects erased
     * @return {boolean}
     */
    CommandDelete.prototype.saveAndDestroy = function (shape, root, fillArray) {
        var i,
            child,
            parent,
            children = null,
            connection,
            canvas = shape.canvas;
        if (shape.hasOwnProperty("children")) {
            children = shape.children;
        }
        // special function to be called as an afterwards
        // BIG NOTE: doesn't have to delete html
        if (shape.destroy) {
            shape.destroy();
        }
        for (i = 0; i < children.getSize(); i += 1) {
            child = children.get(i);
            this.saveAndDestroy(child, false, fillArray);
        }
        while (shape.ports && shape.ports.getSize() > 0) {
            connection = shape.ports.getFirst().connection;
            if (fillArray) {
                this.relatedElements.push(connection);
            }
            this.stackCommandConnect.push(
                new PMUI.command.CommandConnect(connection)
            );
            connection.saveAndDestroy();
        }
        // remove from the children array of its parent
        if (root) {
            parent = shape.parent;
            parent.getChildren().remove(shape);
            if (parent.isResizable()) {
                parent.resizeBehavior.updateResizeMinimums(shape.parent);
            }
            // remove from the currentSelection and from either the customShapes
            // arrayList or the regularShapes arrayList
            canvas.removeFromList(shape);
            // remove the html only from the root
            shape.html = $(shape.html).detach()[0];
        }
        if (fillArray) {
            this.relatedElements.push(shape);
        }
        return true;
    };
    /**
     * Executes the command
     * The steps are:
     *
     * 1. Retrieve the old currentSelection (saved in `this.initObject()`)
     * 2. Remove the shapes (detaching them from the DOM)
     * 3. Remove the currentConnection if there's one
     * 4. Trigger the remove event
     *
     * @chainable
     */
    CommandDelete.prototype.execute = function () {
        var shape,
            i,
            canvas = this.receiver,
            currentConnection,
            stringified,
            fillArray = false,
            mainShape = null;
        if (this.relatedElements.length === 0) {
            fillArray = true;
        }
        canvas.emptyCurrentSelection();
        // copy from this.currentConnection
        for (i = 0; i < this.currentSelection.getSize(); i += 1) {
            shape = this.currentSelection.get(i);
            canvas.addToSelection(shape);
        }
        if (canvas.currentSelection.getSize() === 1) {
            mainShape = shape;
        }
        // remove the elements in the canvas current selection
        stringified = [];
        while (canvas.getCurrentSelection().getSize() > 0) {
            shape = canvas.getCurrentSelection().getFirst();
    //        // TESTING JSON
    //        canvas.stringifyTest(JSON.stringify(
    //            shape.stringify()
    //        ));
            this.saveAndDestroy(shape, true, fillArray);
            stringified.push(shape.stringify());
    //        this.saveAndDestroy(shape, true);
        }
    //    // TESTING JSON
    //    canvas.stringifyTest(JSON.stringify(
    //        stringified
    //    ));
        // destroy the currentConnection
        canvas.currentConnection = this.currentConnection;
        currentConnection = canvas.currentConnection;
        if (currentConnection) {
    //        // TESTING JSON
    //        canvas.stringifyTest(JSON.stringify(
    //            this.currentConnection.stringify()
    //        ));
            // add to relatedElements just in the case when only a connection is
            // selected and deleted
            this.relatedElements.push(currentConnection);
            this.stackCommandConnect.push(
                new PMUI.command.CommandConnect(currentConnection)
            );
            currentConnection.saveAndDestroy();
            currentConnection = null;
        }
        canvas.triggerRemoveEvent(mainShape, this.relatedElements);
        return this;
    };
    /**
     * Inverse executes the command a.k.a. undo
     *
     * The steps are:
     *
     * 1. Retrieve the old currentSelection (saved in `this.initObject()`)
     * 2. Restore the shapes (attaching them to the DOM)
     * 3. Restore the currentConnection if there was one
     * 4. Trigger the create event
     *
     * @chainable
     */
    CommandDelete.prototype.undo = function () {
        // undo recreates the shapes
        var i,
            shape,
            mainShape = this.receiver.currentSelection.getFirst();
        for (i = 0; i < this.currentSelection.getSize(); i += 1) {
            shape = this.currentSelection.get(i);
            // add to the canvas array of regularShapes and customShapes
            shape.canvas.addToList(shape);
            // add to the children of the parent
            shape.parent.getChildren().insert(shape);
            shape.parent.html.appendChild(shape.getHTML());
            PMUI.behavior.ResizeBehavior.prototype.updateResizeMinimums(shape.parent);
            shape.showOrHideResizeHandlers(false);
        }
        // reconnect using the stack of commandConnect
        for (i = this.stackCommandConnect.length - 1; i >= 0; i -= 1) {
            this.stackCommandConnect[i].redo();
        }
        this.receiver.triggerCreateEvent(mainShape, this.relatedElements);
        return this;
    };
    /**
     * Executes the command (a.k.a redo)
     * @chainable
     */
    CommandDelete.prototype.redo = function () {
        this.execute();
        return this;
    };
    // extend namespace
    PMUI.extendNamespace('PMUI.command.CommandDelete', CommandDelete);
}());
