(function () {
    /**
     * @class PMUI.draw.ConnectionDecorator
     * Represents the decorator on each endpoint of a connection (represented as srcDecorator and destDecorator in
     * the class Connection).
     * The connection will be painted as follows:
     *
     * 1. Each connection decorator is painted with a CSS sprite
     * 2. The CSS class is built concatenating (with underscores) the following:
     *
     *      1. The prefix (passed as an argument in the config options)
     *      2. The zoom factor multiplied by 100
     *      3. The decorator type (passed as an argument in the config options)
     *      4. The direction of the decorator (which is the same as the direction of the port it corresponds to)
     *
     * Some examples:
     *
     *      // e.g.
     *      // let's assume that the zoom factor is 1
     *      // let's assume that connection is an instance of the class Connection
     *
     *      // To create a target decorator
     *      var connectionDecorator = new PMUI.draw.ConnectionDecorator({
     *          decoratorPrefix:  'con',
     *          decoratorType:  'target',
     *          style:  {
     *              cssClasses:  [],
     *              cssProperties:  {}
     *          },
     *          parent:  connection
     *      });
     *
     *      // assuming that the direction of the port is (1) TOP
     *      // paint() will build the class like this:
     *      // CSSClass = decoratorPrefix + "_" + zoomFactor * 100 + "_" + decoratorType + "_" + direction
     *      // CSSClass = "con_100_target_TOP"
     *
     *      // To create a source decorator
     *      var connectionDecorator = new PMUI.draw.ConnectionDecorator({
     *          decoratorPrefix:  'con',
     *          decoratorType:  'source',
     *          style:  {
     *              cssClasses:  [],
     *              cssProperties:  {}
     *          },
     *          parent:  connection
     *      });
     *
     *      // assuming that the direction of the port is (3) LEFT
     *      // paint() will build the class like this:
     *      // CSSClass = decoratorPrefix + "_" + zoomFactor * 100 + "_" + decoratorType + "_" + direction
     *      // CSSClass = "con_100_source_LEFT"
     *
     * @extends PMUI.draw.Core
     *
     * @constructor Creates an instance of the class ConnectionDecorator
     * @param {Object} options Initialization options
     * @cfg {PMUI.util.Point} [decoratorPrefix=''] Decorator prefix used to 
     reconstruct the css class for the sprite
     * @cfg {PMUI.draw.Connection} [parent=null] The parent of this decorator 
     (must be an instance of the class Connection)
     * @cfg {Object} [style={cssClasses: [], cssProperties: {}}] CSS classes and properties
     */
    var ConnectionDecorator = function (options) {

        ConnectionDecorator.superclass.call(this, options);

        /**
         * Parent of this decorator (must be a Connection)
         * @property {PMUI.draw.Connection}
         */
        this.parent = null;

        /**
         * The type of this decorator (either "source" or "target")
         * @property {"source" / "target"}
         */
        this.decoratorType = null;

        /**
         * Decorator prefix of this decorator to build the CSS class for the sprite
         * @property {String}
         */
        this.decoratorPrefix = null;

        /**
         * This parameter is an array to see if the end point
         * is UP, RIGHT, BOTTOM and LEFT
         * @property {Object} spriteDirection
         * @property {string} [spriteDirection.0="up"] Enum for "up"
         * @property {string} [spriteDirection.1="right"] Enum for "right"
         * @property {string} [spriteDirection.2="bottom"] Enum for "bottom"
         * @property {string} [spriteDirection.3="left"] Enum for "left"
         */
        this.spriteDirection = {'0' : 'top', '1' : 'right',
            '2' : 'bottom', '3' : 'left'};

        /**
         * Height of this decorator
         * @property {number} [height=11]
         */
        this.height = 11;

        /**
         * Width of this decorator
         * @property {number} [width=11]
         */
        this.width = 11;

        /**
         * Separator used to build the class
         * @type {String}
         */
        this.separator = null;

        /**
         * Sprite used to build the class
         * @type {String}
         */
        this.sprite = null;

        /**
         * The class that will be constructed using the parameters given in
         * the options object
         * @type {string}
         */
        this.cssClass = null;

        ConnectionDecorator.prototype.initObject.call(this, options);
    };

    PMUI.inheritFrom('PMUI.draw.Core', ConnectionDecorator);

    /**
     * Type of this connection decorator
     * @property {String}
     */
    ConnectionDecorator.prototype.type = "ConnectionDecorator";

    /**
     * Instance initializer which uses options to extend the config options to initialize the instance
     * @param {Object} options The object that contains the config
     * @private
     */
    ConnectionDecorator.prototype.initObject = function (options) {

        var defaults = {
            width: 11,
            height: 11,
            sprite: 'bpmn_zoom',
            decoratorPrefix: '',
            separator: '_',
            decoratorType: 'target',
            parent: null
        };

        // extend recursively the defaultOptions with the given options
        $.extend(true, defaults, options);

        // init
        this.setDecoratorType(defaults.decoratorType)
            .setDecoratorPrefix(defaults.decoratorPrefix)
            .setSeparator(defaults.separator)
            .setSprite(defaults.sprite)
            .setParent(defaults.parent)
            .setDimension(defaults.width, defaults.height)
            .setCssClass('');       // cssClass defaults to empty
    };

    /**
     * Paints the connectionDecorator according to the parameters saved in `this.initObject`.
     * The steps to paint the decorator are:
     *
     * 1. Determine if this decorator belongs to the source or destination port
     * 2. Determine the direction of the decorator
     * 3. Build the class using the direction, decorator prefix, decorator type and zoom
     * 4. Determine the position of this decorator
     *
     * @chainable
     */
    ConnectionDecorator.prototype.paint = function () {

        var point,
            canvas,
            direction,
            port, // the port it "belongs to"
            topStyle,
            leftStyle;

        if (this.decoratorType === "source") {
            port = this.parent.getSrcPort();
        } else {
            port = this.parent.getDestPort();
        }

        point = port.getPoint(false);
        direction = port.getDirection();
        canvas = port.canvas;

        topStyle = [
            point.y - this.zoomHeight,
            point.y - Math.round(this.zoomHeight / 2),
            point.y,
            point.y - Math.round(this.zoomHeight / 2)
        ];
        leftStyle = [
            point.x - Math.round(this.zoomWidth / 2) + 1,
            point.x,
            point.x - Math.round(this.zoomWidth / 2) + 1,
            point.x - this.zoomWidth
        ];

        if (this.getHTML() === null) {
            this.createHTML();
        }

        if (this.decoratorType === null) {
            this.html = null;
            return this;
        }

        // apply classes using the prefix
        this.style.removeClasses([this.cssClass]);

    // construct the new class to be applied
        this.setCssClass([this.prefix, parseInt(canvas.zoomFactor * 100, 10),
            this.decoratorType, this.spriteDirection[direction]].join(this.separator));
        this.style.addClasses([
            this.sprite,
            this.getCssClass()
        ]);

        // top and left position
        this.style.addProperties({
            top: topStyle[direction] - canvas.absoluteX,
            left: leftStyle[direction] - canvas.absoluteY
            //,
            //width: 11,
            //height: 11
        });

        this.parent.html.appendChild(this.html);
        return this;
    };

    /**
     * Creates the HTML Representation of the SourceSpriteConnectionDecorator
     * @returns {HTMLElement}
     */
    ConnectionDecorator.prototype.createHTML = function () {
        this.html = document.createElement('div');
        this.html.id = this.id;
        this.style.applyStyle();
        this.style.addProperties({
            position: "absolute",
            left: 0,
            top: 0,
            height: this.zoomHeight,
            width: this.zoomWidth,
            zIndex: PMUI.util.Style.MAX_ZINDEX    // (segments are 1) so this should be 2
        });

        return this.html;
    };

    /**
     * Attaches listeners to the connectionDecorator (currently it has click and mouseDown events)
     * @chainable
     */
    ConnectionDecorator.prototype.attachListeners = function () {
        var $connectionDecorator;
        $connectionDecorator = $(this.getHTML()).click(this.onClick(this));
    //    $connectionDecorator.on("contextmenu", this.onRightClick(this));
        $connectionDecorator.on("mousedown", this.onMouseDown(this));
        return this;
    };

    /**
     * Refresh the dimension and position of the decorator to apply the current
     * zoom scale
     * @chainable
     */
    ConnectionDecorator.prototype.applyZoom = function () {
        this.setDimension(this.width, this.height);
        return this;
    };
    /**
     * @event mousedown
     * ConnectionDecorator mouse down callback fired when the mouse is down on it.
     * @param {PMUI.draw.ConnectionDecorator} decorator
     */
    ConnectionDecorator.prototype.onMouseDown = function (decorator) {
        return function (e, ui) {
            e.preventDefault();
            if (e.which === 3) {    // right click
                decorator.parent.canvas.updatedElement = decorator.parent;
                $(decorator.parent.canvas.html).trigger("rightclick");
            }
            e.stopPropagation();
        };
    };
// commented by mauricio on 17/12/12
// reason:  it was an example on how to change the segment style of the connection
///**
// * XXX
// * @param decorator
// * @return {Function}
// */
//ConnectionDecorator.prototype.onRightClick = function (decorator) {
//    return function (e, ui) {
//        if (decorator.parent.canvas.currentConnection) {
//            var test = ["normal", "message", "association"],
//                style = ["regular", "dotted", "segmented", "segmentdot"],
//                connection = decorator.parent;
//            connection.getDestPort().moveTowardsTheCenter(true);
//            connection.getDestDecorator()
//                .setDecoratorPrefix("con_" + test[parseInt(Math.random() * 3, 10)]);
//            connection.getDestDecorator().paint();
//            connection.getDestPort().moveTowardsTheCenter();
//            connection.setSegmentStyle(style[parseInt(Math.random() *
//                style.length, 10)]);
//            e.preventDefault();
//        }
//    };
//};

    /**
     * @event click
     * Click callback fired when the decorator is clicked on.
     * It hides the currentSelection if any and shows the ports and handlers of `decorator` parent
     * (which is a connection).
     * @param {PMUI.draw.ConnectionDecorator} decorator
     */
    ConnectionDecorator.prototype.onClick = function (decorator) {
        return function (e, ui) {
            var connection = decorator.parent,
                oldConnection = decorator.parent.canvas.currentConnection,
                canvas = connection.canvas;

            // HIDE
            // if there were some shapes in the current selection then
            // empty the current selection
            canvas.emptyCurrentSelection();

            // if there was a connection previously select hide its ports
            // and its handlers
            if (oldConnection) {
                oldConnection.hidePortsAndHandlers();
            }

            // SHOW
            // show the ports and the handlers of the new connection
            connection.showPortsAndHandlers();

            // set the old connection as this connection
            canvas.currentConnection = connection;

            // TODO:  zIndex
            e.stopPropagation();
        };
    };

    /**
     * Serializes this connection decorator.
     * @return {Object}
     * @return {"source" / "target"} return.decoratorType The decorator type to build the CSS class for the sprite
     * @return {string} return.decoratorPrefix The decorator prefix to build the CSS class for the sprite
     */
    ConnectionDecorator.prototype.stringify = function () {
        var inheritedJSON = {},
            thisJSON = {
                decoratorType: this.getDecoratorType(),
                decoratorPrefix: this.getDecoratorPrefix()
            };
        $.extend(true, inheritedJSON, thisJSON);
        return inheritedJSON;
    };

    /**
     * Returns the decorator type
     * @returns {String}
     */
    ConnectionDecorator.prototype.getDecoratorType = function () {
        return this.decoratorType;
    };

    /**
     * Sets the decoration type
     * @param {String} newType
     * @chainable
     */
    ConnectionDecorator.prototype.setDecoratorType = function (newType) {
        this.decoratorType = newType;
        return this;
    };

    /**
     * Returns the decorator type
     * @returns {String}
     */
    ConnectionDecorator.prototype.getDecoratorPrefix = function () {
        return this.prefix;
    };

    /**
     * Sets the decoration prefix
     * @param {String} newType
     * @chainable
     */
    ConnectionDecorator.prototype.setDecoratorPrefix = function (newType) {
        this.prefix = newType;
        return this;
    };

    /**
     * Sets the parent of this connectionDecorator
     * @param {PMUI.draw.Connection} newParent
     * @chainable
     */
    ConnectionDecorator.prototype.setParent = function (newParent) {
        this.parent = newParent;
        return this;
    };

    /**
     * Gets the parent of this connectionDecorator
     * @return {PMUI.draw.Connection}
     */
    ConnectionDecorator.prototype.getParent = function () {
        return this.parent;
    };

    /**
     * Sets the separator of this connectionDecorator
     * @param {String} newSeparator
     * @chainable
     */
    ConnectionDecorator.prototype.setSeparator = function (newSeparator) {
        this.separator = newSeparator;
        return this;
    };

    /**
     * Sets the sprite of this connectionDecorator
     * @param {String} newSprite
     * @chainable
     */
    ConnectionDecorator.prototype.setSprite = function (newSprite) {
        this.sprite = newSprite;
        return this;
    };

    /**
     * Sets the cssClass of this connectionDecorator
     * @param {string} newCssClass
     * @chainable
     */
    ConnectionDecorator.prototype.setCssClass = function (newCssClass) {
        this.cssClass = newCssClass;
        return this;
    };

    /**
     * Gets the cssClass of this connectionDecorator
     * @return {string}
     */
    ConnectionDecorator.prototype.getCssClass = function () {
        return this.cssClass;
    };

    PMUI.extendNamespace('PMUI.draw.ConnectionDecorator', ConnectionDecorator);

    if (typeof exports !== 'undefined') {
        module.exports = ConnectionDecorator;
    }
    
}());
