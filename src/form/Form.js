(function() {
    var Form = function(settings) {
        Form.superclass.call(this, settings);
        this.name = null;
        this.action = null;
        this.encType = null;
        this.containers = [];
        this.fields = [];
        this.title = null;

        Form.prototype.init.call(this, settings);
    };

    PMUI.inheritFrom('PMUI.core.Panel', Form);

    Form.prototype.type = 'PMForm';

    Form.prototype.family = 'PMForm';

    Form.prototype.init = function(settings) {
        var defaults = {
            title: "Untitled form",
            name: this.id,
            action: "",
            encType: "application/x-www-form-urlencoded",
            items: []
        };

        this.setTitle(defaults.title)
            .setName(defaults.name)
            .setAction(defaults.action)
            .setEncType(defaults.encType)
            .setItems();
    };

    Form.prototype.setTitle = function(title) {
        if(typeof title === 'string') {
            this.title =  title;
            if(this.header) {
                $(this.header).empty().append('<h2 class="pmui-' + this.family + '-header-title"></h2>');
            }
        }

        return this;
    };

    Form.prototype.setName = function(name){
        this.name = name;
        if(this.html) {
            this.html.name = name;
        }

        return this;
    };

    Form.prototype.setAction = function(action) {
        this.action = action;
        if(this.html) {
            this.html.action = action;
        }

        return this;
    };

    Form.prototype.setEncType = function(encType) {
        this.encType = encType;
        if(this.html) {
            this.html.encType = encType;
        }

        return this;
    };

    Form.prototype.createHTML = function() {
        var html;

        if(this.html) {
            return this.html;
        }

        html = this.createHTMLElement('form');
        this.html = html;
        this.setName(this.name);
        this.setAction(this.action);
        this.setEncType(this.encType);

        this.header = this.createHTMLElement('div');
        this.header.className = 'pmui-' + this.family + '-header';
        this.body = this.createHTMLElement('div');
        this.body.className = 'pmui-' + this.family + '-body';
        this.footer = this.createHTMLElement('div');
        this.footer.className = 'pmui-' + this.family + '-footer';
        this.html.className = 'pmui-' + this.family;
        this.html.appendChild(this.header);
        this.html.appendChild(this.body);
        this.html.appendChild(this.footer);
        this.setBodyHeight(this.bodyHeight);
        this.setTitle(this.title)
            .setName(this.name)
            .setAction(this.action)
            .setEncType(this.encType);
        //this.setItems(this.items.asArray());
        this.style.applyStyle();    

        return this.html;
    };

    // Declarations created to instantiate in NodeJS environment
    if (typeof exports !== "undefined") {
        module.exports = Form;
    }

    PMUI.extendNamespace('PMUI.form.Form', Form);
}());