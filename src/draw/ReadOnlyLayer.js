(function () {
    /**
     * @class PMUI.draw.ReadOnlyLayer
     * Layer used to give the canvas a readonly state so that the user can just look
     * at the diagram and not be able to perform any modification,
     * the canvas is in charge of instantiating this object when its property
     * readOnly is set to true, there is no need to instance this object
     * independently
     * @extends PMUI.draw.Core
     *
     * @constructor
     * Creates an instance of this class
     * @param {Object} options configuration options inherited from Core
     */

    var ReadOnlyLayer = function (options) {
        ReadOnlyLayer.superclass.call(this, options);
        ReadOnlyLayer.prototype.initObject.call(this, options);
    };

    PMUI.inheritFrom('PMUI.draw.Core', ReadOnlyLayer);

    /**
     * Creates the HTML and attach the event listeners
     * @param options
     */
    ReadOnlyLayer.prototype.initObject = function (options) {
        this.createHTML();
        this.attachListeners();
    };
    /**
     * Attach the event listeners necessary for blocking interactions
     */
    ReadOnlyLayer.prototype.attachListeners = function () {
        var $layer = $(this.html);
        $layer.on('mousedown', this.onMouseDown(this))
            .on('mouseup', this.onMouseUp(this))
            .on('mousemove', this.onMouseMove(this))
            .on('click', this.onClick(this))
            .droppable({
                accept: "*",
                greedy: true,
                onDrop: function () {
                    return false;
                }
            });
    };
    /**
     * Stops the propagation of the mousedown event
     * @param {PMUI.draw.ReadOnlyLayer} layer
     * @return {Function}
     */
    ReadOnlyLayer.prototype.onMouseDown = function (layer) {
        return function (e, ui) {
            e.stopPropagation();
        };
    };
    /**
     * Stops the propagation of the mouseup event
     * @param {PMUI.draw.ReadOnlyLayer} layer
     * @return {Function}
     */
    ReadOnlyLayer.prototype.onMouseUp = function (layer) {
        return function (e, ui) {
            e.stopPropagation();
        };
    };
    /**
     * Stops the propagation of the click event
     * @param {PMUI.draw.ReadOnlyLayer}layer
     * @return {Function}
     */
    ReadOnlyLayer.prototype.onClick = function (layer) {
        return function (e, ui) {
            e.stopPropagation();
        };
    };
    /**
     * Stops the propagation of the mousemove event
     * @param {PMUI.draw.ReadOnlyLayer} layer
     * @return {Function}
     */
    ReadOnlyLayer.prototype.onMouseMove = function (layer) {
        return function (e, ui) {
            e.stopPropagation();
        };
    };

    PMUI.extendNamespace('PMUI.draw.ReadOnlyLayer', ReadOnlyLayer);

    if (typeof exports !== 'undefined') {
        module.exports = ReadOnlyLayer;
    }
    
}());

