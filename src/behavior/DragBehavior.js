(function () {
    /**
     * @abstract
     * @class PMUI.behavior.DragBehavior
     * Abstract class that encapsulates the drag behavior of an object
     *
     * @constructor Creates a new instance of the class
     *
     */
    var DragBehavior = function () {
    };

    /**
     * Type of the object
     * @property {String}
     */
    DragBehavior.prototype.type = "DragBehavior";
    /**
     * Family of the object
     * @property {String}
     */
    DragBehavior.prototype.family = "DragBehavior";


    /**
     * Attach the drag listener and its corresponding ui properties to the shape
     * @param {PMUI.draw.Shape} shape
     */
    DragBehavior.prototype.attachDragBehavior = function (shape) {
        var dragOptions,
            $shape = $(shape.getHTML());
        dragOptions = {
            revert: false,
            helper: "none",
            cursorAt: false,
            revertDuration: 0,
            grid: [1, 1],
            start: this.onDragStart(shape),
            drag: this.onDrag(shape),
            stop: this.onDragEnd(shape)
        };
        $shape.draggable(dragOptions);
        //console.log('Drag Behavior attached to', shape);
    };
    /**
     * @event dragStart
     * @abstract drag start handler, function that runs when the drag start event occurs,
     * it should return a function so that any implementation should go inside the
     * return
     * @param {PMUI.draw.Shape} shape current shape being dragged
     * @template
     * @protected
     */
    DragBehavior.prototype.onDragStart = function (shape) {
        return function (e, ui) {
        };
    };

    /**
     * @event drag
     * Drag handler, function that runs when dragging is occurring,
     * it should return a function so that any implementation should go inside the
     * return
     * @param {PMUI.draw.Shape} shape shape being dragged
     * @template
     * @protected
     */
    DragBehavior.prototype.onDrag = function (shape) {
        return function (e, ui) {
        };
    };

    /**
     * @event dragEnd
     * Drag end handler, function that runs when the drag end event occurs,
     * it should return a function so that any implementation should go inside the
     * return
     * @param {PMUI.draw.Shape} shape
     * @template
     * @protected
     */
    DragBehavior.prototype.onDragEnd = function (shape) {
        return function (e, ui) {
        };
    };
    /**
     * @abstract Executes the hook Function for the drag start event
     * @template
     * @protected
     */
    DragBehavior.prototype.dragStartHook = function (hookFunction) {
    };

    /**
     * @abstract Executes the hook function for the drag event
     * @template
     * @protected
     */
    DragBehavior.prototype.dragHook = function (hookFunction) {
    };
    /**
     * @abstract Executes the hook function for the drag end event
     * @template
     * @protected
     */
    DragBehavior.prototype.dragEndHook = function () {
    };

    PMUI.extendNamespace('PMUI.behavior.DragBehavior', DragBehavior);

    if (typeof exports !== 'undefined') {
        module.exports = DragBehavior;
    }

}());