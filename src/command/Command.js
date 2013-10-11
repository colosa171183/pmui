(function () {
    /**
     * @class PMUI.command.Command
     * Abstract class command which declares some abstract methods such as
     * execute (redo) and inverseExecute (undo) a command.
     *
     * A command is implemented in the library as follows:
     *
     * - The command must define a method execute which does the operation desired (e.g. commandDelete's execute
     *      method deletes shapes and connections from a canvas).
     * - The command must define a method undo which undoes what the method execute did.
     * - The command must define a method redo which simply calls the execute method (redo must do the
     *      same operation as execute).
     *
     * Finally to execute and save the command let's use the 
     {@link PMUI.draw.Canvas#property-commandStack} property that any
     * canvas has so:
     *
     *      // e.g.
     *      // let's assume that canvas is an instance of the class Canvas
     *      // let's create an instance of commandDelete
     *      // let's assume that config has the correct configuration options of this command
     *      var command = new PMUI.command.CommandDelete(config)
     *      // let's add the command to the canvas's commandStack
     *      canvas.commandStack.add(command);
     *      // finally let's execute the command
     *      command.execute();      // this line actually removes the shapes!
     *
     *      // if we want to undo the last command
     *      canvas.commandStack.undo();     // this line recreates the shapes
     *
     *      // if we want to redo the last command
     *      canvas.commandStack.redo();     // this line removes the shapes again
     *
     * @abstract
     * @constructor Creates an instance of the class command
     * @param {Object} receiver The object that will execute the command
     */
    var Command = function (receiver) {

        /**
         * The object that executes the command
         * @property {Object}
         */
        this.receiver = receiver;
        /**
         * Reference to the canvas
         * @property {PMUI.draw.Canvas}
         */
        
        this.canvas = this.getCanvas(receiver);    
        
    };

    /**
     * Family of this command
     * @property {String}
     */
    Command.prototype.family = "Command";

    /**
     * Executes the command
     * @template
     * @protected
     */
    Command.prototype.execute = function (stopTrigger) {
    };

    /**
     * InverseExecutes the command (a.k.a. undo)
     * @template
     * @protected
     */
    Command.prototype.undo = function (stopTrigger) {
    };

    /**
     * Executes the command (a.k.a. redo)
     * @template
     * @protected
     */
    Command.prototype.redo = function (stopTrigger) {
    };

    Command.prototype.getCanvas = function (obj) {
        var aux,
            canvas;
            
        if (obj.getSize) {
            aux = obj.get(0);
            canvas = aux.getCanvas();
        } else if (obj.getCanvas) {
            canvas = obj.getCanvas();
        } else {
            canvas = null;
        }
        return canvas;
    };

    // extend the namespace
    PMUI.extendNamespace('PMUI.command.Command', Command);
}());
