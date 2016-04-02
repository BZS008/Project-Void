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

// First simple enemy entity
entitytypes.enemy1 = function(x,y,id){
	this.type = 'enemy1';
	this.ai_init = 'neutral1';
	this.id = id;
	// Initial Spatial Properties
	this.x = x;									// x position of entity (lvl coords)
	this.y = y;									// y position of entity (lvl coords)
	this.vx = 0;
	this.vy = 0;
	this.lastvx = 0;
	this.lastvy = 0;
	this.xview = 0;
	this.yview = 0;
	
	// List of all dango's - choose a random one
	var dangos = [[images.dango_blue_walkleft,images.dango_blue_walkright],[images.dango_yellow_walkleft,images.dango_yellow_walkright],[images.dango_red_walkleft,images.dango_red_walkright],[images.dango_orange_walkleft,images.dango_orange_walkright],[images.dango_lilac_walkleft,images.dango_lilac_walkright],[images.dango_green_walkleft,images.dango_green_walkright]];
	var dangoindex = Math.floor(Math.random()*6);
	
	this.spriteoptions = {
		images:dangos[dangoindex],
		speed:[40,40],
		stdSpriteIndex:0
	};

	// Physical Properties
	this.fall_factor = 1.4;
	this.air_drag_factor = 1.3;					// Air drag x-direction
	this.ground_drag_factor = 1.6;				//// MIGHT ADD MATERIAL SPECIFIC DRAG

	// Collision Properties
	//  Important note: In order for
	//  the collision detection/correction to work
	//  correctly, the side points (top, bottom,
	//  left & right) should be next to, but not
	//  on the collision points. This has to do with
	//  The way position is corrected after collision.
	
	this.width = 60;
	this.height = 40;
	this.colpts = [[0,0],[0,40],[60,0],[60,40]];	// Collision points =  will be used for collision detection/correction
	this.bottompts = [[0,41],[60,41]];			// Bottom points =  for ground checking
	this.leftpts = [[-1,0],[-1,40]];	// Left points =  for left wall checking
	this.rightpts = [[61,0],[61,40]];	// Right points =  for right wall checking
	this.toppts = [[0,-1],[40,-1]];				// Top points =  for ceiling checking
	
	// this.width = 30;
	// this.height = 60;
	// this.colpts = [[0,0],[0,60],[30,0],[30,60],[0,30],[30,30]];	// Collision points =  will be used for collision detection/correction
	// this.bottompts = [[0,61],[30,61]];			// Bottom points =  for ground checking
	// this.leftpts = [[-1,0],[-1,30],[-1,60]];	// Left points =  for left wall checking
	// this.rightpts = [[31,0],[31,30],[31,60]];	// Right points =  for right wall checking
	// this.toppts = [[0,-1],[30,-1]];				// Top points =  for ceiling checking

	// 20% more awesome
	this.groundacc = 1.0 + Math.random()*0.5;
	this.airacc = 0.5 + Math.random()*0.2;							// Acceleration in air in x-direction
	this.jumpspeed = 8 + Math.random()*3;


	// State Variables
	this.onground = false;

	// Draw Entity
	this.draw = function(){
		if(this.vx > 0){
			this.sprite.changeAnim(1);
		}else{
			this.sprite.changeAnim(0);
		}
		this.sprite.update();
		this.sprite.render(this.xview,this.yview);
	};

	// such movement, many physics
	this.movement = function(){
		basicmovement(this);
	};
	
	this.do_ai = function(){
		ai.act(this);
	}
}
