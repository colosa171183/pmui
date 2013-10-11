(function () {
    /**
     * @class PMUI.ui.Window
     * @extend PMUI.core.Panel
     *
     * @constructor
     * Create a new instace of the Window class 
     * @param {Object} options Constructor object
     * 
     * Create a new instance of the Window class
     * Below is an example of instantiation of this class:
     * From width is a number, px, 'auto' whit Window 
     * From height is a number, px, 'auto' whit Window
     * From BodyHeight is a number, px, 'auto' whit the body Window
     * From footerHeight is a number, px, 'auto' whit the footer Window
     * the head window is 1em is not a modified
     * the Window Modal is define for value true default or false send the object json
     * the title is define defualt or value send the object json 
     *   
     *        var w;
     *        $(function() {
     *             w = new PMUI.ui.Window({
     *                   title: 'Richard Noel',
     *                   modal : false,
     *                   width: 600,
     *                   height: 'auto',
     *                  footerHeight: 'auto',
     *              bodyHeight: 300
     *         });
     *              w.open();
     *         });
     *      
     */
    var Window = function (settings){
        Window.superclass.call(this, jQuery.extend(true, {width: 400}, settings));
        /**
         * @property {String} title
         * String to indicated the title in the head of the Window 
         */
        this.title = null;
        /**
         * Defines the window header HTML Element where are placed the title label HTML Element and 
         the Close Button HTML Element
         * @type {HTMLElement}
         */
        this.header = null;
        /**
         * Defines the window container title HTML Element where are placed the title label
         * @type {HTMLElement}
         */
        this.titleContainer = null;
        /**
         * Defines the window body HTML Element where is fix the content
         * @type {HTMLElement}
         */
         this.body = null;
        /**
         * Defines the window footer HTML Element where are placed the Buttons or labels
         * @type {HTMLElement}
         */
        this.footer = null;
        /**
         * Defines the Button Object to handle close the windows
         * @type {Button}
         */
        this.closeButton = null;
        /**
         * Defines the window's modal property
         * @type {Boolean}
         */
        this.modal = false;
        /**
         * Defines the window modal HTML Element, if modal is true
         * @type {HTMLElement}
         */
        this.modalObject = null;
        /**
         * Height for the HTML header, it can be a number or a string with the following format: 
         ##px when ## is a number
         * @type {Number|String}
         */
        this.headerHeight = null;
        /**
         * Height for the HTML body, it can be a number or a string with the following format: 
         ##px when ## is a number
         * @type {Number|String}
         */
        this.bodyHeight = null;
        /**
         * Height for the HTML footer, it can be a number or a string with the following format:
         ##px when ## is a number
         * @type {Number|String}
         */
        this.footerHeight = null;
        /**
         * Defines the window open o close property
         * @type {Boolean}
         */
        this.opened = false;
        /**
         * Defines the style number padding for the HTMLElemet header, body and footer
         * @type {number}
         */
        this.windowPadding = null;
        /**
         * Defines the window's arrayList objects
         * @type {arrayList}
         */
        this.buttons = new PMUI.util.ArrayList();

        this.buttonsPosition = null;
        this.spaceButtons = null;
        this.fixCloseButton = false;
        Window.prototype.init.call(this, settings);
    };

    PMUI.inheritFrom('PMUI.core.Panel', Window);
    /**
     * Defines the object's type
     * @type {String}
     */
    Window.prototype.type = 'Window';
    /**
     * Defines the object's family
     * @type {String}
     */
    Window.prototype.family = 'ui';

    Window.prototype.init = function (settings) {
        var defaults = {
            title : '[Untitled window]',
            modal : true,
            height : 300,
            width : 400,
            headerHeight : "1em",
            bodyHeight : "auto",
            footerHeight : 0,
            windowPadding: 8,
            zOrder: 100,
            buttons: [],
            buttonsPosition: 'right',
            spaceButtons : 15,
            fixCloseButton : true
        };

        jQuery.extend(true, defaults, settings);

        this.windowPadding = defaults.windowPadding;

        this.setTitle(defaults.title)
            .setModal(defaults.modal)
            .setWidth(defaults.width)
            .setHeight(defaults.height)
            .setHeaderHeight(defaults.headerHeight)
            .setBodyHeight(defaults.bodyHeight)
            .setFooterHeight(defaults.footerHeight)
            .setZOrder(defaults.zOrder)
            .setSpaceButtons(defaults.spaceButtons)
            .setButtons(defaults.buttons)
            .setButtonsPosition(defaults.buttonsPosition)
            .setFixCloseButton(defaults.fixCloseButton);

        this.style.addProperties({
            "padding": defaults.windowPadding
        });
    };

    Window.prototype.setFixCloseButton = function (value) {
        this.fixCloseButton = value;
        return this;
    };

    Window.prototype.setButtonsPosition = function (buttonsPosition){
        this.buttonsPosition = buttonsPosition;
        return this;
    };

    Window.prototype.setSpaceButtons = function (spaceButtons){
        this.spaceButtons = spaceButtons;
        return this;
    };

    Window.prototype.getSpaceButtons = function ( ){
        return this.spaceButtons;  
    };

    /**
     * fixed window in the center of the monitor
     * chainable
     */
    Window.prototype.centerWindow = function() {
        if(this.opened) {
            this.style.addProperties({
                "left": "50%",
                "margin-left": (this.width / -2) + "px",
                "top": "50%",
                "margin-top": (jQuery(this.html).outerHeight() / -2) + "px"
            });
        }
        return this;
    };
    /**
     * updates the dimensions of the height of the HTMLElement window, body and foot when 
     it is modified by the user
     * @chainable
     */

    Window.prototype.updateDimensions = function() {
        var usableHeight;
        if(this.opened) {
            this.centerWindow();
            if(this.height !== 'auto') {
                usableHeight = $(this.html).height() - $(this.header).outerHeight() - $(this.footer).outerHeight();
                this.body.style.height = (usableHeight - 2) + "px";
            } else {
                if(this.bodyHeight !== 'auto') {
                    this.body.style.height = this.bodyHeight + "px";
                } else {
                    this.body.style.height = this.bodyHeight;
                }
                if(this.footerHeight !== 'auto') {
                    this.footer.style.height = this.footerHeight + "px";
                } else {
                    this.footer.style.height = this.footerHeight;
                }
            }   

            
            if(this.modal) {
                this.updateModalDimensions();
                this.centerWindow();
            }
            
        }
        return this;
    };


    Window.prototype.getFooterHeight = function () {
        return this.FooterHeight;
    };
    /**
     * Set the width for the HTML element
     * @param {Number|String} width height it can be a number or a string.
      In case of using a String you only can use 'auto' or 'inherit' or ##px or ##% or ##em when ## is a number
     * @chainable
     */
    Window.prototype.setWidth = function(width) {
        if(typeof width === 'number') {
            this.width = width - ((this.windowPadding || 0) * 2) - 2;
        } else if(/^\d+(\.\d+)?px$/.test(width)) {
            this.width = parseInt(width, 10) - ((this.windowPadding || 0) * 2) - 2;
        } else {
            throw new Error('setWidth: width param is not valid.');
        }

        Window.superclass.prototype.setWidth.call(this, this.width);

        return this;
    };

    Window.prototype.getWidth = function () {
        return this.width;
    };
    /**
     * high fixed size for the main window
     * @param {Number|String} height it can be a number or a string.
      In case of using a String you only can use 'auto' or 'inherit' or ##px or ##% or ##em when ## is a number.
     * @chainable
     */
    Window.prototype.setHeight = function(height) {
        if(typeof height === 'number') {
            this.height = height - ((this.windowPadding || 0) * 2) - 2;
        } else if(/^\d+(\.\d+)?px$/.test(height)) {
            this.height = parseInt(height, 10) - ((this.windowPadding || 0) * 2) - 2;
        } else if(height === 'auto') {
            this.height = height;
        } else {
            throw new Error('setHeight: height param is not valid.');
        }

        Window.superclass.prototype.setHeight.call(this, this.height);

        this.updateDimensions();

        return this;
    };

    Window.prototype.getHeight = function () {
        return this.height;
    };

    Window.prototype.getTitle = function () {
        return this.title;
    }
    /**
     * high fixed size for the footer of the window
     * @param {Number|String} height it can be a number or a string.
      In case of using a String you only can use 'auto' or 'inherit' or ##px or ##% or ##em when ## is a number.
     * @chainable
     */
    Window.prototype.setFooterHeight = function(footerHeight) {
        if(typeof footerHeight === 'number') {
            this.footerHeight = footerHeight;
        } else if(/^\d+(\.\d+)?px$/.test(footerHeight)) {
            this.footerHeight = parseInt(footerHeight, 10);
        } else if(footerHeight === 'auto') {
            this.footerHeight = footerHeight;
        } else {
            throw new Error('setFooterHeight: footerHeight param is not valid.');
        }
        if(this.footer) {
            this.footer.style.height = this.footerHeight + 'px';
        }
        this.updateDimensions();

        return this;
    };
    /**
     * high fixed size for the body of the window
     * @param {Number|String} height it can be a number or a string.
      In case of using a String you only can use 'auto' or 'inherit' or ##px or ##% or ##em when ## is a number.
     * @chainable
     */
    Window.prototype.setBodyHeight = function(bodyHeight) {
        if(typeof bodyHeight === 'number') {
            this.bodyHeight = bodyHeight;
        } else if(/^\d+(\.\d+)?px$/.test(bodyHeight)) {
            this.bodyHeight = parseInt(bodyHeight, 10);
        } else if(bodyHeight === 'auto') {
            this.bodyHeight = bodyHeight;
        } else {
            throw new Error('setBodyHeight: bodyHeight param is not valid.');
        }

        this.updateDimensions();

        return this;
    };
    /**
     * high fixed size for the Head of the window
     * @param {Number|String} height it can be a number or a string.
      In case of using a String you only can use 'auto' or 'inherit' or ##px or ##% or ##em when ## is a number.
     * @chainable
     */
    Window.prototype.setHeaderHeight = function(headerHeight) {
        if(typeof headerHeight === 'number') {
            this.headerHeight = headerHeight;
        } else if(/^\d+(\.\d+)?px$/.test(headerHeight)) {
            this.headerHeight = parseInt(headerHeight, 10);
        } else if(/^\d+(\.\d+)?%$/.test(headerHeight)) {
            this.headerHeight = headerHeight;
        } else if(/^\d+(\.\d+)?em$/.test(headerHeight)) {
            this.headerHeight = headerHeight;
        } else {
            throw new Error('setHeaderHeight: headerHeight param is not valid');
        }
        this.updateDimensions();
        return this;
    }; 
    /**
     * Set if the HTML element is modal or not
     * @param {Boolean} visible
     * @chainable
     */    
    Window.prototype.setModal = function(modal) {
        if(typeof modal !== 'undefined') {
            this.modal = !!modal;
        }
        return this;
    };
    /**
     * Sets the window title in the header part of the window
     * Set the proportion of the html element
     * @param {string} title
     * @chainable
     */    
    Window.prototype.setTitle = function(title) {
        if(typeof title === 'string') {
            this.title = title;
            if(this.titleContainer) {
                this.titleContainer.textContent = title;
                this.titleContainer.title = title;
            }
        } else {
            throw new Error("The setTitle() method accepts only string values.");
        }
        return this;
    };
    /**
     * Adds item to the object Window Body and Footer
     * @param {PMUI.core.Element|Object} item It can be one of the following data types:
     * - {PMUI.core.Element} the object to add
     * - {Object} a JSON object with the settings for the Container to be added
     * @chainable
     */
    Window.prototype.setButtons = function(buttons) {
        var itemToBeAdded, length,
            spaceBetweenButtons = this.getSpaceButtons() / 2,
            factory = new PMUI.util.Factory({
                products: {
                    "button": PMUI.ui.Button
                },
                defaultProduct: "button"
            }),
            that = this;
        //where = typeof where === 'undefined' ? 'body' : where;
        //
        length = buttons.length;
        jQuery.each(buttons, function (i, button){

            switch(i) {
                case 0:
                        itemToBeAdded = factory.make(button);
                        itemToBeAdded.style.addProperties({"margin-right" :spaceBetweenButtons});
                    break;
                case length-1:
                        itemToBeAdded = factory.make(button);
                        itemToBeAdded.style.addProperties({"margin-left" :spaceBetweenButtons});
                    break;
                default :
                        itemToBeAdded = factory.make(button);
                        
                        itemToBeAdded.style.addProperties({"margin-left" :spaceBetweenButtons});
                        itemToBeAdded.style.addProperties({"margin-right" :spaceBetweenButtons});
                    break;
            }
            itemToBeAdded.style.addProperties({"margin-top" :'1%'});
            that.buttons.insert(itemToBeAdded);
            if (that.html) {
                that.footer.appendChild(itemToBeAdded.getHTML());
            }
        });

        return this;
    };
    /**
     * Adds an child item to the body HTMLElement
     * @param {PMUI.core.Window|Object} item It can be one of the following data types:
     * - {PMUI.core.Element} the object to add
     * - {Object} a JSON object with the settings for the Container to be added
     * @chainable
     */
    Window.prototype.addItem = function(item) {

        var itemToBeAdded;
  
        if (this.factory) {
            itemToBeAdded = this.factory.make(item);
        }
        if (itemToBeAdded && !this.isDirectParentOf(itemToBeAdded)) {
            itemToBeAdded.parent = this;

                this.items.insert(itemToBeAdded);
                if (this.body) {
                    this.body.appendChild(itemToBeAdded.getHTML());
                }
        }

        return this;
    };

    /**
     * @abstract
     * Defines the events associated with the Window
     */
    Window.prototype.defineEvents = function() {
        var that = this, html = this.html, modal = this.modal,buttons,
            stopPropagation = new PMUI.event.Action({
                handler: function (e) {
                    e.stopPropagation();
                }
            }),
            updateDimensions = new PMUI.event.Action({
                handler: function() {
                    that.updateModalDimensions();
                }
            });

        if(html) {
            this.addEvent('mousedown').listen(this.body, stopPropagation);
            this.addEvent('mousedown').listen(this.footer, stopPropagation);
            that.addEvent('click').listen(modal, stopPropagation);
            that.addEvent('mouseover').listen(modal, stopPropagation);
            that.addEvent('mouseout').listen(modal, stopPropagation);
            //that.addEvent('mouseup').listen(modal, stopPropagation);
            that.addEvent('mousedown').listen(modal, stopPropagation);
            that.addEvent('resize').listen(window, updateDimensions);

            //that.closeButton.defineEvents();
        }
    };

    /**
     * Creates natural elements to the window html: head, body and foot
     * @return {HTMLElement} returns a HTML element
     */
    Window.prototype.createHTML = function() {
        var header, buttons, body, footer, titleContainer, closeButton, modal, that = this;

        if(this.html) {
            return this.html;
        }

        Window.superclass.prototype.createHTML.call(this);

        header = PMUI.createHTMLElement('div');
        header.className = 'pmui-window-header';
        body = PMUI.createHTMLElement('div');
        body.className = 'pmui-window-body';
        body.style.textAlign = 'center';
        footer = PMUI.createHTMLElement('div');
        footer.className = 'pmui-window-footer';
        footer.style.textAlign = this.buttonsPosition;
        modal = PMUI.createHTMLElement('div');
        modal.className = 'pmui-window-modal';
        modal.id = this.id + "-modal";

        titleContainer = PMUI.createHTMLElement('span');
        titleContainer.className = 'pmui-window-title';

        closeButton = new PMUI.ui.Button({
            text: 'X',
            style: {
                cssClasses: ['pmui-window-close']
            },
            handler: function() {
                that.close();
            }
        });

        this.modalObject = modal;
        if(this.fixCloseButton){
            header.appendChild(closeButton.getHTML());
        }
        header.appendChild(titleContainer);
        this.html.appendChild(header);
        this.html.appendChild(body);
        this.html.appendChild(footer);

        this.header = header;
        this.body = body;
        this.footer = footer;
        this.titleContainer = titleContainer;
        this.closeButton = closeButton;

        this.setTitle(this.title)
            .setFooterHeight(this.footerHeight)
            .setItems(this.items.asArray().slice(0));

        buttons = this.buttons.asArray();
        jQuery.each(buttons, function(i,b) {
            that.footer.appendChild(b.getHTML());
        });

        this.defineEvents();

        return this.html;
    };
    /**
     * Returns a boolean value that indicates if the window is open or is close
     * @return {Boolean} [description]
     */
    Window.prototype.isOpen = function() {
        return this.opened;
    };

    /**
     * Actualiza el estado del HTMLElement modal 
     * updates the status of modal HTMLElement and 
     fixed all styles required to show
     */
    Window.prototype.updateModalDimensions = function() {
        var width, height;

        if(document && this.modalObject) {
            this.modalObject.style.height = this.modalObject.style.width = "0px";
            width = jQuery(document).width();
            height = jQuery(document).height();
            this.modalObject.style.width = width + "px";
            this.modalObject.style.height = height + "px";
        }

        return this;
    };
    /**
     * If the window is closed, sets the status to open and displays the values ​​
     set in the properties window, header, body and footer
     * @chainable
     */
    Window.prototype.open = function() {
        var the_window;
        if(this.opened) {
            return this;
        }
        the_window = this.getHTML();
        if(this.modal) {
            this.modalObject.appendChild(the_window);
            document.body.appendChild(this.modalObject);
            jQuery(the_window).draggable({ containment: '#' + this.modalObject.id, scroll: false });
        } else {
            document.body.appendChild(the_window);
            jQuery(this.getHTML()).draggable();
        }
        this.opened = true;
        this.updateDimensions();
        this.setVisible(true);

        return this;
    };
    /**
    * if the window is open, sets the status to closed
    * * @chainable
    */
    Window.prototype.close = function ( ) {
        jQuery(this.modalObject).remove();
        jQuery(this.html).remove();
        jQuery(this.closeButton).remove();
        this.opened = false;

        return this;
        

    };
    
    PMUI.extendNamespace("PMUI.ui.Window", Window);
    
    if (typeof exports !== "undefined") {
        module.exports = Window;
    }
}());   
