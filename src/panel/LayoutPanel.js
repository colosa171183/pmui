(function (){
    /**
     * @class  PMUI.panel.LayoutPanel
     * @extends PMUI.core.Panel
     * Handles layouts to be inserted into panels. 
     * It is composed by five main elements: north, south, west, east and center
     *
     * Example:
     *
     *      var layout,
     *          layoutOptions;
     *     
     *      layoutOptions = {
     *          id: "layout-id",
     *          height: 450 //pixels
     *          north: {
     *              size: 50,
     *              closed: true
     *          },
     *          west: {
     *              pmType: 'panel'
     *              size: 100,
     *              resizable: false
     *          },
     *          east: new PMUI.core.Panel({
     *              id: "east-panel"
     *          }),
     *          eastConfig: {
     *              size: 150,
     *              cssProperties: {
     *                  "background-color" : "#800000"
     *              }
     *          }
     *      };
     *      
     *      layout = new PMUI.panel.LayoutPanel(layoutOptions);
     *      $('body').append(layout.getHTML());
     *      layout.render();
     *
     * @constructor
     * Create a new instance of the LayoutPanel class
     * @param {Object} options Contructor object
     */
    var LayoutPanel = function (options) {
        LayoutPanel.superclass.call(this, options);

        /**
         * @property {String} prefixPlugin
         * The prefix for the classes in jquery.layout plugin
         * @private
         */
        var prefixPlugin = 'ui-layout-',
            /**
             * @property {Array} positions
             * The array with the position accepted in the layout
             * @private
             */
            positions = ['north','center','south','east','west'],
            /**
             * @property {Object} settings
             * Defines the settings acceptted by the layout panel
             * @private
             */
            settings = {
                size: "size",
                closed: "initClosed",
                resizable: "resizable",
                closable: "closable",
                togglerOpen: "togglerLength_open",
                togglerClosed: "togglerLength_closed",
                overflow: "allowOverflow",
                hidden: "initHidden",
                cssProperties: "cssProperties",
                cssClasses: "cssClasses"
            };

        /**
         * @property {Object} panels
         * The settings for the plugin organized by section
         * @private
         */
        this.panels = {};

        /**
         * North panel pointer
         * @type {HTMLElement}
         */
        this.north = null;

        /**
         * Center panel pointer
         * @type {HTMLElement}
         */
        this.center = null;

        /**
         * South panel pointer
         * @type {HTMLElement}
         */
        this.south = null;

        /**
         * East panel pointer
         * @type {HTMLElement}
         */
        this.east = null;

        /**
         * West panel pointer
         * @type {HTMLElement}
         */
        this.west = null;

        /**
         * Javascript pointer to the jquery layout plugin instance
         * @type {Object}
         */
        this.instance = null;

        /**
         * Returns the config object
         * @return {Object} 
         */
        LayoutPanel.prototype.getConfig = function () {
            return {
                panels: this.panels,
                prefix: prefixPlugin,
                positions: positions,
                isSetting: function (value) {
                    var valid = settings[value];
                    return (typeof valid !== 'undefined');
                },
                transformSetting: function (value) {
                    return settings[value];
                }
            };
        };

        /**
         * Sets the panel settings
         * @param {String} pos      Position (north, center, south, east or west)
         * @param {Object} settings Object settings
         */
        LayoutPanel.prototype.setConfig = function (pos, settings) {
            this.panels[pos] = settings;
            return this;
        };

        LayoutPanel.prototype.init.call(this, options);
    };

    PMUI.inheritFrom('PMUI.core.Panel', LayoutPanel);

    /**
     * Defines the object's type
     * @type {String}
     */
    LayoutPanel.prototype.type = 'LayoutPanel';

    /**
     * @private
     * Initializes the object with default values
     * @param  {Object} options 
     */
    LayoutPanel.prototype.init = function (options) {
        var defaults = {
            center: {
                cssProperties: {},
                cssClasses: []
            },
            factory: {
                products: {
                    "layout": PMUI.panel.LayoutPanel,
                    "treePanel": PMUI.panel.TreePanel,
                    "panel": PMUI.core.Panel
                },
                defaultProduct: "panel"
            }
        };
        jQuery.extend(true, defaults, options);
        this.setFactory(defaults.factory)
            .setPluginSettings(defaults)
            .setPanels(defaults);
    };

    /**
     * Calculate and sets the settings for each panel
     * @param {Object} obj Object constructor
     */
    LayoutPanel.prototype.setPluginSettings = function (obj) {
        var config = this.getConfig(),
            that = this;
        jQuery.each(config.positions, function(index, pos){
            var panel = obj[pos],
                panelSettings = {};
            if (panel) {
                if (that.factory && that.factory.isValidClass(panel)) {
                    panelSettings = obj[pos + "Config"] || {};
                } else {
                    jQuery.each(panel, function(key, value){
                        if (config.isSetting(key)){
                            panelSettings[config.transformSetting(key)] = value;
                        }
                    }); 
                }
                //if (panelSettings !== {}) {
                if (!(panelSettings.cssClasses && jQuery.isArray(panelSettings.cssClasses))) {
                    panelSettings.cssClasses = [];
                }
                panelSettings.cssClasses.push(config.prefix + pos);
                that.setConfig(pos, panelSettings);
                //}
            } 
        });
        return this;
    };

    /**
     * Set panels into north, south, center, west and east pointers
     * @param {Object} obj Constructor object
     */
    LayoutPanel.prototype.setPanels = function (obj) {
        var config = this.getConfig(),
            that = this,
            treeOptions;
        jQuery.each(config.positions, function(index, pos){
            if (obj[pos]){
                
                that[pos] = that.factory.make(obj[pos]);

                if (that[pos] instanceof PMUI.panel.LayoutPanel) {
                    that.setConfig(pos, jQuery.extend(true, config.panels[pos], {instance: that[pos]}));
                }
                if (that[pos] instanceof PMUI.panel.TreePanel) {
                    treeOptions = {
                        cssProperties: that[pos].style.cssProperties,
                        cssClasses: that[pos].style.cssClasses
                    };
                    that.setConfig(pos, jQuery.extend(true, config.panels[pos], treeOptions));
                }
                
                that[pos].style.cssProperties = config.panels[pos].cssProperties || {};
                that[pos].style.cssClasses = config.panels[pos].cssClasses || [config.prefix + pos];    
                
                that.addItem(that[pos]);
            }
        });
        return this;
    };


    /**
     * Create html for each item to container 
     * @return {Object} the current object html
     */
    LayoutPanel.prototype.createHTML = function () {
        var i,
            sizeArray,
            items;

        items = this.items.asArray();
        LayoutPanel.superclass.prototype.createHTML.call(this);
        for (i = 0; i < items.length; i+=1) {
            $(this.html).append(items[i].getHTML());
        }
        return this.html;
    };
    /**
     * Render all the html object
     * @param  {Boolean} [recursive] Defines if the render must be recursive
     */
    LayoutPanel.prototype.render = function (recursive) {
        var that = this,
            options,
            renderRecursive = recursive || false;
        options = that.getConfig().panels;
        if (jQuery(that.html).height() === 0){
            jQuery(that.html).height(jQuery(document).height() - 20);
        }
        this.instance = jQuery(that.html).layout(options);

        jQuery.each(options, function(position, val) {
            if (options[position].instance && renderRecursive){
                options[position].instance.render(renderRecursive);
            }
            if (options[position].allowOverflow === true) {
                that.instance.allowOverflow(position);
            }
        });
    };

    /**
     * Remove each html related to the layout from the DOM and destroy the layout instance
     */
    LayoutPanel.prototype.destroy = function () {
        if (this.instance.destroy !== undefined) {
            this.instance.destroy(); 
        }
        if (this.html !== undefined) {
            jQuery(this.html).remove();
            this.html = null;
        }
        this.instance = null;
    };

    PMUI.extendNamespace('PMUI.panel.LayoutPanel', LayoutPanel);

    if (typeof exports !== 'undefined') {
        module.exports = LayoutPanel;
    }

}());