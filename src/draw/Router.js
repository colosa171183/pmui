 (function () {
    /**
     * @abstract
     * @class PMUI.draw.Router
     * Represents the router used to define the points for a connection.
     * @extend PMUI.draw.Core
     *
     * @constructor Creates an instance of the class Router
     */
    var Router = function () {
        Router.superclass.call(this);
    };

    PMUI.inheritFrom('PMUI.draw.Core', Router);

    /**
     * The type of each instance of this class
     * @property {String}
     */
    Router.prototype.type = "Router";

    /**
     * @abstract Abstract method to create a route (defined in other inherited classes)
     * @returns {boolean}
     */
    Router.prototype.createRoute = function () {
        return true;
    };

    PMUI.extendNamespace('PMUI.draw.Router', Router);

    if (typeof exports !== 'undefined') {
        module.exports = Router;
    }
}());
