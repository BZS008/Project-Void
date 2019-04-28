"use strict";

// First simple enemy entity
entitytypes.jubokko = function(x,y){
	this.type = 'jubokko';
	this.ai_init = 'tree';
	
	this.enemies = ['player', 'dango'];
	
	// Initial Spatial Properties
	this.x = x;					// x position of entity (lvl coords)
	this.y = y;					// y position of entity (lvl coords)
	this.vx = 0;
	this.vy = 0;
	this.lastvx = 0;
	this.lastvy = 0;
	this.xview = 0;
	this.yview = 0;
	
	// State Variables
	this.onground = false;		// True if entity is touching the ground
	this.direction = 1;			// Direction entity is facing
		
	// Life/Attack variables
	this.hp = 42;				// Health of entity
	this.fullhp = 42;			// Maximum health of entity
	this.cooldown = 0;			// Timer of cooldown. (When reached zero, entity can do another attack)
	this.stun = 0;				// Timer of stun. (When nonzero, entity cannot move)
    this.typedamagefactor = {   // When attack damage is calculated,
        'melee':0.5,            //   it will be multiplied with the
        'fire': 2.0,            //   factor corresponding to the
        'water':0.5,            //   attack type.
        'earth':0.5,
        'wind':0.5,
    }
	
	// Movement parameters
	this.groundacc = 0.2 + Math.random()*0.1;
	this.airacc = 0.1 + Math.random()*0.1;							// Acceleration in air in x-direction
	this.jumpspeed = 8 + Math.random()*2;
	
	this.spriteoptions = {
		images 			: [images.tree_standing],
		speed			: [0],
		stdSpriteIndex	: 0
	};

	// Physical Properties
	this.fall_factor = 1.4;
	this.airdragx = 1.05;						// Air drag factor x-direction
	this.airdragy = 1.00;						// Air drag factor y-direction
	this.ground_drag_factor = 1.1;				//// MIGHT ADD MATERIAL SPECIFIC DRAG

	// Dimensions
	this.width = 120;
	this.height = 120;
	addfourcolpts(this);

	// Draw Entity
	this.draw = function(i){
		this.sprite.update();
		this.sprite.render(this.xview,this.yview);
	};

	// such movement, many physics
	this.movement = function(){
		basicmovement(this);
	};
	
	// Call AI module and do a few other things
	this.do_ai = function(){
		ai.act(this);
		
		if(this.cooldown > 0){
			this.cooldown--;	// Count down the cooldown timer for attacks
		}
	}
}
