(function () {
    /**
     * @class PMUI.command.CommandStack
     * Command stack stores the commands executed to perform undos and redos, it consists of 2 stacks:
     *
     * - undoStack (represented as an array)
     * - redoStack (represented as an array)
     *
     * Every time an undo or redo action is executed the stacks automatically get updated and the function passed
     * during the instantiation is called.
     *
     *      // e.g.
     *      // let's assume that commandCreateInstance is an instance of CommandCreate
     *      // let's assume that commandResizeInstance is an instance of CommandResize
     *
     *      // first let's create the stacks (max size of the redo stack is 5)
     *      var commandStack = new PMUI.command.CommandStack(5);
     *
     *      // commandStack.add() inserts the command to the undoStack (emptying the redo stack too)
     *      commandStack.add(commandCreateInstance);
     *      commandStack.add(commandResizeInstance);
     *      commandStack.add(commandResizeInstance);
     *      commandStack.add(commandResizeInstance);
     *      commandStack.add(commandResizeInstance);
     *
     *      // at this point the redo stack is full (we defined a max size of 5), so the following add will remove the
     *      // last element of the stack (which is commandCreateInstance) and the undoStack will only consist of
     *      // command resize instances
     *      commandStack.add(commandResizeInstance);
     *
     *      // whenever an undo operation is executed in the commandStack, the first command (which is the last command
     *      // in the undoStack) executes its undo operation and the command is removed from the undoStack and pushed to
     *      // the redoStack, graphically:
     *
     *      // Let's define an stack graphically as '[['
     *      // if an element (e1) is pushed to the stack the stack becomes: [[e1
     *      // if an element (e2) is pushed to the stack the stack becomes: [[e1, e2
     *      // if an element (e3) is pushed to the stack the stack becomes: [[e1, e2, e3
     *      // if an element is removed from the stack the stack becomes: [[e1, e2
     *      // Note the direction of the stack, if it's defined as ']]'
     *      // the operations executed above turn the stack into:
     *      // e1]]; e2, e1]]; e3, e2, e1]]; e2, e1]]
     *
     *      // Let's alias commandResizeInstance as cRI and commandCreateInstance cCI.
     *      // With the example defined above of commandResizeInstance, the following line does:
     *      // pre state:
     *      // undoStack = [[cRI_1, cRI_2, cRI_3, cRI_4, cRI_5
     *      // redoStack = ]]
     *      // post state:
     *      // undoStack = [[cRI_1, cRI_2, cRI_3, cRI_4
     *      // redoStack = cRI_5]]
     *      commandStack.undo();
     *
     *      // executing undo again leads to:
     *      // pre state:
     *      // undoStack = [[cRI_1, cRI_2, cRI_3, cRI_4
     *      // redoStack = cRI_5]]
     *      // post state:
     *      // undoStack = [[cRI_1, cRI_2, cRI_3
     *      // redoStack = cRI_4, cRI_5]]
     *      commandStack.undo();
     *
     *      // executing redo leads to:
     *      // pre state:
     *      // undoStack = [[cRI_1, cRI_2, cRI_3
     *      // redoStack = cRI_4, cRI_5]]
     *      // post state:
     *      // undoStack = [[cRI_1, cRI_2, cRI_3, cRI_4
     *      // redoStack = cRI_5]]
     *      commandStack.redo();
     *
     *      // adding a new command to the stack empties the redo stack so:
     *      // pre state:
     *      // undoStack = [[cRI_1, cRI_2, cRI_3, cRI_4
     *      // redoStack = cRI_5]]
     *      // post state:
     *      // undoStack = [[cRI_1, cRI_2, cRI_3, cRI_4, cCI_1
     *      // redoStack = ]]
     *      commandStack.add(commandCreateInstance);
     *
     * @constructor Creates an instance of the class CommandStack
     * @param {number} stackSize The maximum number of operations to be saved
     * @param {Function} successCallback Function to be executed after add, undo or redo,
     * `this` will refer to the object itself, not the constructor
     */
    var CommandStack = function (stackSize, successCallback) {
        var undoStack,
            redoStack,
            maxSize;
        /**
         * Stacks that contains commands (when pushed to the undoStack)
         * @property {Array} [undoStack=[]]
         * @private
         */
        undoStack = [];
        /**
         * Stacks that contains commands (when pushed to the redoStack)
         * @property {Array} [redoStack=[]]
         * @private
         */
        redoStack = [];
        /**
         * Maximum size of the undo stack
         * @property {number} [maxSize=20]
         * @private
         */
        maxSize = stackSize || 20;
        /**
         * Empties the redo stack (when a new event is added to the undoStack)
         * @private
         */
        function emptyRedoStack() {
            redoStack = [];
        }

        /**
         * Handler to be called when a special action occurs
         */
        function onSuccess() {
    //        // debug
    //        console.log("onSuccess was called");
    //        console.log(this.getUndoSize() + " " + this.getRedoSize());
        }

        if (successCallback && {}.toString.call(successCallback) === '[object Function]') {
            onSuccess = successCallback;
        }

        return {
            /**
             * Adds an action (command) to the undoStack
             * @param {PMUI.command.Command} action
             */
            add: function (action) {
                emptyRedoStack();
                undoStack.push(action);
                if (undoStack.length > maxSize) {
                    // got to the max size of the stack
                    undoStack.shift();
                }
                onSuccess();
            },
            /**
             * Adds an action (command) to the redoStack
             * @param {PMUI.command.Command} action
             */
            addToRedo: function (action) {
                redoStack.push(action);
            },
            /**
             * Undoes the last action executing undoStack's first item undo
             * @return {boolean}
             */
            undo: function () {
                var action;     // action to be inverse executed
                if (undoStack.length === 0) {
                    console.log("undo(): can't undo because there are no " +
                        "actions to undo");
                    return false;
                }
                action = undoStack.pop();
                // inverse execute the action
                action.undo();
                redoStack.unshift(action);

                // execute on success handler
                onSuccess();
                return true;
            },
            /**
             * Redoes the last action executing redoStack's first item redo
             * @return {boolean}
             */
            redo: function () {
                var action;     // action to be inverse executed
                if (redoStack.length === 0) {
                    console.log("redo(): can't redo because there are no " +
                        "actions to redo");
                    return false;
                }
                action = redoStack.shift();
                // execute the action
                action.redo();
                undoStack.push(action);

                // execute on success handler
                onSuccess();
                return true;
            },
            /**
             * Clear both stacks
             */
            clearStack: function () {
                console.log("CommandStack.clearStack(): WARNING - " +
                    "clearing the stacks");
                redoStack = [];
                undoStack = [];
            },
            /**
             * Debugging method to show the state of each stack
             * @param {boolean} showDetailed
             */
            debug: function (showDetailed) {
                var i;
                console.log("Debugging command stack:");
                console.log("Undo stack size: " + undoStack.length);
                if (showDetailed) {
                    for (i = 0; i < undoStack.length; i += 1) {
                        console.log((i + 1) + ") " + undoStack[i].type);
                    }
                }
                console.log("Redo stack size: " + redoStack.length);
                if (showDetailed) {
                    for (i = 0; i < redoStack.length; i += 1) {
                        console.log((i + 1) + ") " + redoStack[i].type);
                    }
                }
            },
            /**
             * Gets the size of the redo stack
             * @return {Number}
             */
            getRedoSize: function () {
                return redoStack.length;
            },
            /**
             * Gets the size of the redo stack
             * @return {Number}
             */
            getUndoSize: function () {
                return undoStack.length;
            },
            /**
             * Sets the onSuccess handler of this object
             * @param successCallback
             * @chainable
             */
            setHandler: function (successCallback) {
                if (successCallback && {}.toString.call(successCallback) === '[object Function]') {
                    onSuccess = successCallback;
                }
                return this;
            }
        };
    };

    // extend the namespace
    PMUI.extendNamespace('PMUI.command.CommandStack', CommandStack);

}());
