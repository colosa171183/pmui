(function () {
    /**
     * @class PMUI.command.CommandCreate
     * Class CommandCreate determines the actions executed when some shapes are created (redo) and the actions
     * executed when they're destroyed (undo).
     *
     * Instances of this class are created in {@link PMUI.behavior.ConnectionDropBehavior#onDrop}.
     * @extends PMUI.command.Command
     *
     * @constructor Creates an instance of the class CommandCreate
     * @param {Object} receiver The object that will execute the command
     *
     */
    var CommandCreate = function (receiver) {
        CommandCreate.superclass.call(this, receiver);

        /**
         * Object that represents the state of the receiver before
         * it was created
         * @property {Object}
         */
        this.before = null;

        /**
         * Object that represents the state of the receiver after
         * it was created
         * @property {Object}
         */
        this.after = null;

        CommandCreate.prototype.initObject.call(this, receiver);
    };

    PMUI.inheritFrom('PMUI.command.Command', CommandCreate);

    /**
     * Type of command
     * @property {String}
     */
    CommandCreate.prototype.type = "CommandCreate";

    /**
     * Instance initializer which uses options to extend the config options to initialize the instance
     * @param {Object} receiver
     * @private
     */
    CommandCreate.prototype.initObject = function (receiver) {
        this.before = {
        };
        this.after = {
            x: receiver.getX(),
            y: receiver.getY(),
            parent: receiver.getParent()
        };
    };

    /**
     * Executes the command.
     * The steps are:
     *
     * 1. Insert the current shape to the children of its parent if it's possible
     * 2. Append it to the HTML of its parent
     * 3. Add the shape to either `canvas.customShapes` or `canvas.regularShapes`
     * 4. Trigger the create event
     *
     * @chainable
     */
    CommandCreate.prototype.execute = function () {

        // execute the trigger
        var shape = this.receiver,
            parent = shape.parent;

        // append the html to its parent
        // NOTE: in the first execution (in containerDropBehavior) the html is
        // already in the parent so the following line appends it again (html
        // is not created)

        // note that during the execution of this command the next line may called twice (one in
        // RegularContainerBehavior.addToContainer and the other here) so check if it's not
        // already in its children
        if (!parent.getChildren().contains(shape)) {
            parent.getChildren().insert(shape);
        }
        this.after.parent.html.appendChild(shape.getHTML());
        shape.canvas.addToList(shape);
        shape.showOrHideResizeHandlers(false);
        shape.canvas.triggerCreateEvent(shape, []);
        return this;
    };

    /**
     * Inverse executes the command a.k.a. undo
     *
     * The steps are:
     *
     * 1. Remove the current shape from the children of its parent if it's possible
     * 2. Remove its HTML (detach it from the DOM)
     * 4. Trigger the remove event
     *
     * @chainable
     */
    CommandCreate.prototype.undo = function () {
        this.receiver.parent.getChildren().remove(this.receiver);
        this.receiver.saveAndDestroy();
        this.receiver.canvas.triggerRemoveEvent(this.receiver, []);
        return this;
    };

    /**
     * Executes the command a.k.a redo
     * @chainable
     */
    CommandCreate.prototype.redo = function () {
        this.execute();
        return this;
    };

    // extend the namespace
    PMUI.extendNamespace('PMUI.command.CommandCreate', CommandCreate);
}());
