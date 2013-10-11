(function(){
    /**
     * @class PMUI.form.FormPanel
     * @extends PMUI.core.Panel
     * Class to handle form containers for {@link PMUI.form.Field Field objects}, 
     * {@link PMUI.form.FormPanel FormPanel objects}, {@link PMUI.form.Fieldset Fieldset objects} 
     * and {@link PMUI.form.TabPanel TabPanel objects}. 
     *     //usage example
     *     var p;
     * 
     *     $(function() {
     *         p = new PMUI.form.FormPanel({
     *         width: 600, 
     *         height: 100,
     *         fieldset: true,
     *         legend: "my fieldset panel",
     *         items: [
     *             {
     *                 pmType: "text",
     *                 label: "Name",
     *                 id: "123",
     *                 value: "",
     *                 placeholder: "insert your name",
     *                 name: "name"
     *             }, {
     *                 pmType: "text",
     *                 label: "Last name",
     *                 value: "",
     *                 placeholder: "your lastname here asshole!",
     *                 name: "lastname"
     *             }, {
     *                 pmType: "panel",
     *                 layout: 'hbox',
     *                 items: [
     *                     {
     *                         pmType: "text",
     *                         label: "E-mail",
     *                         value: "",
     *                         name: "email"
     *                     },{
     *                         pmType: "text",
     *                         label: "Phone",
     *                         value: "555",
     *                         name: "phone"
     *                     }
     *                 ]
     *             }
     *         ],
     *         layout: "vbox"
     *     });
     *     document.body.appendChild(p.getHTML());
     *  });
     * @cfg {PMUI.form.Form} [form=null] The {@link PMUI.form.Form Form} the object belongs to.
     * @cfg {Array} [items=[]] The array with the items to be contained by the object.
     *      //example
     *      {
     *         ......
     *         items: [
     *             {
     *                 pmType: "text",
     *                 label: "Name",
     *                 id: "123",
     *                 value: "",
     *                 placeholder: "insert your name",
     *                 name: "name"
     *             }, {
     *                 pmType: "text",
     *                 label: "Last name",
     *                 value: "",
     *                 placeholder: "your lastname here asshole!",
     *                 name: "lastname"
     *             }, {
     *                 pmType: "panel",
     *                 layout: 'hbox',
     *                 items: [
     *                     {
     *                         pmType: "text",
     *                         label: "E-mail",
     *                         value: "",
     *                         name: "email"
     *                     },{
     *                         pmType: "text",
     *                         label: "Phone",
     *                         value: "555",
     *                         name: "phone"
     *                     }
     *                 ]
     *             }
     *         ],
     *         ......
     *     });
     * @cfg {Boolean} [fieldset=false] If the panel will have the fieldset behavior.
     */
    var FormPanel = function(settings) {
        /**
         * @property {PMUI.util.ArrayList} fields
         * Object that contains all the object's direct children that are {@link PMUI.form.Field Field} objects.
         * @private
         */
        this.fields = new PMUI.util.ArrayList();
        /**
         * @property {PMUI.util.ArrayList} formPanels 
         * Object that contains all the object's direct children that are {@link PMUI.form.FormPanel FormPanel} objects.
         * @private
         */
        this.formPanels = new PMUI.util.ArrayList();
        /**
         * @property {PMUI.util.ArrayList} tabPanels 
         * Object that contains all the object's direct children that are {@link PMUI.form.TabPanel TabPanel} objects.
         * @private
         */
        this.tabPanels = new PMUI.util.ArrayList();

        FormPanel.superclass.call(this, settings);
        /**
         * @property {Boolean} [fieldset] 
         * If the panel has the fieldset behavior.
         * @readOnly
         */
        this.fieldset = null;
        /**
         * @property {PMUI.form.Form} [form=null] The {@link PMUI.form.Form Form} the object belongs to.
         */
        this.form = null;
        /**
         * @property {String} [legend=""] The text for the legend to show in case of the fieldset behavior will be applied.
         */
        this.legend = null;
        /**
         * @property {String} [legend=""] The HTML element for containt the legend to show in case of the fieldset behavior will be applied.
         */
        this.legendElement = null;

        FormPanel.prototype.init.call(this, settings);
    };

    PMUI.inheritFrom('PMUI.core.Panel', FormPanel);

    FormPanel.prototype.init = function(settings) {
        var defaults = {
            form: null,
            fieldset: false,
            legend: ""
        };

        $.extend(true, defaults, settings);

        this.form = defaults.form;
        this.fieldset = defaults.fieldset;
        this.legend = defaults.legend;

        if(this.fieldset) {
            this.setElementTag("fieldset");
        }
    };
    /**
     * Returns an array of items depending on the parameters the method receives.
     * @param  {String} [filter=undefined]
     * A string which specifiest the bunch of items that will be returned.
     * It defaults to {undefined}, that means that only the direct child items will be in the returned array.
     *
     * Alternatively this param can take one of the following values:
     *
     * - 'fields': it will return only the child {@link PMUI.form.Field Field} items.
     * - 'formPanels': it will return only the child {@link PMUI.form.FormPanel FormPanel} items.
     * - 'tabPanels': it will return only the child {@link PMUI.form.TabPanel TabPanel} items.
     * 
     * @param  {Boolean} [includeChildren=false] 
     *
     * If the value is evaluated as false only the direct child items will be returned, 
     * otherwise additionaly will be added the items for all child items.
     *
     * Note: This parameter only has effect when the [filter] parameter is provided.
     * @return {Array}
     */
    FormPanel.prototype.getItems = function(filter, includeChildren) {
        var res = [], items, size, i, targetArray, the_class;

        switch(filter) {
            case 'fields':
                the_class = PMUI.form.Field;
                targetArray = this.fields;
                break;
            case 'formPanels':
                the_class = PMUI.form.FormPanel;
                targetArray = this.formPanels;
                break;
            case 'tabPanels':
                the_class = PMUI.form.TabPanel;
                targetArray = this.tabPanels;
            default:
                return FormPanel.superclass.prototype.getItems.call(this);
        }

        if(includeChildren) {
            if(the_class) {
                items = this.items.asArray();
                size = items.length;
                for(i = 0; i < size; i += 1) {
                    if(items[i] instanceof the_class) {
                        res.push(items[i]);
                    } else {
                        res = res.concat(items[i].getItems(filter, true));
                    }
                }
            } else {
                throw new Error('getItems(): The valid values for the "filter" parameter are: "fields", "formPanels" or "tabPanels", received: ' + filter);
            }
        } else {
            res = targetArray.asArray().slice(0);
        }
        return res;
    };
    /**
     * Sets the {@link PMUI.util.Factory Factory} object for the FormPanel
     * @param {PMUI.util.Factory|Object} factory It can be a {@link PMUI.util.Factory Factory} object, or a JSON object.
     * If it is a JSON object then a {@link PMUI.form.FormItemFactory FormItemFactory} 
     * is created using the JSON object as the config options.
     * @chainable
     */
    FormPanel.prototype.setFactory = function (factory) {
        if (factory instanceof PMUI.util.Factory){
            this.factory = factory;
        } else {
            this.factory = new PMUI.form.FormItemFactory(factory);
        }
        return this;
    };
    /**
     * Clear all the items.
     * @chainable
     */
    FormPanel.prototype.clearItems = function() {
        FormPanel.superclass.prototype.clearItems.call(this);
        if(this.fields) {
            this.fields.clear();
            this.formPanels.clear();
            this.tabPanels.clear();
        }
        return this;
    };
    /**
     * Sets the text for the legend to be displayed just in case of the fieldset beahvior is beign applied.
     * @param {String} legend
     * @chainable
     */
    FormPanel.prototype.setLegend = function(legend) {
        if(typeof legend === 'string') {
            this.legend = legend;
            if(this.legendElement) {
                this.legendElement.textContent = legend;
            }
        } else {
            throw new Error("setLegend(): this method accepts string values as only parameter.");
        }

        return this;
    };
    /**
     * Creates the HTML element for the FormPanel.
     * @chainable
     */
    FormPanel.prototype.createHTML = function() {
        var legendElement, html;
        if(this.html) {
            return this.html;
        }

        FormPanel.superclass.prototype.createHTML.call(this);

        if(this.fieldset) {
            legendElement = PMUI.createHTMLElement('legend');
            legendElement.textContent = this.legend;
            this.legendElement = legendElement;
            $(this.html).prepend(legendElement);
        }
        return this.html;
    };
    /**
     * Add an item to the object.
     * @param {Object|PMUI.form.Field|PMUI.form.FormPanel|PMUI.form.TabPanel|PMUI.form.Fieldset} item 
     * The item parameter can be:
     *
     * - A JSON object, in that case, it must have at least a "pmType" property 
     * which can have any of the values specifed in the {@link PMUI.form.FormItemFactory FormItemFactory documentation}.
     * - A {@link PMUI.form.Field Field} object.
     * - A {@link PMUI.form.FormPanel FormPanel} object.
     * - A {@link PMUI.form.TabPanel TabPanel} object.
     * - A {@link PMUI.form.Fieldset Fieldset} object.
     */
    FormPanel.prototype.addItem = function(item) {
        var itemToBeAdded;
        if(this.factory) {
            if(this.factory.isValidClass(item) || this.factory.isValidName(item.pmType)) {
                itemToBeAdded = this.factory.make(item);
            } else {
                throw new Error('Invalid item to add.');
            }
        }
        if(itemToBeAdded) {
            itemToBeAdded.setDisplay("inline-block");
            if(itemToBeAdded instanceof PMUI.form.FormPanel) {
                this.formPanels.insert(itemToBeAdded);
            } else if(itemToBeAdded instanceof PMUI.form.Field) {
                this.fields.insert(itemToBeAdded);
            }
        }

        FormPanel.superclass.prototype.addItem.call(this, item);

        return this;
    };

    PMUI.extendNamespace('PMUI.form.FormPanel', FormPanel);

    if (typeof exports !== "undefined") {
        module.exports = FormPanel;
    }
}());