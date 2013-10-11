(function () {
    /**
     * @class PMUI.command.CommandSegmentMove
     * Class CommandSegmentMove determines the actions executed when a segment is moved through its move handler (redo)
     * and the actions executed when the segment is moved back (undo).
     *
     * Instances of this class are created in {@link PMUI.draw.SegmentMoveHandler#event-dragEnd}.
     * @extends PMUI.command.Command
     *
     * @constructor Creates an instance of the class CommandSegmentMove
     * @param {PMUI.draw.Connection} receiver The object that will execute the command
     * @param {Object} options Initialization options
     * @cfg {Array} [oldPoints=[]] Array of old points of the connection
     * @cfg {Array} [newPoints=[]] Array of new points of the connection
     */
    var CommandSegmentMove = function (receiver, options) {
        CommandSegmentMove.superclass.call(this, receiver);

        /**
         * Array of points that represent the state of the connection before moving the segment move handler
         * @property {Array}
         */
        this.oldPoints = [];

        /**
         *  Array of points that represent the state of the connection after moving the segment move handler
         * @property {Array}
         */
        this.newPoints = [];

        CommandSegmentMove.prototype.initObject.call(this, options);
    };

    PMUI.inheritFrom('PMUI.command.Command', CommandSegmentMove);

    /**
     * Type of command of this object
     * @property {String}
     */
    CommandSegmentMove.prototype.type = "CommandResize";

    /**
     * Instance initializer which uses options to extend the config options to initialize the instance
     * @param {Object} options The object that contains old points and new points
     * @private
     */
    CommandSegmentMove.prototype.initObject = function (options) {
        var defaults = {
                oldPoints: [],
                newPoints: []
            },
            i,
            point;
        $.extend(true, defaults, options);
        this.oldPoints = [];
        for (i = 0; i < defaults.oldPoints.length; i += 1) {
            point = defaults.oldPoints[i];
            this.oldPoints.push(new PMUI.util.Point(point.x, point.y));
        }
        this.newPoints = [];
        for (i = 0; i < defaults.newPoints.length; i += 1) {
            point = defaults.newPoints[i];
            this.newPoints.push(new PMUI.util.Point(point.x, point.y));
        }
    };

    /**
     * There's a common behavior between execute and inverseExecute in
     * this command so merge both files and use a parameter to choose
     * between execute and inverseExecute.
     * The steps are: 
     *
     * 1. Select the connection by triggering a click in its destination decorator
     * 2. Hide the ports and handlers of the connection and reconnect the connection using points
     * 3. Check and create the intersections and show the ports of the connection
     * 4. Trigger the segment move event
     *
     * @private
     * @chainable
     */
    CommandSegmentMove.prototype.common = function (action) {
        var connection = this.receiver;
        // trigger targetSpriteDecorator onClick
        $(connection.destDecorator.getHTML()).trigger('click');

        connection.hidePortsAndHandlers();
        connection.disconnect(true).connect({
            algorithm: 'user',
            points: this[action]
        });

        // delete and create handlers to avoid
        // the creation of two handlers in
        // connection.checkAndCreateIntersectionsWithAll()
        connection.setSegmentMoveHandlers();

        // create intersections with all other connections
        connection.checkAndCreateIntersectionsWithAll();

        // show the ports and handlers again
        connection.showPortsAndHandlers();

        // trigger event
        connection.canvas.triggerConnectionStateChangeEvent(connection);
        return this;
    };

    /**
     * Executes a command
     * @chainable
     */
    CommandSegmentMove.prototype.execute = function () {
        this.common("newPoints");
        return this;
    };

    /**
     * Inverse executes the command a.k.a. undo
     * @chainable
     */
    CommandSegmentMove.prototype.undo = function () {
        this.common("oldPoints");
        return this;
    };

    /**
     * Executes the command a.k.a. redo
     * @chainable
     */
    CommandSegmentMove.prototype.redo = function () {
        this.execute();
        return this;
    };

    PMUI.extendNamespace('PMUI.command.CommandSegmentMove', CommandSegmentMove);
}());
