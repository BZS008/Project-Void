// The AI object contains all AI modules and an 'act' function that executes the selected module for the entity

"use strict";

var ai = {
	act:function(entity){
		var module = entity.ai.module;
		var mode = entity.ai.mode;
		ai[module][mode](entity);
	}
};
