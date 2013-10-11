(function(){
    /**
     * @class PMUI.form.Fieldset
     * @extends PMUI.core.Panel
     * Class to handle form a fieldset container for {@link PMUI.form.Field Field objects}, {@link PMUI.form.FormPanel FormPanel objects}, {@link PMUI.form.Fieldset Fieldset objects} and {@link PMUI.form.TabPanel TabPanel objects}. 
     *  //usage example
     *  var p;
     *      $(function() {
     *      p = new PMUI.form.Fieldset({
     *      width: 600, 
     *      height: 100,
     *      items: [
     *          {
     *              pmType: "text",
     *              label: "Name",
     *              id: "123",
     *              value: "",
     *              placeholder: "insert your name",
     *              name: "name"
     *          },{
     *              pmType: "text",
     *              label: "Last name",
     *              value: "",
     *              placeholder: "your lastname here asshole!",
     *              name: "lastname"
     *          }, {
     *              pmType: "fieldset",
     *              layout: 'hbox',
     *              items: [
     *                  {
     *                      pmType: "text",
     *                      label: "E-mail",
     *                      value: "",
     *                      name: "email"
     *                  },{
     *                      pmType: "text",
     *                      label: "Phone",
     *                      value: "555",
     *                      name: "phone"
     *                  }
     *              ]
     *          }
     *      ],
     *      layout: "vbox"
     *  });
     *  document.body.appendChild(p.getHTML());
     *  
     * @cfg {PMUI.form.Form} [form=null] The {@link PMUI.form.Form Form} the object belongs to.
     * @cfg {Array} [items=[]] The array with the items to be contained by the object.
     *      //example
     *      {
     *      ....
     *      items: [
     *          {
     *              pmType: "text",
     *              label: "Last name",
     *              value: "",
     *              placeholder: "your lastname here asshole!",
     *              name: "lastname"
     *          }, {
     *              pmType: "panel",
     *              layout: 'hbox',
     *              items: [
     *                  {
     *                      pmType: "text",
     *                      label: "E-mail",
     *                      value: "",
     *                      name: "email"
     *                  },{
     *                      pmType: "text",
     *                      label: "Phone",
     *                      value: "555",
     *                      name: "phone"
     *                  }
     *              ]
     *          }
     *      ]
     *      .....};
     */
    var Fieldset = function(settings) {
        this.legend = null;
        /**
         * @property {PMUI.util.ArrayList} fields Object that contains all the object's direct children that are {@link PMUI.form.Field Field} objects.
         * @private
         */
        this.fields = new PMUI.util.ArrayList();
        /**
         * @property {PMUI.util.ArrayList} formPanels Object that contains all the object's direct children that are {@link PMUI.form.FormPanel FormPanel} objects.
         * @private
         */
        this.formPanels = new PMUI.util.ArrayList();
        /**
         * @property {PMUI.util.ArrayList} tabPanels Object that contains all the object's direct children that are {@link PMUI.form.TabPanel TabPanel} objects.
         * @private
         */
        this.tabPanels = new PMUI.util.ArrayList();
        /**
         * @property {PMUI.util.ArrayList} fieldsets Object that contains all the object's direct children that are {@link PMUI.form.Fieldset Fieldset} objects.
         * @private
         */
        this.fieldsets = new PMUI.util.ArrayList();

        Fieldset.superclass.call(this, settings);
        /**
         * @property {PMUI.form.Form} [form=null] The {@link PMUI.form.Form Form} the object belongs to.
         */
        this.form = null;

        Fieldset.prototype.init.call(this, settings);
    };

    PMUI.inheritFrom('PMUI.core.Panel', FormPanel);

    Fieldset.prototype.init = function(settings) {
        var defaults = {
            form: null
        };

        $.extend(true, defaults, settings);

        this.form = defaults.form;
    };
    /**
     * Return the child {@link PMUI.form.Field Field} objects.
     * @param  {Boolean} [includeChildren=false] If the returning array will include the child panel's {@link PMUI.form.Field Field} objects.
     * @return {Array} An array where each element is a {@link PMUI.form.Field Field} object.
     */
    Fieldset.prototype.getFields = function(includeChildren) {
        var res = [], items, size, i;

        if(includeChildren) {
            items = this.getItems();
            size = items.length;
            for(i = 0; i < size; i += 1) {
                if(items[i] instanceof PMUI.form.Field) {
                    res.push(items[i]);
                } else {
                    res = res.concat(items[i].getFields(true));
                }
            }
        } else {
            res = this.fields.asArray().slice(0);   
        }
        return res;
    };
    /**
     * Return the child {@link PMUI.form.FormPanel FormPanel} objects.
     * @param  {Boolean} [includeChildren=false] If the returning array will include the child panel's {@link PMUI.form.FormPanel FormPanel} objects.
     * @return {Array} An array where each element is a {@link PMUI.form.FormPanel FormPanel} object.
     */
    Fieldset.prototype.getFormPanels = function(includeChildren) {
        var res = [], items, size, i;

        if(includeChildren) {
            items = this.getItems();
            size = items.length;
            for(i = 0; i < size; i += 1) {
                if(items[i] instanceof PMUI.form.FormPanel) {
                    res = res.concat(items[i].getFormPanels(true));
                }
            }
        } else {
            res = this.formPanels.asArray().slice(0);   
        }
        return res;
    };
    /**
     * Return the child {@link PMUI.form.TabPanel TabPanel} objects.
     * @param  {Boolean} [includeChildren=false] If the returning array will include the child panel's {@link PMUI.form.TabPanel TabPanel} objects.
     * @return {Array} An array where each element is a {@link PMUI.form.TabPanel TabPanel} object.
     */
    Fieldset.prototype.getTabPanels = function(includeChildren) {
        var res = [], items, size, i;

        if(includeChildren) {
            items = this.getItems();
            size = items.length;
            //for(i = 0; i < size; i += 1) {
                /*if(items[i] instanceof PMUI.form.tabPanels) {
                    res = res.concat(items[i].getFormPanels(true));
                }*/
            //}
        } else {
            res = this.tabPanels.asArray().slice(0);
        }
        return res;
    };
    /**
     * Return the child {@link PMUI.form.Fieldset Fieldset} objects.
     * @param  {Boolean} [includeChildren=false] If the returning array will include the child panel's {@link PMUI.form.Fieldset Fieldset} objects.
     * @return {Array} An array where each element is a {@link PMUI.form.Fieldset Fieldset} object.
     */
    Fieldset.prototype.getFieldsets = function() {
        var res = [], items, size, i;

        if (includeChildren) {
            items = this.getItems();
            size = items.length;
            //for(i = 0; i < size; i += 1) {
                /*if(items[i] instanceof PMUI.form.FormPanel) {
                    res = res.concat(items[i].getFormPanels(true));
                }*/
            //}
        } else {
            res = this.fieldsets.asArray().slice(0);
        }
        return res;
    };
    /**
     * Sets the {@link PMUI.util.Factory Factory} object for the FormPanel
     * @param {PMUI.util.Factory|Object} factory It can be a {@link PMUI.util.Factory Factory} object, or a JSON object.
     * If it is a JSON object then a {@link PMUI.form.FormItemFactory FormItemFactory} is created using the JSON object as the config options.
     * @chainable
     */
    Fieldset.prototype.setFactory = function (factory) {
        if (factory instanceof PMUI.util.Factory){
            this.factory = factory;
        } else {
            this.factory = new PMUI.form.FormItemFactory(factory);
        }
        return this;
    };
    /**
     * Cleat all the items.
     * @chainable
     */
    Fieldset.prototype.clearItems = function() {
        FormPanel.superclass.prototype.clearItems.call(this);
        if(this.fields) {
            this.fields.clear();
            this.formPanels.clear();
            this.tabPanels.clear();
            this.fieldsets.clear(); 
        }
        return this;
    };
    /**
     * Add an item to the object.
     * @param {Object|PMUI.form.Field|PMUI.form.FormPanel|PMUI.form.TabPanel|PMUI.form.Fieldset} item 
     * The item parameter can be:
     *
     * - A JSON object, in that case, it must have at least a "pmType" property which can have any of the values specifed in the {@link PMUI.form.FormItemFactory FormItemFactory documentation}.
     * - A {@link PMUI.form.Field Field} object.
     * - A {@link PMUI.form.FormPanel FormPanel} object.
     * - A {@link PMUI.form.TabPanel TabPanel} object.
     * - A {@link PMUI.form.Fieldset Fieldset} object.
     */
    Fieldset.prototype.addItem = function(item) {
        var itemToBeAdded;
        if(this.factory) {
            if(this.factory.isValidClass(item) || this.factory.isValidName(item.pmType)) {
                itemToBeAdded = this.factory.make(item);
            } else {
                throw new Error('Invalid item to add.');
            }
        }
        if(itemToBeAdded) {
            if(itemToBeAdded instanceof PMUI.form.FormPanel) {
                this.formPanels.insert(itemToBeAdded);
            } else if(itemToBeAdded instanceof PMUI.form.Fieldset) {
                this.fieldsets.insert(itemToBeAdded);
            } else if(itemToBeAdded instanceof PMUI.form.Field) {
                this.fields.insert(itemToBeAdded);
            }
        }

        FormPanel.superclass.prototype.addItem.call(this, item);

        return this;
    };

    PMUI.extendNamespace('PMUI.form.Fieldset', FormPanel);

    if (typeof exports !== "undefined") {
        module.exports = FormPanel;
    }
}());