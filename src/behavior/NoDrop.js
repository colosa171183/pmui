(function () {
    /**
     * @class  PMUI.behavior.NoDropBehavior
     * Encapsulates the drop behavior representing an object that can't be droppable
     * @extends PMUI.behavior.DropBehavior
     *
     * @constructor
     * Creates a new instance of the class
     */
    var NoDropBehavior = function (selectors) {
        NoDropBehavior.superclass.call(this, selectors);
    };

    PMUI.inheritFrom('PMUI.behavior.DropBehavior', NoDropBehavior);
    /**
     * Type of the instances
     * @property {String}
     */
    NoDropBehavior.prototype.type = "NoDropBehavior";
    /**
     * Attach the drop behavior, sets the accepted elements to none
     * @param {PMUI.draw.Shape} shape
     */
    NoDropBehavior.prototype.attachDropBehavior = function (shape) {
        //var $shape = $(shape.getHTML());
        //NoDropBehavior.superclass.prototype.attachDropBehavior.call(this, shape);
        //$(shape).droppable({ accept:  "" });
    };

    PMUI.extendNamespace('PMUI.behavior.NoDropBehavior', NoDropBehavior);

    if (typeof exports !== 'undefined') {
        module.exports = NoDropBehavior;
    }

}());
