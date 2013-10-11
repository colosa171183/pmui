global.window = require("jsdom")
                .jsdom()
                .createWindow();
global.document = global.window.document;
global.jQuery = require("jquery");
global.$ = global.jQuery;
global.jQuery = require("jquery");
global.PMUI = require('../src/pmui.js');
var ArrayList = require('../src/util/ArrayList.js');
var Base = require ("../src/core/Base.js");
var PMUI = require ('../src/pmui.js');

describe('Class base', function(){
		var claseBase = new Base();
		var claseBase1 = new Base();
		var claseBase2 = new Base();
		var claseBase3 = new Base();
		var ID,id1,id2;
		var type1,type2;
		var family1,family2;
	describe('Behavior Class Base',function(){
		it("[US-1,a] should be able to instantiate a class Base",function(){
				expect(claseBase).toBeDefined();
				expect(claseBase instanceof Base).toBeTruthy();
				expect(claseBase.type).toEqual('Base');
				expect(claseBase.family).toEqual('Core');
			});

			it ("[US-1,a] should create a unique ID",function(){
				ID = claseBase.id;
				expect(claseBase.id).toBeDefined();
				expect(claseBase.id).toEqual(ID);
			});

				it ("[US-1,b] id should be able to accept manual",function(){
				claseBase2 = new Base({
										id: "jasmineTest"
									 });
				expect(claseBase2.id).toEqual("jasmineTest");
			});
	});

	describe('methods get of the base class',function(){
		it ("should be able to get the id",function(){
				id1 = claseBase.id;
				id2 = claseBase.getID();
				expect(id1).toEqual(id2); 
			});
		it ("should be able to get the value of the type attribute",function(){
				type1 = claseBase.type;
				type2 = claseBase.getType();
				expect(type1).toEqual(type2); 
			});
		it ("should be able to get the attribute value family",function(){
				family1 = claseBase.family;
				family2 = claseBase.getFamily();
				expect(family1).toEqual(family2); 
			});
		
		
	});

	describe('methods set of the base class',function(){
		it ("should be able to set the id",function(){
				claseBase2.setID('1234abcd');
				id1=claseBase2.id;
				expect(id1).toEqual('1234abcd'); 
			});
		
	});
/**
	/*describe('methods dispose the base class',function(){
		it ("should be able to destroy the object",function(){
			var key;
						claseBase3 = new Base();
						claseBase3.dispose();
						for(key in claseBase3) {
							expect(claseBase3[key]).toBeNull();
						}		
					});
	});	
*/
});

