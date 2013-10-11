global.dom = require('jsdom');
global.window = global.$ = null;
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
    
var ArrayList = require('../src/util/ArrayList.js'),
    Style = require('../src/util/Style.js'),
    Base = require('../src/core/Base.js'),
    Element = require('../src/core/Element.js'),
    TooltipMessage = require('../src/ui/TooltipMessage.js');

if (!$) {
  beforeEach(function() {
    return waitsFor(function() {
      return $;
    });
  });
}

describe('Class "TooltipMessage"', function () {
    var a,
        b;
    describe('Class behavior', function () {
        it('[US-3,a]should throw an exception if the Mode introduced is not equal to normal or tooltip', function () {
            var previousMode;
            a = new TooltipMessage();
            b = new TooltipMessage();
            previousMode = a.mode;
            expect(function () {
                a.setMode("mode_x");
            }).toThrow();
            expect(a.mode).toEqual(previousMode);
            expect(function () {
                b.setMode("tooltip");
            }).not.toThrow();
            expect(b.mode).not.toBeNull();
        });
        it('[US-3,b] should throw an exception if the category introduced is not equal to help, info, error, warning', function () {
            var previousCategory;
            a = new TooltipMessage();
            b = new TooltipMessage();
            previousCategory = a.category;
            expect(function () {
                a.setCategory("category_x");
            }).toThrow();
            expect(a.category).toEqual(previousCategory);
            expect(function () {
                b.setCategory("help");
            }).not.toThrow();
            expect(b.category).not.toBeNull();
        });
    });
    describe('method "setTooltipClass"', function () {
        it('should return an object with a TooltipClass different from default', function () {
            a = new TooltipMessage();
            b = new TooltipMessage();
            a.setTooltipClass('pmui-tooltip-message_extra');
            expect(a.tooltipClass).toBeDefined();
            expect(a.tooltipClass).not.toEqual(b.tooltipClass);
        });
    });
    describe('method "setTrack"', function () {
        it('should return an object with a Track to be true', function () {
            a = new TooltipMessage();
            b = new TooltipMessage();
            a.setTrack(true);
            expect(a.track).toBeDefined();
            expect(a.track).toBeTruthy();
            expect(b.track).toBeFalsy();
        });
    });
    describe('method "setHideEffect"', function () {
        it('should return an object with hide Effect different from null', function () {
            a = new TooltipMessage();
            a.setHideEffect({effect: "explode", delay: 250});
            expect(a.hideEffect).toBeDefined();
            expect(a.hideEffect).not.toBeNull();
        });
    });
    describe('method "setShowEffect"', function () {
        it('should return an object with show Effect different from null', function () {
            a = new TooltipMessage();
            a.setShowEffect({effect: "slideDown", delay: 250});
            expect(a.showEffect).toBeDefined();
            expect(a.showEffect).not.toBeNull();
        });
    });
    describe('method "setTooltipPosition"', function () {
        it('should return an object with a tooltip position different from default', function () {
            a = new TooltipMessage();
            b = new TooltipMessage();
            expect(a.tooltipPosition).toBeDefined();
            expect(b.tooltipPosition).toBeDefined();
            b.setTooltipPosition({ my: "left top", at: "left bottom", collision: "flipfit"});
            expect(a.tooltipPosition).not.toEqual(b.tooltipPosition);
        });
    });
    describe('method "setMessage"', function () {
        it('should return an object with a message', function () {
            a = new TooltipMessage();
            a.setMessage("Mensaje 1");
            expect(a.message).toBeDefined();
            expect(a.message === "Mensaje 1").toBeTruthy();
        });
    });
    describe('method "setDisplayMode"', function () {
        it('should throw an exception if the Display Mode introduced is not equal to block or inline', function () {
            var previousDisplayMode;
            a = new TooltipMessage();
            b = new TooltipMessage();
            previousDisplayMode = a.displayMode;
            expect(function () {
                a.setDisplayMode("display_x");
            }).toThrow();
            expect(a.displayMode).toEqual(previousDisplayMode);
            expect(function () {
                b.setDisplayMode("block");
            }).not.toThrow();
            expect(b.displayMode).not.toBeNull();
        });
    });
    describe('method "createHTML"', function () {
        it('should create a new HTML element', function () {
            a = new TooltipMessage();
            var html = a.createHTML();
            expect(html).toBeDefined();
            expect(html.tagName).toBeDefined();
            expect(html.nodeType).toBeDefined();
            expect(html.nodeType).toEqual(document.ELEMENT_NODE);
        });
    });
});    


