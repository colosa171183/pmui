(function () {
    /**
     * @class PMUI.behavior.NoContainerBehavior
     * Encapsulates the behavior of elements that has no container behavior, useful
     * for implementing the strategy pattern
     * @extends PMUI.behavior.ContainerBehavior
     *
     *
     * @constructor
     * Creates a new instance of the class
     */
    var NoContainerBehavior = function () {
    };

    PMUI.inheritFrom('PMUI.behavior.ContainerBehavior', NoContainerBehavior);
    /**
     * Type of the instances
     * @property {String}
     */
    NoContainerBehavior.prototype.type = "NoContainerBehavior";

    PMUI.extendNamespace('PMUI.behavior.NoContainerBehavior', NoContainerBehavior);

    if (typeof exports !== 'undefined') {
        module.exports = NoContainerBehavior;
    }
    
}());
