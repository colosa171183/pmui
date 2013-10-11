(function () {
    /**
     *
     * @class PMUI.draw.Layer
     * Class that contains the properties of a layer for a shape we need
     * to have a shape already instantiated and added to the canvas in order for
     * this class to be effective
     *
     *          //e.g.
     *           var layer = new PMUI.draw.Layer({
     *                  //Determine the layer's parent
     *                  parent: customShape,
     *                  layerName: "first layer",
     *                  //the order in which the layers will be added in increasing
     *                  //order
     *                  priority: 0,
     *                  //determines if the layer will be hidden or visible
     *                  visible: true,
     *                  //sprites to be applied on the layers according to a zoom
     *                  //scale
     *                  zoomSprites : ["class50, class75, class100, class125,
     *                      class 150"]
     *           });
     * @extend PMUI.draw.Core
     *
     * @constructor
     * Initializes a layer, the constructor must be called with all its parameter
     * for the object to be meaningful, its is important to denote that the css
     * class must follow this structure
     * any word_zoomScale_anythingYouWantHere
     * @param {Object} options
     * @cfg {Object} parent, Parent of a corresponding layer, a layer may not exist
     * without a parent
     * @cfg {String} [layerName="defaultLayerName"] A name we want to label a layer
     * with
     * @cfg {number} [priority=0] The orders in which the layers will be added in
     * increasing order
     * @cfg {boolean} [visible=true] Determines whether a layer wll be visible or
     * hidden
     * @cfg {Array} [zoomSprites=["","","","",""]] Sprites to be applied to the
     * layer according to a zoom scale
     */
    var Layer = function (options) {

    // TODO:  check elementClass and bpmnClass removal impact on the layers
    //Layer = function (parent, name, elementClass, priority, bpmnClass, visible) {

        Layer.superclass.call(this, options);

        /**
         * The name of the layer
         * @property {String}
         */
        this.layerName = null;

        /**
         * The priority of the layer, determines which layer should be on top
         * @property {number}
         */
        this.priority = null;

        /**
         * The bpmnShape that this layer belongs too.
         * Extremely important since some data will be strictly drawn by its parent
         * @property {Object}
         */
        this.parent = null;

        /**
         * Determines when a layer is visible or not
         * @property boolean
         */
        this.visible = null;
        /**
         * The current Sprite applied in the zoom scale
         * @property {String}
         */
        this.currentZoomClass = "";
        /**
         * Sprites for the layer in each zoom scale
         * @property {Array}
         */
        this.zoomSprites = [];

        Layer.prototype.initObject.call(this, options);
    };

    PMUI.inheritFrom('PMUI.draw.Core', Layer);

    /**
     * Type of an instance of this class
     * @property {String}
     */
    Layer.prototype.type = "Layer";

    /**
     * Object init method (internal)
     * @param {Object} options
     */
    Layer.prototype.initObject = function (options) {
        /**
         * Default options for the object
         * @property {Object}
         */
        var defaults = {
            x: 0,
            y: 0,
            parent: null,
            layerName: "defaultLayerName",
            priority: 0,
            visible: true,
            zoomSprites: ["", "", "", "", ""]
        };

        // extend recursively the defaultOptions with the given options
        $.extend(true, defaults, options);

        // call setters using the defaults object
        this.setParent(defaults.parent)
            .setPosition(defaults.x, defaults.y)
            .setLayerName(defaults.layerName)
            .setPriority(defaults.priority)
            .setVisible(defaults.visible)
            .setZoomSprites(defaults.zoomSprites)
            .setProperties();

    };
    /**
     * Updates the properties in order to change zoom scales
     */
    Layer.prototype.applyZoom = function () {
        this.setProperties();
    };
    /**
     * Comparison function for ordering layers according to priority
     * @param {PMUI.draw.Layer} layer1
     * @param {PMUI.draw.Layer} layer2
     * @returns {boolean}
     */
    Layer.prototype.comparisonFunction = function (layer1, layer2) {
        return layer1.priority > layer2.priority;
    };
    /**
     * Creates the HTML representation of the layer
     * @returns {HTMLElement}
     */
    Layer.prototype.createHTML = function (modifying) {
        this.setProperties();
        Layer.superclass.prototype.createHTML.call(this, modifying);
        return this.html;
    };
    /**
     * Paints the corresponding layer, in this case adds the
     * corresponding css classes
     * @chainable
     */
    Layer.prototype.paint = function () {

        var $layer = $(this.html),
            newSprite;
        this.style.removeClasses([this.currentZoomClass]);
        newSprite = this.zoomSprites[this.canvas.zoomPropertiesIndex];
        this.style.addClasses([newSprite]);
        this.currentZoomClass = newSprite;
        this.style.applyStyle();
        /*
         //The current position where the properties for the current zoom factor
         // are located
         var propertiesPosition;

         if (!this.html) {
         return this;
         }
         propertiesPosition = (this.canvas) ? this.canvas.getPropertyPosition() :  2;

         //determine the css classes that will be used
         this.bpmnClass = this.elementProperties[propertiesPosition].bpmnClass;
         this.elementClass = this.elementProperties[propertiesPosition].elementClass;

         //apply classes according to visibility
         if (this.visible) {
         this.html.className = this.bpmnClass + " " + this.elementClass;
         } else {
         this.html.className = "";
         }
         return this;*/
        return this;
    };

    /**
     * This method will set the parent necessary properties for the layer to work
     * @chainable
     */
    Layer.prototype.setProperties = function () {

        if (!this.parent) {
            return this;
        }
        //generates an id for the layer
        this.id = this.parent.getID() + "Layer-" + this.layerName;
        //this.width =  this.parent.getWidth();
        //this.height = this.parent.getHeight();
        this.setDimension(this.parent.getWidth(), this.parent.getHeight());
        // DO NOT ASSUME THAT THE POSITION OF THE LAYER IS 0,0 BECAUSE OF THE
        // BORDERS IT MAY HAVE
    //    this.setPosition(0, 0);
        this.canvas = this.parent.canvas;

        return this;
    };
    /**
     * Returns the layer name
     * @returns {String}
     */
    Layer.prototype.getLayerName = function () {
        return this.layerName;
    };

    /**
     * Returns the priority of the layer
     * @returns {number}
     */
    Layer.prototype.getPriority = function () {
        return this.priority;
    };
///**
// * Returns if the layer is visible or not
// * @returns {boolean}
// */
//Layer.prototype.getVisible = function () {
//    return this.visible;
//};

    /**
     * Sets the layer name
     * @param {String} newLayerName
     * @chainable
     */
    Layer.prototype.setLayerName = function (newLayerName) {
        if (typeof newLayerName === "string" && newLayerName !== "") {
            this.layerName = newLayerName;
        }
        return this;
    };

    /**
     * Sets the priority of the layer
     * @param {number} newPriority
     * @chainable
     */
    Layer.prototype.setPriority = function (newPriority) {
        if (typeof newPriority === "number") {
            this.priority = newPriority;
        }
        return this;
    };

    /**
     * Sets the parent of this layer
     * @param {PMUI.draw.CustomShape} newParent
     * @chainable
     */
    Layer.prototype.setParent = function (newParent) {
        if (newParent) {
            this.parent = newParent;
        }
        return this;
    };

    /**
     * Gets the parent of this layer
     * @return {PMUI.draw.Shape}
     */
    Layer.prototype.getParent = function () {
        return this.parent;
    };

    /**
     * Sets the css classes for the zoom scales
     * @param {Array} zoomSprites
     * @chainable
     */
    Layer.prototype.setZoomSprites = function (zoomSprites) {
        var i;
        this.zoomSprites = ["", "", "", "", ""];
        for (i = 0; i < zoomSprites.length; i += 1) {
            this.zoomSprites[i] = zoomSprites[i];
        }
        return this;
    };
    /**
     * Serializes this object
     * @return {Object}
     */
    Layer.prototype.stringify = function () {
        /**
         * inheritedJSON = {
         *     id:  #
         *     x:  #,
         *     y:  #,
         *     width:  #,
         *     height:  #
         * }
         * @property {Object}
         */
        var inheritedJSON = {},
            thisJSON = {
                id: this.getID(),
                x: this.getX(),
                y: this.getY(),
                layerName: this.getLayerName(),
                priority: this.getPriority(),
                style: {
                    cssClasses: this.style.getClasses()
                },
                zoomSprites: this.zoomSprites
            };
        $.extend(true, inheritedJSON, thisJSON);
        return inheritedJSON;
    };

    PMUI.extendNamespace('PMUI.draw.Layer', Layer);

    if (typeof exports !== 'undefined') {
        module.exports = Layer;
    }

}());
