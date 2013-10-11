(function () {
    /**
     * @abstract
     * @class PMUI.behavior.ResizeBehavior
     * Abstract class which inherited classes' instances are used for delegation of the resize behavior of a shape.
     *
     * @constructor Creates an instance of the class ResizeBehavior
     */
    var ResizeBehavior = function () {
    };

    /**
     * The type of each instance of this class.
     * @property {String}
     */
    ResizeBehavior.prototype.type = "ResizeBehavior";

    /**
     * The family of each instance of this class.
     * @property {String}
     */
    ResizeBehavior.prototype.family = "ResizeBehavior";


    /**
     * Initialize JQueryUI's resize plugin
     * @param {PMUI.draw.Shape} shape
     */
    ResizeBehavior.prototype.init = function (shape) {
        var $shape = $(shape.getHTML()),
            shapeResizeOptions = {
                handles: shape.getHandlesIDs(),
                disable: false,
                start: this.onResizeStart(shape),
                resize: this.onResize(shape),
                stop: this.onResizeEnd(shape)
            };
        $shape.resizable(shapeResizeOptions);

        // update the min height and min width of the parent
        //this.updateResizeMinimums(shape.parent);
        //console.log('Resize Behavior attached to', shape);
    };

    /**
     * @abstract
     * @event resizeStart
     * Abstract method to be implemented in inherited classes
     * @param {PMUI.draw.Shape} shape
     */
    ResizeBehavior.prototype.onResizeStart = function (shape) {
    };
    /**
     * @abstract
     * @event resize
     * Abstract method to be implemented in inherited classes
     * @param {PMUI.draw.Shape} shape
     */
    ResizeBehavior.prototype.onResize = function (shape) {
    };
    /**
     * @abstract
     * @event resizeEnd
     * Abstract method to be implemented in inherited classes
     * @param {PMUI.draw.Shape} shape
     */
    ResizeBehavior.prototype.onResizeEnd = function (shape) {
    };

///**
// * Sets a shape's container to a given container
// * @param container
// * @param shape
// */
//ResizeBehavior.prototype.resizeStartHook = function () {
//};
///**
// * Removes shape from its current container
// * @param shape
// */
//ResizeBehavior.prototype.resizeHook = function () {
//};
///**
// * Adds a shape to a given container
// * @param container
// * @param shape
// */
//ResizeBehavior.prototype.resizeEndHook = function () {
//};

    /**
     * Updates the minimum height and maximum height of the JQqueryUI's resizable plugin.
     * @param {PMUI.draw.Shape} shape
     * @chainable
     */
    ResizeBehavior.prototype.updateResizeMinimums = function (shape) {
        var minW,
            minH,
            children = shape.getChildren(),
            limits = children.getDimensionLimit(),
            margin = 15,
            $shape = $(shape.getHTML());

        // TODO:  consider the labels width and height
    //    if (subProcess.label.orientation === 'vertical') {
    //        minW = Math.max(limits[1], Math.max(labelH, subProcess.label.height)) +
    //            margin + 8;
    //        minH = Math.max(limits[2], Math.max(labelW, subProcess.label.width)) +
    //            margin;
    //    } else {
    //        minW = Math.max(limits[1], Math.max(labelW, subProcess.label.width)) +
    //            margin;
    //        minH = Math.max(limits[2], Math.max(labelH, subProcess.label.height)) +
    //            margin + 8;
    //    }

        minW = limits[1] + margin;
        minH = limits[2] + margin;

        // update jQueryUI's minWidth and minHeight
        $shape.resizable('option', 'minWidth', minW);
        $shape.resizable('option', 'minHeight', minH);
        return this;
    };

    PMUI.extendNamespace('PMUI.behavior.ResizeBehavior', ResizeBehavior);

    if (typeof exports !== 'undefined') {
        module.exports = ResizeBehavior;
    }

}());
