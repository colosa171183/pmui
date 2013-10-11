(function () {
    /**
     * @class PMUI.panel.Layout
     * Handles layouts to be inserted into panels. 
     * It is composed by five main elements: north, south, west, east and center
     * @extend PMUI.core.Panel
     *
     * Create a new instance of the Layout class
     * Below is an example of instantiation of this class:
     *
     *
     *              var b = {
     *                  id: "myId",
     *                  height: 300,
     *                  north: {
     *                      size: 100,
     *                      cssProperties: {
     *                          "background-color": "red"
     *                      }
     *                  },
     *                  south: {
     *                      size: 100,
     *                      cssProperties: {
     *                          "background-color": "blue"
     *                      }
     *                  },
     *                  west: new Panel({
     *                      id: "New Panel One"
     *                  }),
     *                  east: {
     *                      pmType: "PMPanel",
     *                      id: "New Panel Two"
     *                  }
     *              };
     *
     *            $(function() {
     *              a = new PMUI.panel.Layout(b);
     *              $('body').append(a.getHTML());
     *              a.render();
     *            });
     *
     * Other example having only a simple layout, It should create a center section by default
     *
     *              $(function() {
     *                  c = new PMUI.panel.Layout();
     *                  jQuery("body").append(c.createHTML());
     *                  c.render();
     *              });
     *
     *
     * These default hotkeys cannot be changed
     * The cursor/arrow key must be pressed in combination with CTRL as example
     *
     *              Toggle North-pane:  CTRL + Up
     *              Toggle South-pane:  CTRL + Down
     *              Toggle West-pane:   CTRL + Left
     *              Toggle East-pane:   CTRL + Right
     *
     */


    var Layout = function (settings) {

        var panels,
            itemsPanel,
            heightLayout,
            prefixPlugin;

        if (settings === undefined) {
            settings = {};
        }

        if (settings.height === undefined) {
            heightLayout = parseInt(jQuery(document.body).css("height").replace("px",""), 10);
            settings.height =  document.height - heightLayout;
        }

        // Call to Panel constructor
        Layout.superclass.call(this, jQuery.extend(true, settings, {bodyHeight: settings.height}));

        /**
         * Contains methods related to the layout
         * @type {Object}
         */
        this.instance = null;
        /**
         * Defines the panel's north content area 
         * @type {Object}
         */
        this.north = null;
        /**
         * Defines the panel's south content area 
         * @type {Object}
         */
        this.south = null;
        /**
         * Defines the panel's west content area 
         * @type {Object}
         */
        this.west = null;
        /**
         * Defines the panel's east content area 
         * @type {Object}
         */
        this.east = null;
        /**
         * Defines the panel's center content area 
         * @type {Object}
         */
        this.center = null;
        

        this.widgets = {
            Panel: PMUI.core.Panel,
            Element: PMUI.core.Element,
            Style: PMUI.util.Style
        };
        
        this.optionsLayout = {
            /**
             * Defines the size of one panel specified
             * @type {string|Number}
             *
             * For example for north section
             *
             *      north: {
             *          size: 100
             *      }
             *
             * Or 
             *
             *      north: {
             *          size: "50%"
             *      }
             */
            size: "size",
            /**
             * Defines if a section (north, south, west and east) could be rendered closed o open
             * @type {Boolean}
             *
             * For example for west section will be rendered closed
             *
             *
             *      west: {
             *          closed: true
             *      }
             *
             * This section will be rendered opened
             *
             *      west: {
             *          close: false
             *      }
             *
             * By default will appear opened
             */
            closed: "initClosed",
            /**
             * Defines if a section (north, south, west and east) could be resizable
             * @type {Boolean}
             *
             * For example for east section will be resizable
             *
             *      east: {
             *          resizable: true
             *      }
             *
             * This section will not be resizable
             *
             *      east: {
             *          resizable: false
             *      }
             *
             * By default will be resizable
             */
            resizable: "resizable",
            /**
             * Defines if a section (north, south, west and east) could be closable
             * @type {Boolean}
             *
             * For example for south section will be closable
             *
             *      south: {
             *          closable: true
             *      }
             *
             * This section will not be resizable
             *
             *      south: {
             *          closable: false
             *      }
             *
             * By default will be closable
             */
            closable: "closable",
            /**
             * Defines the toggler lenght
             * Length of toggler-button when pane is 'open' 
             * Length means 'width' for north/south togglers, and 'height' for east/west togglers.
             * "100%" OR -1 means 'full height/width of resizer bar' - 0 means 'hidden'
             * @type {Number|String}
             *
             * For example for north
             *
             *      north: {
             *          togglerOpen: 50
             *      }
             *
             * Or
             *
             *      north: {
             *          togglerOpen: "100%"
             *      }
             *
             * By default will appear
             */
            togglerOpen: "togglerLength_open",
            /**
             * Defines the toggler lenght
             * Length of toggler-button when pane is 'closed' 
             * Length means 'width' for north/south togglers, and 'height' for east/west togglers.
             * "100%" OR -1 means 'full height/width of resizer bar' - 0 means 'hidden'
             * @type {Number|String}
             *
             * For example for north
             *
             *      north: {
             *          togglerClosed: 50
             *      }
             *
             * Or
             *
             *      north: {
             *          togglerClosed: "100%"
             *      }
             *
             * By default will appear
             */
            togglerClosed: "togglerLength_closed",
            /**
             * Defines if a section allow to overflow
             * @type {Boolean}
             *
             * For example for north
             *
             *      north: {
             *          overflow: true
             *      }
             *
             * Or
             *
             *      north: {
             *          overflow: false
             *      }
             *
             * By default the section does not allow to overflow
             */
            overflow: "allowOverflow",
            /**
             * Defines if a section appear in the browser
             * If 'true', then pane is 'hidden' when layout is created 
             * - no resizer or spacing is visible, as if the pane does not exist.
             * @type {Boolean}
             *
             * For example for north
             *
             *      north: {
             *          hidden: true
             *      }
             *
             * Or
             *
             *      north: {
             *          hidden: false
             *      }
             *
             * By default the section appear in the browser
             */
            hidden: "initHidden"
        };

        itemsPanel = {};
        prefixPlugin = "ui-layout-";
        panels = ["center", "north", "south", "west", "east"];

        /**
         * Merge an object to center, north, south, west, east panels based from JSON sent
         * @param {Object} obj contains items about the parameter for any section
         */
        Layout.prototype.setItemsPanel = function(obj) {
            if (typeof obj === "object") {
                jQuery.extend(true, itemsPanel,obj);
            }
            
        };
        
        /**
         * Returns constant variables
         * @return {Object} 
         */
        Layout.prototype.getConfig = function() {
            return {
                panels: panels,
                items: itemsPanel,
                prefix: prefixPlugin
            };
        };

        Layout.prototype.initObject.call(this, settings);
        
    };

    // Inheritance from Panel class
    PMUI.inheritFrom('PMUI.core.Panel', Layout);
    /**
     * Class type
     * @type {String}
     */
    Layout.prototype.type = 'Layout';
    //Layout.prototype.family = 'Panel';

    /**
     * Set the defaults options about styles to panels that are in the settings
     * @param {Object} settings It's a JSON structure with attributes 
     * positions ["center", "north", "south", "west", "east"];
     */
    Layout.prototype.initObject = function (settings) {
        var defaults;

        defaults = {
            center: {
                cssProperties: {},
                cssClasses: []
            },
            appendTo: document.body
        };

        jQuery.extend(true,defaults, settings);
        this.setPanels(defaults);
        this.createPanels(defaults);
        //this.render();
    };

    /**
     * Set the defaults options about styles to panels that are in the settings
     * @param {Object} settings It's a JSON structure with attributes 
     * positions ["center", "north", "south", "west", "east"];
     */
    Layout.prototype.setPanels = function (settings) {
        var i,
            me,
            aPanels;
        
        me = this;
        aPanels = this.getConfig().panels;
        jQuery.each(settings,function(position, el) {

            if ( jQuery.inArray(position, aPanels) >= 0 ) {            
                if (typeof settings[position].cssProperties === 'undefined') {
                    settings[position].cssProperties = {};
                }
                
                if (typeof settings[position].cssClasses === 'undefined') {
                    settings[position].cssClasses = [];
                }
                me[position] = settings[position];
            }
        });

    };
    /**
     * Create classes Panel and others class based in the pmType attribute sent from the JSON
     * @param [Object] settings It's a JSON structure with attributes position and options to panels
     */
    Layout.prototype.createPanels = function (settings) {
        var me,
            aPanels,
            NewClass;

        me = this;    
        aPanels = this.getConfig().panels;
        jQuery.each(settings,function(position, el) {
            
            if ( jQuery.inArray(position, aPanels) < 0 || typeof settings[position] !== "object") {
                return;
            }
            
            settings[position].cssClasses.push(me.getConfig().prefix + position);

            if (settings[position] instanceof PMUI.core.Panel) {
                me[position] = settings[position];
            } else if( me.widgets[settings[position].pmType] !== undefined) {
                me.setOptions(position, settings[position]);
                NewClass = me.widgets[settings[position].pmType];
                me[position] = new NewClass(settings[position]);
            } else {
                me.setOptions(position, settings[position]);
                me[position] = new PMUI.core.Panel(settings[position]);
            }
            
            me[position].style.cssProperties = settings[position].cssProperties;
            me[position].style.cssClasses = settings[position].cssClasses;
            me[position].createHTML();
            me.addItem(me[position]);

        });

    };
    /**
     * Define the options to layout
     * @param [Object] settings It's a JSON structure with attributes position and options to panels
     */
    Layout.prototype.setOptions = function (position, settings) {
        var j,
            me,
            param,
            aPanels,
            paramVal,
            paramJson,
            option;
        
        me = this;
        aPanels = this.getConfig().panels;

        jQuery.each(settings,function(property, el) {
            option = me.optionsLayout[property];
            
            if (typeof option !== "string" ) {
                return;
            }
            
            if (typeof settings[property] === "string") {
                j = JSON.parse('{"' +position+ '": {"'+ option + '":"' +settings[property]+ '"}}');
            } else {
                j = JSON.parse('{"' +position+ '": {"'+ option + '":' +settings[property]+ '}}');
            }
            me.setItemsPanel(j);
        });
         
    };
    /**
     * Create html for each item to container 
     * @return {Object} the current object html
     */
    Layout.prototype.createHTML = function () {
        var i,
            sizeArray,
            items;

        items = this.items.asArray();
        Layout.superclass.prototype.createHTML.call(this);
        for (i = 0; i < items.length; i+=1) {
            $(this.body).append(items[i].html);
        }
        return this.html;
    };
    /**
     * Render all the html object 
     */
    Layout.prototype.render = function () {
        var me,
            options;
        options = this.getConfig().items;
        this.instance = jQuery(this.body).layout(options);

        me = this;
        jQuery.each(options, function(position, val) {
            if (options[position].allowOverflow === true) {
                me.instance.allowOverflow(position);
            }
        });
        
    };
    /**
     * Remove each html related to the layout from the DOM and destroy the layout instance
     */
    Layout.prototype.destroy = function () {
        if (this.instance.destroy !== undefined) {
            this.instance.destroy(); 
        }
        if (this.html !== undefined) {
            jQuery(this.html).remove();
            this.html = null;
        }
        this.instance = null;
    };
    /**
     * Get the class registered
     * @param [String] type It's a string of the class type
     * @param [Class] class It's a any class
     */
    Layout.prototype.getWidget = function (type, settings) {
        if (settings === undefined) {
            settings = {};
        }
        var Class = this.widgets[type];
        return new Class(settings);
    };
    /**
     * Register new Class to Layout class 
     * @param [String] type It's a string of the class type
     * @param [Class] class It's a any class
     */
    Layout.prototype.registerWidget = function (type, Class) {
        this.widgets[type] = Class;
    };

    // Declarations created to instantiate in NodeJS environment
    if (typeof exports !== "undefined") {
        module.exports = Layout;
    }

    PMUI.extendNamespace('PMUI.panel.Layout', Layout);
    
}());