(function () {
    /**
     * @class PMUI.behavior.ConnectionDragBehavior
     * Class that encapsulates the behavior for a connection drag.
     * A connection drag behavior means that instead of moving a shape when dragging
     * occurs, it creates a connection segment that let's us connect to shapes
     * @extends PMUI.behavior.DragBehavior
     *
     * @constructor Creates a new instance of the class
     *
     */
    var ConnectionDragBehavior = function () {
    };

    PMUI.inheritFrom('PMUI.behavior.DragBehavior', ConnectionDragBehavior);

    /**
     * Type of the instances
     * @property {String}
     */
    ConnectionDragBehavior.prototype.type = "ConnectionDragBehavior";
    /**
     * Attach the drag behavior and ui properties to the corresponding shape
     * @param {PMUI.draw.Shape} shape
     */
    ConnectionDragBehavior.prototype.attachDragBehavior = function (shape) {
        var $shape = $(shape.getHTML()),
            dragOptions;
        dragOptions = {
            helper: shape.createDragHelper,
            cursorAt: {top: 0, left: 0},
            revert: true
        };
        ConnectionDragBehavior.superclass.prototype.attachDragBehavior.call(this, shape);
        $shape.draggable(dragOptions);
        $shape.draggable('enable');
    };
    /**
     * On drag start handler, initializes all properties needed to start a
     * connection drag
     * @param {PMUI.draw.CustomShape} customShape
     * @return {Function}
     */
    ConnectionDragBehavior.prototype.onDragStart = function (customShape) {
        return function (e, ui) {
            var canvas = customShape.canvas,
                currentLabel = canvas.currentLabel,
                realPoint = canvas.relativePoint(e);

            // empty the current selection so that the segment created by the
            // helper is always on top
            customShape.canvas.emptyCurrentSelection();

            if (currentLabel) {
                currentLabel.loseFocus();
                $(currentLabel.textField).focusout();
            }
            if (customShape.family !== "CustomShape") {
                return false;
            }
            customShape.setOldX(customShape.getX());
            customShape.setOldY(customShape.getY());
            customShape.startConnectionPoint.x += customShape.getAbsoluteX();
            customShape.startConnectionPoint.y += customShape.getAbsoluteY();
    //        customShape.increaseParentZIndex(customShape.parent);
            return true;

        };
    };
    /**
     * On drag handler, creates a connection segment from the shape to the current
     * mouse position
     * @param {PMUI.draw.CustomShape} customShape
     * @return {Function}
     */
    ConnectionDragBehavior.prototype.onDrag = function (customShape) {
        return function (e, ui) {
            var canvas = customShape.getCanvas(),
                endPoint = new PMUI.util.Point(),
                realPoint = canvas.relativePoint(e);
            if (canvas.connectionSegment) {
                //remove the connection segment in order to create another one
                $(canvas.connectionSegment.getHTML()).remove();
            }

            //Determine the point where the mouse currently is
            endPoint.x = realPoint.x;
            endPoint.y = realPoint.y;

            //creates a new segment from where the helper was created to the
            // currently mouse location

            canvas.connectionSegment = new PMUI.draw.Segment({
                startPoint: customShape.startConnectionPoint,
                endPoint: endPoint,
                parent: canvas,
                zOrder: PMUI.util.Style.MAX_ZINDEX * 2
            });
            //We make the connection segment point to helper in order to get
            // information when the drop occurs
            canvas.connectionSegment.pointsTo = customShape;
            //create HTML and paint
            //canvas.connectionSegment.createHTML();
            canvas.connectionSegment.paint();
        };

    };
    /**
     * On drag end handler, deletes the connection segment created while dragging
     * @param {PMUI.draw.CustomShape} customShape
     * @return {Function}
     */
    ConnectionDragBehavior.prototype.onDragEnd = function (customShape) {
        return function (e, ui) {
            if (customShape.canvas.connectionSegment) {
                //remove the connection segment left
                $(customShape.canvas.connectionSegment.getHTML()).remove();
            }
            customShape.setPosition(customShape.getOldX(), customShape.getOldY());
            customShape.dragging = false;
        };
    };

    PMUI.extendNamespace('PMUI.behavior.ConnectionDragBehavior', ConnectionDragBehavior);

    if (typeof exports !== 'undefined') {
        module.exports = ConnectionDragBehavior;
    }
    
}());
