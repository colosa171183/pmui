(function () {
    /**
     * @class PMUI.behavior.ConnectionContainerDropBehavior
     * Class that encapsulates the drop behaviors for containers that can also be
     * connected
     * @extends PMUI.behavior.DropBehavior
     *
     * @constructor
     * Creates a new instance of the class
     * @param {Array} [selectors=[]] css selectors that this drop behavior will
     * accept
     */
    var ConnectionContainerDropBehavior = function (selectors) {
        ConnectionContainerDropBehavior.superclass.call(this, selectors);
    };

    PMUI.inheritFrom('PMUI.behavior.DropBehavior', ConnectionContainerDropBehavior);

    /**
     * Type of the instances
     * @property {String}
     */
    ConnectionContainerDropBehavior.prototype.type = "ConnectionContainerDropBehavior";
    /**
     * Default selectors for this drop behavior
     * @property {String}
     */
    ConnectionContainerDropBehavior.prototype.defaultSelector =
            ".custom_shape,.port";
    /**
     * Set the selectors for this drop behavior including the default selectors
     * @param {Array} selectors css selectors
     * @param {boolean} overwrite
     * @return {*}
     */
    ConnectionContainerDropBehavior.prototype.setSelectors = function (selectors, overwrite) {
        ConnectionContainerDropBehavior.superclass.prototype
            .setSelectors.call(this, selectors, overwrite);
        this.selectors.push(".port");
        this.selectors.push(".custom_shape");
        return this;
    };
    /**
     * On drop handler for this drop behavior, determines whether to create a
     * connection or add a shape to the container that is using this drop behavior
     * @param {PMUI.draw.Shape} shape
     * @return {Function}
     */
    ConnectionContainerDropBehavior.prototype.onDrop = function (shape) {
        return function (e, ui) {
            if (!PMUI.behavior.ConnectionDropBehavior.prototype.onDrop.call(this, shape)(e, ui)) {
                PMUI.behavior.ContainerDropBehavior.prototype.onDrop.call(this, shape)(e, ui);
            }

        };
    };

    PMUI.extendNamespace('PMUI.behavior.ConnectionContainerDropBehavior',
        ConnectionContainerDropBehavior);
}());


