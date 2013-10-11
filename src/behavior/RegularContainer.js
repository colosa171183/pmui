(function () {
    /**
     * @class PMUI.behavior.RegularContainerBehavior
     * Encapsulates the behavior of a regular container
     * @extends PMUI.behavior.ContainerBehavior
     *
     * @constructor
     * Creates a new instance of the class
     */
    var RegularContainerBehavior = function () {
    };

    PMUI.inheritFrom('PMUI.behavior.ContainerBehavior', RegularContainerBehavior);

    /**
     * Type of the instances
     * @property {String}
     */
    RegularContainerBehavior.prototype.type = "RegularContainerBehavior";
    /**
     * Adds a shape to a given container given its coordinates
     * @param {PMUI.draw.BehavioralElement} container container using this behavior
     * @param {PMUI.draw.Shape} shape shape to be added
     * @param {number} x x coordinate where the shape will be added
     * @param {number} y y coordinate where the shape will be added
     * @param {boolean} topLeftCorner Determines whether the x and y coordinates
     * will be considered from the top left corner or from the center
     */
    RegularContainerBehavior.prototype.addToContainer = function (container, shape, x, y, topLeftCorner) {
        var shapeLeft = 0,
            shapeTop = 0,
            shapeWidth,
            shapeHeight,
            canvas,
            topLeftFactor = (topLeftCorner === true) ? 0 : 1;

        if (container.family === "Canvas") {
            canvas = container;
        } else {
            canvas = container.canvas;
        }


        shapeWidth = shape.getZoomWidth();
        shapeHeight = shape.getZoomHeight();

        shapeLeft += x - (shapeWidth / 2) * topLeftFactor;
        shapeTop += y - (shapeHeight / 2) * topLeftFactor;

        shapeLeft /= canvas.zoomFactor;
        shapeTop /= canvas.zoomFactor;

        shape.setParent(container);
        container.getChildren().insert(shape);
        this.addShape(container, shape, shapeLeft, shapeTop);

        // fix the zIndex of this shape and it's children
        shape.fixZIndex(shape, 0);

        // fix resize minWidth and minHeight and also fix the dimension
        // of this shape (if a child made it grow)
        container.updateDimensions(10);

        // adds the shape to either the customShape arrayList or the regularShapes
        // arrayList if possible
        canvas.addToList(shape);
    };
    /**
     * Removes a shape from the container implementing this behavior
     * @param {PMUI.draw.Shape} shape shape to be removed
     */
    RegularContainerBehavior.prototype.removeFromContainer = function (shape) {
        var parent = shape.parent;
        parent.getChildren().remove(shape);
        if (parent.isResizable()) {
            parent.resizeBehavior.updateResizeMinimums(shape.parent);
        }
        shape.parent = null;
    };
    /**
     * Sets the position of the shape, and append its html
     * @param {PMUI.draw.BehavioralElement} container element implementing this behavior
     * @param {PMUI.draw.Shape} shape shape added to the container
     * @param {number} x x coordinate of the position that will be set relative to
     * the container
     * @param {number} y y coordinate of the position that will be set relative to
     * the container
     * @chainable
     */
    RegularContainerBehavior.prototype.addShape = function (container, shape, x, y) {
        shape.setPosition(x, y);
        //insert the shape HTML to the DOM
        container.getHTML().appendChild(shape.getHTML());

        shape.paint();
        shape.updateHTML();
        shape.applyBehaviors();
        //shape.defineEvents();
        shape.attachListeners();
        return this;

    };

    PMUI.extendNamespace('PMUI.behavior.RegularContainerBehavior', RegularContainerBehavior);

    if (typeof exports !== 'undefined') {
        module.exports = RegularContainerBehavior;
    }
    
}());

