// The AI object contains all AI modules and an 'act' function that executes the selected module for the entity

"use strict";

var ai = {
	act:function(entity){
		var module = entity.ai.module;			// Fetch set AI module for entity
		var mode = entity.ai.mode;				// Fetch current AI mode for entity
		ai[module][mode](entity);				// Execute AI mode function
	}
};
