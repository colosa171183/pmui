(function () {
    /**
     * @class PMUI.behavior.RegularResizeBehavior
     * Class that encapsulates the regular resize behavior of a shape
     * @extends PMUI.behavior.ResizeBehavior
     *
     * @constructor Creates a new instance of the class RegularResizeBehavior
     */
    var RegularResizeBehavior = function () {
    };

    PMUI.inheritFrom('PMUI.behavior.ResizeBehavior', RegularResizeBehavior);

    /**
     * The type of each instance of this class
     * @property {String}
     */
    RegularResizeBehavior.prototype.type = "RegularResizeBehavior";

    /**
     * Initialize JQueryUI's resizable plugin
     * @param {PMUI.draw.Shape} shape
     */
    RegularResizeBehavior.prototype.init = function (shape) {
        var $shape = $(shape.getHTML());
        RegularResizeBehavior.superclass.prototype.init.call(this, shape);
        $shape.resizable('enable');
        shape.applyStyleToHandlers('resizableStyle');

        // hide its handles (jQueryUI's resizable shows the handles by default)
        shape.showOrHideResizeHandlers(false);
    };

    /**
     * @event resizeStart
     * ResizeStart event fired when the user resizes a shape.
     * It does the following:
     *
     * - Save old values (for the undo-redo stack)
     * - Empties the {@link PMUI.draw.Canvas#property-currentSelection}, and adds `shape` to that arrayList
     * - Hides the resize handlers of the shape
     *
     * @param {PMUI.draw.Shape} shape
     */
    RegularResizeBehavior.prototype.onResizeStart = function (shape) {
        return function (e, ui) {
            shape.resizing = true;
            shape.dragging = false;

            shape.oldWidth = shape.width;
            shape.oldHeight = shape.height;
            shape.oldX = shape.x;
            shape.oldY = shape.y;
            shape.oldAbsoluteX = shape.absoluteX;
            shape.oldAbsoluteY = shape.absoluteY;

            if (shape.ports) {
                shape.initPortsChange();
            }

            if (shape.canvas.currentSelection.getSize() > 1) {
                // empty current selection and add this item to the currentSelection
                shape.canvas.emptyCurrentSelection();
                shape.canvas.addToSelection(shape);
            }
            shape.showOrHideResizeHandlers(false);

            // calculate percentage of each label in each axis
            shape.calculateLabelsPercentage();
            return true;
        };
    };

    /**
     * @event resize
     * Resize event fired when the user is resizing a shape.
     * It does the following:
     *
     * - Sets the position and dimensions of the shape
     * - Fixes the ports of `shape` and from the its children (recursively)
     * - Updates the position of its labels
     *
     * @param {PMUI.draw.Shape} shape
     */
    RegularResizeBehavior.prototype.onResize = function (shape) {
        return function (e, ui) {
            var i,
                port,
                canvas = shape.canvas;
            shape.setPosition(ui.position.left / canvas.zoomFactor,
                    ui.position.top / canvas.zoomFactor);
            shape.setDimension(ui.size.width / canvas.zoomFactor,
                    ui.size.height / canvas.zoomFactor);

            // fix the position of the shape's ports (and the positions and port
            // position of its children)
            // parameters (shape, resizing, root)
            shape.fixConnectionsOnResize(shape.resizing, true);

            // fix the labels positions on resize (on x = true and y = true)
            shape.updateLabelsPosition();
        };
    };

    /**
     * @event resizeEnd
     * ResizeEnd event fired when the user stops resizing a shape.
     * It does the following:
     *
     * - Shows the handlers of `shape`
     * - Updates the dimension of its parent (this shape might have outgrown the shape)
     * - Creates an instance of {@link PMUI.command.CommandResize} to add it to the undo-redo stack
     *
     * @param {PMUI.draw.Shape} shape
     */
    RegularResizeBehavior.prototype.onResizeEnd = function (shape) {
        return function (e, ui) {
            var i,
                label,
                command;
            shape.resizing = false;

            // last resize
            RegularResizeBehavior.prototype.onResize.call(this, shape)(e, ui);

            // show the handlers again
            shape.showOrHideResizeHandlers(true);

            // update the dimensions of the parent if possible (a shape might
            // have been resized out of the dimensions of its parent)
            shape.parent.updateDimensions(10);

            if (shape.ports) {
                shape.firePortsChange();
            }

            // TESTING COMMANDS
            command = new PMUI.command.CommandResize(shape);
            shape.canvas.commandStack.add(command);
            command.execute();
            for (i = 0; i < shape.labels.getSize(); i += 1) {
                label = shape.labels.get(i);
                label.setLabelPosition(label.location, label.diffX, label.diffY);
            }

            return true;
        };
    };

    PMUI.extendNamespace('PMUI.behavior.RegularResizeBehavior', RegularResizeBehavior);

    if (typeof exports !== 'undefined'){
        module.exports = RegularResizeBehavior;
    }

}());
