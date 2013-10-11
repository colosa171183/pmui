(function () {
    /**
     * @class PMUI.draw.Canvas
     * Is the object where all the shapes and drawings will be placed on, in addition it handles zoom operations
     * and also the triggering of events.
     *
     * Below are some unique characteristics of the instances of this class:
     *
     * - Each instance of this class has an instance of the following:
     *      - {@link PMUI.command.CommandStack Command stack}
     *      - {@link PMUI.draw.Snapper Two snappers} (one horizontal snapper and one vertical snapper).
     *      - {@link PMUI.draw.MultipleSelectionContainer} to select multiple shapes.
     *      - {@link PMUI.draw.Segment}. To create connections between shapes.
     *      - {@link PMUI.draw.Canvas#property-customShapes CustomShapes arrayList}. To save all the custom shapes
     *          created in this canvas.
     *      - {@link PMUI.draw.Canvas#property-connections Connections arrayList}. To save all the connections
     *          created in this canvas.
     *      - {@link PMUI.draw.Canvas#property-currentSelection Current selection arrayList}. 
     To save all the custom shapes
     *          that are select (by clicking, ctrl clicking them or selecting them using the
     *          multipleSelectionContainer instance).
     *      - {@link PMUI.draw.Canvas#property-currentConnection Current connection}. A pointer to the selected
     *          connection.
     *      - {@link PMUI.draw.Canvas#property-currentLabel Current label}. A pointer to the active label.
     *
     * Besides this class does the following:
     *
     * - Parses the JSON retrieved from the database (through {@link PMUI.draw.Canvas#parse})
     * - Creates some custom events (defined in {@link PMUI.draw.Canvas#attachListeners})
     * - Creates, stores and executes the commands (through its {@link PMUI.draw.Canvas#property-commandStack}) property
     *
     * Below is an example of instantiation of this class:
     *
     *      // The canvas needs an object containing the reference to existing classes outside the library
     *      // e.g. let's define two classes
     *      var BpmnActivity = function (options) {
     *          ...
     *      };
     *      var BpmnEvent = function (options) {
     *          ...
     *      };
     *
     *      // Next, the canvas needs a factory function to create custom shapes dragged from a toolbar
     *      // this function needs an ID to create the shape
     *      function toolbarFactory (id) {
     *          var customShape = null;
     *          switch(id) {
     *              case: 'BpmnActivity':
     *                  customShape = new PMUI.draw.BpmnActivity({
     *                      ....
     *                  });
     *                  break;
     *              case: 'BpmnEvent':
     *                  customShape = new PMUI.draw.BpmnEvent({
     *                      ....
     *                  });
     *                  break;
     *          }
     *          return customShape;
     *      }
     *
     *      // finally an instance of this class can be defined
     *      var canvas = new PMUI.draw.Canvas({
     *          width: 4000,
     *          height: 4000,
     *          toolbarFactory: toolbarFactory,
     *          copyAndPasteReferences: {
     *              bpmnActivity: BpmnActivity,
     *              bpmnEvent: BpmnEvent
     *          }
     *      });
     *
     * @extends PMUI.draw.BehavioralElement
     *
     * @constructor
     * Creates an instance of the class
     * @param {Object} options configuration options of the canvas
     * @cfg {number} [width=4000] Width of this canvas.
     * @cfg {number} [height=4000] Height of this canvas.
     * @cfg {Function} toolbarFactory Function that will handle object creation
     * from a custom toolbar
     * @cfg {Object} [copyAndPasteReferences={}] References to the constructors of the classes
     * (so that a shape is easily created from the canvas)
     * @cfg {boolean} [readOnly=false] Property that determines the permission a
     * user has over the canvas
     */
    var Canvas = function (options) {
        Canvas.superclass.call(this, options);
        /**
         * Variable that points to the HTML in the DOM of this object.
         * @property {HTMLElement} [html=null]
         */
        this.html = null;
        /**
         * A list of all the custom shapes in the canvas.
         * @property {PMUI.util.ArrayList}
         */
        this.customShapes = null;
        /**
         * A list of all the regular shapes in the canvas.
         * @property {PMUI.util.ArrayList}
         */
        this.regularShapes = null;
        /**
         * A list of all the connections in the canvas.
         * @property {PMUI.util.ArrayList}
         */
        this.connections = null;
        /**
         * A list of all the shapes that are currently selected.
         * @property {PMUI.util.ArrayList}
         */
        this.currentSelection = null;
        /**
         * A list of all the connections that will not be repainted (using the ManhattanRouter algorithm),
         * but will be moved only.
         * @property {PMUI.util.ArrayList}
         */
        this.sharedConnections = null;
        /**
         * Left Scroll coordinate of the canvas
         * @property {number} [leftScroll=0]
         */
        this.leftScroll = 0;
        /**
         * Top scroll coordinate of the canvas
         * @property {number} [topScroll=0]
         */
        this.topScroll = 0;
        /**
         * Reference to the current selected connection in the canvas
         * @property {PMUI.draw.Connection}
         */
        this.currentConnection = null;
        /**
         * Pointer to the last connection selected in the canvas
         * (this variable is set from the commandDelete)
         * @property {PMUI.draw.Connection}
         */
        this.oldCurrentConnection = null;
        /**
         * Instance of the class {@link PMUI.draw.Segment} used to make connections in the canvas.
         * @property {PMUI.draw.Segment}
         */
        this.connectionSegment = null;
        /**
         * Instance of the class {@link PMUI.draw.MultipleSelectionContainer} created to do multiple selection
         * @property {PMUI.draw.MultipleSelectionContainer}
         */
        this.multipleSelectionHelper = null;
        /**
         * Instance of the class {@link PMUI.draw.Snapper} which represents the horizontal line used for snapping
         * @property {PMUI.draw.Snapper}
         */
        this.horizontalSnapper = null;
        /**
         * Instance of the class {@link PMUI.draw.Snapper} which represents the vertical line used for snapping
         * @property {PMUI.draw.Snapper}
         */
        this.verticalSnapper = null;
        /**
         * Current zoom Factor of the diagram
         * @property {number} [zoomFactor=1]
         */
        this.zoomFactor = 1;
        /**
         * Index for the zoom properties for shapes corresponding to the current
         * zoom factor
         * @property {number} [zoomPropertiesIndex=2]
         */
        this.zoomPropertiesIndex = 2;
        /**
         * zOrder of the HTML Representation
         * @property {number} [zOrder=0]
         */
        this.zOrder = 0;
        /**
         * Boolean set true if the {@link PMUI.draw.Canvas#event-mousedown} event of the canvas is fired,
         * it's set to false in the {@link PMUI.draw.Canvas#event-mouseup} event.
         * @property {boolean} [isMouseDown=false]
         */
        this.isMouseDown = false;
        /**
         * Current selected shape
         * @property {PMUI.draw.Shape}
         */
        this.currentShape = null;
        /**
         * True if the {@link PMUI.draw.Canvas#event-mousedown} event of the canvas is triggered and
         * the {@link PMUI.draw.Canvas#event-mousemove} event is triggered, it's set to false in mouseUp event.
         * @property {boolean} [isMouseDownAndMove=false]
         */
        this.isMouseDownAndMove = false;
        /**
         * Denotes if there's been a multiple drop prior to a drag end.
         * @property {boolean} [multipleDrop=false]
         */
        this.multipleDrop = false;
        /**
         * Denotes if a segment move handler is being dragged. in order not to
         * trigger events in the canvas [draggingASegmentHandler=false]
         * @property {boolean}
         */
        this.draggingASegmentHandler = false;
        /**
         * Elements that was added, changed or deleted in the canvas.
         * @property {Object}
         */
        this.updatedElement = null;
        /**
         * Determines if the canvas has been right clicked at {@link PMUI.draw.Canvas#event-mousedown}
         * @property {boolean} [rightClick=false]
         */
        this.rightClick = false;
        /**
         * Each time a shape is moved using the cursors, the following code is executed:
         *
         *      // for each 'connection' that is not in this.sharedConnection and that it's being
         *      // recalculated (using ManhattanRouter algorithm)
         *      connection.disconnect().connect()
         *                  .setSegmentMoveHandlers()
         *                  .checkAndCreateIntersectionsWithAll();
         *
         *  So to avoid these operations for each key press of the cursors, let's create a timeout,
         *  so that only after that timeout has expired the code above will run.
         *  This variable is a reference to that timeout.
         * @property {Object}
         */
        this.intersectionTimeout = null;
        /**
         * Point to the current label that is being edited
         * @property {Object}
         */
        this.currentLabel = null;
        /**
         * Instance of the class {@link PMUI.command.CommandStack} to be used in this canvas
         * @property {PMUI.command.CommandStack}
         */
        this.commandStack = null;
        /**
         * Array which contains a list of all the objects that were duplicated
         * (during copy)
         * @property {Array} [shapesToCopy=[]]
         */
        this.shapesToCopy = [];
        /**
         * Array which contains a list of all the connections that were duplicated
         * (during copy)
         * @property {Array} [connectionsToCopy=[]]
         */
        this.connectionsToCopy = [];
        /**
         * Property that determines the permissions a user has over the canvas
         * @property {boolean} [readOnly=false]
         */
        this.readOnly = false;
        /**
         * Layer that prevents the canvas to be altered
         * @property {PMUI.draw.ReadOnlyLayer}
         */
        this.readOnlyLayer = null;
        /**
         * Object which holds references to the constructors of the classes
         * (so that a shape is easily created from the canvas)
         * @property {Object} [copyAndPasteReferences={}]
         */
        this.copyAndPasteReferences = {};
        /**
         * Previous zoom properties index
         * @property {number} [prevZoom=1]
         */
        this.prevZoom = 1;
        /**
         * Initializer for labels, so that jQuery can measure the width of a message
         * in the first time its created
         * @type {HTMLElement}
         */
        this.dummyLabelInitializer = null;
        Canvas.prototype.init.call(this, options);
    };

    PMUI.inheritFrom('PMUI.draw.BehavioralElement', Canvas);

    /**
     * Type of the instances
     * @property {String}
     */
    Canvas.prototype.type = "Canvas";
    /**
     * Family of the instances, this attribute must not be overridden
     * @property {String}
     * @readonly
     */
    Canvas.prototype.family = "Canvas";
    /**
     * Instance initializer which uses options to extend the config options to initialize the instance.
     * The following properties are instantiated in this method:
     *
     *      this.children = new PMUI.util.ArrayList();
     *      this.customShapes = new PMUI.util.ArrayList();
     *      this.regularShapes = new PMUI.util.ArrayList();
     *      this.connections = new PMUI.util.ArrayList();
     *      this.currentSelection = new PMUI.util.ArrayList();
     *      this.sharedConnections = new PMUI.util.ArrayList();
     *      this.commandStack = new PMUI.command.CommandStack(20);
     *      this.multipleSelectionHelper = new PMUI.draw.MultipleSelectionContainer(this);
     *      this.horizontalSnapper = new PMUI.draw.Snapper({orientation: 'horizontal', canvas: this});
     *      this.verticalSnapper = new PMUI.draw.Snapper({orientation: 'vertical', canvas: this});
     *
     * @param {Object} options The object that contains the config
     * @private
     */
    Canvas.prototype.init = function (options) {
        var canvasPosition,
            defaults;
        defaults = {
            x : 0,
            y : 0,
            width: 4000,
            height: 4000,
            copyAndPasteReferences: (options && options.copyAndPasteReferences) || {},
            readOnly : false
        };
        jQuery.extend(true, defaults, options);
        if (options) {
            this.children = new PMUI.util.ArrayList();
            this.customShapes = new PMUI.util.ArrayList();
            this.regularShapes = new PMUI.util.ArrayList();
            this.connections = new PMUI.util.ArrayList();
            this.currentSelection = new PMUI.util.ArrayList();
            this.sharedConnections = new PMUI.util.ArrayList();
            this.commandStack = new PMUI.command.CommandStack(20);
            this.multipleSelectionHelper = new PMUI.draw.MultipleSelectionContainer({
                canvas: this, 
                x: defaults.absoluteX, 
                y: defaults.absoluteY
            });
            this.copyAndPasteReferences = defaults.copyAndPasteReferences;
            this.setShapeFactory(defaults.shapeFactory);
            this.setPosition(defaults.x, defaults.y)
                .setDimension(defaults.width, defaults.height)
                .setCanvas(this);
            // create snappers
            this.horizontalSnapper = new PMUI.draw.Snapper({
                orientation: 'horizontal',
                canvas: this
            });
            this.verticalSnapper = new PMUI.draw.Snapper({
                orientation: 'vertical',
                canvas: this
            });

            if (defaults.absoluteX){
                this.absoluteX = defaults.absoluteX;
            } 
            if (defaults.absoluteY){
                this.absoluteY = defaults.absoluteY;
            }

            if (defaults.readOnly) {
                this.setToReadOnly();
            }
        }
    };

    /**
     * Overwrite createHTML method
     * @return {HTMLElement}
     */
    Canvas.prototype.createHTML = function () {
        Canvas.superclass.prototype.createHTML.call(this);
        this.addElement(this.multipleSelectionHelper, 0, 0, true);
        //this.html.appendChild(this.multipleSelectionHelper.getHTML());
        //this.html.appendChild(this.horizontalSnapper.getHTML());
        //this.html.appendChild(this.verticalSnapper.getHTML());
        //this.horizontalSnapper.enable();
        //this.verticalSnapper.enable();
        return this.html;
    };
    /**
     * Sets the read and write permissions of the canvas.
     * @param {boolean} readOnly Determines if the canvas will be set to read only
     * or if it will be editable
     * @chainable
     */
    Canvas.prototype.setReadOnly = function (readOnly) {
        if (readOnly) {
            this.setToReadOnly();
        } else {
            this.unsetReadOnly();
        }
        return this;
    };
    /**
     * Sets the canvas to readOnly mode by creating a ReadOnlyLayer instance and appending its html to
     * this html
     * @chainable
     */
    Canvas.prototype.setToReadOnly = function () {
        var readOnlyLayer = this.readOnlyLayer;
        if (readOnlyLayer && readOnlyLayer.html) {
            this.html.appendChild(this.readOnlyLayer.html);
        } else {
            this.readOnlyLayer = new PMUI.draw.ReadOnlyLayer({
                width : this.width,
                height : this.height
            });
            this.html.appendChild(this.readOnlyLayer.html);
        }
        this.readOnly = true;
        return this;
    };
    /**
     * Sets the canvas to read and write mode.
     * @chainable
     */
    Canvas.prototype.unsetReadOnly = function () {
        var readOnlyLayer = this.readOnlyLayer;
        this.html.removeChild(readOnlyLayer.getHTML());
        this.readOnly = false;
        return this;
    };
    /**
     * Sets the position of the canvas.
     * @param {number} x x coordinate relative to where the canvas is contained
     * @param {number} y y coordinate relative to where the canvas is contained
     * @chainable
     */
    Canvas.prototype.setPosition = function (x, y) {
        this.setX(x);
        this.setY(y);
        return this;
    };
    /**
     * Sets the x coordinate of the canvas, its zoomX and absoluteX to an equal value.
     * @param {number} newX new x coordinate to be applied in the canvas
     * @chainable
     */
    Canvas.prototype.setX = function (newX) {
        this.x = this.zoomX = newX;
        this.absoluteX = 0;
        return this;
    };
    /**
     * Set the y coordinate of the canvas, its zoomY and absoluteY to an equal value
     * @param {number} newY new y coordinate to be applied in the canvas
     * @chainable
     */
    Canvas.prototype.setY = function (newY) {
        this.y = this.zoomY = newY;
        this.absoluteY = 0;
        return this;
    };
    /**
     * Retrieves the div element that has this canvas id
     * @return {HTMLElement}
     */
    Canvas.prototype.createHTMLDiv = function () {
        return document.getElementById(this.id);
    };
    /**
     * Default shape factory for creating shapes.
     * @param {String} id
     * @return {PMUI.draw.CustomShape}
     * @template
     */
    Canvas.prototype.shapeFactory = function (id) {
        var customShape = null;
        return customShape;
    };
    /**
    * Identifies the family of the shape (which might be *"CustomShape"* or *"RegularShape"*)
    * and adds `shape` to either `this.customShapes` or `this.regularShapes`.
    * @param {PMUI.draw.Shape} shape
    * @chainable
    */
    Canvas.prototype.addToList = function (shape) {
        switch (shape.family) {
        case "CustomShape":
            if (!this.customShapes.contains(shape)) {
                this.customShapes.insert(shape);
            }
            break;
        case "RegularShape":
            if (!this.regularShapes.contains(shape)) {
                this.regularShapes.insert(shape);
            }
            break;
        default:
        }
        return this;
    };
    /**
     * Hides `this.currentConnection` if there is one.
     * @chainable
     */
    Canvas.prototype.hideCurrentConnection = function () {
        // hide the current connection if there was one
        if (this.currentConnection) {
            this.currentConnection.hidePortsAndHandlers();
            this.currentConnection = null;
        }
        return this;
    };
    /**
     * Applies a zoom scale to the canvas and all its elements
     * @param {number} scale numbered from 1 to n
     * @chainable
     */
    Canvas.prototype.applyZoom = function (scale) {
        // TODO Implement Zoom Constants in utils
        var i,
            shape;
        if (scale > 0) {
            scale -= 1;
            this.prevZoom = this.zoomPropertiesIndex;
            this.zoomPropertiesIndex = scale;
            this.zoomFactor = (scale * 25 + 50) / 100;
        }
        for (i = 0; i < this.customShapes.getSize(); i += 1) {
            shape = this.customShapes.get(i);
            shape.applyZoom();
            shape.paint();
        }
        for (i = 0; i < this.regularShapes.getSize(); i += 1) {
            shape = this.regularShapes.get(i);
            shape.applyZoom();
            shape.paint();
        }
        return this;
    };
    /**
     * Adds a connection to the canvas, appending its html to the DOM and inserting
     * it in the list of connections
     * @param {PMUI.draw.Connection} conn
     * @chainable
     */
    Canvas.prototype.addConnection = function (conn) {
        this.html.appendChild(conn.getHTML());
        this.connections.insert(conn);
        this.updatedElement = conn;
    //    $(this.html).trigger("createelement");
        return this;
    };
    /**
     * Remove all selected elements, it destroy the shapes and all references to them.
     * @chainable
     */
    Canvas.prototype.removeElements = function () {
        // destroy the shapes (also destroy all the references to them)
        var shape,
            command;
        command = new PMUI.command.CommandDelete(this);
        this.commandStack.add(command);
        command.execute();
    //    while (this.getCurrentSelection().getSize() > 0) {
    //        shape = this.getCurrentSelection().getFirst();
    //        shape.destroy();
    //    }
    //
    //    // destroy the currentConnection (also destroy all the references to it)
    //    if (this.currentConnection) {
    //        this.currentConnection.destroy();
    //        this.currentConnection = null;
    //    }
    //    DEBUG
    //    console.log("CurrentSelection: " + canvas.getCurrentSelection().getSize());
    //    console.log("CustomShapes: " + canvas.getCustomShapes().getSize());
    //    console.log("RegularShapes: " + canvas.getRegularShapes().getSize());
    //    console.log("Connections: " + canvas.getConnections().getSize());
        return this;
    };
    /**
     * Moves all the connections of the children of this shape (shape was moved using the cursors but the children
     * connections don't know that so move those connections), this method is called from #moveElements.
     * @param {PMUI.draw.Shape} shape
     * @chainable
     */
    Canvas.prototype.moveAllChildConnections = function (shape) {
        var i,
            child,
            j,
            port;
        if (shape.child !== null) {
            for (i = 0; i < shape.children.getSize(); i += 1) {
                child = shape.children.get(i);
                child.setPosition(child.x, child.y);
                for (j = 0; j < child.getPorts().getSize(); j += 1) {
                    port = child.getPorts().get(j);
                    port.setPosition(port.x, port.y);
                    port.connection.disconnect();
                    //alert('disconnected');
                    port.connection.connect();
                }
                this.moveAllChildConnections(child);
            }
        }
        return this;
    };
    /**
     * Move all selected elements in one direction, used mainly for keyboard events
     * @param {PMUI.draw.Canvas} canvas
     * @param {string} direction The direction to move the shapes to
     * @param {Function} [hook] Hook used to determine which shapes can be moved with the keyboard,
     * the function must receive a shape as its parameter and return true if the shape can be moved, false
     * otherwise (if this function is not defined then it's assumed that all shapes are valid
     * to be moved).
     *      // e.g.
     *      hook = function(shape) {
     *          return shape.isValidToMove();
     *      }
     *
     * @chainable
     */
    Canvas.prototype.moveElements = function (canvas, direction, hook) {
        var i, j,
            shape,
            hfactor = 0,
            vfactor = 0,
            port,
            currentSelection = [],
            canMove;
        switch (direction) {
        case 'LEFT':
            hfactor = -1;
            break;
        case 'RIGHT':
            hfactor = 1;
            break;
        case 'TOP':
            vfactor = -1;
            break;
        case 'BOTTOM':
            vfactor = 1;
            break;
        }
        for (i = 0; i < canvas.getCurrentSelection().getSize(); i += 1) {
            canMove = true;
            shape = canvas.getCurrentSelection().get(i);
            currentSelection.push(shape);
            if (hook && typeof hook === "function" && !hook(shape)) {
                canMove = false;
            }
            if (canMove) {
                shape.oldX = shape.x;
                shape.oldY = shape.y;
                shape.oldAbsoluteX = shape.absoluteX;
                shape.oldAbsoluteY = shape.absoluteY;
                shape.setPosition(shape.getX() + hfactor, shape.getY() + vfactor);
                shape.changePosition(shape.oldX, shape.oldY, shape.oldAbsoluteX,
                    shape.oldAbsoluteY);
                for (j = 0; j < shape.ports.getSize(); j += 1) {
                    //for each port update its absolute position and repaint its
                    // connection
                    port = shape.ports.get(j);
                    port.setPosition(port.x, port.y);
                    port.connection.disconnect().connect();
        //            this.intersectionTimeout = null;
                }
                this.moveAllChildConnections(shape);
            }
        }
        clearTimeout(this.intersectionTimeout);
        this.intersectionTimeout = window.setTimeout(function (currentSelection) {
            var stack = [],
                selection = currentSelection || [];
            for (i = 0; i < selection.length; i += 1) {
                shape = selection[i];
                stack.push(shape);
            }
            while (stack.length > 0) {
                shape = stack.pop();
                // add the children to the stack
                for (i = 0; i < shape.getChildren().getSize(); i += 1) {
                    stack.push(shape.getChildren().get(i));
                }
                for (j = 0; j < shape.ports.getSize(); j += 1) {
                    //for each port update its absolute position and repaint its
                    // connection
                    port = shape.ports.get(j);
                    port.connection.disconnect().connect();
                    port.connection.setSegmentMoveHandlers();
                    port.connection.checkAndCreateIntersectionsWithAll();
                }
            }
        }, 1000, currentSelection);
        return this;
    };
    /**
     * Removes `shape` from the its corresponding list in the canvas (the shape has a reference either in
     * `this.customShapes` or `this.regularShapes`).
     * @param {PMUI.draw.Shape} shape
     * @chainable
     */
    Canvas.prototype.removeFromList = function (shape) {
        // remove from the current selection
        this.currentSelection.remove(shape);
        if (shape.family === "CustomShape") {
            this.customShapes.remove(shape);
        } else if (shape.family === "RegularShape") {
            this.regularShapes.remove(shape);
        }
        return this;
    };
    /**
     * Fixes the data of the snappers recreating the arrays and sorting them,
     * this method is called from {@link PMUI.behavior.RegularDragBehavior#onDragStart} (it might
     * be an overrided method `onDragStart` if the instance of {@link PMUI.behavior.RegularDragBehavior} was changed).
     * @chainable
     */
    Canvas.prototype.fixSnapData = function () {
        this.horizontalSnapper.createSnapData();
        this.verticalSnapper.createSnapData();
        this.horizontalSnapper.sortData();
        this.verticalSnapper.sortData();
        return this;
    };
    /**
     * Shows or hides the snappers according to this criteria:
     *
     * - To show the vertical snapper
     *      - `shape.absoluteX` must equal a value in the data of `this.verticalSnapper`
     *      - `shape.absoluteX + shape.width` must equal a value in the data of `this.verticalSnapper`
     *
     * - To show the horizontal snapper
     *      - `shape.absoluteY` must equal a value in the data of `this.horizontalSnapper`
     *      - `shape.absoluteY + shape.height` must equal a value in the data of `this.horizontalSnapper`
     *
     * @param {PMUI.draw.Shape} shape
     * @chainable
     */
    Canvas.prototype.showOrHideSnappers = function (shape) {
        var hSnapper = this.horizontalSnapper,
            vSnapper = this.verticalSnapper,
            x = shape.getAbsoluteX(),
            y = shape.getAbsoluteY(),
            width = shape.getZoomHeight(),
            height = shape.getZoomHeight();
        if (hSnapper.binarySearch(y)) {
            hSnapper.setPosition(
                this.getLeftScroll() / this.zoomFactor,
                y / this.zoomFactor
            );
            hSnapper.show();
        } else if (hSnapper.binarySearch(y + height)) {
            hSnapper.setPosition(
                this.getLeftScroll() / this.zoomFactor,
                (y + height) / this.zoomFactor
            );
            hSnapper.show();
        } else {
            hSnapper.hide();
        }
        if (vSnapper.binarySearch(x)) {
            vSnapper.setPosition(
                x / this.zoomFactor,
                this.getTopScroll() / this.zoomFactor
            );
            vSnapper.show();
        } else if (vSnapper.binarySearch(x + width)) {
            vSnapper.setPosition(
                (x + width) / this.zoomFactor,
                this.getTopScroll() / this.zoomFactor
            );
            vSnapper.show();
        } else {
            vSnapper.hide();
        }
        return this;
    };
    /**
     * Empties `this.currentSelection` arrayList, thus hiding the resize handlers
     * of each shape that was in it, it also clears `this.sharedConnections` array
     * (there's a direct relationship between them).
     * @chainable
     */
    Canvas.prototype.emptyCurrentSelection = function () {
        var i,
            shape;
        while (this.currentSelection.getSize() > 0) {
            shape = this.currentSelection.get(0);
            this.removeFromSelection(shape);
        }
        // also clear the sharedConnections
        this.sharedConnections.clear();
        return this;
    };
    /**
     * Determines if it's possible to select `newShape` using `referenceShape` as a reference (`newShape` is a valid
     * shape to be added to the selection if it has the same parent as `referenceShape`).
     * @param {PMUI.draw.Shape} referenceShape shape which parent will be taken as reference
     * @param {PMUI.draw.Shape} newShape new selected shape
     * @return {boolean}
     */
    Canvas.prototype.isValidSelection = function (referenceShape, newShape) {
        if (referenceShape.parent === null) {
            return newShape.parent === null;
        }
        if (newShape.parent === null) {
            return false;
        }
        return newShape.parent.id === referenceShape.parent.id;
    };
    /**
     * Adds `shape` to `this.currentSelection` if it meets one of the following rules:
     *
     * - If `this.currentSelection` is empty then add it to the arrayList
     * - If `this.currentSelection` is not empty then check if this candidate shape
     *      has the same parent as any element in `this.currentSelection`, if so then add it to
     *      the arrayList.
     *
     * This method also shows the resize handlers of the shape and adds its connections
     * to `this.sharedConnections` if possible.
     * @param {PMUI.draw.Shape} shape
     * @chainable
     */
    Canvas.prototype.addToSelection = function (shape) {
        var currentSelection = this.currentSelection,
            firstSelected,
            valid,
            isEmpty = currentSelection.isEmpty();
        if (!isEmpty) {
            firstSelected = currentSelection.get(0);
            valid = this.isValidSelection(firstSelected, shape);
        } else {
            valid = true;
        }
        if (!currentSelection.contains(shape) && valid) {
            // increase this shape zIndex
            shape.increaseZIndex();
            currentSelection.insert(shape);
            // add the connections from this shape that are connected
            // to another shape in the currentSelection to the
            // canvas sharedConnections array
            // NOTE: the shape is passed as an argument but its
            // connections are stored
            if (shape.family === "CustomShape") {
                this.addToSharedConnections(shape);
            }
    //        console.log("currentSelection: " + this.currentSelection.getSize());
    //        console.log("shared connections: " + this.sharedConnections.getSize());
            shape.selected = true;
            shape.showOrHideResizeHandlers(true);
        }
        return this;
    };
    /**
     * Removes `shape` from `this.currentSelection` (also hiding its resize handlers).
     * @param {PMUI.draw.Shape} shape
     * @chainable
     */
    Canvas.prototype.removeFromSelection = function (shape) {
        shape.decreaseZIndex();
        this.removeFromSharedConnections(shape);
        this.currentSelection.remove(shape);
        shape.selected = false;
        shape.showOrHideResizeHandlers(false);
        return this;
    };
    /**
     * Removes all the shared connections between `customShape` and every shape
     * found in `this.currentSelection`, also the connections inside `customShape` are removed from
     * `this.sharedConnections` array.
     * @param {PMUI.draw.CustomShape} customShape
     * @chainable
     */
    Canvas.prototype.removeFromSharedConnections = function (customShape) {
        var i,
            child,
            connection,
            sharedConnections = this.sharedConnections;
        for (i = 0; i < customShape.getChildren().getSize(); i += 1) {
            child = customShape.getChildren().get(i);
            this.removeFromSharedConnections(child);
        }
        if (customShape.ports) {
            for (i = 0; i < customShape.ports.getSize(); i += 1) {
                connection = customShape.ports.get(i).connection;
                if (sharedConnections.find('id', connection.getID())) {
                    this.sharedConnections.remove(connection);
                }
            }
        }
        return this;
    };
    /**
     * Checks if an ancestor of `shape` is in `this.currentSelection`.
     * @return {boolean}
     */
    Canvas.prototype.findAncestorInCurrentSelection = function (shape) {
        if (this.currentSelection.find('id', shape.getID())) {
            return true;
        }
        if (!shape.parent) {
            return false;
        }
        return this.findAncestorInCurrentSelection(shape.parent);
    };
    /**
     * Adds all the connections between `customShape` and another shape in the
     * currentSelection to the `sharedConnections` arrayList, also the connections inside
     * `customShape` are added to `this.sharedConnections` array.
     * @param {PMUI.draw.CustomShape} customShape
     * @chainable
     */
    Canvas.prototype.addToSharedConnections = function (customShape) {
        var i,
            child,
            connection,
            sourceShape,
            destShape,
            sharedConnections = this.sharedConnections;
        for (i = 0; i < customShape.getChildren().getSize(); i += 1) {
            child = customShape.getChildren().get(i);
            this.addToSharedConnections(child);
        }
        if (customShape.ports) {
            for (i = 0; i < customShape.ports.getSize(); i += 1) {
                connection = customShape.ports.get(i).connection;
                sourceShape = connection.srcPort.parent;
                destShape = connection.destPort.parent;
    //            console.log(sourceShape);
    //            console.log(destShape);
                if (this.findAncestorInCurrentSelection(sourceShape) &&
                        this.findAncestorInCurrentSelection(destShape) &&
                        !sharedConnections.find('id', connection.getID())) {
                    sharedConnections.insert(connection);
                }
            }
        }
        return this;
    };
    /**
     * Removes a connection from `this.connections`.
     * @param {PMUI.draw.Connection} conn
     * @chainable
     */
    Canvas.prototype.removeConnection = function (conn) {
        //this.currentSelection.remove(conn);
        this.connections.remove(conn);
        return this;
    };
    /**
     * Attaches event listeners to this canvas, it also creates some custom triggers
     * used to save the data (to send it to the database later).
     *
     * The events attached to this canvas are:
     *
     * - {@link PMUI.draw.Canvas#event-mousedown Mouse down event}
     * - {@link PMUI.draw.Canvas#event-mousemove Mouse move event}
     * - {@link PMUI.draw.Canvas#event-mouseup Mouse up event}
     * - {@link PMUI.draw.Canvas#event-click Click event}
     * - {@link PMUI.draw.Canvas#event-scroll Scroll event}
     *
     * The custom events are:
     *
     * - {@link PMUI.draw.Canvas#event-createelement Create element event}
     * - {@link PMUI.draw.Canvas#event-removeelement Remove element event}
     * - {@link PMUI.draw.Canvas#event-changeelement Change element event}
     * - {@link PMUI.draw.Canvas#event-selectelement Select element event}
     * - {@link PMUI.draw.Canvas#event-rightclick Right click event}
     *
     * This method also initializes jQueryUI's droppable plugin (instantiated as `this.dropBehavior`)
     * @chainable
     */
    Canvas.prototype.attachListeners = function () {
        var $canvas = $(this.html).click(this.onClick(this)),
            $canvasContainer = $canvas.parent();
        $canvas.mousedown(this.onMouseDown(this));
        $canvasContainer.scroll(this.onScroll(this, $canvasContainer));
        $canvas.mousemove(this.onMouseMove(this));
        $canvas.mouseup(this.onMouseUp(this));
        $canvas.on("createelement", this.onCreateElement(this));
        $canvas.on("removeelement", this.onRemoveElement(this));
        $canvas.on("changeelement", this.onChangeElement(this));
        $canvas.on("selectelement", this.onSelectElement(this));
        $canvas.on("rightclick", this.onRightClick(this));
        $canvas.on("contextmenu", function (e) {
            e.preventDefault();
        });
        this.updateBehaviors();
        return this;
    };
    /**
     * This is a hook that will be executed after an element has been created in
     * the canvas.
     * This hook will be executed every time a shape, a connection, or an
     * independent label is created.
     * @param {Object} updatedElement
     * @param {string} [updatedElement.id] ID of the updated element
     * @param {string} [updatedElement.type] Type of the updated element
     * @param {PMUI.draw.Shape} [updatedElement.relatedObject] The updated element
     * @param {Array} [updatedElement.relatedElements] An array with all the other elements created
     *  e.g. When executing {@link PMUI.command.CommandDelete#undo CommandDelete.undo()}, multiple elements are created
     *  at once, so this property will contain all those shapes.
     * @template
     * @protected
     */
    Canvas.prototype.onCreateElementHandler = function (updatedElement) {
    };
    /**
     * @event createelement
     * Handler for the custom event createelement, this event fires when an element
     * has been created. It executes the hook #onCreateElementHandler
     * @param {PMUI.draw.Canvas} canvas
     */
    Canvas.prototype.onCreateElement = function (canvas) {
        return function (e, ui) {
            canvas.onCreateElementHandler(canvas.updatedElement);
        };
    };
    /**
     * This is a hook that will be executed after an element has been deleted in
     * the canvas.
     * This hook will be executed every time a shape, a connection, or an
     * independent label is deleted
     * @param {Object} updatedElement
     * @param {string} [updatedElement.id] ID of the removed element
     * @param {string} [updatedElement.type] Type of the removed element
     * @param {PMUI.draw.Shape} [updatedElement.relatedObject] The removed element
     * @param {Array} [updatedElement.relatedElements] An array with all the other elements removed
     *  e.g. When executing {@link PMUI.command.CommandDelete#execute PMUI.command.CommandDelete.execute()},
      multiple elements are created
     *  at once, so this property will contain all those shapes.
     * @template
     * @protected
     */
    Canvas.prototype.onRemoveElementHandler = function (updatedElement) {
        return true;
    };
    /**
     * @event removeelement
     * Handler for the custom event removeelement, this event fires when an element
     * has been deleted. It executes the hook #onRemoveElementHandler
     * @param {PMUI.draw.Canvas} canvas
     */
    Canvas.prototype.onRemoveElement = function (canvas) {
        return function (e, ui) {
            canvas.onRemoveElementHandler(canvas.updatedElement.relatedElements);
        };
    };
    /**
     * This is a hook that will be executed after an element has been changed in
     * the canvas.
     * This hook will be executed every time a shape, a connection, or an
     * independent label is changed.
     * `arguments[0]` is an array with all the elements that were updated,
     * the structure of each element of the array is described below:
     *
     *      {
     *          id: #,      // the id of the updated element
     *          type: #     // the type of the updated element
     *          fields: [
     *              {
     *                  field: #        // the field that was updated in this element
     *                  oldVal: #       // the old value of this shape
     *                  newVal: #       // the new value of this shape
     *              },
     *              ...
     *          ]
     *      }
     *
     * @param {Array} updatedElements Array with all the elements that were updated.
     * @template
     * @protected
     */
    Canvas.prototype.onChangeElementHandler = function (updatedElements) {
    };
    /**
     * @event changeelement
     * Handler for the custom event changeeelement, this event fires when an element
     * has been changed. It executes the hook #onChangeElementHandler
     * @param {PMUI.draw.Canvas} canvas
     */
    Canvas.prototype.onChangeElement = function (canvas) {
        return function (e, ui) {
            canvas.onChangeElementHandler(canvas.updatedElement);
        };
    };
    /**
     * This is a hook that will be executed after an element has been selected in
     * the canvas.
     * This hook will be executed every time a shape, a connection, or an
     * independent label is selected
     * `arguments[0]` is an array with all the elements that were selected,
     * the structure of each element of the array is described below:
     *
     *      {
     *          id: #,              // the id of the selected element
     *          type: #             // the type of the selected element
     *          relatedObject       // the selected element
     *      }
     * @param {Array} updatedElements Array with the selected elements
     * @protected
     * @template
     */
    Canvas.prototype.onSelectElementHandler = function (updatedElements) {
    };
    /**
     * @event selectelement
     * Handler for the custom event selectelement, this event fires when an element
     * has been selected. It executes the hook #onSelectElementHandler
     * @param {PMUI.draw.Canvas} canvas
     */
    Canvas.prototype.onSelectElement = function (canvas) {
        return function (e, ui) {
            canvas.onSelectElementHandler(canvas.updatedElement);
        };
    };
    /**
     * This is a hook that will be executed after an element has been right clicked
     * in the canvas or the canvas's been right clicked itself.
     * This hook will be executed every time a shape, a connection, an
     * independent label or the canvas is right clicked
     * @param {Object} updatedElement Reference to the last element that was
     * right clicked in the canvas
     * @param {Object} points x coordinate where the mouse was pressed
     * @template
     * @protected
     */
    Canvas.prototype.onRightClickHandler = function (updatedElement, points) {
    };
    /**
     * @event rightclick
     * Handler for the custom event rightclick, this event fires when an element
     * has been right clicked. It executes the hook #onRightClickHandler
     * @param {PMUI.draw.Canvas} canvas
     */
    Canvas.prototype.onRightClick = function (canvas) {
        return function (event, e, element) {
            var realPoint = canvas.relativePoint(e);
            canvas.updatedElement = element;
            canvas.onRightClickHandler(canvas.updatedElement, {
                canvas: realPoint,
                page: {
                    x: e.pageX,
                    y: e.pageY
                }
            });
        };
    };
    /**
     * @event click
     * Click event handler, which makes `this.currentLabel` lose its focus.
     * @param {PMUI.draw.Canvas} canvas
     */
    Canvas.prototype.onClick = function (canvas) {
        return function (e, ui) {
            var currentLabel = canvas.currentLabel;
            //console.log('current:'+ current);
            if (currentLabel) {
                currentLabel.loseFocus();
                $(currentLabel.textField).focusout();
            }
        };
    };
    /**
     * @event mousedown
     * MouseDown Handler of the canvas. It does the following:
     *
     * - Trigger the {@link PMUI.draw.Canvas#event-rightclick Right Click event} if it detects a right click
     * - Empties `canvas.currentSelection`
     * - Hides `canvas.currentConnection` if there's one
     * - Resets the position of `canvas.multipleSelectionContainer` making it visible and setting its
     *      `[x, y]` to the point where the user did mouse down in the `canvas`.
     *
     * @param {PMUI.draw.Canvas} canvas
     */
    Canvas.prototype.onMouseDown = function (canvas) {
        return function (e, ui) {
            var realPoint = canvas.relativePoint(e),
                    x = realPoint.x,
                    y = realPoint.y;
            e.preventDefault();
            if (e.which === 3) {
                canvas.rightClick = true;
                $(canvas.html).trigger("rightclick", [e, canvas]);
            }
            canvas.isMouseDown = true;
            canvas.isMouseDownAndMove = false;
            // do not create the rectangle selection if a segment handler
            // is being dragged
            if (canvas.draggingASegmentHandler) {
                return;
            }
            // clear old selection
            canvas.emptyCurrentSelection();
            // hide the currentConnection if there's one
            canvas.hideCurrentConnection();
            canvas.multipleSelectionHelper.reset();
            canvas.multipleSelectionHelper.setPosition(x / canvas.zoomFactor,
                    y / canvas.zoomFactor);
            canvas.multipleSelectionHelper.oldX = x;
            canvas.multipleSelectionHelper.oldY = y;
            canvas.multipleSelectionHelper.setVisible(true);
            canvas.multipleSelectionHelper.changeOpacity(0.2);
    //        console.log("canvas down");
        };
    };
    /**
     * @event mousemove
     * MouseMove handler of the canvas, it does the following:
     *
     * - Updates the position and dimension of `canvas.multipleSelectionContainer`
     *
     * @param {PMUI.draw.Canvas} canvas
     */
    Canvas.prototype.onMouseMove = function (canvas) {
        return function (e, ui) {
            if (canvas.isMouseDown && !canvas.rightClick) {
                canvas.isMouseDownAndMove = true;
                var realPoint = canvas.relativePoint(e),
                    x = realPoint.x,
                    y = realPoint.y,
                    topLeftX,
                    topLeftY,
                    bottomRightX,
                    bottomRightY;
                topLeftX = Math.min(x, canvas.multipleSelectionHelper.oldX);
                topLeftY = Math.min(y, canvas.multipleSelectionHelper.oldY);
                bottomRightX = Math.max(x, canvas.multipleSelectionHelper.oldX);
                bottomRightY = Math.max(y, canvas.multipleSelectionHelper.oldY);
                canvas.multipleSelectionHelper.setPosition(
                    topLeftX / canvas.zoomFactor,
                    topLeftY / canvas.zoomFactor
                );
                canvas.multipleSelectionHelper.setDimension(
                    (bottomRightX - topLeftX) / canvas.zoomFactor,
                    (bottomRightY - topLeftY) / canvas.zoomFactor
                );
            }
    //        console.log("canvas move");
        };
    };
    /**
     * @event mouseup
     * MouseUp handler of the canvas. It does the following:
     *
     * - Wraps the elements that are inside `canvas.multipleSelectionContainer`
     * - Resets the state of `canvas.multipleSelectionContainer` 
     (see {@link PMUI.draw.MultipleSelectionContainer#reset})
     *
     * @param {PMUI.draw.Canvas} canvas
     */
    Canvas.prototype.onMouseUp = function (canvas) {
        return function (e, ui) {
            if (canvas.isMouseDownAndMove) {
                var realPoint = canvas.relativePoint(e),
                    x = realPoint.x,
                    y = realPoint.y;
                canvas.multipleSelectionHelper.setPosition(
                    Math.min(x, canvas.multipleSelectionHelper.zoomX) / canvas.zoomFactor,
                    Math.min(y, canvas.multipleSelectionHelper.zoomY) / canvas.zoomFactor
                );
                if (canvas.multipleSelectionHelper) {
                    canvas.multipleSelectionHelper.wrapElements();
                }
            } else {
                //canvas.setCurrentShape(null);
                //hideSelectedPorts(canvas);
                if (!canvas.multipleSelectionHelper.wasDragged) {
                    canvas.multipleSelectionHelper.reset().setVisible(false);
                }
            }
            canvas.isMouseDown = false;
            canvas.isMouseDownAndMove = false;
            canvas.rightClick = false;
    //        console.log("canvas up");
        };
    };
    /**
     * @event scroll
     * Handler for scrolling, sets the scroll values to the canvas
     * @param {PMUI.draw.Canvas} canvas
     * @param {Object} $canvasContainer jQuery element that is the container of the `canvas`
     */
    Canvas.prototype.onScroll = function (canvas, $canvasContainer) {
        return function (e, ui) {
            canvas.setLeftScroll($canvasContainer.scrollLeft())
                .setTopScroll($canvasContainer.scrollTop());
        };
    };
    /**
     * Fires the {@link PMUI.draw.Canvas#event-selectelement} event, 
     and elaborates the structure of the object that will
     * be passed to the handlers.
     * @param {Array} selection The `currentSelection` ArrayList of some canvas
     * @chainable
     */
    Canvas.prototype.triggerSelectEvent = function (selection) {
        var i,
            elements = [],
            current;
        for (i = 0; i < selection.length; i += 1) {
            current = selection[i];
            elements.push({
                id : current.id,
                type : current.type,
                relatedObject : current
            });
        }
        this.updatedElement = elements;
        $(this.html).trigger('selectelement');
        return this;
    };
    /**
     * Fires the {@link PMUI.draw.Canvas#event-rightclick} event and elaborates the structure
     * of the object that will be passed to the event.
     * @param {PMUI.draw.CustomShape} element The object that's been right clicked on.
     * @chainable
     */
    Canvas.prototype.triggerRightClickEvent = function (element) {
        this.updatedElement = {
            id : element.id,
            type : element.type,
            relatedObject : element
        };
        $(this.html).trigger('rightclick');
        return this;
    };
    /**
     * Fires the {@link PMUI.draw.Canvas#event-createelement} 
     event, and elaborates the structure of the object that will
     * be passed to the handlers.
     * @param {Object} shape The shape created
     * @param {Array} relatedElements The array with the other elements created
     * @chainable
     */
    Canvas.prototype.triggerCreateEvent = function (shape, relatedElements) {
        this.updatedElement = {
            id : (shape && shape.id) || null,
            type : (shape && shape.type) || null,
            relatedObject : shape,
            relatedElements: relatedElements
        };
        $(this.html).trigger('createelement');
        return this;
    };
    /**
     * Fires the {@link PMUI.draw.Canvas#event-removeelement} event, 
     and elaborates the structure of the object that will
     * be passed to the handlers.
     * @param {PMUI.draw.CustomShape} shape The shape created
     * @param {Array} relatedElements The array with the other elements created
     * @chainable
     */
    Canvas.prototype.triggerRemoveEvent = function (shape, relatedElements) {
        this.updatedElement = {
            id : (shape && shape.id) || null,
            type : (shape && shape.type) || null,
            relatedObject: shape,
            relatedElements : relatedElements
        };
        $(this.html).trigger('removeelement');
        return this;
    };

    /**
     * Fires the {@link PMUI.draw.Canvas#event-changeelement} event, 
     and elaborates the structure of the object that will
     * be passed to the handlers, the structure contains the following 
     fields (considering old values and new values):
     *
     * - width
     * - height
     *
     * @param {PMUI.draw.CustomShape} shape The shape that updated its dimension
     * @param {number} oldWidth The old width of `shape`
     * @param {number} oldHeight The old height of `shape`
     * @param {number} newWidth The new width of `shape`
     * @param {number} newHeight The old height of `shape`
     * @chainable
     */
    Canvas.prototype.triggerDimensionChangeEvent = function (shape, oldWidth,
                oldHeight, newWidth, newHeight) {
        this.updatedElement = [{
            id : shape.id,
            type : shape.type,
            fields : [
                {
                    field : "width",
                    oldVal : oldWidth,
                    newVal : newWidth
                },
                {
                    field : "height",
                    oldVal : oldHeight,
                    newVal : newHeight
                }
            ],
            relatedObject: shape
        }];
        $(this.html).trigger('changeelement');
        return this;
    };

    /**
     * Fires the {@link PMUI.draw.Canvas#event-changeelement} event, 
     and elaborates the structure of the object that will
     * be passed to the handlers, the structure contains the following fields 
     (considering old values and new values):
     *
     * - x
     * - y
     * - parent (the shape that is parent of this shape)
     * - state (of the connection)
     *
     * @param {PMUI.draw.Port} port The port updated
     * @chainable
     */
    Canvas.prototype.triggerPortChangeEvent = function (port) {
        this.updatedElement = [{
            id: port.getID(),
            type: port.type,
            fields: [
                {
                    field: 'x',
                    oldVal: port.getOldX(),
                    newVal: port.getX()
                },
                {
                    field: 'y',
                    oldVal: port.getOldY(),
                    newVal: port.getY()
                },
                {
                    field: 'parent',
                    oldVal: port.getOldParent().getID(),
                    newVal: port.getParent().getID()
                },
                {
                    field: 'state',
                    oldVal: port.connection.getOldPoints(),
                    newVal: port.connection.savePoints() &&
                        port.connection.getPoints()
                }
            ],
            relatedObject: port
        }];

        console.log('port change!');
        $(this.html).trigger('changeelement');
        return this;
    };

    /**
     * Fires the {@link PMUI.draw.Canvas#event-changeelement} event, 
     and elaborates the structure of the object that will
     * be passed to the handlers, the structure contains the following 
     fields (considering old values and new values):
     *
     * - state (of the connection)
     *
     * @param {PMUI.draw.Connection} connection The connection updated
     * @chainable
     */
    Canvas.prototype.triggerConnectionStateChangeEvent = function (connection) {
        var points = [],
            Point = PMUI.util.Point,
            point,
            i;
        connection.savePoints();
        for (i = 0; i < connection.points.length; i += 1) {
            point = connection.points[i];
            points.push(new Point(point.x / this.zoomFactor, point.y / this.zoomFactor));
        }
        this.updatedElement = [{
            id: connection.getID(),
            type: connection.type,
            fields: [
                {
                    field: 'state',
                    oldVal: connection.getOldPoints(),
                    newVal: points
                }
            ],
            relatedObject: connection
        }];

        //console.log('connection state change!');
        $(this.html).trigger('changeelement');
        return this;
    };

    /**
     * Fires the {@link PMUI.draw.Canvas#event-changeelement} event, 
     and elaborates the structure of the object that will
     * be passed to the handlers, the structure contains the following 
     fields (considering old values and new values):
     *
     * - x
     * - y
     *
     * @param {Array} shapes The shapes that were updated
     * @param {Array} before The state of the shapes before they were repositioned
     * @param {Array} after The state of the shapes after they were repositioned
     * @chainable
     */
    Canvas.prototype.triggerPositionChangeEvent = function (shapes, before, after) {
        var i,
            elements = [];
        for (i = 0; i < shapes.length; i += 1) {
            elements.push({
                id : shapes[i].getID(),
                type : shapes[i].type,
                fields : [
                    {
                        field : "x",
                        oldVal : before[i].x,
                        newVal : after[i].x
                    },
                    {
                        field : "y",
                        oldVal : before[i].y,
                        newVal : after[i].y
                    }
                ],
                relatedObject: shapes[i]
            });
        }
        this.updatedElement = elements;
        $(this.html).trigger('changeelement');
        return this;
    };
    /**
     * Fires the {@link PMUI.draw.Canvas#event-changeelement} event, 
     and elaborates the structure of the object that will
     * be passed to the handlers, the structure contains the following 
     fields (considering old values and new values):
     *
     * - message
     *
     * @param {PMUI.draw.CustomShape} element The shape that updated one of ots labels
     * @param {string} oldText The old text of the label
     * @param {string} newText The new text of the label
     * @chainable
     */
    Canvas.prototype.triggerTextChangeEvent = function (element, oldText, newText) {
        this.updatedElement = [{
            id : element.id,
            type : element.type,
            parent : element.parent,
            fields : [
                {
                    field : "message",
                    oldVal : oldText,
                    newVal : newText
                }
            ],
            relatedObject: element
        }];
        $(this.html).trigger('changeelement');
        return this;
    };/**
     * Fires the {@link PMUI.draw.Canvas#event-changeelement} event, 
     and elaborates the structure of the object that will
     * be passed to the handlers, the structure contains the following 
     fields (considering old values and new values):
     *
     * - parent
     * - x
     * - y
     *
     * @param {Array} shapes The shapes that were updated
     * @param {Array} before The state of the shapes before they were repositioned
     * @param {Array} after The state of the shapes after they were repositioned
     * @chainable
     */
    Canvas.prototype.triggerParentChangeEvent = function (shapes, before, after) {

        var i,
            elements = [];
        for (i = 0; i < shapes.length; i += 1) {
            elements.push({
                id : shapes[i].getID(),
                type : shapes[i].type,
                fields : [
                    {
                        field : "parent",
                        oldParent: before[i].parent,
                        newVal : after[i].parent

                    },
                    {
                        field : "x",
                        oldVal : before[i].x,
                        newVal : after[i].x
                    },
                    {
                        field : "y",
                        oldVal : before[i].y,
                        newVal : after[i].y
                    }
                ],
                relatedObject : shapes[i]
            });
        }

        this.updatedElement = elements;
        $(this.html).trigger('changeelement');
        return this;
    };

    /**
     * Sets the top scroll of this canvas.
     * @param {number} newScroll
     * @chainable
     */
    Canvas.prototype.setTopScroll = function (newScroll) {
        this.topScroll = newScroll;
        return this;
    };
    /**
     * Sets the left scroll of this canvas.
     * @param {number} newScroll
     * @chainable
     */
    Canvas.prototype.setLeftScroll = function (newScroll) {
        this.leftScroll = newScroll;
        return this;
    };
    /**
     * Sets the zoom Factor applied in the canvas
     * @param {number} newZoom
     * @chainable
     */
    Canvas.prototype.setZoomFactor = function (newZoom) {
        if (typeof newZoom === "number" && newZoom % 25 === 0 && newZoom > 0) {
            this.zoomFactor = newZoom;
        }
        return this;
    };
    /**
     * Sets the currentConnection of this canvas.
     * @param {PMUI.draw.Connection} newConnection
     * @chainable
     */
    Canvas.prototype.setCurrentConnection = function (newConnection) {
        if (newConnection.type === "Connection") {
            this.currentConnection = newConnection;
        }
        return this;
    };
    /**
     * Assigns `newFunction` as `Canvas.prototype.toolbarShapeFactory` so that
     * the canvas has a reference to the shapes that will be created when they
     * are dragged from the toolbar.
     * @param {Function} newFunction
     * @chainable
     */
    Canvas.prototype.setShapeFactory = function (newFunction) {
        Canvas.prototype.shapeFactory = newFunction;
        return this;
    };
    /**
     * Gets the current zoom factor applied in the canvas
     * @return {number}
     */
    Canvas.prototype.getZoomFactor = function () {
        return this.zoomFactor;
    };
    /**
     * Gets the index where the zoom properties are located for the current
     * zoom factor.
     * @return {number}
     */
    Canvas.prototype.getZoomPropertiesIndex = function () {
        return this.zoomPropertiesIndex;
    };
    /**
     * Gets the segment used to make connections in the canvas.
     * @return {PMUI.draw.Segment}
     */
    Canvas.prototype.getConnectionSegment = function () {
        return this.connectionSegment;
    };
    /**
     * Gets the left scroll position of the canvas.
     * @return {number}
     */
    Canvas.prototype.getLeftScroll = function () {
        return this.leftScroll;
    };
    /**
     * Gets the top scroll position of the canvas.
     * @return {number}
     */
    Canvas.prototype.getTopScroll = function () {
        return this.topScroll;
    };
    /**
     * Gets the current connection stored in this canvas.
     * @return {PMUI.draw.Connection}
     */
    Canvas.prototype.getCurrentConnection = function () {
        return this.currentConnection;
    };
    /**
     * Gets the current selection of this canvas.
     * @return {PMUI.util.ArrayList}
     */
    Canvas.prototype.getCurrentSelection = function () {
        return this.currentSelection;
    };
    /**
     * Gets all the connections of this canvas.
     * @return {PMUI.util.ArrayList}
     */
    Canvas.prototype.getConnections = function () {
        return this.connections;
    };
    /**
     * Gets all the shared connections stored in this canvas.
     * @return {PMUI.util.ArrayList}
     */
    Canvas.prototype.getSharedConnections = function () {
        return this.sharedConnections;
    };
    /**
     * Gets all the custom shapes of the canvas.
     * @return {PMUI.util.ArrayList}
     */
    Canvas.prototype.getCustomShapes = function () {
        return this.customShapes;
    };
    /**
     * Gets all the regular shapes of the canvas.
     * @return {PMUI.util.ArrayList}
     */
    Canvas.prototype.getRegularShapes = function () {
        return this.regularShapes;
    };
    /**
     * Gets the multiple selection container instance.
     * @return {PMUI.draw.MultipleSelectionContainer}
     */
    Canvas.prototype.getMultipleSelectionHelper = function () {
        return this.multipleSelectionHelper;
    };
    /**
     * Gets the horizontal snapper of this canvas.
     * @return {PMUI.draw.Snapper}
     */
    Canvas.prototype.getHorizontalSnapper = function () {
        return this.horizontalSnapper;
    };
    /**
     * Gets the vertical snapper of this canvas.
     * @return {PMUI.draw.Snapper}
     */
    Canvas.prototype.getVerticalSnapper = function () {
        return this.verticalSnapper;
    };
    /**
     * Gets the last updated element in the canvas
     * @return {Mixed}
     */
    Canvas.prototype.getUpdatedElement = function () {
        return this.updatedElement;
    };
    /**
     * Any instance of the class Canvas is not resizable so this method
     * will always return false.
     * @return {boolean}
     */
    Canvas.prototype.isResizable = function () {
        return false;
    };
    /**
     * Gets a reference to itself.
     * @return {PMUI.draw.Canvas}
     */
    Canvas.prototype.getCanvas = function () {
        return this;
    };
    /**
     * Undoes the last action in the canvas by calling `this.commandStack.undo`.
     * @chainable
     */
    Canvas.prototype.undo = function () {
        this.commandStack.undo();
        return this;
    };
    /**
     * Redoes the last action in the canvas by calling `this.commandStack.redo`.
     * @chainable
     */
    Canvas.prototype.redo = function () {
        this.commandStack.redo();
        return this;
    };
    /**
     * Serializes this canvas by serializing its customShapes, regularShapes and connections.
     * @return {Object}
     * @return {Object} return.customShapes See {@link PMUI.draw.CustomShape#stringify}
     * @return {Object} return.regularShapes See {@link PMUI.draw.Shape#stringify}
     * @return {Object} return.connections See {@link PMUI.draw.Connection#stringify}
     */
    Canvas.prototype.stringify = function () {
        var i,
            customShapes = [],
            regularShapes = [],
            connections = [],
            inheritedJSON,
            thisJSON,
            Shape;
        // serialize custom shapes
        for (i = 0; i < this.customShapes.getSize(); i += 1) {
            customShapes.push(this.customShapes.get(i).stringify());
        }
        // serialize regular shapes
        for (i = 0; i < this.regularShapes.getSize(); i += 1) {
            regularShapes.push(this.regularShapes.get(i).stringify());
        }
        // serialize connections shapes
        for (i = 0; i < this.connections.getSize(); i += 1) {
            connections.push(this.connections.get(i).stringify());
        }
        inheritedJSON = Shape.prototype.stringify.call(this);
        thisJSON = {
            customShapes: customShapes,
            regularShapes: regularShapes,
            connections: connections
        };
        $.extend(true, inheritedJSON, thisJSON);
        return inheritedJSON;
    };
    /**
     * Adds shape and its children to `this.shapesToCopy` array so that later
     * they can be pasted in the canvas.
     * @param {PMUI.draw.Shape} shape
     * @chainable
     */
    Canvas.prototype.addToShapesToCopy = function (shape) {
        var i,
            child;
        this.shapesToCopy.push(shape.stringify());
        for (i = 0; i < shape.getChildren().getSize(); i += 1) {
            child = shape.getChildren().get(i);
            this.addToShapesToCopy(child);
        }
        return this;
    };

    /**
     * Duplicates the `this.sharedConnection` array and the shapes stored in `this.currentSelection`
     * array (saving them in `this.shapesToCopy` and `this.connectionsToCopy` respectively) so
     * that they can be pasted later in the canvas.
     * @chainable
     */
    Canvas.prototype.copy = function () {
        var i,
            shape,
            connection;
        // duplicate shapes
        this.shapesToCopy = [];
        for (i = 0; i < this.getCurrentSelection().getSize(); i += 1) {
            shape = this.getCurrentSelection().get(i);
            this.addToShapesToCopy(shape);
        }
        // duplicate connections
        this.connectionsToCopy = [];
        for (i = 0; i < this.getSharedConnections().getSize(); i += 1) {
            connection = this.getSharedConnections().get(i);
            this.connectionsToCopy.push(connection.stringify());
        }
        /*
            // testing method Canvas.prototype.transformToTree(tree)
            var tree = [];
            for (i = 0; i < this.shapesToCopy.length; i += 1) {
                shape = this.shapesToCopy[i];
                tree.push({id: shape.id, parent: shape.parent});
            }
            console.log(this.transformToTree(tree));
        */
        return this;
    };
    /**
     * Pastes the shapes saved in `this.shapesToCopy` and the connections saved in `this.connectionsToCopy`
     * by calling the #parse method.
     *
     * Currently the parser is called with these arguments:
     *
     *       {
     *          shapes: this.shapesToCopy,
     *          connections: this.connectionsToCopy,
     *          createCommand: true,
     *          uniqueID: true,
     *          selectAfterFinish: true,
     *          prependMessage: "Copy of ",
     *          diffX: 100,
     *          diffY: 100
     *      }
     *
     * @chainable
     */
    Canvas.prototype.paste = function () {
        this.parse({
            shapes: this.shapesToCopy,
            connections: this.connectionsToCopy,
            createCommand: true,
            uniqueID: true,
            selectAfterFinish: true,
            prependMessage: "Copy of ",
            diffX: 100,
            diffY: 100
        });
        return this;
    };
    /**
     * Default copy paste factory which creates new instances of {@link PMUI.draw.CustomShape}, its main purpose
     * is to create instances using `this.copyAndPasteReferences` (passed through the config options of the canvas)
     * which are reference variables to the constructor of some class (a class declared outside the library).
     *
     *      // let's assume that there's a class declared outside the library called BpmnActivity
     *      var BpmnActivity = function (options) {
     *          ...
     *      };
     *
     *      // in the config options of this canvas, we passed a reference to the constructor like this
     *      var canvas = new PMUI.draw.Canvas({
     *          ...
     *          copyAndPasteReferences: {
     *              bpmnActivity: BpmnActivity
     *          }
     *          ...
     *      });
     *
     *      // so the copyAndPasteFactory will create an instance of the class BpmnActivity
     *      // using that reference
     *      // e.g.
     *      // let's assume that options are the correct configuration options for BpmnActivity
     *      var bpmnActivityInstance = Canvas.prototype.copyAndPasteFactory('bpmnActivity', options);
     *
     *
     * @param {string} type The type of the shape to be created
     * @param {Object} options The config options to be passed to the constructor of the shape
     * @return {PMUI.draw.CustomShape} A custom shape or shape created using the reference created before.
     */
    Canvas.prototype.shapeFactory = function (type, options) {
        if (this.copyAndPasteReferences[type]) {
            return new this.copyAndPasteReferences[type](options);
        }
        return new PMUI.draw.CustomShape(options);
    };
    /**
     * Factory to create connections
     * @param {string} type
     * @param {Object} options
     * @return {Object}
     */
    Canvas.prototype.connectionFactory = function (type, options) {
        if (type && this.copyAndPasteReferences[type]) {
            return new this.copyAndPasteReferences[type](options);
        }
        return new PMUI.draw.Connection(options);
    };

    /**
     * Transforms an array of objects, each of the form `{id: #, parent: #}` to a tree like object.
     * The structure of the returned object (which represents a tree) is:
     *
     *      {
     *          id_1: [child_1_of_id1, child_2_of_id1, ...],
     *          id_2: [child_1_of_id2, child_2_of_id2, ...],
     *          ...
     *      }
     *
     * @param {Array} nodes
     * @return {Object}
     */
    Canvas.prototype.transformToTree = function (nodes) {
        var tree = {},
            node,
            i;
        for (i = 0; i < nodes.length; i += 1) {
            // node = {id: #, parent: #, order: #}
            node = nodes[i];
            // create the children of node.id
            if (!tree[node.id]) {
                tree[node.id] = [];
            }
            // insert to the children of its parent
            if (node.parent) {
                // check if the node exists
                if (!tree[node.parent]) {
                    tree[node.parent] = [];
                }
                // add node to the children of node's parent
                tree[node.parent][node.order] = node.id;
            }
        }
        return tree;
    };
    /**
     * Given a tree (with the structure proposed in #transformToTree)
     * and a pointer to the root node, perform a levelOrder traversal (BFS)
     * of the tree and returning an array with the IDs of each node.
     * @param {Object} tree
     * @param {String} [root=canvas.getID()] The ID of the root node (might be canvas)
     * @return {Array} An array with the IDs of the nodes of the tree in level order traversal
     */
    Canvas.prototype.levelOrderTraversal = function (tree, root) {
        var queue = [],
            processed = [],                     // processed shapes
            top,
            realRoot = root || this.getID(),
            i;
        queue.push(realRoot);
        while (queue.length > 0) {
            top = queue.shift();
            // push the json of the node
            processed.push(top);
            // push to the queue
            for (i = 0; i < tree[top].length; i += 1) {
                queue.push(tree[top][i]);
            }
        }
        // return the IDs
        return processed;
    };
    /**
     * Parses `options` creating shapes and connections and placing them in this canvas.
     * It does the following:
     *
     * - Creates each shape (in the same order as it is in the array `options.shapes`)
     * - Creates each connection (in the same order as it is in the array `options.connections`)
     * - Creates the an instance of {@link PMUI.command.CommandPaste} (if possible)
     *
     * @param {Object} options
     * @param {Array} [options.shapes=[]] The config options of each shape to be placed in this canvas.
     * @param {Array} [options.connections=[]] The config options of each connection to be placed in this canvas.
     * @param {boolean} [options.uniqueID=false] If set to true, it'll assign a unique ID to each shape created.
     * @param {boolean} [options.selectAfterFinish=false] If set to true, it'll add the shapes that are
     * direct children of this canvas to `this.currentSelection` arrayList.
     * @param {string} [options.prependMessage=""] The message to be prepended to each shape's label.
     * @param {boolean}  [options.createCommand=true] If set to true it'll create a command for each creation
     * of a shape and connection (see {@link PMUI.command.CommandCreate}, 
     {@link PMUI.command.CommandConnect}) and save them in
     * a {@link PMUI.command.CommandPaste} (for undo-redo purposes).
     * @param {number} [options.diffX=0] The number of pixels on the x-coordinate to move the shape on creation
     * @param {number} [options.diffY=0] The number of pixels on the y-coordinate to move the shape on creation
     * @chainable
     */
    Canvas.prototype.parse = function (options) {
        var defaults = {
            shapes: [],
            connections: [],
            uniqueID: false,
            selectAfterFinish: false,
            prependMessage: "",
            createCommand: true,
            diffX: 0,
            diffY: 0
        },
            i,
            j,
            id,
            oldID,
            shape,
            points,
            shapeOptions,
            connection,
            connectionOptions,
            sourcePort,
            sourcePortOptions,
            sourceShape,
            sourceBorder,
            destPort,
            destPortOptions,
            destShape,
            destBorder,
            command,
            diffX,
            diffY,
            stackCommandCreate = [],
            stackCommandConnect = [],
            canvasID = this.getID(),
            mapOldId = {},              // {oldId: newId}
            map = {};                   // {newId: reference to the shape}
        $.extend(true, defaults, options);
        // set the differentials (if the shapes are pasted in the canvas)
        diffX = defaults.diffX;
        diffY = defaults.diffY;
        // map the canvas
        map[canvasID] = this;
        mapOldId[canvasID] = canvasID;
        // empty the current selection and sharedConnections as a consequence
        // (so that the copy is selected after)
        if (defaults.selectAfterFinish) {
            this.emptyCurrentSelection();
        }
        for (i = 0; i < defaults.shapes.length; i += 1) {
            shapeOptions = {};
            $.extend(true, shapeOptions, defaults.shapes[i]);

            // set the canvas of <shape>
            shapeOptions.canvas = this;

            // create a map of the current id with a new id
            oldID = shapeOptions.id;

            // generate a unique id on user request
            if (defaults.uniqueID) {
                shapeOptions.id = PMUI.generateUniqueId();
            }
            mapOldId[oldID] = shapeOptions.id;

            // change labels' messages (using prependMessage)
            if (shapeOptions.labels) {
                for (j = 0; j < shapeOptions.labels.length; j += 1) {
                    shapeOptions.labels[j].message = defaults.prependMessage +
                        shapeOptions.labels[j].message;
                }
            }

            // create an instance of the shape based on its type
            shape = this.shapeFactory(shapeOptions.type, shapeOptions);

            // map the instance with its id
            map[shapeOptions.id] = shape;

            // if the shapes don't have a valid parent then set the parent
            // to be equal to the canvas
            // TODO: ADD shapeOptions.topLeftOnCreation TO EACH SHAPE
            if (!mapOldId[shapeOptions.parent]) {
                this.addElement(shape,
                    shapeOptions.x + diffX, shapeOptions.y + diffY, true);
            } else if (shapeOptions.parent !== canvasID) {
                // get the parent of this shape
                map[mapOldId[shapeOptions.parent]].addElement(shape, shapeOptions.x,
                    shapeOptions.y, true);
            } else {
                // move the shapes a little (so it can be seen that
                // they were duplicated)
                map[mapOldId[shapeOptions.parent]].addElement(shape,
                    shapeOptions.x + diffX, shapeOptions.y + diffY, true);
            }

            // perform some extra actions defined for each shape
            shape.parseHook();

            shape.attachListeners();
    //        console.log(shape);
            // execute command create but don't add it to the canvas.commandStack
            command = new PMUI.command.CommandCreate(shape);
            command.execute();
            stackCommandCreate.push(command);
        }
        for (i = 0; i < defaults.connections.length; i += 1) {
            connectionOptions = {};
            $.extend(true, connectionOptions, defaults.connections[i]);

            // state of the connection
            points = connectionOptions.state || [];

            // determine the shapes
            sourcePortOptions = connectionOptions.srcPort;
            sourceShape = map[mapOldId[sourcePortOptions.parent]];
            sourceBorder = sourceShape.getBorderConsideringLayers();

            destPortOptions = connectionOptions.destPort;
            destShape = map[mapOldId[destPortOptions.parent]];
            destBorder = destShape.getBorderConsideringLayers();

            // populate points if points has no info (backwards compatibility,
            // e.g. the flow state is null)
            if (points.length === 0) {
                points.push({
                    x: sourcePortOptions.x + sourceShape.getAbsoluteX(),
                    y: sourcePortOptions.y + sourceShape.getAbsoluteY()
                });
                points.push({
                    x: destPortOptions.x + destShape.getAbsoluteX(),
                    y: destPortOptions.y + destShape.getAbsoluteY()
                });
            }

            //create the ports
            sourcePort = new PMUI.draw.Port({
                width: 8,
                height: 8
            });
            destPort = new PMUI.draw.Port({
                width: 8,
                height: 8
            });
            // add the ports to the shapes
            // LOGIC: points is an array of points relative to the canvas.
            // CustomShape.addPort() requires that the point passed as an argument
            // is respect to the shape, so transform the point's coordinates (also
            // consider the border)
            sourceShape.addPort(
                sourcePort,
                points[0].x + diffX + sourceBorder -
                    sourceShape.getAbsoluteX(),
                points[0].y + diffX + sourceBorder -
                    sourceShape.getAbsoluteY()
            );
            destShape.addPort(
                destPort,
                points[points.length - 1].x + diffX + destBorder -
                    destShape.getAbsoluteX(),
                points[points.length - 1].y + diffY + destBorder -
                    destShape.getAbsoluteY(),
                false,
                sourcePort
            );

            connection = this.connectionFactory(
                connectionOptions.type,
                {
                    srcPort : sourcePort,
                    destPort: destPort,
                    canvas : this,
                    segmentStyle: connectionOptions.segmentStyle
                }
            );
            connection.id = connectionOptions.id || PMUI.generateUniqueId();
            if (defaults.uniqueID) {
                connection.id = PMUI.generateUniqueId();
            }
            //set its decorators
            connection.setSrcDecorator(new PMUI.draw.ConnectionDecorator({
                width: 11,
                height: 11,
                canvas: this,
                decoratorPrefix: connectionOptions.srcDecoratorPrefix,
                decoratorType: "source",
                parent: connection
            }));
            connection.setDestDecorator(new PMUI.draw.ConnectionDecorator({
                width: 11,
                height: 11,
                canvas: this,
                decoratorPrefix: connectionOptions.destDecoratorPrefix,
                decoratorType: "target",
                parent: connection
            }));

            command = new PMUI.command.CommandConnect(connection);
            stackCommandConnect.push(command);

            // connect the two ports
            if (points.length >= 3) {
    //            console.log("user");
                connection.connect({
                    algorithm: 'user',
                    points: connectionOptions.state,
                    dx: defaults.diffX,
                    dy: defaults.diffY
                });
            } else {
                // use manhattan
    //            console.log("manhattan");
                connection.connect();
            }
            connection.setSegmentMoveHandlers();

            // add the connection to the canvas, that means insert its html to
            // the DOM and adding it to the connections array
            this.addConnection(connection);

            // now that the connection was drawn try to create the intersections
            connection.checkAndCreateIntersectionsWithAll();

            //attaching port listeners
            sourcePort.attachListeners(sourcePort);
            destPort.attachListeners(destPort);

            this.triggerCreateEvent(connection, []);
        }

        // finally add to currentSelection each shape if possible (this method is
        // down here because of the zIndex problem with connections)
        if (defaults.selectAfterFinish) {
            for (id in map) {
                if (map.hasOwnProperty(id)) {
                    if (map[id].family !== 'Canvas') {
                        this.addToSelection(map[id]);
                    }
                }
            }
        }

        // create command if possible
        if (defaults.createCommand) {
            this.commandStack.add(new PMUI.command.CommandPaste(this, {
                stackCommandCreate: stackCommandCreate,
                stackCommandConnect: stackCommandConnect
            }));
        }
        return this;
    };

    Canvas.prototype.getRelativeX = function () {
        return this.x + this.absoluteX;
    };

    Canvas.prototype.getRelativeY = function () {
        return this.y + this.absoluteY;
    };

    ///**
    // * Testing json (easy viewing of the json file)
    // * @param object
    // */
    //Canvas.prototype.stringifyAndSaveToFile = function (object) {
    //    $.ajax({
    //        url: '../src/json_test/output.php',
    //        type: 'POST',
    //        data: {
    //            json: object
    //        }
    //    });
    //    window.open('../src/json_test/output.json', '_blank');
    //};

    PMUI.extendNamespace('PMUI.draw.Canvas', Canvas);

    if (typeof exports !== 'undefined'){
        module.exports = Canvas;
    }

}());
