(function () {
    /**
     * @class PMUI.draw.MultipleSelectionContainer
     * Represents the rectangle created to do multiple selection after firing 
     {@link PMUI.draw.Canvas#event-mousedown} and
     * dragging a rectangle over the desired elements in the canvas and firing 
     {@link PMUI.draw.Canvas#event-mouseup},
     * currently it can only select shapes that are direct children of the canvas.
     *
     * An example of use:
     *
     *      // let's assume that canvas is an instance of the class Canvas
     *      var multipleSelectionContainer = new PMUI.draw.MultipleSelectionContainer(canvas);
     *
     * @extend PMUI.draw.Rectangle
     *
     * @constructor Creates an instance of the class MultipleSelectionContainer
     * @param {PMUI.draw.Canvas} canvas
     */
    var MultipleSelectionContainer = function (options) {
        MultipleSelectionContainer.superclass.call(this);

        /**
         * The background color of this element
         * @property {PMUI.util.Color}
         */
        this.backgroundColor = null;

        /**
         * Reference to the canvas
         * @property {PMUI.draw.Canvas}
         */
        this.canvas = null;

        // init object
        MultipleSelectionContainer.prototype.init.call(this, options);
    };

    PMUI.inheritFrom('PMUI.draw.Rectangle', MultipleSelectionContainer);

    /**
     * Type of each instance of this class
     * @property {String}
     */
    MultipleSelectionContainer.prototype.type = "MultipleSelectionContainer";

    /**
     * Instance initializer which uses options to extend the config options to initialize the instance
     * @param {PMUI.draw.Canvas} canvas The canvas of this multiple selection container
     * @private
     */
    MultipleSelectionContainer.prototype.init = function (options) {
        var defaults = {
            canvas: null,
            x: 0,
            y: 0,
            color: new PMUI.util.Color(0, 128, 255, 0.1)
        };
        jQuery.extend(true, defaults, options);
        this.backgroundColor = defaults.color; 
            // light blue
        this.canvas = defaults.canvas;
        this.absoluteX = defaults.x;
        this.absoluteY = defaults.y;
        // add this element to the canvas
        //this.canvas.addElement(this, 0, 0, true);
    };

    /**
     * Paints the multiple selection container with the color *light blue* (defined in initObject)
     * @chainable
     */
    MultipleSelectionContainer.prototype.paint = function () {
        this.style.addProperties({
            backgroundColor: this.backgroundColor.getCSS()
        });
        return this;
    };

    /**
     * Changes the opacity of this multiple selection container (and repaints it later).
     * @param {number} value
     * @chainable
     */
    MultipleSelectionContainer.prototype.changeOpacity = function (value) {
        this.backgroundColor.setOpacity(value);
        this.paint();
        return this;
    };

    /**
     * Wraps the direct children of the canvas. To call this method it's assumed that this instance has a position
     * and a dimension in the canvas (this method is called from {@link PMUI.draw.Canvas#event-mouseup}).
     * It executes the following actions:
     *
     * 1. Gathers the currentSelection
     * 2. Checks which direct children of the canvas are inside the selection
     *      (done through {@link PMUI.draw.MultipleSelectionContainer#intersectElements}).
     * 3. Fires {@link PMUI.draw.Canvas#triggerSelectEvent} using the new `this.canvas.currentSelection`
     * 4. Resets the state of this instance
     *
     * @chainable
     */
    MultipleSelectionContainer.prototype.wrapElements = function () {
        var currentSelection = this.canvas.currentSelection,
            selection = [];
        this.intersectElements();
        if (!currentSelection.isEmpty()) {
            selection = currentSelection.asArray();
            this.canvas.triggerSelectEvent(selection);
        }
        this.reset();
        this.setVisible(false);
        return this;
    };

    /**
     * Checks which direct children of the canvas are inside `this` (represented as a rectangle in the canvas).
     * The steps are:
     *
     * 1. Empty `this.canvas.currentSelection` by calling {@link PMUI.draw.Canvas#emptyCurrentSelection}.
     * 2. If a child is inside this rectangle then it's added to `this.canvas.currentSelection`.
     *
     * @chainable
     */
    MultipleSelectionContainer.prototype.intersectElements = function () {
        var i,
            shape,
            children;

        //empty the current selection
        this.canvas.emptyCurrentSelection();

        // get all the customShapes
        children = this.canvas.customShapes;
        for (i = 0; i < children.getSize(); i += 1) {
            shape = children.get(i);
            if (shape.parent.family === "Canvas" && this.checkIntersection(shape)) {
                this.canvas.addToSelection(shape);
            }
        }
        return this;
    };

    /**
     * Resets the position and dimensions of this selection container.
     * @chainable
     */
    MultipleSelectionContainer.prototype.reset = function () {
        this.setPosition(0, 0);
        this.setDimension(0, 0);
        return this;
    };

    /**
     * Alias for {@link PMUI.draw.Core#getAbsoluteX}.
     * @property {Function} getLeft
     */
    MultipleSelectionContainer.prototype.getLeft = PMUI.draw.Shape.prototype.getAbsoluteX;

    /**
     * Alias for {@link PMUI.draw.Core#getAbsoluteY}.
     * @property {Function} getTop
     */
    MultipleSelectionContainer.prototype.getTop = PMUI.draw.Shape.prototype.getAbsoluteY;

    /**
     * Checks if `shape` is inside `this`, `shape` is inside `this` if one of its corners
     * its inside `this`.
     * @param {PMUI.draw.Shape} shape
     * @return {boolean}
     */
    MultipleSelectionContainer.prototype.checkIntersection = function (shape) {
        var Point = PMUI.util.Point,
            Geometry = PMUI.draw.Geometry,
            topLeft = new PMUI.util.Point(this.zoomX, this.zoomY),
            bottomRight = new PMUI.util.Point(this.zoomX + this.zoomWidth,
                this.zoomY + this.zoomHeight);
        return Geometry.pointInRectangle(new PMUI.util.Point(shape.getZoomX(), shape.getZoomY()),
            topLeft, bottomRight) ||
            Geometry.pointInRectangle(new PMUI.util.Point(shape.zoomX +
                shape.zoomWidth, shape.zoomY), topLeft, bottomRight) ||
            Geometry.pointInRectangle(new PMUI.util.Point(shape.zoomX, shape.zoomY +
                shape.zoomHeight), topLeft, bottomRight) ||
            Geometry.pointInRectangle(new PMUI.util.Point(shape.zoomX +
                shape.zoomWidth, shape.zoomY + shape.zoomHeight), topLeft, bottomRight);
    };

    PMUI.extendNamespace('PMUI.draw.MultipleSelectionContainer', MultipleSelectionContainer);

    if (typeof exports !== 'undefined') {
        module.exports = MultipleSelectionContainer;
    }
    
}());
