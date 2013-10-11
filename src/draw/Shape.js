(function () {
    /**
     * @abstract
     * @class PMUI.draw.Shape
     * Represents a shape in the PMDraw framework, shapes can be:
     *
     * - **Regular shapes** (Ovals, rectangles, polygons)
     * - **Custom shapes** (these kind of shapes can have sprites)
     *
     * A shape has the following characteristics:
     *
     * - It has a dragBehavior (inherited from {@link PMUI.draw.Core})
     * - It has a dropBehavior (inherited from {@link PMUI.draw.BehavioralElement})
     * - It has a containerBehavior (inherited from {@link PMUI.draw.BehavioralElement})
     * - It has a resizeBehavior (instantiated in this class)
     *
     * This class cannot be instantiated.
     *
     * @extend PMUI.draw.BehavioralElement
     * @constructor Creates an instance of the class ConnectionDecorator
     * @param {Object} options Initialization options
     * @cfg {boolean} [topLeft=false] If set to true then when this shape is dragged from the toolbar it'll be created
     * and placed in its topLeft coordinate otherwise it'll use the center as its topLeft coordinate
     * @cfg {string} [resizeBehavior="no"] Default resize behavior used to create the correct instance in the factory
     * @cfg {Object} [resizeHandlers={
     *      type: "None",
     *      total: 4,
     *          resizableStyle: {
     *              cssProperties: {
     *                  'background-color': "rgb(0, 255, 0)",
     *                  'border': '1px solid black'
     *              }
     *          },
     *          nonResizableStyle: {
     *              cssProperties: {
     *                  'background-color': "white",
     *                  'border': '1px solid black'
     *              }
     *          }
     *      }] Default styles to create the instances of the class Style
     * @cfg {string} [drag="disabled"] Default drag behavior used to create the correct instance in the factory
     */
    var Shape = function (options) {

        Shape.superclass.call(this, options);

        /**
         * Array built when setting the dimension of the shape to store the
         * x coordinate of the div corners in clockwise order starting at top left
         * @property {Array}
         */
        this.xCorners = [0, 0, 0, 0];
        /**
         * Array built when setting the dimension of the shape to store the
         * y coordinate of the div corners in clockwise order starting at top left
         * @property {Array}
         */
        this.yCorners = [0, 0, 0, 0];
        /**
         * Array built when setting the dimension of the shape to store the
         * x coordinate of the midpoints of each div border in clockwise order
         * starting at the top border
         * @property {Array}
         */
        this.xMidPoints = [0, 0, 0, 0];
        /**
         * Array built when setting the dimension of the shape to store the
         * y coordinate of the midpoints of each div border in clockwise order
         * starting at the top border
         * @property {Array}
         */
        this.yMidPoints = [0, 0, 0, 0];
        /**
         * List containing the resize Points located in the corner of a div
         * @property {PMUI.util.ArrayList}
         */
        this.cornerResizeHandlers = new PMUI.util.ArrayList();
        /**
         * List containing the resize Points located in the middle of a border
         * @property {PMUI.util.ArrayList}
         */
        this.midResizeHandlers = new PMUI.util.ArrayList();

        

        /**
         * Center point of the shape (in the case of a polygon).
         * @property {PMUI.util.Point}
         */
        this.center = null;
        /**
         * The parent of this shape.
         * @property {PMUI.draw.Shape}
         */
        this.parent = null;
        /**
         * Old parent of this shape (useful to check the previous
         * container of this shape).
         * @property {PMUI.draw.Shape}
         */
        this.oldParent = null;
        /**
         * Default zOrder of the shape.
         * @property {number} [defaultZOrder=1]
         */
        this.defaultZOrder = 1;
        /**
         * Denotes whether this shape is being dragged.
         * @property {boolean} [dragging=false]
         */
        this.dragging = false;
        /**
         * Denotes whether this shape was dragged.
         * @property {boolean} [wasDragged=false]
         */
        this.wasDragged = false;
        /**
         * Denotes whether this shape was entered by a draggable element.
         * @property {boolean} [entered=false]
         */
        this.entered = false;
        /**
         * Determines the resizeBehavior that this object has.
         * @property {PMUI.behavior.ResizeBehavior}
         */
        this.resize = null;
        /**
         * Determines whether the shape is being resized or not.
         * @property {boolean} [resizing=false]
         */
        this.resizing = false;
        /**
         * This shape was repainted.
         * @property {boolean}
         */
        this.repainted = false;
        /**
         * Determines whether a shape has fixed Dimensions or not
         * @property boolean
         */
        this.fixed = true;
        /**
         * Determines if the shape's been dropped to a different container
         * @property {boolean}
         */
        this.changedContainer = false;
        /**
         * Determines whether this shape will be created considering its top-left
         * coordinates or its center
         * @property {boolean}
         */
        this.topLeftOnCreation = false;

        // set defaults
        Shape.prototype.init.call(this, options);
    };

    // inherits from BehavioralElement
    PMUI.inheritFrom('PMUI.draw.BehavioralElement', Shape);

    /**
     * Type of each instance of this class
     * @property {String}
     */
    Shape.prototype.type = "Shape";

    /**
     * Family of each instance of this class
     * @property {String}
     */
    Shape.prototype.family = "Shape";

    /**
     * Instance of RegularDragBehavior (avoiding the creation of multiple same instances)
     * @property {PMUI.behavior.DragBehavior} [noDragBehavior=null]
     */
    Shape.prototype.noDragBehavior = null;

    /**
     * Instance of RegularDragBehavior (avoiding the creation of multiple same instances)
     * @property {PMUI.behavior.DragBehavior} [regularDragBehavior=null]
     */
    Shape.prototype.regularDragBehavior = null;

    /**
     * Instance of ConnectionDragBehavior (avoiding the creation of multiple same instances)
     * @property {PMUI.behavior.ConnectionDragBehavior} [connectionDragBehavior=null]
     */
    Shape.prototype.connectionDragBehavior = null;

    /**
     * Instance of CustomShapeDragBehavior (avoiding the creation of multiple same instances)
     * @property {PMUI.behavior.CustomShapeDragBehavior} [customShapeDragBehavior=null]
     */
    Shape.prototype.customShapeDragBehavior = null;

    /**
     * Corner resize identifiers (for jQueryUI Resizable handles)
     * @property {Array} [cornersIdentifiers=['nw', 'ne', 'se', 'sw']]
     */
    Shape.prototype.cornersIdentifiers = ['nw', 'ne', 'se', 'sw'];

    /**
     * Mid resize identifiers (for jQueryUI Resizable handles)
     * @property {Array} [midPointIdentifiers=['n', 'e', 's', 'w']]
     */
    Shape.prototype.midPointIdentifiers = ['n', 'e', 's', 'w'];

    /**
     * Constant for the maximum z-index
     * @property {number} [MAX_ZINDEX=100]
     */
    Shape.prototype.MAX_ZINDEX = 100;

    /**
     * Constant for the default radius used in the class Arc
     * @property {number} [DEFAULT_RADIUS=6]
     */
    Shape.prototype.DEFAULT_RADIUS = 6;

    /**
     * Instance initializer which uses options to extend the config options to initialize the instance
     * @param {Object} options The object that contains old points and new points
     * @private
     */
    Shape.prototype.init = function (options) {
        var defaults = {
            topLeft: false,
            resizeBehavior: "no",
            resizeHandlers: {
                type: "None",
                total: 4,
                resizableStyle: {
                    cssProperties: {
                        'background-color': "rgb(0, 255, 0)",
                        'border': '1px solid black'
                    }
                },
                nonResizableStyle: {
                    cssProperties: {
                        'background-color': "white",
                        'border': '1px solid black'
                    }
                }
            },
            drag: "disabled"
        };

        $.extend(true, defaults, options);

        if (defaults.drag !== "disabled") {
            this.setDragBehavior(defaults.drag);
        } else {
            this.setDragBehavior("nodrag");
        }
        this.setResizeBehavior(defaults.resizeBehavior);
        this.createHandlers(defaults.resizeHandlers.type,
            defaults.resizeHandlers.total,
            defaults.resizeHandlers.resizableStyle,
            defaults.resizeHandlers.nonResizableStyle);
        this.topLeftOnCreation = defaults.topLeft;
    };

    /**
     * Creates handlers according to the `number` of handlers, the `type` of handlers (currently only Rectangle
     * is supported), the `resizableStyle` (created in `this.initObject`) and the `nonResizableStyle`
     * (created in `this.initObject`).
     * @param {string} type
     * @param {number} number
     * @param {Object} resizableStyle
     * @param {Object} nonResizableStyle
     * @chainable
     */
    Shape.prototype.createHandlers = function (type, number, resizableStyle, nonResizableStyle) {
        if (type === "Rectangle") {

            var i;

            //First determine how many ResizeHandlers we are to create
            if (!number || (number !== 8 &&
                number !== 4 && number !== 0)) {
                number = 4;
            }
            //Then insert the corners first
            for (i = 0; i < number && i < 4; i += 1) {
                this.cornerResizeHandlers.insert(
                    new PMUI.draw.ResizeHandler({
                        parent: this,
                        zOrder: PMUI.util.Style.MAX_ZINDEX + 3,
                        representation: new PMUI.draw.Rectangle(),
                        orientation: this.cornersIdentifiers[i],
                        resizableStyle: resizableStyle,
                        nonResizableStyle: nonResizableStyle
                    })
                );
            }
            //subtract 4 just added resize points to the total
            number -= 4;
            //add the rest to the mid list
            for (i = 0; i < number; i += 1) {
                this.midResizeHandlers.insert(
                    new PMUI.draw.ResizeHandler({
                        parent: this,
                        zOrder: PMUI.util.Style.MAX_ZINDEX + 3,
                        representation: new PMUI.draw.Rectangle(),
                        orientation: this.midPointIdentifiers[i],
                        resizableStyle: resizableStyle,
                        nonResizableStyle: nonResizableStyle
                    })
                );
            }
        }
        return this;
        //console.log(this.cornerResizeHandlers.asArray());
        //console.log(this.midResizeHandlers.asArray());
    };

    /**
     * Updates the position of the handlers using `this.cornerResizeHandlers` and `this.midResizeHandlers`.
     * NOTE:  There's a prerequisite to call this method, `this.setDimensions` must be called first
     * because it updated the arrays used by this method.
     * @chainable
     */
    Shape.prototype.updateHandlers = function () {
        var handler,
            i;
        for (i = 0; i < this.cornerResizeHandlers.getSize(); i += 1) {
            handler = this.cornerResizeHandlers.get(i);
            handler.setPosition(this.xCorners[i] -
                Math.round(handler.width / 2) - 1,
                this.yCorners[i] - Math.round(handler.height / 2) - 1);
        }
        for (i = 0; i < this.midResizeHandlers.getSize(); i += 1) {
            handler = this.midResizeHandlers.get(i);
            handler.setPosition(this.xMidPoints[i] -
                Math.round(handler.width / 2) - 1,
                this.yMidPoints[i] - Math.round(handler.height / 2) - 1);
        }
        return this;
    };

    /**
     * Sets the visibility of the resize handlers
     * @param {boolean} visible
     * @chainable
     */
    Shape.prototype.showOrHideResizeHandlers = function (visible) {

        var i;
        if (!visible) {
            visible = false;
        }
        for (i = 0; i < this.cornerResizeHandlers.getSize(); i += 1) {
            this.cornerResizeHandlers.get(i).setVisible(visible);
        }

        for (i = 0; i < this.midResizeHandlers.getSize(); i += 1) {
            this.midResizeHandlers.get(i).setVisible(visible);
        }
        return this;
    };

    /**
     * Applies a predefined style to its handlers (which can be resizable style or non resizable style)
     * @param {string} styleType
     * @chainable
     */
    Shape.prototype.applyStyleToHandlers = function (styleType) {
        var i;
        for (i = 0; i < this.cornerResizeHandlers.getSize(); i += 1) {
            this.cornerResizeHandlers.get(i)[styleType].applyStyle();
        }

        for (i = 0; i < this.midResizeHandlers.getSize(); i += 1) {
            this.midResizeHandlers.get(i)[styleType].applyStyle();
        }
        return this;
    };

    /**
     * Attaches events to this shape (currently mousedown, mouseup and click events).
     *
     * This method also instantiates the behaviors defined in the configuration options of the object,
     * the behaviors instantiated are: 
     *
     * - drag behavior
     * - drop behavior
     * - resize behavior
     *
     * @chainable
     */
    Shape.prototype.attachListeners = function () {
        var $shape = $(this.html);
        $shape.on("mousedown", this.onMouseDown(this));
        $shape.on("mouseup", this.onMouseUp(this));
        $shape.on("click", this.onClick(this));
        this.updateBehaviors();
        return this;
    };

    /**
     * @event mousedown
     * Moused down callback fired when the user mouse downs on the `shape`
     * @param {PMUI.draw.Shape} shape
     */
    Shape.prototype.onMouseDown = function (shape) {
        return function (e, ui) {
        };
    };

    /**
     * @event mouseup
     * Moused up callback fired when the user mouse ups on the `shape`
     * @param {PMUI.draw.Shape} shape
     */
    Shape.prototype.onMouseUp = function (shape) {
        return function (e, ui) {
        };
    };

    /**
     * @event click
     * Click callback fired when the user clicks on the `shape`
     * @param {PMUI.draw.Shape} shape
     */
    Shape.prototype.onClick = function (shape) {
        return function (e, ui) {
        };
    };

    /**
     * Creates the HTML representation of the shape, besides calling the method `createHTML` of
     * the method of its parent, it also adds the resize handlers to the DOM.
     * @returns {HTMLElement}
     */
    Shape.prototype.createHTML = function () {
        var i;

        // call the prototype's createHTML
        Shape.superclass.prototype.createHTML.call(this);

        // add the handlers
        for (i = 0; i < this.cornerResizeHandlers.getSize(); i += 1) {
            this.addResizeHandler(this.cornerResizeHandlers.get(i),
                this.xCorners[i], this.yCorners[i]);
        }
        for (i = 0; i < this.midResizeHandlers.getSize(); i += 1) {
            this.addResizeHandler(this.midResizeHandlers.get(i),
                this.xMidPoints[i], this.yMidPoints[i]);
        }
        return this.html;
    };


    /**
     * Returns true if this object is draggable
     * @return {boolean}
     */
    Shape.prototype.isDraggable = function () {
        return this.drag &&
            this.drag.type !== "NoDragBehavior";
    };

    /**
     * Updates the behaviors of this shape (this method is called from `this.attachListeners`).
     * This is the method that actually initializes jQueryUI's plugins (during the creation of the
     * instance of this shapes, the shape's behaviors are initialized but the init that they do
     * initialize jQuery's UI plugins is done through `[behavior].init`).
     * @chainable
     */
    Shape.prototype.updateBehaviors = function () {
        Shape.superclass.prototype.updateBehaviors.call(this);
        if (this.drag) {
            this.drag.attachDragBehavior(this);
        }
        if (this.resize) {
            this.resize.init(this);
        }
        return this;
    };

    /**
     * Adds a `resizeHandler` to the shape at `[x, y]`
     * @param {PMUI.draw.ResizeHandler} resizeHandler
     * @param {number} x
     * @param {number} y
     * @chainable
     */
    Shape.prototype.addResizeHandler = function (resizeHandler, x, y) {
        if (!this.html) {
            return;
        }
        //console.log(resizeHandler.getHTML());
        this.html.appendChild(resizeHandler.getHTML());

        resizeHandler.setPosition(x - Math.round(resizeHandler.width / 2) - 1,
            y - Math.round(resizeHandler.height / 2) - 1);
        resizeHandler.setCategory("resizable");
        return this;
    };


    /**
     * Paints the shape performing the following actions: 
     *
     * - Paints its resize handlers
     * - Applies the predefined style according to the resize behavior it has
     *
     * @chainable
     */
    Shape.prototype.paint = function () {
        var i,
            styleToApply;

    //    // apply predefined style
    //    this.style.applyStyle();

        for (i = 0; i < this.cornerResizeHandlers.getSize(); i += 1) {
            this.cornerResizeHandlers.get(i).paint();
        }
        for (i = 0; i < this.midResizeHandlers.getSize(); i += 1) {
            this.midResizeHandlers.get(i).paint();
        }

        // apply style to the handlers
        if (this.resizeBehavior) {
            styleToApply = this.resizeBehavior.type === "NoResizeBehavior" ?
                    "nonResizableStyle" :  "resizableStyle";
            this.applyStyleToHandlers(styleToApply);
        }

        return this;
    };

    Shape.prototype.updateHTML = function () {
        return this;
    };

    /**
     * Detaches `this` HTML from the DOM (also removing it from `canvas.customShapes` or `canvas.regularShapes`)
     * @chainable
     */
    Shape.prototype.saveAndDestroy = function () {
        // save the html but detach it from the DOM
        this.html = $(this.html).detach()[0];
        this.canvas.removeFromList(this);
        return this;
    };

    /**
     * Updates the dimensions of this shape according to the dimensions and
     * positions of its children
     * @param {number} newMargin Padding to be added when a children is near the edge
     * @chainable
     */
    Shape.prototype.updateSize = function (newMargin) {
        var children = this.children,
            limits = children.getDimensionLimit(),
            left = limits[3],
            top = limits[0],
            right = limits[1],
            bottom = limits[2],
            newLeft = this.getX(),
            newTop = this.getY(),
            newWidth = this.getWidth(),
            newHeight = this.getHeight(),
            margin,
            diffX = 0,
            diffY = 0,
            positionShift = false,
            dimensionIncrement = false;

        if (newMargin !== "undefined") {
            margin = newMargin;
        } else {
            margin = 15;
        }

        if (left < 0) {
            diffX = margin - left;
            positionShift = true;
            this.oldX = this.x;
            this.oldAbsoluteX = this.x;
            this.oldY = this.y;
            this.oldAbsoluteY = this.absoluteY;
        }

        if (top < 0) {
            diffY = margin - top;
            positionShift = true;
            this.oldX = this.x;
            this.oldAbsoluteX = this.x;
            this.oldY = this.y;
            this.oldAbsoluteY = this.absoluteY;
        }

        newLeft -= diffX;
        newTop -= diffY;
        newWidth += diffX;
        newHeight += diffY;

        if (right > this.width) {
            newWidth += right - this.width + margin;
            dimensionIncrement = true;
            this.oldWidth = this.width;
        }
        if (bottom > this.height) {
            newHeight += bottom - this.height + margin;
            dimensionIncrement = true;
            this.oldHeight = this.height;
        }

        // move the shape to the new coordinates
        this.setPosition(newLeft, newTop);

        // TODO:  CHECK WHERE THIS FUNCTION MUST GO
        // update the positions of its ports
        //this.updatePortsPosition(newWidth - this.width, newHeight - this.height);

        // update the shape's dimension
        this.setDimension(newWidth, newHeight);

        // custom triggers
        if (positionShift) {
            this.changePosition(this.oldX, this.oldY,
                this.absoluteX, this.absoluteY);
        }
        if (dimensionIncrement) {
            this.changeSize(this.oldWidth, this.oldHeight);
        }

        // move the children
        this.updateChildrenPosition(diffX, diffY);

        return this;
    };

    /**
     * Applies the actual zoom scale to the corresponding shape
     * @chainable
     */
    Shape.prototype.applyZoom = function () {
    //    var zoomFactor = this.canvas.getZoomFactor(),
    //        zoomIndex = this.canvas.getZoomPropertiesIndex();

        this.refreshShape();
        return this;
    };

    /**
     * Sets the dimension of this shape, it also updates the arrays `this.xCorners, this.yCorners, this.xMidPoints
     * and this.yMidPoints`
     * @param {number} width
     * @param {number} height
     * @chainable
     */
    Shape.prototype.setDimension = function (width, height) {
        Shape.superclass.prototype.setDimension.call(this, width, height);
        if (this.xCorners) {
            this.xCorners = [0, Math.round(this.zoomWidth), Math.round(this.zoomWidth), 0];
            this.yCorners = [0, 0, Math.round(this.zoomHeight), Math.round(this.zoomHeight)];
            this.xMidPoints = [Math.round(this.zoomWidth / 2), Math.round(this.zoomWidth),
                Math.round(this.zoomWidth / 2), 0];
            this.yMidPoints = [0, Math.round(this.zoomHeight / 2), Math.round(this.zoomHeight),
                Math.round(this.zoomHeight / 2)];
            this.updateHandlers();
        }
        return this;
    };

    /**
     * Sets some variables that store what changed during the process of changing the parent and also
     * triggers `changeElement` using those variables.
     *
     * The variables saved in {@link PMUI.draw.Canvas#updatedElement} are: 
     *
     * - x (old x and new x)
     * - y (old y and new y)
     * - absoluteX (old absoluteX and new absoluteX)
     * - absoluteY (old absoluteY and new absoluteY)
     * - parent (old parent and new parent)
     *
     * @param {number} oldX
     * @param {number} oldY
     * @param {number} oldAbsoluteX
     * @param {number} oldAbsoluteY
     * @param {Object} oldParent
     * @param {PMUI.draw.Canvas} canvas
     * @chainable
     */
    Shape.prototype.changeParent = function (oldX, oldY, oldAbsoluteX, oldAbsoluteY, oldParent, canvas) {
        var fields = [
            {
                "field": "x",
                "oldVal": oldX,
                "newVal": this.x
            },
            {
                "field": "y",
                "oldVal": oldY,
                "newVal": this.y
            },
            {
                "field": "absoluteX",
                "oldVal": oldAbsoluteX,
                "newVal": this.absoluteX
            },
            {
                "field": "absoluteY",
                "oldVal": oldAbsoluteY,
                "newVal": this.absoluteY
            },
            {
                "field": "parent",
                "oldVal": oldParent,
                "newVal": this.parent
            }
        ];
        canvas.updatedElement = {
            "id": this.id,
            "type": this.type,
            "fields": fields,
            "relatedObject": this
        };
        $(canvas.html).trigger("changeelement");
        return this;
    };

    /**
     * Sets some variables that store what changed during the process of resizing and also
     * triggers `changeElement` using those variables.
     *
     * The variables saved in {@link PMUI.draw.Canvas#updatedElement} are: 
     *
     * - width (old width and new width)
     * - height (old height and new height)
     *
     * @param {number} oldWidth
     * @param {number} oldHeight
     * @chainable
     */
    Shape.prototype.changeSize = function (oldWidth, oldHeight) {
        var canvas = this.canvas,
            fields = [
                {
                    "field": "width",
                    "oldVal": oldWidth,
                    "newVal": this.width
                },
                {
                    "field": "height",
                    "oldVal": oldHeight,
                    "newVal": this.height
                }
            ];
        canvas.updatedElement = {
            "id": this.id,
            "type": this.type,
            "fields": fields,
            "relatedObject": this
        };
        $(canvas.html).trigger("changeelement");
        return this;
    };

    /**
     * Sets some variables that store what changed during the process of changing its position and also
     * triggers `changeElement` using those variables.
     *
     * The variables saved in {@link PMUI.draw.Canvas#updatedElement} are: 
     *
     * - x (old x and new x)
     * - y (old y and new y)
     * - absoluteX (old absoluteX and new absoluteX)
     * - absoluteY (old absoluteY and new absoluteY)
     *
     * @param {number} oldX
     * @param {number} oldY
     * @param {number} oldAbsoluteX
     * @param {number} oldAbsoluteY
     * @chainable
     */
    Shape.prototype.changePosition = function (oldX, oldY, oldAbsoluteX, oldAbsoluteY) {
        var canvas = this.canvas,
            fields = [
                {
                    "field": "x",
                    "oldVal": oldX,
                    "newVal": this.x
                },
                {
                    "field": "y",
                    "oldVal": oldY,
                    "newVal": this.y
                },
                {
                    "field": "absoluteX",
                    "oldVal": oldAbsoluteX,
                    "newVal": this.absoluteX
                },
                {
                    "field": "absoluteY",
                    "oldVal": oldAbsoluteY,
                    "newVal": this.absoluteY
                }

            ];
        canvas.updatedElement = {
            "id": this.id,
            "type": this.type,
            "fields": fields,
            "relatedObject": this
        };
        $(canvas.html).trigger("changeelement");
        return this;
    };

    /**
     * Sets whether the dimensions are fixed or not
     * @param {boolean} fixed
     * @chainable
     */
    Shape.prototype.setFixed = function (fixed) {
        if (typeof fixed === "boolean") {
            this.fixed = fixed;
        }
        return this;
    };

    /**
     * Adds `value` to the z-index of the shape (considering the z-index of its parent), since a shape might have
     * children, this method must increase the z-index of each child recursively.
     * @param {PMUI.draw.Shape} shape
     * @param {number} value
     * @chainable
     */
    Shape.prototype.fixZIndex = function (shape, value) {

        var i,
            anotherShape,
            port,
            srcShape,
            destShape,
            srcShapeZIndex,
            destShapeZIndex,
            parentZIndex;

        parentZIndex = shape.parent.html.style.zIndex;
        shape.setZOrder(
            parseInt(parentZIndex, 10) + value + parseInt(shape.defaultZOrder, 10)
        );

        // fix children zIndex
        for (i = 0; i < shape.children.getSize(); i += 1) {
            anotherShape = shape.children.get(i);
            anotherShape.fixZIndex(anotherShape, 0);
        }

        // fix connection zIndex
        // only if it has ports
        if (shape.ports) {
            for (i = 0; i < shape.ports.getSize(); i += 1) {
                port = shape.ports.get(i);
                srcShape = port.connection.srcPort.parent;
                destShape = port.connection.destPort.parent;
                srcShapeZIndex = parseInt(srcShape.html.style.zIndex, 10);
                destShapeZIndex = parseInt(destShape.html.style.zIndex, 10);
                port.connection.style.addProperties({
                    zIndex: Math.max(srcShapeZIndex + 1, destShapeZIndex + 1)
                });
            }
        }
        return this;
    };

    /**
     * Increases the zIndex of this shape by Style.MAX_ZINDEX
     * @chainable
     */
    Shape.prototype.increaseZIndex = function () {
        this.fixZIndex(this, PMUI.util.Style.MAX_ZINDEX);
        return this;
    };

    /**
     * Decreases the zIndex of this shape back to normal
     * @chainable
     */
    Shape.prototype.decreaseZIndex = function () {
        this.fixZIndex(this, 0);
        return this;
    };

    /**
     * Increases the z-index of `shapes`'s ancestors by one
     * @param shape
     * @chainable
     */
    Shape.prototype.increaseParentZIndex = function (shape) {
        if (shape.family !== "Canvas") {
            shape.style.addProperties({
                zIndex: parseInt(shape.html.style.zIndex, 10) + 1
            });
            shape.increaseParentZIndex(shape.parent);
        }
        return this;
    };

    /**
     * Decreases the zIndex of `shapes`'s ancestors by one by one
     * @param {PMUI.draw.Shape} shape
     * @chainable
     */
    Shape.prototype.decreaseParentZIndex = function (shape) {
        if (shape && shape.family !== "Canvas") {
            shape.style.addProperties({
                zIndex: parseInt(shape.html.style.zIndex, 10) - 1
            });
            shape.decreaseParentZIndex(shape.parent);
        }
        return this;
    };

    /**
     * Sets the determined resize behavior to `this` by calling `this.resizeBehaviorFactory` (which creates or returns
     * the instance according to `behavior`) and attaches the drag events to `this`.
     * @param {String} behavior
     * @chainable
     */
    Shape.prototype.setResizeBehavior = function (behavior) {
        var factory = new PMUI.behavior.BehaviorFactory({
                products: {
                    "regularresize": PMUI.behavior.RegularResizeBehavior,
                    "Resize": PMUI.behavior.RegularResizeBehavior,
                    "yes": PMUI.behavior.RegularResizeBehavior,
                    "resize": PMUI.behavior.RegularResizeBehavior,
                    "noresize": PMUI.behavior.NoResizeBehavior,
                    "NoResize": PMUI.behavior.NoResizeBehavior,
                    "no": PMUI.behavior.NoResizeBehavior
                },
                defaultProduct: "noresize"
            });
        this.resize = factory.make(behavior);
        if (this.html) {
            this.resize.init(this);
        }
        return this;
    };

    /**
     * Returns whether the shape is resizable or not
     * @return {boolean}
     */
    Shape.prototype.isResizable = function () {
        return this.resize &&
            this.resize.type !== "NoResizeBehavior";
    };

    /**
     * Updates the position and dimensions of the shape (useful when the parent of this shape
     * has changed positions or dimensions).
     * @chainable
     */
    Shape.prototype.refreshShape = function () {
        this.setPosition(this.x, this.y)
            .setDimension(this.width, this.height);
        return this;
    };

    /**
     * Abstract method intended to refresh the connections of a shapes
     * @abstract
     * @chainable
     */
    Shape.prototype.refreshConnections = function () {
        return this;
    };

    /**
     * Updates the positions of the children of this shape recursively
     * @param {boolean} onCommand
     * @chainable
     */
    Shape.prototype.refreshChildrenPositions = function (onCommand) {
        var i,
            children = this.children,
            child,
            relatedShapes = [],
            coordinates = [];
        for (i = 0; i < children.getSize(); i += 1) {
            child = children.get(i);
            child.setPosition(child.getX(), child.getY());
            if (onCommand) {
                child.refreshConnections(false);
            }
            relatedShapes.push(child);
            coordinates.push({
                x : child.getX(),
                y:  child.getY()
            });
            child.refreshChildrenPositions(onCommand);
        }
        this.canvas.triggerPositionChangeEvent(relatedShapes, coordinates,
            coordinates);
        return this;
    };

    /**
     * Fix connections ports on resize (a container must call this method on resize to reposition its
     * ports on resize and the ports of its children)
     * @param {boolean} resizing
     * @param {boolean} root The currentShape is root?
     * @chainable
     */
    Shape.prototype.fixConnectionsOnResize = function (resizing, root) {

        var i,
            port,
            child,
            connection,
            zoomFactor = this.canvas.zoomFactor;

        if (root) {
            if (this.ports) {
                // connections
                for (i = 0; i < this.ports.getSize(); i += 1) {
                    port = this.ports.get(i);
                    connection = port.connection;
                    this.recalculatePortPosition(port);

                    connection.disconnect().connect();
                    if (!this.resizing) {
                        connection.setSegmentMoveHandlers();
                        connection.checkAndCreateIntersectionsWithAll();
                    }
                }
            }
        } else {
            if (this.ports) {
                // connections
                for (i = 0; i < this.ports.getSize(); i += 1) {
                    // for each port update its absolute position and
                    // repaint its connections
                    port = this.ports.get(i);
                    connection = port.connection;
                    port.setPosition(port.x, port.y);

                    connection.disconnect().connect();
                    if (!this.resizing) {
                        connection.setSegmentMoveHandlers();
                        connection.checkAndCreateIntersectionsWithAll();
                    }
                }
            }
        }

        // children
        for (i = 0; i < this.children.getSize(); i += 1) {
            child = this.children.get(i);
            child.setPosition(child.x, child.y);
            child.fixConnectionsOnResize(child.resizing, false);
        }
        return this;
    };

    /**
     * Serializes this object.
     *
     * This method adds the following to the object retrieved from {@link PMUI.draw.BehavioralElement#stringify}: 
     *
     * - resizeBehavior
     * - resizeHandlers (as defined in the config options)
     *
     * @return {Object}
     */
    Shape.prototype.stringify = function () {
        var inheritedJSON = Shape.superclass.prototype.stringify.call(this),
            type = (this.savedOptions.resizeHandlers &&
                this.savedOptions.resizeHandlers.type) || 'Rectangle',
            total = (this.savedOptions.resizeHandlers &&
                this.savedOptions.resizeHandlers.total) || 4,
            thisJSON = {
                resizeBehavior: this.savedOptions.resizeBehavior,
                resizeHandlers: {
                    type: type,
                    total: total
                }
            };
        $.extend(true, inheritedJSON, thisJSON);
        return inheritedJSON;
    };

    /**
     * Sets the center of the shape
     * @param {number} newCenter
     * @throws {Error} parameter newCenter is not an instance of points
     * @chainable
     */
    Shape.prototype.setCenter = function (newCenter) {
        if (newCenter instanceof PMUI.util.Point) {
            this.center = newCenter;
        } else {
            throw new Error("setCenter():  argument is not an instance of Point");
        }
        return this;
    };

    /**
     * Sets the Parent of the shape (might also trigger the custom event change element if the parameter
     * triggerChange is set to true)
     * @chainable
     * @param {PMUI.draw.Shape} newParent
     * @param {boolean} triggerChange
     */
    Shape.prototype.setParent = function (newParent, triggerChange) {
        //if(newParent.type === "Shape" || newParent.type === "StartEvent" ||
        //newParent.type === "EndEvent")
        if (newParent) {

            if (this.canvas && triggerChange) {
                this.canvas.updatedElement = {
                    "id": this.id,
                    "type": this.type,
                    "fields": [
                        {
                            "field": "parent",
                            "oldVal": this.parent,
                            "newVal": newParent
                        }
                    ]
                };
                $(this.canvas.html).trigger("changeelement");
            }
            this.parent = newParent;
        }
    // else {
    //        throw new Error("setParent() :  paramater newParent is null");
    //    }
        return this;
    };

    /**
     * Sets the oldParent of the shape.
     * @chainable
     * @param {PMUI.draw.Shape} oldParent
     */
    Shape.prototype.setOldParent = function (oldParent) {
        this.oldParent = oldParent;
        return this;
    };

    /**
     * Gets the center of the shape.
     * @return {PMUI.util.Point}
     */
    Shape.prototype.getCenter = function () {
        return this.center;
    };

    /**
     * Gets the parent of the shape.
     * @return {PMUI.draw.Shape / PMUI.draw.Canvas}
     */
    Shape.prototype.getParent = function () {
        return this.parent;
    };

    /**
     * Gets the oldParent of the shape
     * @return {PMUI.draw.Shape / PMUI.draw.Canvas}
     */
    Shape.prototype.getOldParent = function () {
        return this.oldParent;
    };

    /**
     * Gets the handles IDs used to initialize jQueryUI's resizable plugin
     * @return {Object}
     */
    Shape.prototype.getHandlesIDs = function () {
        var handlesObject = {}, // the handles of the shape
            i;                      // iterator

        for (i = 0; i < this.midPointIdentifiers.length; i += 1) {
            handlesObject[this.midPointIdentifiers[i]] = '#' +
                this.midPointIdentifiers[i] + this.id +
                'resizehandler';
        }
        for (i = 0; i < this.cornersIdentifiers.length; i += 1) {
            handlesObject[this.cornersIdentifiers[i]] = '#' +
                this.cornersIdentifiers[i] + this.id +
                'resizehandler';
        }
        return handlesObject;
    };

    /**
     * Applies all behavior in a Shape
     * @chainable
     */
    Shape.prototype.applyBehaviors = function () {
        if (this.html) {
            if (this.drag) {
                this.drag.attachDragBehavior(this);
            }
            if (this.drop) {
                this.drop.attachDropBehavior(this);
            }
            if (this.resize) {
                this.resize.init(this);
            }
        }
        return this;
    };

    PMUI.extendNamespace('PMUI.draw.Shape', Shape);

    if (typeof exports !== 'undefined') {
        module.exports = Shape;
    }

}());
