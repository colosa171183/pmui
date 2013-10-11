/**
 * @class PMUI
 * Base class PMUI
 * @singleton
 */
var PMUI = {};

PMUI.version = '///***VERSION***///';  //PMDraw Version
PMUI.activeCanvas = null; 

/**
 * Extends the PMUI namespace with the given `path` and making a pointer
 * from `path` to the given `class` (note that the `path`'s last token will be the pointer visible from outside
 * the definition of the class).
 *
 *      // e.g.
 *      // let's define a class inside an anonymous function
 *      // so that the global scope is not polluted
 *      (function () {
 *          var Canvas = function () {...};
 *
 *          // let's extend the namespace
 *          PMUI.extendNamespace('PMUI.core.Panel', Canvas);
 *
 *      }());
 *
 *      // now PMDraw.draw.Canvas is a pointer to the class defined above
 *
 *  Another example:
 *
 *      // let's define a class inside an anonymous function
 *      // so that the global scope is not polluted
 *      (function () {
 *          var Shape = function () {...};
 *
 *          // let's extend the namespace
 *          PMUI.extendNamespace('PMUI.draw.RandomName', Shape);
 *
 *      }());
 *
 *      // now PMUI.draw.RandomName is a pointer to the class Shape
 *      // note that this class can only be accessed through this pointer
 *
 * @param {string} path
 * @param {Object} newClass
 * @return {Object} The argument `newClass`
 */
PMUI.extendNamespace = function (path, newClass) {
    var current,
        pathArray,
        extension,
        i;

    if (arguments.length !== 2) {
        throw new Error("PMUI.extendNamespace(): method needs 2 arguments");
    }

    pathArray = path.split('.');
    if (pathArray[0] === 'PMUI') {
        pathArray = pathArray.slice(1);
    }
    current = PMUI;

    // create the 'path' namespace
    for (i = 0; i < pathArray.length - 1; i += 1) {
        extension = pathArray[i];
        if (typeof current[extension] === 'undefined') {
            current[extension] = {};
        }
        current = current[extension];
    }

    extension = pathArray[pathArray.length - 1];
    if (current[extension]) {
        console.log("PMUI.extendNamespace(): Warning! overriding the class '" + pathArray.join('.') + "'");
    }
    current[extension] = newClass;
    return newClass;
};
/**
 * Checks if `path` (a string separated with dots) is a valid path inside the `from` object if provided otherwise
 * checks if `path` is a valid path inside the {@link PMUI} object,
 * if so then returns a pointer to the object which is the last token of the string
 *
 *      // e.g
 *      validPath('PMDraw.event.Keyboard.modifiers.alt');    // returns a pointer to alt
 *      validPath('modifiers.alt', PMUI.event.Keyboard);   // returns a pointer to alt
 *
 * @param {string} path
 * @param {Object} [from]
 * @return {Object}
 */
PMUI.validPath = function (path, from) {
    var pathArray = path.split('.'),
        current,
        extension,
        i;
    if (!from) {
        if (pathArray[0] === 'PMUI') {
            pathArray = pathArray.slice(1);
        }
        current = PMUI;
    } else {
        current = from;
    }
    for (i = 0; i < pathArray.length; i += 1) {
        extension = pathArray[i];
        if (!current[extension]) {
            return null;
        }
        current = current[extension];
    }
    return current;
};

/**
 * Creates an object whose [[Prototype]] link points to an object's prototype (the object is gathered using the
 * argument `path` and it's the last token in the string), since `subClass` is given it will also mimic the
 * creation of the property `constructor` and a pointer to its parent called `superclass`:
 *
 *      // constructor pointer
 *      subClass.prototype.constructor === subClass       // true
 *
 *      // let's assume that superClass is the last token in the string 'path'
 *      subClass.superclass === superClass         // true
 *
 * An example of use:
 *
 *      (function () {
 *          var Core = function () {...};
 *
 *          // extending the namespace
 *          PMDraw.extendNamespace('PMDraw.draw.Core', Core);
 *
 *      }());
 *
 *      (function () {
 *          var BehavioralElement = function () {...};
 *
 *          // this class inherits from PMDraw.draw.Core
 *          PMDraw.inheritFrom('PMDraw.draw.Core', BehavioralElement);
 *
 *          // extending the namespace
 *          PMDraw.extendNamespace('PMDraw.draw.BehavioralElement', BehavioralElement);
 *
 *      }());
 *
 * @param {string} path
 * @param {Object} subClass
 * @return {Object}
 */
PMUI.inheritFrom = function (path, subClass) {
    var current,
        extension,
        pathArray,
        i,
        prototype;

    if (arguments.length !== 2) {
        throw new Error("PMUI.inheritFrom(): method needs 2 arguments");
    }

    // function used to create an object whose [[Prototype]] link
    // points to `object`
    function clone(object) {
        var F = function () {};
        F.prototype = object;
        return new F();
    }

    pathArray = path.split('.');
    if (pathArray[0] === 'PMUI') {
        pathArray = pathArray.slice(1);
    }
    current = PMUI;

    // find that class the 'path' namespace
    for (i = 0; i < pathArray.length; i += 1) {
        extension = pathArray[i];
        if (typeof current[extension] === 'undefined') {
            throw new Error("PMUI.inheritFrom(): object " + extension + " not found, full path was " + path);
        }
        current = current[extension];
    }

    prototype = clone(current.prototype);

    prototype.constructor = subClass;
    subClass.prototype = prototype;
    subClass.superclass = current;
};

/**
 * Generates 32-digits alphanumeric unique IDs
 * @return {String} Alphanumeric 32-char unique string
 */
PMUI.generateUniqueId = function () {
    var rand = function (min, max) {
            // Returns a random number
            //
            // version: 1109.2015
            // discuss at: http://phpjs.org/functions/rand
            // +   original by: Leslie Hoare
            // +   bugfixed by: Onno Marsman
            // %          note 1: See the commented out code below for a
            // version which will work with our experimental
            // (though probably unnecessary) srand() function)
            // *     example 1: rand(1, 1);
            // *     returns 1: 1

            // fix for jsLint
            // from: var argc = arguments.length;
            if (typeof min === "undefined") {
                min = 0;
            }
            if (typeof max === "undefined") {
                max = 999999999;
            }
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        uniqid = function (prefix, more_entropy) {
            // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // +    revised by: Kankrelune (http://www.webfaktory.info/)
            // %        note 1: Uses an internal counter (in php_js global) to avoid collision
            // *     example 1: uniqid();
            // *     returns 1: 'a30285b160c14'
            // *     example 2: uniqid('foo');
            // *     returns 2: 'fooa30285b1cd361'
            // *     example 3: uniqid('bar', true);
            // *     returns 3: 'bara20285b23dfd1.31879087'
            if (typeof prefix === 'undefined') {
                prefix = "";
            }

            var retId,
                formatSeed = function (seed, reqWidth) {
                    var tempString = "",
                        i;
                    seed = parseInt(seed, 10).toString(16); // to hex str
                    if (reqWidth < seed.length) { // so long we split
                        return seed.slice(seed.length - reqWidth);
                    }
                    if (reqWidth > seed.length) { // so short we pad
                        // jsLint fix
                        tempString = "";
                        for (i = 0; i < 1 + (reqWidth - seed.length); i += 1) {
                            tempString += "0";
                        }
                        return tempString + seed;
                    }
                    return seed;
                };

            // BEGIN REDUNDANT
            if (!this.php_js) {
                this.php_js = {};
            }
            // END REDUNDANT
            if (!this.php_js.uniqidSeed) { // init seed with big random int
                this.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
            }
            this.php_js.uniqidSeed += 1;

            retId = prefix; // start with prefix, add current milliseconds hex string
            retId += formatSeed(parseInt(new Date().getTime() / 1000, 10), 8);
            retId += formatSeed(this.php_js.uniqidSeed, 5); // add seed hex string
            if (more_entropy) {
                // for more entropy we add a float lower to 10
                retId += (Math.random() * 10).toFixed(8).toString();
            }

            return retId;
        },
        sUID;

    do {
        sUID = uniqid(rand(0, 999999999), true);
        sUID = sUID.replace('.', '0');
    } while (sUID.length !== 32);

    return sUID;
};

/**
 * Creates and returns a HTML element
 * @param  {String} type The type for the element to be created, for example: div, span, p
 * @return {HTMLElement}    An HTML element
 */
PMUI.createHTMLElement = function(type) {
    return document.createElement(type);
};

/**
 * Calculates the text width usign a font family
 * @param {String} text The text which width will be calculated
 * @param {String} font The font family and size (expressed as the 'font' css properties)
 * to be used to calculate the width 
 * @return {Number}
 */
PMUI.calculateWidth = function (text, font) {
    var f = font || '12px arial',
        $o = $(this.createHTMLElement('div')), w;
        $o.text(text)
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
            .appendTo($('body'));
        w = $o.width();

    $o.remove();

    return w;
};

/**
 * Get PMUI Version.
 * @return {String}
 */
PMUI.getVersion = function () {
    return this.version;
};

/**
 * Trigger events defined in the element
 * @param  {PMUI.core.Element} el Element associated with the event
 * @param  {String} eventName Event Name or alias
 * @param  {Object} scope  Calling scope for the event
 */
PMUI.triggerEvent = function(el, eventName, scope) {
    var scopeTrigger = scope || this;
    if (el instanceof PMUI.core.Element) {
        if (el.events[eventName] instanceof PMUI.event.Event){
            el.events[eventName].handler.call(scopeTrigger);
        } else {
            throw new Error('Event name is not registered int this element');    
        }
    } else {
        throw new Error('Current Element is not able to trigger events');
    }
};

/**
 * Sets the active canvas.
 * @param {PMUI.draw.Canvas} canvas
 * @chainable
 */
PMUI.setActiveCanvas = function (canvas) {
    this.activeCanvas = canvas;
    return this;
};
/**
 * Gets the active canvas
 * @return {PMUI.draw.Canvas}
 */
PMUI.getActiveCanvas = function () {
    return this.activeCanvas;
};

/**
 * Converts the coordinates `xCoord` and `yCoord` (assuming that xCoord and yCoord are pageCoordinates)
 * or the page coordinates gathered from the object `e` if there is no `xCoord` or `yCoord` to
 * `shape` coordinates, this new coordinate also considers the scroll done in the canvas
 *
 *      // e.g.
 *      // Let's assume that:
 *      // the canvas coordinates are [100, 100] and that it has no scroll
 *      // the shape coordinates are [100, 100] (inside the canvas)
 *      // e is an object containing page.X = 300, page.Y = 300
 *      Utils.pageCoordinatesToShapeCoordinates(shape, e)  // new Point(100, 100) respect to the shape
 *
 *
 * @param {Object} shape
 * @param {Object} e
 * @param {number} [xCoord]
 * @param {number} [yCoord]
 * @return {PMUI.util.Point} a point relative to the canvas
 */
PMUI.pageCoordinatesToShapeCoordinates = function (shape, e, xCoord, yCoord) {
    var coordinates,
        x = (!xCoord) ? e.pageX : xCoord,
        y = (!yCoord) ? e.pageY : yCoord,
        canvas = shape.getCanvas();
    x += canvas.getLeftScroll() - shape.getAbsoluteX() - canvas.getX();
    y += canvas.getTopScroll() - shape.getAbsoluteY() - canvas.getY();
    coordinates = new PMUI.util.Point(x, y);
    return coordinates;
};
/**
 * Converts the coordinates of the `shape` to page coordinates, this method
 * also considers the scroll of the canvas in the calculation
 *
 *      // e.g.
 *      // Let's assume that:
 *      // the canvas coordinates are [100, 100] and that it has no scroll
 *      // the shape coordinates are [100, 100] (inside the canvas)
 *      Utils.getPointRelativeToPage(shape)     // new Point(200, 200) respect to the page
 *
 * @param {Object} shape
 * @return {PMUI.util.Point} a point relative to the page
 */
PMUI.getPointRelativeToPage = function (shape) {
    var canvas = shape.getCanvas(),
        x = shape.absoluteX + canvas.getX() - canvas.getLeftScroll() +
            shape.zoomWidth / 2,
        y = shape.absoluteY + canvas.getY() - canvas.getTopScroll() +
            shape.zoomHeight / 2;
    return new PMUI.point.Point(x, y);
};

if (typeof exports !== "undefined") {
    module.exports = PMUI;
}

///***CODE***///