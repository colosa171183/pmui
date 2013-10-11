(function () {
    /**
     * @class PMUI.command.CommandPaste
     * Class CommandPaste determines the actions executed when some shapes are pasted (redo) and the actions
     * executed when they're removed (undo).
     *
     * Instances of this class are created in {@link PMUI.draw.Canvas#paste}.
     * @extends PMUI.command.Command
     *
     * @constructor Creates an instance of the class CommandPaste
     * @param {Object} receiver The object that will execute the command
     * @param {Object} options Initialization options
     * @cfg {Array} [stackCommandConnect=[]] Array of commands connect
     * @cfg {Array} [stackCommandCreate=[]] Array of commands create
     */
    var CommandPaste = function (receiver, options) {

        CommandPaste.superclass.call(this, receiver);

        /**
         * A stack of commandsConnect (for connections)
         * @property {Array}
         */
        this.stackCommandConnect = [];

        /**
         * A stack of commandsCreate (for shapes)
         * @property {Array}
         */
        this.stackCommandCreate = [];

        CommandPaste.prototype.initObject.call(this, receiver, options);
    };

    PMUI.inheritFrom('PMUI.command.Command', CommandPaste);

    /**
     * Type of command
     * @property {String}
     */
    CommandPaste.prototype.type = "CommandPaste";

    /**
     * Instance initializer which uses options to extend the config options to initialize the instance
     * @param {Object} receiver The object that will execute the command
     * @private
     */
    CommandPaste.prototype.initObject = function (receiver, options) {
        var i,
            shape,
            defaults = {
                stackCommandConnect: [],
                stackCommandCreate: []
            };

        $.extend(true, defaults, options);

        this.stackCommandConnect = defaults.stackCommandConnect;
        this.stackCommandCreate = defaults.stackCommandCreate;

    };

    /**
     * Executes the command.
     * The steps are:
     *
     * 1. Execute the redo operation for each command create
     * 2. Execute the redo operation for each command connect
     *
     * @chainable
     */
    CommandPaste.prototype.execute = function () {
        var i,
            command;
        for (i = 0; i < this.stackCommandCreate.length; i += 1) {
            command = this.stackCommandCreate[i];
            command.redo();
        }
        for (i = 0; i < this.stackCommandConnect.length; i += 1) {
            command = this.stackCommandConnect[i];
            command.redo();
        }
        return this;
    };

    /**
     * Inverse executes the command a.k.a. undo.
     * The steps are:
     *
     * 1. Execute the undo operation for each command create
     * 2. Execute the undo operation for each command connect
     *
     * @chainable
     */
    CommandPaste.prototype.undo = function () {
        var i,
            command;
        for (i = 0; i < this.stackCommandCreate.length; i += 1) {
            command = this.stackCommandCreate[i];
            command.undo();
        }
        for (i = 0; i < this.stackCommandConnect.length; i += 1) {
            command = this.stackCommandConnect[i];
            command.undo();
        }
        return this;
    };

    /**
     * Executes the command a.k.a redo
     * @chainable
     */
    CommandPaste.prototype.redo = function () {
        this.execute();
        return this;
    };

    PMUI.extendNamespace('PMUI.command.CommandPaste', CommandPaste);
}());
