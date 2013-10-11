(function () {
    /**
     * @class  PMUI.panel.TreePanel
     * @extends PMUI.core.Panel
     * Is the container for every {@link PMUI.item.TreeItem TreeItem} class
     *
     *      configOptions = {
     *          id: "myTreeId",
     *          collapsed: true,
     *          children: [
     *              {
     *                  id: "10",
     *                  text: "Folder 1",
     *                  children: [
     *                      {
     *                          text: "Element1"
     *                      },
     *                      new PMUI.item.TreeItem({
     *                          text: 'Element3'
     *                      })
     *                  ]
     *              },
     *              {
     *                  id: "11",
     *                  text: "Element2"
     *              }
     *          ]
     *      };
     *
     *      jQuery(document).ready(function($) {
     *          tree = new PMUI.panel.TreePanel(configOptions);
     *          $('body').append(tree.getHTML());
     *      });  
     *
     *
     * @cfg {String} id Defines the ID for HTMLElement.
     * @cfg {Array} children Defines the data children, Is an array of objects.
     *
     *      children: [
     *          {
     *              text: "Element"
     *          },
     *          { 
     *              ... 
     *          }
     *      ]
     *
     * @cfg {Boolean} collapse Defines if the tree'll show collapsed or expanded. 
     * By default is expanded.
     * 
     *      collapsed: false //true or false
     *
     */

    var TreePanel = function (settings) {
        TreePanel.superclass.call(this, settings);
        this.root = null;
        /**
         * Defines the className of the container
         * @type {String}
         */
        this.classContainer = null;
        /**
         * Defines if the tree will be collapsed or expanded
         *
         * By default it's expanded
         * @type {String}
         */
        this.collapsed = null;
        /**
         * This is a pointer from current object
         * @type {Boolean}
         */
        this.pointer = null;
        // Call to Item class constructor
        TreePanel.prototype.init.call(this, settings);
    };

    // Inheritance from Panel 
    PMUI.inheritFrom('PMUI.core.Panel', TreePanel);

    /**
     * Class type
     * @type {String}
     */
    TreePanel.prototype.type = 'Tree';
    /**
     * Class family
     * @type {String}
     */
    TreePanel.prototype.family = 'Panel';

    /**
     * Creates new Component.
     * @param {Object} config The configuration options may be specified as a JSON.
     *
     */
    TreePanel.prototype.init = function (settings) {
        var defaults = {
            root: {
                text: "PMUI TreePanel",
                id: "TreePanel",
                visible: false
            },
            
            factory: {
                products : {
                    "treeitem" : PMUI.item.TreeItem
                },
                defaultProduct: "treeitem"
            },
            classContainer: "pmui-"+this.family.toLowerCase()+"-"+this.type.toLowerCase()+"-"+"ul"
        };

        jQuery.extend(true, defaults, settings);
        
        this.setFactory(defaults.factory)
            .setClassContainer(defaults.classContainer)
            .setCollapsed(defaults.collapsed)
            .setChildren(defaults.children);

        //this.pointer = this;
    };
    /**
     * Add a child to {@link PMUI.panel.TreePanel TreePanel}
     * @param {Array} data Contains objects children
     * @return {PMUI.item.TreeItem} TreeItem
     */
    TreePanel.prototype.addChild = function (data) {
        var that = this,
            obj,
            item,
            count,
            initObj;

        jQuery.each(data, function (key, value){
            initObj = { 
                collapsed: that.collapsed,
                classContainer: that.classContainer,
                space: 0
            };
            obj = jQuery.extend(true, value, initObj);
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
     * Remove a child with id sent as a parameter
     * @return {PMUI.panel.TreePanel} TreePanel
     */
    TreePanel.prototype.removeChildren = function (id) {
        var pointer;
        pointer = this.search(this, id);
        if (pointer !== null) {
            this.pointer = null;
            jQuery(pointer.child.html).remove();
            pointer.father.items.remove(pointer.child);    
        } else {
            throw new Error("removeChildren(): can not remove items with the current id");
        }
        
        return this;
    };
    
    /**
     * Returns the first object of the tree that has the
     * specified id with the specified value
     * if the object is not found it returns -1
     * @param {string} id This is the identifier of the object
     * @return {Object / -1}
     */
    TreePanel.prototype.search = function (obj, id) {
        var that = obj,
            searched,
            j = 0,
            b;
            
        if (that === undefined) {
            return false;
        }
        if (that.id === id) {
            this.pointer = {
                father: that,
                child: that
            };
            return this.pointer;
        }
        if (that.items.getSize() > 0) {
            searched = that.items.find("id",id);

            if (searched !== undefined) {
                this.pointer = {
                    father: that,
                    child: searched
                };
            }

            b = that.getItems();
            for (j = 0; j < b.length; j++) {
                this.search(b[j], id);
            }
        }
        
        return this.pointer;
    };
    /**
     * Sets the children elements in the body of the component.
     * @param {Array} data Contains objects children
     * @return {PMUI.panel.TreePanel} this
     */
    TreePanel.prototype.setChildren = function (data) {
        if (data) {
            this.addChild(data);
        }
        return this;
    };
    /**
     * Adds an objects array.
     * @param {Array} data Contains objects children
     * @return {PMUI.panel.TreePanel} this
     */
    TreePanel.prototype.addChildren = function (id, data) {
        var a,
            item,
            base,
            itemChild;
        item = this.search(this, id);
        this.pointer = null;
        if (data && item !== null) {
            itemChild = item.child;
            a = itemChild.addChild(data);
            base = jQuery(itemChild.html).children()[1];
            jQuery(base).append(a.getHTML());
        } else {
            throw new Error("addChildren(): can not add items with the current parameters");
        }
        return this;
    };
    /**
     * Sets the ClassName css to container element
     * @param {string} className Will be the class name for all containers in the tree
     * @return {PMUI.panel.TreePanel} this
     */
    TreePanel.prototype.setClassContainer = function (value) {
        this.classContainer = value;
        return this;
    };
    /**
     * Sets the Collapsed attribute with a parameter boolean
     * @param {Boolean} option Is the parameter boolean
     * @return {PMUI.panel.TreePanel}
     */
    TreePanel.prototype.setCollapsed = function (option) {
        this.collapsed = option;
        return this;
    };
    /**
     * Creates HTMLElement object
     * @return PMUI.panel.TreePanel} HTMLElement
     */
    TreePanel.prototype.createHTML = function () {
        TreePanel.superclass.prototype.createHTML.call(this);
        var base = PMUI.createHTMLElement('ul'),
            items = this.getItems();
        base.setAttribute("class",this.classContainer);
        base.setAttribute("style","list-style-type:none; padding-left:0px;");
        jQuery.each(items, function(k,v) {
            base.appendChild(v.getHTML());
        });
        this.html.appendChild(base);
        this.applyStyle();
        return this.html;
    };
    TreePanel.prototype.render = function () {
        $('#'+this.id+' .pmui-panel-tree-ul').sortable({
            connectWith: '#'+this.id+' .pmui-panel-tree-ul',
            axis: "y",
            remove: function ( event, ui ) {
                console.log("removed:"+ ui);
            },
            receive: function ( event, ui ) {
                console.log(ui);
                console.log("received:"+ ui);
            },
            change: function( event, ui ) {
                var identifier = ui.item.attr('id'); 
                console.log("changed:"+ ui);
            }
        });

    };
    PMUI.extendNamespace('PMUI.panel.TreePanel', TreePanel);

}());