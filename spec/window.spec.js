global.dom = require('jsdom');
global.window = $ = null;
global.window = global.dom.jsdom().createWindow();
global.document = global.window.document;
global.PMUI = require('../src/pmui.js');

global.dom.env({
    html: '<body></body>',
    scripts: ['../libraries/jquery-ui/js/jquery-1.9.1.js', '../libraries/jquery-ui/js/jquery-ui-1.10.3.custom.js'],
    done: function(errors, _window) {
        if (errors) {
          console.log("errors:", errors);
        }
        global.window = _window;
        global.document = _window.document;
        return global.$ = global.jQuery = window.$;
    }
});

if (!$) {
  beforeEach(function() {
    return waitsFor(function() {
      return $;
    });
  });
}

global.PMUI = require('../src/pmui.js');
var ArrayList = require('../src/util/ArrayList.js'),
    Style = require('../src/util/Style.js'),
    Base = require('../src/core/Base.js'),
    Factory = require('../src/util/Factory.js'),
    Element = require('../src/core/Element.js'),
    Layout = require('../src/layout/Layout.js'), 
    Box = require('../src/layout/Box.js'),
    HBox = require('../src/layout/HBox.js'),
    VBox = require('../src/layout/VBox.js'),
    LayoutFactory = require('../src/layout/LayoutFactory.js'),
    Event = require ('../src/event/Event.js'),
    EventFactory = require('../src/event/EventFactory.js'),
    MouseEvent = require('../src/event/MouseEvent.js'),
    KeyboardEvent = require('../src/event/KeyboardEvent.js'),
    FormEvent = require('../src/event/FormEvent.js'),
    Action = require('../src/event/Action.js'),
    Container = require('../src/core/Container.js'),
    Panel = require("../src/core/Panel.js"),
    Window = require('../src/ui/Window.js'),
    Button = require("../src/ui/Button.js");

describe('class Window', function () {
    var classWindow, classWindow2, button1, button2, padding=18;
    describe('Behavior class Window',function(){
       it("[US-16,d] should be able to instantiate a class Window Default",function() {
            classWindow = new PMUI.ui.Window();
            expect(classWindow).toBeDefined();
            expect(classWindow instanceof PMUI.ui.Window).toBeTruthy();
            expect(classWindow.type).toEqual('Window');
            expect(classWindow.family).toEqual('ui');
            expect(classWindow.title).toEqual('[Untitled window]');
            expect(classWindow.modal).toEqual(true);
            expect(classWindow.height).toEqual(300-padding);
            expect(classWindow.width).toEqual(400-padding);
        });

         it("[US-16,e] should be able to create buttons for use on windows",function() {
        
            classWindow2 = new PMUI.ui.Window ({
                width:600,
                height:'auto',
                footerHeight:'auto',
                bodyHeight:300,
                buttons: [
                        new PMUI.ui.Button({
                            text: 'button1',
                            handler: function() {
                                alert('button1');
                            }
                        }),
                        {
                            text: 'button2',
                            handler: function() {
                                alert('button2');
                            }
                        }
                    ]
            });
            expect(classWindow2).toBeDefined();
            expect(classWindow2 instanceof PMUI.ui.Window).toBeTruthy();
            for (var i=0 ;i<=classWindow2.buttons.getSize ; i++){
                expect(classWindow2.buttons[i].text).toEqual('button'+(i+1));
            }
        });
        it("[US-16,f] should be able to create an object of type Window Modal or No Modal",function() {
            var classWindow3,classWindow4;
            classWindow3 = new PMUI.ui.Window ();
            classWindow4 = new PMUI.ui.Window ({
                modal: false
            });
            expect(classWindow3).toBeDefined();  
            expect(classWindow3 instanceof PMUI.ui.Window).toBeTruthy();
            expect(classWindow3.modal).toEqual(true);
            expect(classWindow4).toBeDefined();
            expect(classWindow4 instanceof PMUI.ui.Window).toBeTruthy();
            expect(classWindow4.modal).toEqual(false);
             
        });
        
        it("[US-16,g] should be able to define the title on the header of my window",function() {
            var classWindow5;
            classWindow5 = new PMUI.ui.Window ({
                title : '[US-6,c]',
                fixCloseButton : false
            });
            expect(classWindow5).toBeDefined();  
            expect(classWindow5 instanceof PMUI.ui.Window).toBeTruthy();
            expect(classWindow5.getTitle()).toEqual('[US-6,c]');
            classWindow5.createHTML();
            expect(classWindow5.titleContainer.textContent === '[US-6,c]').toBeTruthy();
            expect(classWindow5.fixCloseButton).toEqual(false);
        });
         it("[US-16,h] should be able to manipulate the height of the window, body and footer independently of the other sections",function() {
            var classWindow6, b;    
            classWindow6 = new PMUI.ui.Window();
            classWindow6.createHTML();
            classWindow6.setBodyHeight(100);
            classWindow6.setFooterHeight(30);
            expect(classWindow6).toBeDefined();  
            expect(classWindow6 instanceof PMUI.ui.Window).toBeTruthy();
            expect(classWindow6.bodyHeight).toEqual(100);
            expect(classWindow6.footerHeight === 30).toBeTruthy();
            expect(typeof(classWindow6.footerHeight)).toEqual('number');
            });
    });
    describe('method "createHTML"', function () {
        it('should create a new html element', function () {
            classWindow1 = new PMUI.ui.Window();
            var h = classWindow1.createHTML();
            expect(h).toBeDefined();
            expect(h.tagName).toBeDefined();
            expect(h.nodeType).toBeDefined();
            expect(h.nodeType).toEqual(document.ELEMENT_NODE);
        });
    });
    describe('method "updateDimensions"', function () {
        it('should update Window Dimensions', function () {
            classWindow6 = new PMUI.ui.Window();
            classWindow6.setBodyHeight(10);
            classWindow6.setFooterHeight(30);
            expect(classWindow6).toBeDefined();
            expect(classWindow6.bodyHeight).toEqual(10);
            expect(classWindow6.footerHeight === 30).toBeTruthy();
        });
    });
    describe('method "centerWindow"', function () {
        it('should set Window location in the center of the display', function () {
            classWindow1 = new PMUI.ui.Window();
            classWindow1.setHeight(200);
            classWindow1.setWidth(200);
            classWindow1.open();
            expect(classWindow1).toBeDefined();
            expect(jQuery('.pmui-window').css('margin-top')).toEqual((classWindow1.height/-2)+'px');
            expect(jQuery('.pmui-window').css('margin-left')).toEqual((classWindow1.width/-2)+'px');
             
        });
    });

});
