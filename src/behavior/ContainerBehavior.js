(function () {
    /**
     * @abstract
     * @class PMUI.behavior.ContainerBehavior
     * Object that encapsulates the container of shapes, this is an abstract class,
     * so all its methods should be implemented by its subclasses

     * @constructor
     * Creates a new instance of the class
     */
    var ContainerBehavior = function () {
    };
    /**
     * Type of the instances
     * @property {String}
     */
    ContainerBehavior.prototype.type = "ContainerBehavior";
    /**
     * Family of the instances
     * @property {String}
     */
    ContainerBehavior.prototype.family = "ContainerBehavior";
    /**
     * @abstract
     * Sets a shape's container to a given container
     * @param {PMUI.draw.BehavioralElement} container element using this behavior
     * @param {PMUI.draw.Shape} shape shape to be added
     * @template
     * @protected
     */
    ContainerBehavior.prototype.addToContainer = function (container, shape, x, y, topLeftCorner) {
    };
    /**
     * @abstract
     * Removes shape from its current container
     * @param {PMUI.draw.Shape} shape shape to be removed
     * @template
     * @protected
     */
    ContainerBehavior.prototype.removeFromContainer = function (shape) {
    };
    /**
     * @abstract
     * Adds a shape to a given container
     * @param {PMUI.draw.BehavioralElement} container container element using this behavior
     * @param {PMUI.draw.Shape} shape shape to be added to the container
     * @template
     * @protected
     */
    ContainerBehavior.prototype.addShape = function (container, shape, x, y) {
    };
    /**
     * Returns whether a shape is a container or not
     * @return {boolean}
     */
    ContainerBehavior.prototype.isContainer = function () {
        return false;
    };

    PMUI.extendNamespace('PMUI.behavior.ContainerBehavior', ContainerBehavior);

    if (typeof exports !== 'undefined') {
        module.exports = ContainerBehavior;
    }

}());
