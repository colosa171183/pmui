(function () {
    /**
     * @abstract
     * @class PMUI.behavior.DropBehavior
     * Abstract class where all the drop behavior classes inherit from
     * Strategy Pattern
     * @constructor
     * Creates a new instance of the class
     * @param {Object} [options] css selectors that the drop behavior
     * will accept
     */
    var DropBehavior = function (options) {
        /**
         * css selectors that the used for the drop behaviors beside the defaults
         * @property {Array}
         */
        this.selectors = [];
        DropBehavior.prototype.init.call(this, options);
    };
    /**
     * Type of the instances
     * @property {String}
     */
    DropBehavior.prototype.type = "DropBehavior";
    /**
     * Family of the instances
     * @property {String}
     */
    DropBehavior.prototype.family = "DropBehavior";
    /**
     * Default css selectors for the drop behavior
     * @property {String}
     */
    DropBehavior.prototype.defaultSelector = "";

    /**
     * @private
     * Initializes the object with the default options
     * @param  {[type]} options 
     */
    DropBehavior.prototype.init = function (options) {
        var defaults = {
            selectors: []
        };
        jQuery.extend(true, defaults, options);
        this.setSelectors(defaults.selectors);
    };
    /**
     * Attach the drop behaviors and assign the handlers to the corresponding shape
     * @param {PMUI.draw.Shape} shape
     */
    DropBehavior.prototype.attachDropBehavior = function (shape) {
        var $shape = $(shape.getHTML()),
            dropOptions = {
                accept:  this.defaultSelector,
                drop: this.onDrop(shape),
                over: this.onDragEnter(shape),
                out: this.onDragLeave(shape),
                greedy: true
            };
        $shape.droppable(dropOptions);
        //console.log('Drop Behavior attached to', shape);
    };

    /**
     * @event dragEnter
     * @abstract Handler for the drag enter event
     * @param {PMUI.draw.Shape} shape
     * @template
     * @protected
     */
    DropBehavior.prototype.onDragEnter = function (shape) {
        return function (e, ui) {
        };
    };

    /**
     * @event dragLeave
     * @abstract Handler for the drag leave event
     * @param {PMUI.draw.Shape} shape
     * @template
     * @protected
     */
    DropBehavior.prototype.onDragLeave = function (shape) {
        return function (e, ui) {
        };
    };

    /**
     * @event drop
     * @abstract Handler for the on drop event
     * @param {PMUI.draw.Shape} shape
     * @template
     * @protected
     */
    DropBehavior.prototype.onDrop = function (shape) {
        return function (e, ui) {
        };
    };
    /**
     * Sets the selectors that the drop behavior will accept
     * @param {Array} selectors css selectors
     * @param {boolean} overwrite determines whether the default selectors will be
     * overridden or not
     * @chainable
     */
    DropBehavior.prototype.setSelectors = function (selectors, overwrite) {
        var currentSelectors = "",
            index,
            i;
        if (selectors) {
            this.selectors = selectors;
        }
        if (!overwrite) {
            currentSelectors = this.defaultSelector;
            index = 0;
        } else if (selectors.length > 0) {
            currentSelectors = selectors[0];
            index = 1;
        }
        for (i = index; i < selectors.length; i += 1) {
            currentSelectors += "," + this.selectors[i];
        }
        return this;
    };
    /**
     * Updates the accepted drop selectors
     * @param {PMUI.draw.Shape} shape
     * @param {Array} selectors
     * @chainable
     */
    DropBehavior.prototype.updateSelectors = function (shape, selectors) {
        var $shape = $(shape.getHTML()),
            currentSelectors,
            i;
        if (selectors) {
            this.selectors = selectors;
        }
    //    if (!overwrite) {
    //        currentSelectors = $shape.droppable("option", "accept");
    //        console.log(currentSelectors);
    //    }
        if (this.selectors.length > 0) {
            currentSelectors = this.selectors[0];
        }
        for (i = 1; i < this.selectors.length; i += 1) {
            currentSelectors += ',' + this.selectors[i];
        }
        $shape.droppable({"accept": currentSelectors});
        return this;
    };

    /**
     * Hook for the drag enter handler
     * @template
     * @protected
     */
    DropBehavior.prototype.dragEnterHook = function () {
        return true;
    };

    /**
     * Hook for the drag leave handler
     * @template
     * @protected
     */
    DropBehavior.prototype.dragLeaveHook = function () {
        return true;
    };

    /**
     * Hook for the drop handler, executes before the on drop handler logic
     * @param {PMUI.draw.Shape} shape
     * @param {Object} e jQuery object that contains the properties on the
     * drop event
     * @param {Object} ui jQuery object that contains the properties on the
     * drop event
     * @template
     * @protected
     */
    DropBehavior.prototype.dropStartHook = function (shape, e, ui) {
        return true;
    };
    /**
     * Hook for the on drop handler
     * @param {PMUI.draw.Shape} shape
     * @param {Object} e jQuery object that contains the properties on the
     * drop event
     * @param {Object} ui jQuery object that contains the properties on the
     * drop event
     * @template
     * @protected
     */
    DropBehavior.prototype.dropHook = function (shape, e, ui) {
        return true;
    };
    /**
     * Hook for the on drop handler, executes after the drop logic has concluded
     * @param {PMUI.draw.Shape} shape
     * @param {Object} e jQuery object that contains the properties on the
     * drop event
     * @param {Object} ui jQuery object that contains the properties on the
     * drop event
     * @template
     * @protected
     */
    DropBehavior.prototype.dropEndHook = function (shape, e, ui) {
        return true;
    };

    PMUI.extendNamespace('PMUI.behavior.DropBehavior', DropBehavior);
}());
