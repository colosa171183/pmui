(function () {
    /**
     * @class PMUI.draw.SegmentMoveHandler
     * Represents the handler to move a segment (the handlers are visible when a decorator of the parent of this
     * segment is clicked on)
     *
     * An example of use:
     *
     *      // e.g.
     *      // let's assume that segment is an instance of the class Segment
     *      // let's assume that rectangle is an instance of the class Rectangle
     *
     *      segmentMoveHandler = new PMUI.draw.SegmentMoveHandler({
     *          width: 8,
     *          height: 8,
     *          parent: segment,
     *          orientation: 0                      // corresponds to a vertical segment
     *          representation: rectangle,
     *          color: new Color(255, 0, 0)         // red !!
     *      });
     * @extend PMUI.draw.Handler
     * @constructor Creates an instance of the class SegmentMoveHandler
     * @param {Object} options
     * @cfg {number} [width=4] The width of this segment move handler.
     * @cfg {number} [height=4] The height of this segment move handler.
     * @cfg {PMUI.draw.Shape} [parent=null] The parent of this segment move handler.
     * @cfg {number} [orientation=null] The orientation of this segment move handler.
     * @cfg {string} [representation=null] The representation of this segment move handler.
     * @cfg {number} [color=new Color(0, 255, 0)] The color of this segment move handler (green).
     */
    var SegmentMoveHandler = function (options) {

        SegmentMoveHandler.superclass.call(this, options);

        /**
         * Orientation of this segment move handler (useful to do the drag).
         * @property {number}
         */
        this.orientation = null;

        /**
         * Denotes whether the SegmentMove point is visible or not.
         * @property {boolean} [visible=false]
         */
        this.visible = false;

        /**
         * The default zOrder of this handler.
         * @property {number} [zOrder=2]
         */
        this.zOrder = 2;

        // set defaults
        SegmentMoveHandler.prototype.init.call(this, options);
    };

    PMUI.inheritFrom('PMUI.draw.Handler', SegmentMoveHandler);

    /**
     * Type of each instance of this class
     * @property {String}
     */
    SegmentMoveHandler.prototype.type = "SegmentMoveHandler";

    /**
     * Instance initializer which uses options to extend the config options to initialize the instance
     * @param {Object} options The object that contains the config
     * @private
     */
    SegmentMoveHandler.prototype.init = function (options) {

        var defaults = {
            width: 4,
            height: 4,
            parent: null,
            orientation: null,
            representation: new PMUI.draw.Rectangle(),
            color: new PMUI.util.Color(0, 255, 0)
        };

        // extend recursively the defaultOptions with the given options
        $.extend(true, defaults, options);

        // init
        this.setWidth(defaults.width)
            .setHeight(defaults.height)
            .setParent(defaults.parent)
            .setColor(defaults.color)
            .setOrientation(defaults.orientation)
            .setRepresentation(defaults.representation);
    };

    /**
     * Paints this resize handler by calling it's parent's `paint` and setting
     * the visibility of this resize handler.
     * @chainable
     */
    SegmentMoveHandler.prototype.paint = function () {
        // before it was:  Rectangle.prototype.paint.call(this);
        SegmentMoveHandler.superclass.prototype.paint.call(this);
        this.setVisible(this.visible);
        return this;
    };

    /**
     * Attaches listeners to the segmentMoveHandler, by default it creates the click,
     * mouseDown and draggable events.
     * @param {PMUI.draw.SegmentMoveHandler} handler
     * @chainable
     */
    SegmentMoveHandler.prototype.attachListeners = function (handler) {
        var $handler = $(handler.html);
        $handler.on('click', handler.onClick(handler));
        $handler.on('mousedown', handler.onMouseDown(handler));
        $handler.draggable({
            start: handler.onDragStart(handler),
            drag: handler.onDrag(handler),
            stop: handler.onDragEnd(handler),
            axis: (handler.orientation === handler.HORIZONTAL) ? "y" :  "x"
            //containment:  handler.parent.parent.html
        });
        return this;
    };

    /**
     * @event mousedown
     * MouseDown callback fired when the user mouse downs on the `handler`
     * @param {PMUI.draw.SegmentMoveHandler} handler
     */
    SegmentMoveHandler.prototype.onMouseDown = function (handler) {
        return function (e, ui) {
            // This is done to avoid the start of a selection in the canvas
            // handler > segment > connection > canvas
            handler.parent.parent.canvas.draggingASegmentHandler = true;
            //e.stopPropagation();
        };
    };

    /**
     * @event click
     * Click callback fired when the user clicks on the handler
     * @param {PMUI.draw.SegmentMoveHandler} handler
     */
    SegmentMoveHandler.prototype.onClick = function (handler) {
        return function (e, ui) {
            e.stopPropagation();
        };
    };

    /**
     * @event dragStart
     * DragStart callback fired when the handler is dragged (it's executed only once).
     * It does the following: 
     *
     * 1. Gather the connection by calling the handler's grandparent
     * 2. Save the state if the connection (for the undo-redo stack)
     * 3. Clear all the intersections of each segment of the connection
     *
     * @param {PMUI.draw.SegmentMoveHandler} handler
     */
    SegmentMoveHandler.prototype.onDragStart = function (handler) {
        return function (e, ui) {
            var parentSegment = handler.parent,
                segment,
                connection = parentSegment.getParent(),
                i;

            // TESTING: 
            // save values for the undo-redo stack
            connection.savePoints({
                saveToOldPoints: true
            });

            // clear all intersections that exists in
            // parentSegment.parent (connection)
            for (i = 0; i < parentSegment.parent.lineSegments.getSize(); i += 1) {
                segment = parentSegment.parent.lineSegments.get(i);
                segment.clearIntersections();
            }
            // clear all intersections that exists among other connections and
            // parentSegment (the ones that exists in the other connections)
            parentSegment.parent.clearAllIntersections();
            e.stopPropagation();
        };
    };

    /**
     * @event drag
     * Drag callback fired when the handler is being dragged.
     * It only moves the segment vertically or horizontally.
     *
     * @param {PMUI.draw.SegmentMoveHandler} handler
     */
    SegmentMoveHandler.prototype.onDrag = function (handler) {
        return function (e, ui) {
            var parentSegment = handler.parent;
            parentSegment.moveSegment(ui.position.left, ui.position.top);
        };
    };

    /**
     * @event dragEnd
     * DragEnd callback fired when the handler stops being dragged.
     * It does the following: 
     *
     * 1. Gather the connection by calling the handler's grandparent
     * 2. Save the state if the connection (for the undo-redo stack)
     * 3. Create a command for the undo-redo stack
     *
     * @param {PMUI.draw.SegmentMoveHandler} handler
     */
    SegmentMoveHandler.prototype.onDragEnd = function (handler) {
        return function (e, ui) {
            var parentSegment = handler.parent,
                connection = parentSegment.getParent(),
                canvas = connection.canvas,
                command;

            canvas.draggingASegmentHandler = false;
            handler.onDrag(handler)(e, ui);

            // LOGIC:  connection.points is an array of points that is not updated
            // automatically when a connection is painted, it must be
            // explicitly called as connection.savePoints()
            connection.savePoints();
            command = new PMUI.command.CommandSegmentMove(connection, {
                oldPoints: connection.getOldPoints(),
                newPoints: connection.getPoints()
            });
            command.execute();
            canvas.commandStack.add(command);

        };
    };

    PMUI.extendNamespace('PMUI.draw.SegmentMoveHandler', SegmentMoveHandler);

    if (typeof exports !== 'undefined') {
        module.exports = SegmentMoveHandler;
    }

}());
