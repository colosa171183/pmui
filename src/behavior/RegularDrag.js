(function () {
    /**
     * @class PMUI.behavior.RegularDragBehavior
     * Class that encapsulates the regular drag behavior of a shape
     * @extends PMUI.behavior.DragBehavior
     *
     * @constructor Creates a new instance of the class
     *
     */
    var RegularDragBehavior = function () {
    };

    PMUI.inheritFrom('PMUI.behavior.DragBehavior', RegularDragBehavior);
    /**
     * Type of the object
     * @property {String}
     */
    RegularDragBehavior.prototype.type = "RegularDragBehavior";
    /**
     * Attach the drag behavior to a given shape
     * @param {PMUI.draw.Shape} shape
     */
    RegularDragBehavior.prototype.attachDragBehavior = function (shape) {
        var $shape = $(shape.getHTML());
        RegularDragBehavior.superclass.prototype.attachDragBehavior.call(this, shape);
        $shape.draggable({'cursor':"move"});
    };
    /**
     * On drag start handler, initializes everything that is needed for a shape to
     * be dragged
     * @param {PMUI.draw.Shape} shape
     * @return {Function}
     */
    RegularDragBehavior.prototype.onDragStart = function (shape) {
        return function (e, ui) {
            var canvas = shape.canvas,
                currentLabel = canvas.currentLabel,
                selectedShape,
                i;

            // hide the current connection if there was one
            canvas.hideCurrentConnection();
            if (currentLabel) {
                currentLabel.loseFocus();
                $(currentLabel.textField).focusout();
            }
            // sort the data of the snappers (a shape might have been inserted in
            // the customShape arrayList or the regularShapes)
            canvas.fixSnapData();

            if (!canvas.currentSelection.contains(shape)) {
                canvas.emptyCurrentSelection();
                /* ALSO DECREASES THE Z-INDEX */
                canvas.addToSelection(shape);
            }

            // added by mauricio
            // these lines must be here and not in the top (currentSelection
            // is updated in the if above)
            for (i = 0; i < canvas.currentSelection.getSize(); i += 1) {
                selectedShape = canvas.currentSelection.get(i);
                selectedShape.setOldX(selectedShape.getX());
                selectedShape.setOldY(selectedShape.getY());
                selectedShape.setOldParent(selectedShape.getParent());
            }

            // increase shape's ancestors zIndex
            shape.increaseParentZIndex(shape.getParent());
            return true;
        };
    };
    /**
     * On drag handler, sets the position of the shape to current position of the
     * shape in the screen
     * @param {PMUI.draw.Shape} shape
     * @return {Function}
     */
    RegularDragBehavior.prototype.onDrag = function (shape) {
        return function (e, ui) {

            shape.setPosition(ui.helper.position().left,
                ui.helper.position().top);

            // show or hide the snappers
            shape.canvas.showOrHideSnappers(shape);
        };
    };
    /**
     * On drag end handler, set the final position of the shape and fires the
     * command move
     * @param {PMUI.draw.Shape} shape
     * @return {Function}
     */
    RegularDragBehavior.prototype.onDragEnd = function (shape) {
        return function (e, ui) {
            var command;
    //        var currentSelection = shape.getCanvas().getCurrentSelection();
            shape.setPosition(ui.helper.position().left,
                ui.helper.position().top);

            // decrease the zIndex of the oldParent of this shape
            shape.decreaseParentZIndex(shape.oldParent);

            shape.dragging = false;

            // hide the snappers
            shape.canvas.verticalSnapper.hide();
            shape.canvas.horizontalSnapper.hide();
            if (!shape.changedContainer) {
                command = new PMUI.command.CommandMove(shape);
                command.execute();
                shape.canvas.commandStack.add(command);
            }
            shape.changedContainer = false;
            // update current selection zIndex
    //        for (i = 0; i < currentSelection.getSize(); i += 1) {
    //            shape = currentSelection.get(i);
    //            shape.increaseZIndex();
    //        }
        };
    };

    PMUI.extendNamespace('PMUI.behavior.RegularDragBehavior', RegularDragBehavior);
}());
