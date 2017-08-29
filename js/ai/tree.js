"use strict";

ai.tree = {

	//--- Oni AI - initialization function ---//
	init:function(entity){
		entity.ai = {
			module:				'tree',
			mode:				'being_a_tree'
		};
		
		return entity;
	},


	//--- Tree AI - 'Being a tree' mode function ---//
	being_a_tree:function(entity){
		attacks.act(entity,'aoe1');		// Do damage upon touch
	}
}
