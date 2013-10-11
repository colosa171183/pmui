(function () {
    /**
     * @class  PMUI.item.TreeItem
     * @extends PMUI.core.Item
     * Creates an TreeItem class, this is a basic element for the {@link PMUI.panel.TreePanel TreePanel} class
     *
     * @constructor
     * Create a new instance of the TreePanel class
     * @param {Object} options Contructor object
     */
    var TreeItem = function (settings) {
        TreeItem.superclass.call(this, settings);
        
        /**
         * @property {String} text
         * String to indicated the name of the node or {@link PMUI.item.TreeItem item}
         */
        this.text = null;
        /**
         * True to indicate that the tree is collapsed or False if the tree is expanded
         * @type {Boolean}
         */
        this.collapsed = null;
        /**
         * Defines the className of the container
         * @type {String}
         */
        this.classContainer = null;
        /**
         * Icon to be used when the checkbox option is checked
         * @type {String}
         */
        this.iconBoxOn = null;
        /**
         * Icon to be used when the checkbox option is uncheked
         * @type {String}
         */
        this.iconBoxOff = null;
        /**
         * String to indicate what kind of cursor mouse will be used on the Tree
         *
         * For example: crosshair, default, inherit, move, wait, etc.
         *
         * By Default is pointer
         * @type {String}
         */
        this.cursor = null;
        /**
         * Icon for items
         * @type {String}
         */
        this.icon = null;
        /**
         * Icon used when the item has children
         * @type {String}
         */
        this.iconParent = null;
        /**
         * Icon that represents when the node is collapsed
         * @type {String}
         */
        this.iconNodeClosed = null;
        /**
         * Icon that represents when the node is expanded
         * @type {String}
         */
        this.iconNodeExpanded = null;
        
        this.space = null;


        TreeItem.prototype.init.call(this, settings);
    };

    // Inheritance from Item class
    PMUI.inheritFrom('PMUI.core.Item', TreeItem);

    /**
     * Class type
     * @type {String}
     */
    TreeItem.prototype.type = 'TreeItem';
    /**
     * Class family
     * @type {String}
     */
    TreeItem.prototype.family = 'item';

    TreeItem.prototype.init = function (settings) {

        var defaults = {
            text: "",
            collapsed: false,
            space: 30,
            cursor: "pointer",
            icon: "../img/icons/leaf.gif",
            iconParent: "../img/icons/folder.gif",
            iconNodeClosed: "../img/icons/elbow-plus.gif",
            iconNodeExpanded: "../img/icons/elbow-minus.gif",
            classContainer: "",
            factory: {
                products: {
                    "treeitem": PMUI.item.TreeItem
                },
                defaultProduct: "treeitem"
            }
        };
        jQuery.extend(true, defaults, settings);
        this.setText(defaults.text)
            .setFactory(defaults.factory)
            .setCursor(defaults.cursor)
            .setSpace(defaults.space)
            .setCollapsed(defaults.collapsed)
            .setClassContainer(defaults.classContainer)
            .setIcon(defaults.icon)
            .setIconParent(defaults.iconParent)
            .setIconNodeClosed(defaults.iconNodeClosed)
            .setIconNodeExpanded(defaults.iconNodeExpanded)
            .setChildren(defaults.children);

    };
    /**
     * Sets the text value of the item
     * @param {String} text 
     */
    TreeItem.prototype.setText = function (text) {
        this.text = text;
        return this;
    };
    /**
     * Sets the kind of cursor mouse value
     * @param {String} value 
     */
    TreeItem.prototype.setCursor = function (value) {
        this.cursor = value;
        return this;
    };
    /**
     * Sets the space
     * @param {number} value 
     */
    TreeItem.prototype.setSpace = function (value) {
        this.space = value;
        return this;
    };
    TreeItem.prototype.setCollapsed = function (option) {
        this.collapsed = option;
        return this;
    };
    /**
     * Sets the icon image
     * @param {String} value 
     */
    TreeItem.prototype.setIcon = function (value) {
        this.icon = value;
        return this;
    };
    /**
     * Sets the icon parent image
     * @param {String} value 
     */
    TreeItem.prototype.setIconParent = function (value) {
        this.iconParent = value;
        return this;
    };
    /**
     * Sets the icon with the node collapsed
     * @param {String} value 
     */
    TreeItem.prototype.setIconNodeClosed = function (value) {
        this.iconNodeClosed = value;
        return this;
    };
    /**
     * Sets the icon with the node expanded
     * @param {String} value 
     */
    TreeItem.prototype.setIconNodeExpanded = function (value) {
        this.iconNodeExpanded = value;
        return this;
    };
    /**
     * Gets the boolean value if the node is collapsed or not
     * @return {Boolean}
     */
    TreeItem.prototype.isCollapsed = function() {
        return this.collapsed;
    };
    /**
     * Sets the ClassName css to container element
     * @param {string} className Will be the class name for all containers in the tree
     * @return {PMUI.item.TreeItem} this
     */
    TreeItem.prototype.setClassContainer = function (value) {
        this.classContainer = value;
        return this;
    };
    /**
     * Begins the tree with collapse status based in the collapsed property.
     * @return {PMUI.item.TreeItem} this
     */
    TreeItem.prototype.initStatus = function () {
        var i = 0, 
            children,
            contentItem;

        children = this.getItems();
        if (this.items.getSize() > 0) {
            for(i = 0; i < children.length; i++) {
                children[i].setVisible(!this.isCollapsed());
            }
            contentItem = jQuery(this.html).children();
            if(this.isCollapsed()) {
                jQuery(contentItem).children()[0].src = this.iconNodeClosed;
                this.collapsed = true;
            } else {
                jQuery(contentItem).children()[0].src = this.iconNodeExpanded;
                this.collapsed = false;
            }
        }
        
        return this;
    };
    /**
     * Collapse the item specified
     * @return {PMUI.item.TreeItem}
     */
    TreeItem.prototype.collapse = function() {
        var i = 0, 
            children,
            contentItem;
            
        children = this.getItems();
        if (this.items.getSize() > 0) {
            for(i = 0; i < children.length; i++) {
                jQuery(children[i].html).slideUp(300);
            }
            contentItem = jQuery(this.html).children();
            jQuery(contentItem).children()[0].src = this.iconNodeClosed;
            
            this.collapsed = true;
        }

        return this;
    };    
    /**
     * Expand the item specified
     * @return {PMUI.item.TreeItem}
     */
    TreeItem.prototype.expand = function() {
        var i = 0, 
            children,
            contentItem;
            
        children = this.getItems();
        if (this.items.getSize() > 0) {
            for(i = 0; i < children.length; i++) {
                jQuery(children[i].html).slideDown(300);    
            }
            contentItem = jQuery(this.html).children();
            jQuery(contentItem).children()[0].src = this.iconNodeExpanded;

            this.collapsed = false;
        }        

        return this;
    };
    /**
     * Toggle item depends if the item is collapsed or expanded
     * @return {PMUI.item.TreeItem}
     */
    TreeItem.prototype.toggleCollapse = function() {
        if (this.collapsed) {
            this.expand();
        } else {
            this.collapse();
        }

        return;
    };
    /**
     * Add a child to {@link PMUI.item.TreeItem TreeItem}
     * @param {Array} data Contains objects children
     * @return {PMUI.item.TreeItem} TreeItem
     */
    TreeItem.prototype.addChild = function (data) {
        var that = this,
            obj,
            item,
            count;

        jQuery.each(data, function (key, value){
            obj = value;
            if (that.collapsed) {
                obj = jQuery.extend(true, value, { collapsed: that.collapsed });
            }
            item = that.factory.make(obj);
            count = item.getItems().length;
            
            if (count > 0) {
                item.setIcon(item.iconParent);
            }
            that.addItem(item);
        });
        return item;
    };
    /**
     * Creates HTMLElement based in the current class
     * @return {HTMLElement}
     */
    TreeItem.prototype.createHTML = function () {

        var html =  PMUI.createHTMLElement('li'),
            iconNode = PMUI.createHTMLElement('img'),
            iconParent = PMUI.createHTMLElement('img'),
            icon = PMUI.createHTMLElement('img'),
            span = PMUI.createHTMLElement('span'),
            that = this,
            items,
            children,
            div;

        icon.setAttribute("src",this.icon);
        
        if (this.items.getSize() > 0) {
            iconNode.setAttribute("src", this.iconNodeExpanded);
        }
        
        iconNode.className = "pmui-node-icon";
        span.appendChild(document.createTextNode(this.text));
        div = document.createElement("div");
        div.className = "pmui-" + this.family.toLowerCase() + "-" + this.type.toLowerCase();
        div.appendChild(iconNode);
        div.appendChild(icon);
        div.appendChild(span);
        div.setAttribute("style","padding-left:" + this.space + "px;");
        html.id = this.id;
        html.appendChild(div);
        if (that.items.getSize() > 0) {
            children = PMUI.createHTMLElement('ul');
            children.setAttribute("class",this.classContainer);
            children.setAttribute("style","list-style-type:none;padding-left:0px;");
            items = that.getItems();
            jQuery.each(items, function (key,item) {
                children.appendChild(item.getHTML());
            });
            html.appendChild(children);
        }
        
        this.html = html;
        this.applyStyle();
        this.defineCursor();
        this.defineEvents();
        this.initStatus();

        return this.html;
    };
    /**
     * Sets the children for the tree
     * @param {Array} data
     */
    TreeItem.prototype.setChildren = function (data) {
        var that = this,
            item,
            obj,
            options,
            initObj;
        if (data) {
            that.space = that.space + 25;
            jQuery.each(data, function(key, value) {
                initObj = {
                    collapsed: that.collapsed,
                    classContainer: that.classContainer,
                    space: that.space
                };
                obj = jQuery.extend(true, value, initObj);

                item = that.factory.make(obj);
                if (value.children) {
                    item.setIcon(that.iconParent);
                } 
                that.addItem(item);
            });
        }
        return this;
    };
    /**
     * Defines the cursor mouse for the contains tree
     * @return {PMUI.item.TreeItem}
     */
    TreeItem.prototype.defineCursor = function () {
        var that = this;
        that.html.setAttribute("style", "cursor:"+this.cursor);
        return this;
    };
    /**
     * Defines events like click, contextmenu, etc. For more example view {@link PMUI.event.EventFactory events}
     */
    TreeItem.prototype.defineEvents = function () {
        var that = this;
        that.addEvent('click').listen(that.html, function(e){
            that.toggleCollapse();
            
            //jQuery(that.html).children()[0].attr('style', 'background-color: blue;');
            //that.html.setAttribute("style", "background-color: blue;");
            console.log("click on: '" + that.id + "' item");
            e.stopPropagation();
        });

        that.addEvent('contextmenu').listen(that.html, function(e){
            e.preventDefault();
            console.log("right click on: '" + that.id + "' item");
            e.stopPropagation();
        });
    };


    PMUI.extendNamespace('PMUI.item.TreeItem', TreeItem);

    if (typeof exports !== 'undefined') {
        module.exports = TreeItem;
    }    
    
}());