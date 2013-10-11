(function () {
    /**
     * @class PMUI.command.CommandEditLabel
     * Encapsulates the action of editing a label
     *
     *                  //e.g.
     *                  // var command = new PMUI.command.CommandEditLabel(label, "new message");
     * @extends PMUI.command.Command
     *
     * @constructor
     * Creates an instance of this command
     * @param {PMUI.draw.Label} receiver The object that will perform the action
     * @param {String} newMessage
     */
    var CommandEditLabel = function (receiver, newMessage) {
        CommandEditLabel.superclass.call(this, receiver);
        this.before = null;
        this.after = null;
        CommandEditLabel.prototype.initObject.call(this, receiver, newMessage);
    };

    PMUI.inheritFrom('PMUI.command.Command', CommandEditLabel);

    /**
     * Type of the instances
     * @property {String}
     */
    CommandEditLabel.prototype.type = "CommandEditLabel";
    /**
     * Initializes the command
     * @param {PMUI.draw.Label} receiver The object that will perform the action
     * @param {String} newMessage
     */
    CommandEditLabel.prototype.initObject = function (receiver, newMessage) {
        var parentHeight = 0,
            parentWidth = 0;
        if (receiver.parent) {
            parentHeight = receiver.parent.height;
            parentWidth = receiver.parent.width;
        }
        this.before = {
            message: receiver.message,
            width: receiver.width,
            height: receiver.height,
            parentHeight: parentHeight,
            parentWidth: parentWidth
        };
        this.after = {
            message: newMessage,
            width: 0,
            height: 0,
            parentHeight: parentWidth,
            parentWidth: parentHeight
        };
    };
    /**
     * Executes the command, sets the new message updates the dimensions and its,
     * parent if necessary
     */
    CommandEditLabel.prototype.execute = function (stopTrigger) {
        this.receiver.setMessage(this.after.message);
        this.receiver.updateDimension();
        if (this.after.width === 0) {
            this.after.width = this.receiver.width;
            this.after.height = this.receiver.height;
            if (this.after.parentWidth !== 0) {
                this.after.parentWidth = this.receiver.parent.width;
                this.after.parentHeight = this.receiver.parent.height;
            }
        }
        this.receiver.paint();
        if (!stopTrigger) {
            this.receiver.canvas.triggerTextChangeEvent(this.receiver,
                this.before.message, this.after.message);
            if ((this.after.parentWidth !== this.before.parentWidth) &&
                    (this.before.parentHeight !== this.after.parentHeight)) {
                this.receiver.canvas.triggerDimensionChangeEvent(
                        this.receiver.parent,
                        this.before.parentWidth,
                        this.before.parentHeight,
                        this.after.parentWidth,
                        this.after.parentHeight
                    );
            }
        }
    };
    /**
     * Returns to the previous state before executing the command
     */
    CommandEditLabel.prototype.undo = function (stopTrigger) {
        this.receiver.setMessage(this.before.message);

        if (this.receiver.parent) {
            this.receiver.parent.setDimension(this.before.parentWidth,
                    this.before.parentHeight);
        }
        this.receiver.setDimension(this.before.width, this.before.height);
        this.receiver.updateDimension();
        this.receiver.paint();
        this.receiver.canvas.triggerTextChangeEvent(this.receiver,
            this.after.message, this.before.message);
        if ((this.after.parentWidth !== this.before.parentWidth) &&
                (this.before.parentHeight !== this.after.parentHeight)) {
            this.receiver.canvas.triggerDimensionChangeEvent(this.receiver.parent,
                this.after.parentWidth, this.after.parentHeight,
                this.before.parentWidth, this.before.parentHeight);
        }
    };
    /**
     * Executes the command again after an undo action has been done
     */
    CommandEditLabel.prototype.redo = function () {
        this.execute();
    };

    PMUI.extendNamespace('PMUI.command.CommandEditLabel', CommandEditLabel);
}());
