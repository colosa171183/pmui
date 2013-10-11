(function () {
    /**
     * @class PMUI.draw.BehavioralElement
     * Class that encapsulates the behavior of all elements that have container and
     * drop behaviors attached to them.
     * since this class inherits from {@link PMUI.draw.Core}, then the common behaviors
     * and properties for all elements in the designer are also part of this class
     * The purpose of this class is to encapsulate behaviors related to drop and
     * containment of elements, so it shouldn't be instantiated, we should
     * instantiate the elements that inherit from this class instead.
     *          //i.e
     *          //we will set the behaviors that are related only to this class
     *          var shape = new PMUI.draw.CustomShape({
     *          //we can set different types of containers here and the factory
     *          //will do all the work
     *              container : "regular",
     *              drop : {
     *              //type specifies the drop behavior we want, again we just need
     *              // to pass a string
     *               type : "container",
     *                //selectors are the css selectors that this element will
     *                //accept to be dropped
     *               selectors : [".firstselector",".secondselector"],
     *              //overwrite is an option to override previous and default
     *              //selectors
     *               overwrite : false
     *              }
     *          });
     *
     * @extends PMUI.draw.Core
     *
     * @constructor Creates a new instance of this class
     * @param {Object} options
     * @cfg {String} [container="nocontainer"] the type of container behavior
     * we want for an object, it can be regular,or nocontainer, or any other class
     * that extends the {@link PMUI.behavior.ContainerBehavior} class, but also note that we would
     * need to override the factory for container behaviors located in this class.
     * @cfg {Object} [drop={
     *     drop : "nodrop",
     *     selectors : [],
     *     overwrite : false
     * }] Object that contains the options for the drop behavior we want an object
     * to have, we can, assign type which can be container, connection,
     * connectioncontainer, or no drop. As with the container behavior we can extend
     * the behaviors and factory for this functionality.
     * We also have selectors that specify the selectors the drop behavior will
     * accept and the overwrite feature
     */
    var BehavioralElement = function (options) {
        BehavioralElement.superclass.call(this, options);
        /**
         * Determines the Behavior object that this object has
         * @property {PMUI.behavior.ContainerBehavior}
         */
        this.container = null;
        /**
         * Determines the Drop Behavior of the element
         * @type {PMUI.behavior.DropBehavior}
         */
        this.drop = null;
        
        /**
         * List of the children
         * @property {*}
         */
        this.children = null;
        BehavioralElement.prototype.init.call(this, options);
    };
    PMUI.inheritFrom('PMUI.draw.Core', BehavioralElement);
    /**
     * Type of the all instances of this class
     * @property {String}
     */
    BehavioralElement.prototype.type = "BehavioralElement";
    /**
     * Instance initializer which uses options to extend the default config options.
     * The default options are container: nocontainer, and drop: nodrop
     * @param {Object} options
     */
    BehavioralElement.prototype.init = function (options) {
        var defaults = {
            drop : "nodrop",
            container : "nocontainer" 
        };
        $.extend(true, defaults, options);
        this.setDropBehavior(defaults.drop);
        this.setContainerBehavior(defaults.container);
        this.children = new PMUI.util.ArrayList();
    };
    
    /**
     * Sets the drop behavior associated with this element
     * @param {Object} obj 
     */
    BehavioralElement.prototype.setDropBehavior = function (obj){
        var factory = new PMUI.behavior.BehaviorFactory({
                products:{
                    "connectioncontainer": PMUI.behavior.ConnectionContainerDropBehavior,
                    "connection": PMUI.behavior.ConnectionDropBehavior,
                    "container": PMUI.behavior.ContainerDropBehavior,
                    "nodrop": PMUI.behavior.NoDropBehavior
                },
                defaultProduct: "nodrop"
            });
        this.drop = factory.make(obj);
        return this; 
    };
    
    /**
     * Sets the container behavior for the element
     * @param {Object} obj 
     */
    BehavioralElement.prototype.setContainerBehavior = function (obj) {
        var factory = new PMUI.behavior.BehaviorFactory({
                products: {
                    "regularcontainer": PMUI.behavior.RegularContainerBehavior,
                    "nocontainer": PMUI.behavior.NoContainerBehavior
                },
                defaultProduct : "nocontainer"
            });
        this.container = factory.make(obj);
        return this;
    };

    /**
     * Updates the children positions of a container given the x and y difference
     * @param {Number} diffX x difference
     * @param {Number} diffY y difference
     * @chainable
     * // TODO make this method recursive
     */
    BehavioralElement.prototype.updateChildrenPosition = function (diffX, diffY) {
        var children = this.getChildren(),
            child,
            i,
            updatedChildren = [],
            previousValues = [],
            newValues = [];
        for (i = 0; i < children.getSize(); i += 1) {
            child = children.get(i);
    //        child.oldX = child.x;
    //        child.oldY = child.y;
    //        child.oldAbsoluteX = child.absoluteX;
    //        child.oldAbsoluteY = child.absoluteY;
            if ((diffX !== 0 || diffY !== 0) &&
                    !this.canvas.currentSelection.contains(child)) {
                updatedChildren.push(child);
                previousValues.push({
                    x : child.x,
                    y : child.y
                });
                newValues.push({
                    x : child.x + diffX,
                    y : child.y + diffY
                });
            }
            child.setPosition(child.x + diffX, child.y + diffY);
        }
        if (updatedChildren.length > 0) {
            this.canvas.triggerPositionChangeEvent(updatedChildren, previousValues,
                newValues);
        }
        return this;
    };
    /**
     * Returns whether the instance is a container or not
     * @return {Boolean}
     */
    BehavioralElement.prototype.isContainer = function () {
        return this.container &&
                this.container.type !== "NoContainerBehavior";
    };
    
    /**
     * Encapsulates the functionality of adding an element this element according
     * to its container behavior
     * @param {PMUI.draw.Shape} shape Shape we want to add to the element
     * @param {Number} x x coordinate where the shape will be positionated relative
     * to this element
     * @param {Number} y y coordinate where the shape will be positionated relative
     * to this element
     * @param {Boolean} topLeftCorner determines if the drop position should be
     * calculated from the top left corner of the shape or, from its center
     * @chainable
     */
    BehavioralElement.prototype.addElement = function (shape, x, y,
                                                    topLeftCorner) {
        this.container.addToContainer(this, shape, x, y, topLeftCorner);
        return this;
    };
    /**
     * Encapsulates the functionality of removing an element this element according
     * to its container behavior
     * @param {PMUI.draw.Shape} shape shape to be removed from this element
     * @chainable
     */
    BehavioralElement.prototype.removeElement = function (shape) {
        this.container.removeFromContainer(shape);
        return this;
    };
    /**
     * Swaps a shape from this container to a different one
     * @param {PMUI.draw.Shape} shape shape to be swapped
     * @param {PMUI.draw.BehavioralElement} otherContainer the other container the shape will
     * be swapped to
     * @param {Number} x x coordinate where the shape will be positionated relative
     * to this element
     * @param {Number} y y coordinate where the shape will be positionated relative
     * to this element
     * @param {Boolean} topLeftCorner determines if the drop position should be
     * calculated from the top left corner of the shape or, from its center
     * @chainable
     */
    BehavioralElement.prototype.swapElementContainer = function (shape,
                                                                 otherContainer, x,
                                                                 y, topLeftCorner) {
        var newX = !x ? shape.getX() : x,
            newY = !y ? shape.getY() : y;
        shape.changedContainer = true;
        this.removeElement(shape);
        otherContainer.addElement(shape, newX, newY, topLeftCorner);
        return this;
    };
    /**
     * Returns the list of children belonging to this shape
     * @returns {PMUI.util.ArrayList}
     */
    BehavioralElement.prototype.getChildren = function () {
        return this.children;
    };
    /**
     * Updates the dimensions and position of this shape (note: 'this' is a shape)
     * @param {Number} margin the margin for this element to consider towards the
     * shapes near its borders
     * @chainable
     */
    BehavioralElement.prototype.updateDimensions = function (margin) {
        // update its size (if an child grew out of the shape)
        // only if it's not the canvas
        if (this.family !== 'Canvas') {
            this.updateSize(margin);
            this.refreshConnections();
            // updates JQueryUI's options (minWidth and minHeight)
            PMUI.draw.ResizeBehavior.prototype.updateResizeMinimums(this);
            BehavioralElement.prototype.updateDimensions.call(this.parent, margin);
        }
        return this;
    };
    
    /**
     * Sets the selectors of the current drop behavior
     * @param {Array} selectors new css selectors for the drop behavior
     * @param {Boolean} overwrite determines whether the default selectors will
     * be erased
     * @chainable
     */
    BehavioralElement.prototype.setDropAcceptedSelectors = function (selectors,
                                                                   overwrite) {
        if (selectors && selectors.hasOwnProperty('length')) {
            this.drop.updateSelectors(this, selectors, overwrite);
        }
        return this;
    };
    /**
     * Attach the drop behavior to the element, if there is such
     * @chainable
     */
    BehavioralElement.prototype.updateBehaviors = function () {
        if (this.drop) {
            this.drop.attachDropBehavior(this);
            this.drop.updateSelectors(this);
        }
        return this;
    };
    /**
     * Stringifies the container and drop behavior of this object
     * @return {Object}
     */
    BehavioralElement.prototype.stringify = function () {
        var inheritedJSON = BehavioralElement.superclass.prototype.stringify.call(this),
            thisJSON = {
                container: this.savedOptions.container,
                drop: this.savedOptions.drop
            };
        $.extend(true, inheritedJSON, thisJSON);
        return inheritedJSON;
    };

    PMUI.extendNamespace('PMUI.draw.BehavioralElement', BehavioralElement);

    if (typeof exports !== 'undefined') {
        module.exports = BehavioralElement;
    }

}());
