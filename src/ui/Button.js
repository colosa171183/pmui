(function () {
    /**
     * @Class PMUI.ui.Button
     * @extend PMUI.core.Element
     *
     * @constructor
     * Create a new instace of the Window class 
     * @param {Object} settigs Constructor object 
     */
    var Button = function (settings, parent) {
        Button.superclass.call(this, settings);
        this.icon = null;
        this.action = null;
        this.parent = null;
        this.text = null;
        this.aliasButton = null;
        this.minWidth = null;
        Button.prototype.init.call(this, settings, parent);
    };

    PMUI.inheritFrom('PMUI.core.Element', Button);

    Button.prototype.type = 'Button';
    Button.prototype.family = 'Button';

    Button.prototype.init = function (settings, parent) {
        var defaults;

        defaults = {
            icon : null,
           // text : null,
            aliasButton : null,
            parent : parent || null,
            height: "auto",
            minWidth: "auto",
            handler : function (){},
            text : 'undefined-button'
        };

        jQuery.extend(true, defaults, settings);

        this.setIcon(defaults.icon)
            .setAliasButton(defaults.aliasButton)
            .setParent(defaults.parent)
            .setMinWidth(defaults.minWidth)
            .setText(defaults.text);

        this.action = new PMUI.event.Action({
            actionText : this.aliasButton,
            handler: defaults.handler
        });
    };


    Button.prototype.setText = function(text){
        this.text = text;
        return this;
    };

    Button.prototype.setMinWidth = function(minWidth) {
        this.minWidth = minWidth;
        this.style.addProperties({"min-width": minWidth});
        return this;
    };

    Button.prototype.setIcon = function (icon){
        this.icon = icon;
        return this;
    };

    Button.prototype.setAliasButton = function (alias) {
        this.aliasButton = alias;
        return this;
    };

    Button.prototype.setParent = function (parent){
        this.parent = parent;
        return this;
    };

    Button.prototype.Click = function (action, parent) {
        this.action = action;
        this.setAliasButton(this.action.text);
        this.setIcon(this.icon);
        this.setParent(parent);
    };

    Button.prototype.createHTML = function (){
        var Button1, spanIcon, labelSpan;
        if(this.html) {
            return this.html;
        }
        Button1 =PMUI.createHTMLElement('a');
        Button1.href = '#';
        Button1.id = this.id;
        labelSpan = PMUI.createHTMLElement('span');
        labelSpan.className = 'pmui-button-Label';
        labelSpan.appendChild(document.createTextNode(this.text)); 
        Button1.appendChild(labelSpan); 
        this.html = Button1;
        this.applyStyle();
        this.defineEvents();
        return this.html;
    };

    Button.prototype.defineEvents = function () {
        var that=this;
        this.addEvent('click').listen(this.html, function(){
            that.action.execute();
        }); 
    };

    PMUI.extendNamespace("PMUI.ui.Button", Button);
        
        if (typeof exports !== "undefined") {
            module.exports = Button;
        }
}());

