"use strict";

var entitytypes = {};

// Easily spawn entities with this function
function spawn(type,x,y){
	var entity = new entitytypes[type](x,y);		// Create new entity of type at x,y
	entity = ai[entity.ai_init].init(entity);		// Add AI to entity
	entity = animation(entity, entity.spriteoptions);
	entities.push(entity);							// Add new entity to list
	return entity;
}

function addfourcolpts(entity) {
	// Important note on Collision Properties: In order for the collision
	// detection/correction to work correctly, the side points (top, bottom,
	// left & right) should be next to, but not on the collision points.
	// This has to do with the way position is corrected after collision.
	// See doc folder for image example.
	
	var w = entity.width;
	var h = entity.height;
	var hw = w/2;
	var hh = h/2;
	
	entity.colpts 		= [[-hw,-hh], [-hw,hh], [hw,-hh], [hw,hh]];	// Collision points =  will be used for collision detection/correction
	entity.bottompts 	= [[-hw,hh+1], 	[hw,hh+1]];			// Bottom points =  for ground checking
	entity.leftpts 		= [[-hw-1,-hh], [-hw-1,hh]];		// Left points =  for left wall checking
	entity.rightpts 	= [[hw+1,-hh], 	[hw+1,hh]];			// Right points =  for right wall checking
	entity.toppts 		= [[-hw,-hh-1], [hw,-hh-1]];		// Top points =  for ceiling checking
}
