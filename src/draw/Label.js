(function () {
    /**
     * @class PMUI.draw.Label
     * Creates a an object that can in order to illustrate text in the HTML it can
     * be inside a shape or by its own directly in the canvas
     *
     *              //e.g.
     *              var label = new PMUI.draw.Label({
     *                  //message that the label will display
     *                  message: "This is a label",
     *                  //orientation of the text, can be vertical or horizontal
     *                  orientation: "horizontal",
     *                  //font-family
     *                  fontFamily: "arial",
     *                  //size of the label object not the text
     *                  size: 80,
     *                  //position where it will be located relative to its
     *                  //container
     *                  position: {
     *                  //location can be center, top, bottom among others,
     *                  //relative to its container
     *                      location: "center",
     *                  //How many pixels in the x coordinate and y coordinate
     *                  //we want to move it from its location
     *                      diffX: 2,
     *                      diffY: -1
     *                  },
     *                  //option that determines if the label should update its
     *                  //parent size when it grows
     *                  updateParent: false,
     *                  //label's parent
     *                  parent: canvas
     *
     *              });
     * @extends PMUI.draw.Shape
     *
     * @constructor
     * Creates an instance of the class
     * @param {Object} options configuration options for the label object
     * @cfg {String} [message=""] Message to be displayed
     * @cfg {String} [orientation="horizontal"] Orientation of the text, can be
     * vertical or horizontal
     * @cfg {String} [fontFamily="arial"] Font family we want the message to be
     * displayed with
     * @cfg {number} [size=0] Size of the label object
     * @cfg {Object} [position={
     *     location:  "none",
     *     diffX:  0,
     *     diffY:  0
     * }] Location where we want the label to be positioned relative to its parent
     * @cfg {boolean} [updateParent=false] Determines whether the parent's size
     * should be updated when the label increases its size
     * @cfg {Object} [parent=null] Label's parent
     */
    var Label = function (options) {
        Label.superclass.call(this, options);
        /**
         * The percentage of this label respect to the width of the shape
         * in the range(0, 1)
         * @property {number}
         */
        this.xPercentage = 0;
        /**
         * The percentage of this label respect to the height of the shape
         * in the range(0, 1)
         * @property {number}
         */
        this.yPercentage = 0;
        /**
         * Message that the label will display
         * @property {String}
         */
        this.message = "";
        /**
         * Orientation of the label
         * @property {String}
         */
        this.orientation = "";
        /**
         * HTML span that holds the text display
         * @property {HTMLElement}
         */
        this.text = null;
        /**
         * Determines whether a label's parent should be updated when a label
         * increases its size
         * @property {boolean}
         */
        this.updateParent = false;
        /**
         * Determines the type of overflow this label should have
         * @property {boolean}
         */
        this.overflow = false;
        /**
         * XXX
         * @property {boolean}
         */
        this.onFocus = false;
        /**
         * Determines the location relative to its parent where this label will be
         * positioned
         * @property {String}
         */
        this.location = "";
        /**
         * x direction pixels that the label will be moved from its location
         * @property {number}
         */
        this.diffX = 0;
        /**
         * y direction pixels that the label will be moved from its location
         * @property {number}
         */
        this.diffY = 0;
        /**
         * Determines the font-size to be used in each zoom scale
         * @property {Array}
         */
        this.fontSizeOnZoom = [];
        /**
         * The font-size that this label will use to display the message
         * @property {number}
         */
        this.fontSize = 0;
        /**
         * html text field for text editing
         * @property {HTMLElement}
         */
        this.textField = null;

        Label.prototype.init.call(this, options);
    };

    PMUI.inheritFrom('PMUI.draw.Shape', Label);
    /**
     * Type of all label instances
     * @property {String}
     */
    Label.prototype.type = "Label";
    /**
     * Line height to be considered in the label's message
     * @type {number}
     */
    Label.prototype.lineHeight = 20;


    /**
     * Initializer of the object will all the given configuration options
     * @param {Object} options
     */
    Label.prototype.init = function (options) {
        var defaults = {
            message: "New Label",
            orientation: "horizontal",
            fontFamily: "arial",
            size: 0,
            position: {
                location: "none",
                diffX: 0,
                diffY: 0
            },
            overflow: false,
            updateParent: false,
            parent: null
        };
        this.fontSizeOnZoom = [6, 8, 10, 13, 15];
        $.extend(true, defaults, options);
        this.setMessage(defaults.message)
            .setOverflow(defaults.overflow)
            .setUpdateParent(defaults.updateParent)
            .setOrientation(defaults.orientation)
            .setFontFamily(defaults.fontFamily)
            .setFontSize(defaults.size)
            .setParent(defaults.parent)
            .updateDimension()
            .setLabelPosition(defaults.position.location, defaults.position.diffX,
                defaults.position.diffY);

    };
    /**
     * Attach the corresponding listeners to this label
     * @chainable
     */
    Label.prototype.attachListeners = function () {
        var $label = $(this.html);
        if (!this.html) {
            return this;
        }
        Label.superclass.prototype.attachListeners.call(this);
        $label.on("dblclick", this.onDblClick(this));
        return this;
    };
    /**
     * Creates the HTML of the label, the input text and the span for displaying the
     * message
     * @return {HTMLElement}
     */
    Label.prototype.createHTML = function () {
        Label.superclass.prototype.createHTML.call(this);
        this.html.style.textAlign = "center";
        this.html.style.align = "center";
        this.html.style.fontFamily = this.fontFamily;
        this.html.style.fontSize = this.fontSize + "pt";
        this.textField = document.createElement("input");
        this.textField.style.width = "200px";
        this.textField.style.position = "absolute";
        this.textField.style.display = "none";
        this.text = document.createElement("span");
        this.text.style.width = "auto";
        this.text.style.height = "auto";
        this.text.style.lineHeight = this.lineHeight * this.canvas.zoomFactor + "px";
        this.text.innerHTML = this.message;
        this.html.appendChild(this.text);
        this.html.appendChild(this.textField);
        this.html.style.zIndex = 2;
        return this.html;
    };
    /**
     * Displays the style of the label and adds the corresponding classes for
     * rotation
     * @chainable
     */
    Label.prototype.paint = function () {
        var $label = $(this.text);

        this.text.style.lineHeight = this.lineHeight * this.canvas.zoomFactor + "px";
        this.textField.value = this.message;
        this.text.innerHTML = this.message;

        this.html.style.verticalAlign = "middle";
        if (this.overflow) {
            this.html.style.overflow = "hidden";
        } else {
            this.html.style.overflow = "none";
        }

        this.displayText(true);
        if (this.orientation === "vertical") {
            $label.addClass('rotateText');
        } else {
            $label.removeClass('rotateText');
        }

        return this;

    };
    /**
     * Displays the label's message in its current orientation or the input text
     * @param {boolean} display true if we want to display the label's message or
     * false for the input text
     * @chainable
     */
    Label.prototype.displayText = function (display) {

        if (display) {
            this.text.style.display = "block";
            this.textField.style.display = "none";
            if (this.orientation === "vertical") {
                this.textField.style.left = "0px";
            }
        } else {
            this.textField.style.display = "block";
            if (this.orientation === "vertical") {
                this.textField.style.left = this.width / 2 - 100 + "px";
            }
            this.text.style.display = "none";
        }
        return this;
    };
    /**
     * Sets the message of this label
     * @param {String} newMessage
     * @chainable
     */
    Label.prototype.setMessage = function (newMessage) {
        this.message = newMessage;
        if (this.text) {
            this.text.innerHTML = this.message;
        }
        return this;
    };
    /**
     * Retrieves the message that this label is displaying
     * @return {String}
     */
    Label.prototype.getMessage = function () {
        return this.message;
    };
    /**
     * Sets the orientation of the text
     * @param {String} newOrientation It can be vertical or horizontal by default
     * @chainable
     */
    Label.prototype.setOrientation = function (newOrientation) {
        var $label;
        this.orientation = newOrientation;
        if (!this.html) {
            return this;
        }
        $label = $(this.text);
        if (newOrientation === "vertical") {
            $label.addClass("rotateText");
            //this.setPosition(this.x - 30, this.y - 30);
        } else {
            $label.removeClass("rotateText");
        }
        return this;
    };
    /**
     * Retrieves the orientation of this label's text
     * @return {String}
     */
    Label.prototype.getOrientation = function () {
        return this.orientation;
    };
    /**
     * Sets the font family of this label's displayed text
     * @param {String} newFontFamily
     * @chainable
     */
    Label.prototype.setFontFamily = function (newFontFamily) {
        this.fontFamily = newFontFamily;
        if (this.html) {
            this.html.style.fontFamily = this.fontFamily;
        }
        return this;
    };

    /**
     * Sets the font-size of this label's displayed text
     * @param {String} newFontSize
     * @chainable
     */
    Label.prototype.setFontSize = function (newFontSize) {
        if (newFontSize === 0) {
            this.fontSize = this.getZoomFontSize();
        } else {
            this.fontSize = newFontSize;
        }
        if (this.html) {
            this.html.style.fontSize = this.fontSize + "pt";
        }
        return this;
    };
    /**
     * Sets the property to determine if a label should update its parent
     * @param {boolean} newUpdateParent
     * @chainable
     */
    Label.prototype.setUpdateParent = function (newUpdateParent) {
        this.updateParent = newUpdateParent;
        return this;
    };
    /**
     * Sets the overflow property of this label
     * @param {boolean} newOverflow
     * @chainable
     */
    Label.prototype.setOverflow = function (newOverflow) {
        this.overflow = newOverflow;
        return this;
    };
    /**
     * Sets the position of the label regarding its parent, considering the location
     * and x and y differentials
     * @param {String} position location where we want to put the label relative to,
     * its parent, it can be top-left, top, top-right, center-left, center,
     * center-right, bottom-left, bottom, bottom-right
     * @param {number} diffX x coordinate pixels to move from its location
     * @param {number} diffY y coordinate pixels to move from its location
     * @chainable
     */
    Label.prototype.setLabelPosition = function (position, diffX, diffY) {
        var x,
            y,
            i,
            width = this.zoomWidth,
            height = this.zoomHeight,
            parent = this.parent,
            parentWidth,
            parentHeight,
            zoomFactor = this.canvas.zoomFactor,
            bottomHeightFactor = 4 * zoomFactor,
            positionString = [
                'top-left',
                'top',
                'top-right',
                'center-left',
                'center',
                'center-right',
                'bottom-left',
                'bottom',
                'bottom-right'
            ],
            orientation,
            orientationIndex = (this.orientation === "vertical") ? 1 :  0,
            positionCoordinates;
        if (!position || position === "") {
            position = "top-left";
        }
        if (diffX === undefined || diffX === null) {
            diffX = 0;
        }
        if (diffY === undefined || diffY === null) {
            diffY = 0;
        }
        if (parent && parent.family !== "Canvas") {
            parentWidth = parent.getZoomWidth();
            parentHeight = parent.getZoomHeight();
            orientation = [
                {x: width / 2, y: 0},
                {x: 0, y: height / 2}
            ];
            positionCoordinates = [
                {
                    x: -width / 2,
                    y: 0
                },
                {
                    x: parentWidth / 2 - width / 2,
                    y: 0
                },
                {
                    x: parentWidth - width / 2,
                    y: 0
                },
                {
                    x: -width / 2,
                    y: parentHeight / 2 - height / 2
                },
                {
                    x: parentWidth / 2 - width / 2,
                    y: parentHeight / 2 - height / 2
                },
                {
                    x: parentWidth - width,
                    y: parentHeight / 2 - height / 2
                },
                {
                    x: -width / 2,
                    y: parentHeight - bottomHeightFactor
                },
                {
                    x: parentWidth / 2 - width / 2,
                    y: parentHeight - bottomHeightFactor
                },
                {
                    x: parentWidth - width / 2,
                    y: parentHeight - bottomHeightFactor
                }
            ];
            for (i = 0; i < 9; i += 1) {
                if (position === positionString[i]) {
                    this.setPosition(
                        positionCoordinates[i].x / zoomFactor + diffX,
                        positionCoordinates[i].y / zoomFactor + diffY
                    );
                    break;
                }
            }

        }
        this.location = position;
        this.diffX = diffX;
        this.diffY = diffY;
        return this;
    };
    /**
     * Hides the span showing the label's message and display the input text ready
     * to be edited
     * @chainable
     */
    Label.prototype.getFocus = function () {
        var $textField = $(this.textField.html);
        this.displayText(false);
        this.canvas.currentLabel = this;
        $($textField).select();
        this.onFocus = true;
        return this;
    };
    /**
     * Hides the input text and display the label's message, and if the message's
     * changed, then it executes the editlabel command
     * @chainable
     */
    Label.prototype.loseFocus = function () {
        var command;
        this.canvas.currentLabel = null;
        if (this.textField.value !== this.message) {
            command = new PMUI.command.CommandEditLabel(this, this.textField.value);
            command.execute();
            this.canvas.commandStack.add(command);
            this.setLabelPosition(this.location, this.diffX, this.diffY);
        }
        this.paint();
        this.onFocus = false;
        return this;
    };
    /**
     * On Mouse down hander, used to stop propagation when the label's parent is the
     * canvas
     * @param {PMUI.draw.Label} label
     * @return {Function}
     */
    Label.prototype.onMouseDown = function (label) {
        return function (e, ui) {
            if (label.parent.family === "Canvas") {
                e.stopPropagation();
            }
        };
    };
    /**
     * On Click handler, used to stop propagation when a label is being edited or
     * its parent is the canvas
     * @param {PMUI.draw.Label} label
     * @return {Function}
     */
    Label.prototype.onClick = function (label) {
        return function (e, ui) {
            if (label.parent.family === "Canvas") {
                e.stopPropagation();
            }
            if (label.onFocus) {
                e.stopPropagation();
            }
        };
    };
    /**
     * Double Click handler, used in order for this label to get focus and being
     * edited
     * @param {PMUI.draw.Label} label
     * @return {Function}
     */
    Label.prototype.onDblClick = function (label) {
        return function (e, ui) {
            var canvas = label.getCanvas(),
                $label = $(label.html);
            if (canvas.currentLabel) {
                canvas.currentLabel.loseFocus();
            }
            label.getFocus();

        };
    };
    /**
     * Returns the font-size according to the current zoom scale
     * @return {number}
     */
    Label.prototype.getZoomFontSize = function () {
        var canvas = this.canvas;
        this.fontSize = this.fontSizeOnZoom[canvas.zoomPropertiesIndex];
        return this.fontSize;
    };
    /**
     * Parse the messages in words length.
     * It returns an array with the length of all the words in the message
     * @return {Array}
     */
    Label.prototype.parseMessage = function () {
        var i,
            start = 0,
            result = [],
            word;
        while (this.message.charAt(start) === ' ') {
            start += 1;
        }
        word = 0;
        for (i = start; i < this.message.length; i += 1) {

            if (this.message.charAt(i) === ' ') {
                result.push(word);
                word = 0;
            } else {
                word += 1;
            }
        }
        result.push(word);
        return result;
    };
    /**
     * Updates the dimension of the label, according to its message, and if the
     * updateParent property is true then it will call the corresponding method to
     * update its parent according to the label's size
     * @chainable
     */
    Label.prototype.updateDimension = function (firstTime) {
    //    var characterLimit,
    //        characterCount,
    //        words = [],
    //        lines = 0,
    //        i = 0,
    //        maxWidth = 0,
    //        totalCharacters = 0,
    //        canvas = this.canvas,
    //        characterOnZoom = [3.3, 5, 7, 9.3, 10.5],
    //        characterMaxWidth = [4, 6, 8, 10, 12],
    //        characterFactor = characterOnZoom[canvas.zoomPropertiesIndex],
    //        characterWidth = characterMaxWidth[canvas.zoomPropertiesIndex],
    //        zoomFactor = canvas.zoomFactor;
    //
    //    words = this.parseMessage();
    //    for (i = 0; i < words.length; i += 1) {
    //        if (maxWidth < words[i]) {
    //            maxWidth = words[i];
    //        }
    //        totalCharacters += words[i] + 1;
    //    }
    //    totalCharacters -= 1;
    //    if (this.orientation === 'vertical') {
    //        if (totalCharacters > 0) {
    //            this.setDimension((totalCharacters * characterWidth) / zoomFactor,
    //                    20);
    //        }
    //    } else {
    //        maxWidth = Math.max(Math.floor((maxWidth * characterWidth)),
    //                this.zoomWidth);
    //        characterLimit = Math.ceil((maxWidth / characterFactor));
    //        i = 0;
    //        while (i < words.length) {
    //            lines += 1;
    //            characterCount = 0;
    //            while (characterCount <= characterLimit && i < words.length) {
    //                if (words[i] + characterCount > characterLimit) {
    //                    if (characterCount !== 0) {
    //                        break;
    //                    }
    //                }
    //                characterCount += words[i] + 1;
    //                i += 1;
    //            }
    //        }
    //        this.setDimension(maxWidth / zoomFactor, (lines * 20));
    //    }
        var divWidth = $(this.text).width(),
            newWidth,
            newHeight;

        newWidth = Math.max(divWidth, this.zoomWidth);
        newHeight = $(this.text).height();

        this.setDimension(newWidth / this.canvas.zoomFactor,
                newHeight / this.canvas.zoomFactor);
        if (this.updateParent) {
            this.updateParentDimension();
        }
        return this;
    };
    /**
     * Apply all properties necessary for this label in a given zoom scale
     * @chainable
     */
    Label.prototype.applyZoom = function () {
        var canvas = this.canvas;
        this.setFontSize(0);
    //    this.fontSize = this.fontSizeOnZoom[canvas.zoomPropertiesIndex];
    //    this.setDimension(this.width, this.height);
        this.updateDimension();
    //    this.updateDimension();
        this.paint();
        return this;
    };
    /**
     * Calls the method to update the label's parent dimension according to the
     * label's orientation
     * @chainable
     */
    Label.prototype.updateParentDimension = function () {

        if (this.orientation === "vertical") {
            this.updateVertically();
        } else {
            this.updateHorizontally();
        }
        if (this.parent.html) {
            this.parent.paint();
        }
        return this;
    };
    /**
     * Updates its parent height according to the size of the label
     * @chainable
     */
    Label.prototype.updateVertically = function () {
        var margin = 5,
            parent = this.parent,
            labelWidth = this.zoomWidth,
            newHeight,
            zoomFactor = this.canvas.zoomFactor;
        if (labelWidth > parent.zoomHeight - margin * 2) {
            newHeight = labelWidth + margin * 2;
        } else {
            newHeight = parent.zoomHeight;
        }
        parent.setDimension(parent.width, newHeight / zoomFactor);
        parent.updateChildrenPosition(0, 0);
        parent.refreshConnections();
        this.setLabelPosition(this.location, this.diffX, this.diffY);
        return this;
    };
    /**
     * Updates its parent width and height according to the new label's dimension
     * @chainable
     */
    Label.prototype.updateHorizontally = function () {
        var margin = 5,
            parent = this.parent,
            labelWidth = this.zoomWidth,
            labelHeight = this.zoomHeight,
            newWidth,
            newHeight,
            zoomFactor = this.canvas.zoomFactor;
        if (labelWidth > parent.zoomWidth - margin * 2) {
            newWidth = labelWidth + margin * 2;
        } else {
            newWidth = parent.zoomWidth;
        }
        if (labelHeight > parent.zoomHeight - margin * 2) {
            newHeight = labelHeight + margin * 2;
        } else {
            newHeight = parent.zoomHeight;
        }
        parent.setDimension(newWidth / zoomFactor, newHeight / zoomFactor);
    //    parent.updateChildrenPosition();
        parent.refreshConnections();
        this.setLabelPosition(this.location, this.diffX, this.diffY);
        return this;
    };
    /**
     * Serializes this object
     * @return {Object}
     */
    Label.prototype.stringify = function () {
        // TODO:  USE CLASS STYLE IN THE METHODS OF THIS CLASS
        // TODO:  COMPLETE THE JSON
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
                message: this.getMessage(),
                orientation: this.getOrientation(),
                position: {
                    location: this.location,
                    diffX: this.diffX,
                    diffY: this.diffY
                }
            };
        $.extend(true, inheritedJSON, thisJSON);
        return inheritedJSON;

    };

    PMUI.extendNamespace('PMUI.draw.Label', Label);

    if (typeof exports !== 'undefined') {
        module.exports = Label;
    }

}());
