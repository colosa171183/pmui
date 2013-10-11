(function () {
    /**
     * @class PMUI.behavior.NoResizeBehavior
     * Class that encapsulates the regular resize behavior of a shape when it's not supposed to be resizable
     * @extends PMUI.behavior.ResizeBehavior
     *
     * @constructor Creates a new instance of the class RegularResizeBehavior
     */
    var NoResizeBehavior = function () {
    };

    PMUI.inheritFrom('PMUI.behavior.ResizeBehavior', NoResizeBehavior);

    /**
     * The type of each instance of this class.
     * @property {String}
     */
    NoResizeBehavior.prototype.type = "NoResizeBehavior";

    /**
     * Initialize JQueryUI's resize plugin (disables the resizable plugin).
     * @param {PMUI.draw.Shape} shape
     */
    NoResizeBehavior.prototype.init = function (shape) {
        var $shape = $(shape.getHTML());
        NoResizeBehavior.superclass.prototype.init.call(this, shape);
        $shape.resizable('disable');
        $shape
    //        .removeClass('ui-resizable-disabled')
            .removeClass('ui-state-disabled');
        shape.applyStyleToHandlers('nonResizableStyle');
        shape.showOrHideResizeHandlers(false);
    };

    /**
     * Overwrites the method {@link PMUI.behavior.ResizeBehavior#updateResizeMinimums} since
     * a shape that is not resizable shouldn't update its resize minimums.
     * @param {PMUI.draw.Shape} shape
     */
    NoResizeBehavior.prototype.updateResizeMinimums = function (shape) {
    };

    PMUI.extendNamespace('PMUI.behavior.NoResizeBehavior', NoResizeBehavior);

    if (typeof exports !== 'undefined') {
        module.exports = NoResizeBehavior;
    }
    
}());
