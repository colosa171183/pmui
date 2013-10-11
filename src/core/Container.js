(function () {
    /**
     * @class PMUI.core.Container
     * Handles HTML elements that have a container behavior (they can be contain {Element} objects)
     * @abstract
     * @extend PMUI.core.Element
     *
     * @constructor 
     * Creates a new instance
     * @param {Object} settings
     */
    var Container = function (settings) {
        Container.superclass.call(this, settings);
        /**
         * @property {PMUI.util.ArrayList} items
         * An ArrayList object that contains all the child Items
         */
        this.items = null;
        /**
         * @property {PMUI.util.Factory} factory
         * xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
         */
        this.factory = null;

        Container.prototype.init.call(this, settings);
    };

    PMUI.inheritFrom('PMUI.core.Element', Container);

    Container.prototype.type = 'Container';

    Container.prototype.init = function (settings) {
        var defaults = {
            items: []
        };

        jQuery.extend(true, defaults, settings);

        this.items = new PMUI.util.ArrayList();

        this.setFactory(defaults.factory)
            .setItems(defaults.items);
    };

    /**
     * Sets the "factory" property with a {PMUI.util.Factory} object
     * @param {Object} factory
     */
    Container.prototype.setFactory = function (factory) {
        if (factory instanceof PMUI.util.Factory){
            this.factory = factory;
        } else {
            this.factory = new PMUI.util.Factory(factory);
        }
        return this;
    };

    /**
     * Removes a child element from the object
     * @param  {PMUI.core.Element|String|Number} item It can be a string (id of the child to remove), 
     a number (index of the child to remove) or a {Element} object
     * @chainable
     */
    Container.prototype.removeItem = function (item) {
        var itemToRemove;
        if (item instanceof PMUI.core.Element) {
            itemToRemove = item;
        } else {
            if (typeof item === 'string') {
                itemToRemove = this.items.find("id", item.id);
            } else if (typeof item === 'number') {
                itemToRemove = this.items.get(item);
            }
        }
        if (itemToRemove) {
            jQuery(itemToRemove.html).remove();
            this.items.remove(itemToRemove);
        }
        return this;
    };
    /**
     * Removes all the child items
     * @chainable
     */
    Container.prototype.clearItems = function () {
        while (this.items.getSize() > 0) {
            this.removeItem(0);
        }
        return this;
    };
    /**
     * Returns true if the item, used as the unique method parameter, is a direct child of the current Container object,
      otherwise returns false
     * @param  {PMUI.core.Element}  item The target child object
     * @return {Boolean}
     */
    Container.prototype.isDirectParentOf = function (item) {
        return this.items.indexOf(item) >= 0;
    };
    /**
     * Adds an child item to the object
     * @param {PMUI.core.Element|Object} item It can be one of the following data types:
     * - {PMUI.core.Element} the object to add
     * - {Object} a JSON object with the settings for the Container to be added
     * @chainable
     */
    Container.prototype.addItem = function (item) {
        var itemToBeAdded;
        if (this.factory) {
            itemToBeAdded = this.factory.make(item);
        }
        if (itemToBeAdded && !this.isDirectParentOf(itemToBeAdded)) {
            itemToBeAdded.parent = this;
            this.items.insert(itemToBeAdded);
            if (this.html) {
                this.html.appendChild(itemToBeAdded.getHTML());
            }
        }

        return this;
    };
    /**
     * Clear all the object's current child items and add new ones
     * @param {Array} items An array where each element can be a {Element} object or a JSON object 
     where is specified the setting for the child item to be added
     * @chainable
     */
    Container.prototype.setItems = function (items) {
        var i;
        if (jQuery.isArray(items)) {
            this.clearItems();
            for (i = 0; i < items.length; i += 1) {
                this.addItem(items[i]);
            }
        }

        return this;
    };
    /**
     * Returns an array with all the child elements
     * @return {Array}
     */
    Container.prototype.getItems = function () {
        return this.items.asArray();
    };
    /**
     * Returns one single item based on the id or index position
     * @param  {String|Number} id If the parameter is a string then 
     it will be take as the id for the element to find and return, 
     but if the element is a Number it returns the object iwth that 
     index position
     * @return {PMUI.core.Element}
     */
    Container.prototype.getItem = function (i) {
        var t;
        if (typeof i === 'number') {
            t = this.items.get(i);
        } else {
            t = this.items.find('id', i);
        }
        return t;
    };

    /**
     * Creates the object's HTML element
     * @return {HTMLElement}
     */
    Container.prototype.createHTML = function () {
        if (this.html) {
            return this.html;
        }
        Container.superclass.prototype.createHTML.call(this);
        this.setItems(this.items.asArray().slice(0));
        this.style.applyStyle();

        return this.html;
    };

    PMUI.extendNamespace('PMUI.core.Container', Container);

    // Publish to NodeJS environment
    if (typeof exports !== 'undefined') {
        module.exports = Container;
    }

}());