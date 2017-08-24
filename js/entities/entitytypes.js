"use strict";

var entitytypes = {};

// Easily spawn entities with this function
function spawn(type,x,y){
	var eid = entities.length;						// Retrieve new entity id
	var entity = new entitytypes[type](x,y,eid);	// Create new entity of type at x,y
	entity = ai[entity.ai_init].init(entity);		// Add AI to entity
	entity = animation(entity, entity.spriteoptions);
	entities.push(entity);							// Add new entity to list
	return eid;
}
