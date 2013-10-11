(function () {
    /**
     * @class PMUI.command.CommandMove
     * Encapsulates the action of moving an element
     *
     *              //e.g.
     *              var command = new PMUI.command.CommandMove(shape);
     * @extends PMUI.command.Command
     *
     * @constructor
     * Creates an instance of CommandMove
     * @param {Object} receiver The object that will perform the action
     */
    var CommandMove = function (receiver) {
        CommandMove.superclass.call(this, receiver);
        this.before = null;
        this.after = null;
        this.relatedShapes = [];
        CommandMove.prototype.initObject.call(this, receiver);
    };

    PMUI.inheritFrom('PMUI.command.Command', CommandMove);
    /**
     * Type of the instances of this class
     * @property {String}
     */
    CommandMove.prototype.type = "CommandMove";

    /**
     * Initializes the command parameters
     * @param {PMUI.draw.Core} receiver The object that will perform the action
     */
    CommandMove.prototype.initObject = function (receiver) {
        var i,
            beforeShapes = [],
            afterShapes = [];
        for (i = 0; i < receiver.getSize(); i += 1) {
            this.relatedShapes.push(receiver.get(i));
            beforeShapes.push({
                x: receiver.get(i).getOldX(),
                y: receiver.get(i).getOldY()
            });
            afterShapes.push({
                x: receiver.get(i).getX(),
                y: receiver.get(i).getY()
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
     * Executes the command, changes the position of the element, and if necessary
     * updates the position of its children, and refreshes all connections
     */
    CommandMove.prototype.execute = function () {
        var i,
            shape;
        for (i = 0; i < this.relatedShapes.length; i += 1) {
            shape = this.relatedShapes[i];
            shape.setPosition(this.after.shapes[i].x, this.after.shapes[i].y)
                .refreshChildrenPositions(true);
            shape.refreshConnections(false);
        }
        this.canvas.triggerPositionChangeEvent(this.relatedShapes,
            this.before.shapes, this.after.shapes);
    };

    /**
     * Returns to the state before the command was executed
     */
    CommandMove.prototype.undo = function () {
        var i,
            shape;
        for (i = 0; i < this.relatedShapes.length; i += 1) {
            shape = this.relatedShapes[i];
            shape.setPosition(this.before.shapes[i].x, this.before.shapes[i].y)
                .refreshChildrenPositions(true);
            shape.refreshConnections(false);
        }
        this.canvas.triggerPositionChangeEvent(this.relatedShapes,
            this.after.shapes, this.before.shapes);
    };

    /**
     *  Executes the command again after an undo action has been done
     */
    CommandMove.prototype.redo = function () {
        this.execute();
    };

    PMUI.extendNamespace('PMUI.command.CommandMove', CommandMove);
}());
