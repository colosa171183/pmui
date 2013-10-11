(function () {
    /**
     * @class PMUI.draw.Graphics
     * Class Graphics is the HTMLElement drawing engine used to draw lines (as HTMLElement divs),
     * arcs (using HTMLElement divs) and ovals.
     * Currently some elements in the designer are completely represented with the drawing engine:
     *
     * - Connection => a set of segments (regular, segmented, dotted)
     * - Port => oval
     * - Intersection => arc
     *
     * Some important notes:
     *
     * - Currently this class acts as an interface between the library **PMDraw** and the HTMLElement
     * drawing engine wz_jsGraphics
     * - The drawing engine constructor needs the HTMLElement where it will go as a parameter **(this
     * HTMLElement must exist in the DOM)**
     *
     * @constructor
     * Creates an instance of this class (currently it's an interface of the wz_graphics framework)
     * @param {Object} html This parameter can be either an id, or an html object
     */
    var Graphics = function (html) {

        if (!html) {
            return null;
        }

        /**
         * Create an instance of the class JSGraphics (this.graphics is an interface)
         * @type {Object}
         */
        this.graphics = new JSGraphics(html);

        /**
         * Creates an instance of the class Color (color black)
         * @type {PMUI.util.Color}
         */
        this.color = new PMUI.util.Color(0, 0, 0);
    };

    /**
     * Draws a line of a given type between two points.
     *
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {string} type the type of line we wish to draw
     * @param {PMUI.util.Color} color The color of the segment
     * @param {number} segLength the segment length for segmented and segmentdot type of line
     * @param {number} spaceLength the space length for segmented and segmentdot type of line
     * @param {boolean} [doNotErasePrevious] if set to true then it won't clear the elements drew with this instance
     */
    Graphics.prototype.drawLine = function (x1, y1, x2, y2, type, color, segLength, spaceLength, doNotErasePrevious) {

        if (!doNotErasePrevious) {
            this.graphics.clear();
        }

        if (!type) {
            type = "regular";
        }
        switch (type) {
            case "dotted":
                this.graphics.setStroke(-1);
                break;
            case "segmented":
                this.graphics.setStroke(1);
                this.graphics.drawLine = this.makeSegmentedLine;
                break;
            case "segmentdot":
                this.graphics.setStroke(1);
                this.graphics.drawLine = this.makeSegmentDotLine;
                break;
            default:
                this.graphics.setStroke(1);
        }

        this.graphics.setColor(color.getCSS());
        this.graphics.drawLine(x1, y1, x2, y2, segLength, spaceLength);
        this.graphics.paint();

    };

///**
// * NOTE: Unused definition
// * Initializes the graphics variable with a new html container
// * @param {HTMLElement} html
// * @returns {Graphics}
// */
//Graphics.prototype.initGraphics = function (html) {
//    if (html) {
//        this.graphics = new PMUI.draw.JSGraphics(html);
//    }
//    return this;
//};

    /**
     * Returns the color that was being used for drawing
     * @returns {PMUI.util.Color}
     */
    Graphics.prototype.getColor = function () {
        return this.color;
    };

    /**
     * Sets the color to be used for drawing
     * @param newColor
     * @chainable
     */
    Graphics.prototype.setColor = function (newColor) {
        if (newColor.type === "Color") {
            this.color = newColor;
        }
        return this;
    };

    /**
     * This function will make a segmented line between two points in the same axis,
     * if points in different axis are provided the method would simple return
     *
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} segmentLength the segment length for segmented and
     * segmentdot type of line
     * @param {number} spLength the space length for segmented and
     * segmentdot type of line
     */
    Graphics.prototype.makeSegmentedLine = function (x1, y1, x2, y2, segmentLength, spLength) {
        var dx,
            dy,
            aux,
            segLength = 4,
            spaceLength = 3,
            diff = 0,
            x,
            y;

        //not same axis so just return
        if ((x2 !== x1 && y2 !== y1)) {
            return;
        }

        if (x2 === x1) {
            //same point just return
            if (y2 === y1) {
                return;
            }
            dx = 0;
            //swap
            if (y2 < y1) {
                aux = y2;
                y2 = y1;
                y1 = aux;
            }
            dy = diff = y2 - y1;
        } else {
            dy = 0;
            if (x2 < x1) {
                aux = x2;
                x2 = x1;
                x1 = aux;
            }
            dx = diff = x2 - x1;
        }

        x = x1;
        y = y1;

        if (diff < 7) {
            segLength = 2;
            spaceLength = 1;
        }

        segLength = (!segmentLength) ? segLength : segmentLength;
        spaceLength = (!spLength) ? spaceLength : spLength;

        if (dy === 0) {
            while (dx > 0) {
                if (dx >= segLength) {
                    this._mkDiv(x, y, segLength, 1);
                    x += segLength + spaceLength;
                    dx -= (segLength + spaceLength);
                } else {
                    this._mkDiv(x, y, dx, 1);
                    dx = 0;
                }
            }
        } else {
            while (dy > 0) {
                if (dy >= segLength) {
                    this._mkDiv(x, y, 1, segLength);
                    y += segLength + spaceLength;
                    dy -= (segLength + spaceLength);
                } else {
                    this._mkDiv(x, y, 1, dy);
                    dy = 0;
                }
            }
        }
    };

    /**
     * This function will make a segment between two points in the same axis with
     * the following structure segment-dot-segment
     * if points in different axis are provided the function will simply return.
     *
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} segmentLength the segment length for segmented and
     * segmentdot type of line
     * @param {number} spLength the space length for segmented and
     * segmentdot type of line
     */

    Graphics.prototype.makeSegmentDotLine = function (x1, y1, x2, y2, segmentLength, spLength) {
        var dx,
            dy,
            aux,
            segLength = 7,
            spaceLength = 4,
        //in case its necessary dot Length
            dotLength = 1,
            diff = 0,
            x,
            y;

        //not same axis so just return
        if ((x2 !== x1 && y2 !== y1)) {
            return;
        }


        if (x2 === x1) {
            //same point just return
            if (y2 === y1) {
                return;
            }
            dx = 0;
            //swap
            if (y2 < y1) {
                aux = y2;
                y2 = y1;
                y1 = aux;
            }
            dy = y2 - y1;
            diff = dy;
        } else {
            dy = 0;
            if (x2 < x1) {
                aux = x2;
                x2 = x1;
                x1 = aux;
            }
            dx = x2 - x1;
            diff = dx;
        }

        x = x1;
        y = y1;

        segLength = (!segmentLength) ? segLength : segmentLength;
        spaceLength = (!spLength) ? spaceLength : spLength;

        if (dy === 0) {
            while (dx > 0) {
                if (dx >= segLength) {
                    this._mkDiv(x, y, segLength, 1);
                    dx -= (segLength + spaceLength);
                    x += segLength + spaceLength;
                    if (dx > 0) {
                        //we need to implement this if the dot length would be
                        // different than one
                        //if(dx < dotLength){
                        //	this._mkDiv(x,y,dx,1);
                        //  dx  = 0; continue;
                        //}
                        this._mkDiv(x, y, dotLength, 1);
                        dx -= (dotLength + spaceLength);
                        x += dotLength + spaceLength;

                    }
                } else {
                    this._mkDiv(x, y, dx, 1);
                    dx = 0;
                }
            }
        } else {
            while (dy > 0) {
                if (dy >= segLength) {
                    this._mkDiv(x, y, 1, segLength);
                    dy -= (segLength + spaceLength);
                    y += segLength + spaceLength;
                    if (dy > 0) {
                        //we need to implement this if the dot length would be
                        // different than one
                        //if(dy < dotLength){
                        //	this._mkDiv(x,y,1,dy);
                        //  dy  = 0; continue;
                        //}
                        this._mkDiv(x, y, 1, dotLength);
                        dy -= (dotLength + spaceLength);
                        y += dotLength + spaceLength;

                    }
                } else {
                    this._mkDiv(x, y, 1, dy);
                    dy = 0;
                }
            }
        }

    };
    /**
     * Draws an arc with the center `[cx, cy]`, with a radius equal to `radius` from `startAngle` to `endAngle`
     * and drawing a line every `step` steps.
     * Logic:
     *
     * 1. Let's assume that we have a circle with center `[cx, cy]` and with a radius equal to `radius`
     * 2. We want to draw only a portion of the circle (from `startAngle` to `endAngle`)
     * 3. Given any angle of the circle `0 <= angle < 360` we can get its `x` and `y` coordinates using
     *    Pythagoras triangle rectangle laws.
     *      - We know that `hyp^2 = dx^2 + dy^2` and that `hyp = radius`
     *      - We know that `cos(angle) = dx / radius` so `dx = radius * cos(angle)`
     *      - We know that `sin(angle) = dy / radius` so `dx = radius * cos(angle)`
     * 4. Finally let's use the given center of the circle to move the triangle
     *
     * @param {number} cx
     * @param {number} cy
     * @param {number} radius
     * @param {number} startAngle
     * @param {number} endAngle
     * @param {number} step
     */
    Graphics.prototype.drawArc = function (cx, cy, radius, startAngle, endAngle, step) {
        var x,
            y,
            angle = startAngle;

        if (!step) {
            step = 10;
        }

        while (Math.abs(angle - endAngle) > 1e-5) {
            angle = (angle + step) % 360;
            x = cx + radius * Math.cos(angle * PMUI.draw.Geometry.pi / 180.0);
            y = cy + radius * Math.sin(angle * PMUI.draw.Geometry.pi / 180.0);
            this.graphics.drawLine(x, y, x, y);
        }
    };

    PMUI.extendNamespace('PMUI.draw.Graphics', Graphics);
}());
