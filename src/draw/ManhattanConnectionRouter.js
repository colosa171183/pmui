(function () {
    /**
     * @class PMUI.draw.ManhattanConnectionRouter
     * Class ManhattanConnectionRouter uses the 'ManhattanRouter' algorithm to define the points of the connection.
     * @extends PMUI.draw.Router
     *
     * @constructor Creates an instance of the class ManhattanConnectionRouter
     */
    var ManhattanConnectionRouter = function () {
        ManhattanConnectionRouter.superclass.call(this);
        /**
         * Minimum distance used in the algorithm
         * @property {number} [mindist=20]
         */
        this.mindist = 20;
    };

    PMUI.inheritFrom('PMUI.draw.Router', ManhattanConnectionRouter);

    /**
     * The type of each instance of this class
     * @property {String}
     */
    ManhattanConnectionRouter.prototype.type = "ManhattanConnectionRouter";

    /**
     * Creates the points of `connection` by calling the #route method and using
     * `connection.srcPort` and `connection.destPort` as the start and end points
     * @param {PMUI.draw.Connection} connection
     * @return {Array} An array of points that define the connection.
     */
    ManhattanConnectionRouter.prototype.createRoute = function (connection) {
        var fromPt, fromDir, toPt, toDir, points = [];

        fromPt = connection.srcPort.getPoint(false);
        fromDir = connection.srcPort.direction;

        toPt = connection.destPort.getPoint(false);
        toDir = connection.destPort.direction;

        // draw a line between the two points.
        this.route(connection, toPt, toDir, fromPt, fromDir, points);
        return points;
    };

    /**
     * Implementation of the 'MahattanRouter' algorithm
     * @param {PMUI.draw.Connection} conn Instance of the class Connection
     * @param {PMUI.util.Point} fromPt initial Point
     * @param {number} fromDir route using to begin line
     *        UP = 0; RIGHT= 1; DOWN = 2; LEFT = 3;
     * @param {PMUI.util.Point} toPt final Point
     * @param {number} toDir route using to end line
     *        UP = 0; RIGHT= 1; DOWN = 2; LEFT = 3;
     * @param {Array} points array where points are saved
     */
    ManhattanConnectionRouter.prototype.route = function (conn, fromPt, fromDir, toPt, toDir, points) {
        var TOL,
            TOLxTOL,
            UP,
            RIGHT,
            DOWN,
            LEFT,
            xDiff,
            yDiff,
            nPoint,
            dir,
            pos;

        TOL = 0.1;
        TOLxTOL = 0.01;

        // fromPt is an x,y to start from.
        // fromDir is an angle that the first link must
        //
        UP = 0;
        RIGHT = 1;
        DOWN = 2;
        LEFT = 3;

        xDiff = fromPt.x - toPt.x;
        yDiff = fromPt.y - toPt.y;

        if (((xDiff * xDiff) < (TOLxTOL)) && ((yDiff * yDiff) < (TOLxTOL))) {
            points.push(toPt);
            return;
        }

        if (fromDir === LEFT) {
            if ((xDiff > 0) && ((yDiff * yDiff) < TOL) && (toDir === RIGHT)) {
                nPoint = toPt;
                dir = toDir;
            } else {
                if (xDiff < 0) {
                    nPoint = new PMUI.util.Point(fromPt.x - this.mindist, fromPt.y);
                } else if (((yDiff > 0) && (toDir === DOWN)) || ((yDiff < 0) &&
                    (toDir === UP))) {
                    nPoint = new PMUI.util.Point(toPt.x, fromPt.y);
                } else if (fromDir === toDir) {
                    pos = Math.min(fromPt.x, toPt.x) - this.mindist;
                    nPoint = new PMUI.util.Point(pos, fromPt.y);
                } else {
                    nPoint = new PMUI.util.Point(fromPt.x - (xDiff / 2), fromPt.y);
                }

                if (yDiff > 0) {
                    dir = UP;
                } else {
                    dir = DOWN;
                }
            }
        } else if (fromDir === RIGHT) {
            if ((xDiff < 0) && ((yDiff * yDiff) < TOL) && (toDir === LEFT)) {
                nPoint = toPt;
                dir = toDir;
            } else {
                if (xDiff > 0) {
                    nPoint = new PMUI.util.Point(fromPt.x + this.mindist, fromPt.y);
                } else if (((yDiff > 0) && (toDir === DOWN)) || ((yDiff < 0) &&
                    (toDir === UP))) {
                    nPoint = new PMUI.util.Point(toPt.x, fromPt.y);
                } else if (fromDir === toDir) {
                    pos = Math.max(fromPt.x, toPt.x) + this.mindist;
                    nPoint = new PMUI.util.Point(pos, fromPt.y);
                } else {
                    nPoint = new PMUI.util.Point(fromPt.x - (xDiff / 2), fromPt.y);
                }

                if (yDiff > 0) {
                    dir = UP;
                } else {
                    dir = DOWN;
                }
            }
        } else if (fromDir === DOWN) {
            if (((xDiff * xDiff) < TOL) && (yDiff < 0) && (toDir === UP)) {
                nPoint = toPt;
                dir = toDir;
            } else {
                if (yDiff > 0) {
                    nPoint = new PMUI.util.Point(fromPt.x, fromPt.y + this.mindist);
                } else if (((xDiff > 0) && (toDir === RIGHT)) || ((xDiff < 0) &&
                    (toDir === LEFT))) {
                    nPoint = new PMUI.util.Point(fromPt.x, toPt.y);
                } else if (fromDir === toDir) {
                    pos = Math.max(fromPt.y, toPt.y) + this.mindist;
                    nPoint = new PMUI.util.Point(fromPt.x, pos);
                } else {
                    nPoint = new PMUI.util.Point(fromPt.x, fromPt.y - (yDiff / 2));
                }

                if (xDiff > 0) {
                    dir = LEFT;
                } else {
                    dir = RIGHT;
                }
            }
        } else if (fromDir === UP) {
            if (((xDiff * xDiff) < TOL) && (yDiff > 0) && (toDir === DOWN)) {
                nPoint = toPt;
                dir = toDir;
            } else {
                if (yDiff < 0) {
                    nPoint = new PMUI.util.Point(fromPt.x, fromPt.y - this.mindist);
                } else if (((xDiff > 0) && (toDir === RIGHT)) || ((xDiff < 0) &&
                    (toDir === LEFT))) {
                    nPoint = new PMUI.util.Point(fromPt.x, toPt.y);
                } else if (fromDir === toDir) {
                    pos = Math.min(fromPt.y, toPt.y) - this.mindist;
                    nPoint = new PMUI.util.Point(fromPt.x, pos);
                } else {
                    nPoint = new PMUI.util.Point(fromPt.x, fromPt.y - (yDiff / 2));
                }

                if (xDiff > 0) {
                    dir = LEFT;
                } else {
                    dir = RIGHT;
                }
            }
        }

        this.route(conn, nPoint, dir, toPt, toDir, points);
        points.push(fromPt);
    };

    PMUI.extendNamespace('PMUI.draw.ManhattanConnectionRouter', ManhattanConnectionRouter);

    if (typeof exports !== 'undefined') {
        module.exports = ManhattanConnectionRouter;
    }

}());
