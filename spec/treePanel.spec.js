global.dom = require('jsdom');
global.window = global.dom.jsdom().createWindow();
global.document = global.window.document;
global.jQuery = require("jquery");
global.$ = global.jQuery;
global.PMUI = require('../src/pmui.js');

var ArrayList = require('../src/util/ArrayList.js'),
    Style = require('../src/util/Style.js'),
    Factory = require('../src/util/Factory.js'),
    Base = require('../src/core/Base.js'),
    Event = require('../src/event/Event.js'),
    Element = require('../src/core/Element.js'),
    Layout = require('../src/layout/Layout.js'),
    HBox = require('../src/layout/HBox.js'),
    VBox = require('../src/layout/VBox.js'),
    Box = require('../src/layout/Box.js'),
    LayoutFactory = require('../src/layout/LayoutFactory.js'),
    Container = require('../src/core/Container.js'),
    Panel = require('../src/core/Panel.js');
    Item = require('../src/core/Item.js'),
    TreeItem = require('../src/item/TreeItem.js');
    TreePanel = require('../src/panel/TreePanel.js');

var tree;
describe('class "TreePanel"', function() {
    
    describe('Class behavior', function() {
        it("[US-14, a] Should be able to create a TreePanel with a hieranchical parent-child", function(){
            var i,
                items;
            tree = new PMUI.panel.TreePanel({
                id: "myTest",
                children: [
                    {
                        id: "elementId",
                        text: "Element1"
                    },
                    {
                        text: "Element2"
                    }
                ]
            });

            expect(tree).toBeDefined();
            expect(tree.type).toEqual('Tree');
            expect(tree.family).toEqual('Panel');

            items = tree.getItems();
            expect(items.length).toBeGreaterThan(0);
            for (i = 0; i < items.length; i++) {
                expect(items[i] instanceof PMUI.item.TreeItem).toBeTruthy();
            }
            
        });
        it("[US-14, b] Should be able to add new items to TreePanel", function() {
            var treeExample = tree;
            spyOn(treeExample, 'addChildren');
            treeExample.addChildren(
                "myTest",
                [
                    {   
                        id: "elementAddedId",
                        text: "Folder added",
                        children: [
                            {
                                text: "element1 added"
                            },
                            {
                                text: "element2 added"
                            }
                        ]   
                    }
                ]
            );
            expect(treeExample.addChildren).toHaveBeenCalled();
        });
        it("[US-14, c] Should be able to remove items from TreePanel with an identifier of the object", function() {
            var treeExample = tree;
            spyOn(treeExample, 'removeChildren');
            treeExample.removeChildren("myTest");
            expect(treeExample.removeChildren).toHaveBeenCalled();
        });
        it("[US-14, d] Should be able to get an object with a identifier as parameter", function() {
            var that = tree;
            item = tree.search(that, "elementId");
            expect(typeof item).toEqual("object");
        });
    })
    describe('Verifying TreePanel methods ', function() {
        it("setChildren method should add elements to TreePanel", function() {
            var arrayObj,
                items;

            arrayObj = [
                {
                    text: "Elem1"
                }
            ];

            tree.setChildren(arrayObj);
            items = tree.getItems();
            expect(items.length).toEqual(3);
            expect(items[0] instanceof PMUI.item.TreeItem).toBeTruthy();
        });

        it("setClassContainer should set the class name css", function() {
            var className = "my-class-css";
            tree.setClassContainer(className);
            expect(tree.classContainer).toEqual(className);
        });

    })
})