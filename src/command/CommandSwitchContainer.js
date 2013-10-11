(function () {
    /**
     * @class PMUI.command.CommandSwitchContainer
     * Class that encapsulates the action of switching containers
     *
     *              //e.g.
     *              var command = new PMUI.command.CommandSwitchContainer(arrayOfShapes);
     * @extends PMUI.command.Command
     *
     * @constructor
     * Creates an instance of this command
     * @param {Array} shapesAdded array of shapes that are going to switch container
     */
    var CommandSwitchContainer = function (shapesAdded) {
        CommandSwitchContainer.superclass.call(this, shapesAdded[0].shape);
        /**
         * Properties of the object before the command is executed
         * @property {Object}
         */
        this.before = null;
        /**
         * Properties of the object after the command is executed
         * @property {Object}
         */
        this.after = null;
        /**
         * Reference to all objects involved in this command
         * @type {Array}
         */
        this.relatedShapes = [];
        CommandSwitchContainer.prototype.initObject.call(this, shapesAdded);
    };

    PMUI.inheritFrom('PMUI.command.Command', CommandSwitchContainer);

    /**
     * Type of the instances of this command
     * @property {String}
     */
    CommandSwitchContainer.prototype.type = "CommandSwitchContainer";

    /**
     * Initializer of the command
     * @param {Array} shapesAdded array of shapes that are going to switch container
     */
    CommandSwitchContainer.prototype.initObject = function (shapesAdded) {
        var i,
            shape,
            beforeShapes = [],
            afterShapes = [];

        for (i = 0; i < shapesAdded.length; i += 1) {
            shape = shapesAdded[i];
            this.relatedShapes.push(shape.shape);
            beforeShapes.push({
                parent: shape.shape.parent,
                x: shape.shape.getOldX(),
                y: shape.shape.getOldY(),
                topLeft: true
            });
            afterShapes.push({
                parent: shape.container,
                x: shape.x,
                y: shape.y,
                topLeft: shape.topLeft
            });
        }

        this.before = {
            shapes: beforeShapes
        };

        this.after = {
            shapes: afterShapes
        };
    };

    /**
     * The command execution implementation, updates the parents, and if necessary,
     * updates the children positions and connections.
     */
    CommandSwitchContainer.prototype.execute = function () {
        var i,
            shape;
        for (i = 0; i < this.relatedShapes.length; i += 1) {
            shape = this.relatedShapes[i];
            this.before.shapes[i].parent.swapElementContainer(
                shape,
                this.after.shapes[i].parent,
                this.after.shapes[i].x,
                this.after.shapes[i].y,
                this.after.shapes[i].topLeft
            );
            shape.refreshChildrenPositions()
                .refreshConnections();
        }
        this.canvas.triggerParentChangeEvent(this.relatedShapes,
            this.before.shapes, this.after.shapes);
    };

    /**
     * Returns to the state before this command was executed
     */
    CommandSwitchContainer.prototype.undo = function () {
        var i,
            shape;
        for (i = 0; i < this.relatedShapes.length; i += 1) {
            shape = this.relatedShapes[i];
            this.before.shapes[i].parent.swapElementContainer(
                shape,
                this.before.shapes[i].parent,
                this.before.shapes[i].x,
                this.before.shapes[i].y,
                this.before.shapes[i].topLeft
            );
            shape.refreshChildrenPositions()
                .refreshConnections();
        }
        this.canvas.triggerParentChangeEvent(this.relatedShapes,
            this.after.shapes, this.before.shapes);
    };

    /**
     *  Executes the command again after an undo action has been done
     */
    CommandSwitchContainer.prototype.redo = function () {
        this.execute();
    };

    PMUI.extendNamespace('PMUI.command.CommandSwitchContainer', CommandSwitchContainer);
}());
