(function () {
    /**
     * @class PMUI.command.CommandResize
     * Class CommandResize determines the actions executed when some shapes are resized (redo) and the actions
     * executed when they're resized back (undo).
     *
     * Instances of this class are created in {@link PMUI.behavior.RegularResizeBehavior#event-resizeEnd}.
     * @extends PMUI.command.Command
     *
     * @constructor Creates an instance of the class CommandResize
     * @param {Object} receiver The object that will execute the command
     */
    var CommandResize = function (receiver) {
        CommandResize.superclass.call(this, receiver);

        /**
         * Object that represents the state of the shape before changing
         * its dimension
         * @property {Object}
         */
        this.before = {
            x: this.receiver.getOldX(),
            y: this.receiver.getOldY(),
            width: this.receiver.getOldWidth(),
            height: this.receiver.getOldHeight()
        };

        /**
         * Object that represents the state of the shape after changing
         * its dimension
         * @property {Object}
         */
        this.after = {
            x: this.receiver.getX(),
            y: this.receiver.getY(),
            width: this.receiver.getWidth(),
            height: this.receiver.getHeight()
        };
    };

    PMUI.inheritFrom('PMUI.command.Command', CommandResize);

    /**
     * Type of command of this object
     * @property {String}
     */
    CommandResize.prototype.type = "CommandResize";

    /**
     * Executes the command.
     * The steps are: 
     *
     * 1. Set the new position and dimension of the shape (using `this.after`)
     * 2. Fix its connections on resize
     * 3. Trigger the dimension change event
     * 4. Trigger the position change event
     *
     * @chainable
     */
    CommandResize.prototype.execute = function () {
        var shape = this.receiver,
            canvas = shape.getCanvas();
        shape.setPosition(this.after.x, this.after.y)
            .setDimension(this.after.width, this.after.height);
        shape.fixConnectionsOnResize(shape.resizing, true);
        canvas.triggerDimensionChangeEvent(shape, this.before.width,
            this.before.height, this.after.width, this.after.height);
        if ((this.after.x !== this.before.x) || (this.after.y !== this.before.y)) {
            canvas.triggerPositionChangeEvent(
                [shape],
                [
                    {
                        x: this.before.x,
                        y: this.before.y
                    }
                ],
                [
                    {
                        x: this.after.x,
                        y: this.after.y
                    }
                ]
            );
        }
        return this;
    };

    /**
     * Inverse executes a command a.k.a undo.
     * The steps are: 
     *
     * 1. Set the new position and dimension of the shape (using `this.before`)
     * 2. Fix its connections on resize
     * 3. Trigger the dimension change event
     * 4. Trigger the position change event
     *
     * @chainable
     */
    CommandResize.prototype.undo = function () {
        var shape = this.receiver,
            canvas = shape.getCanvas();
        shape.setPosition(this.before.x, this.before.y)
            .setDimension(this.before.width, this.before.height);
        shape.fixConnectionsOnResize(shape.resizing, true);
        canvas.triggerDimensionChangeEvent(shape, this.after.width,
            this.after.height, this.before.width, this.before.height);
        if ((this.after.x !== this.before.x) || (this.after.y !== this.before.y)) {
            canvas.triggerPositionChangeEvent(
                [shape],
                [
                    {
                        x: this.after.x,
                        y: this.after.y
                    }
                ],
                [
                    {
                        x: this.before.x,
                        y: this.before.y
                    }
                ]
            );
        }
        return this;
    };

    /**
     * Executes the command a.k.a redo.
     * @chainable
     */
    CommandResize.prototype.redo = function () {
        this.execute();
        return this;
    };

    PMUI.extendNamespace('PMUI.command.CommandResize', CommandResize);
}());
