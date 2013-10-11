(function () {
    /**
     * @class PMUI.behavior.NoDragBehavior
     * Class that encapsulates the drag behavior corresponding to the elements that
     * cannot be dragged
     * @extends PMUI.behavior.DragBehavior
     *
     * @constructor Creates a new instance of the class
     *
     */
    var NoDragBehavior = function () {
    };

    PMUI.inheritFrom('PMUI.behavior.DragBehavior', NoDragBehavior);
    /**
     * Type of the instances
     * @property {String}
     */
    NoDragBehavior.prototype.type = "NoDragBehavior";

    /**
     * On drag start handler, this method prevents drag from occurring
     * @param {PMUI.draw.Shape} shape
     * @return {Function}
     */
    NoDragBehavior.prototype.onDragStart = function (shape) {
        // hide the current connection if there was one
        return function (e, ui) {
            shape.canvas.hideCurrentConnection();
            return false;
        };
    };

    PMUI.extendNamespace('PMUI.behavior.NoDragBehavior', NoDragBehavior);
}());
