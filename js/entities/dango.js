"use strict";

// First simple enemy entity
entitytypes.dango = function(x,y){
	this.type = 'dango';
	this.ai_init = 'neutral1';
	
	this.enemies = [];
	
	// Initial Spatial Properties
	this.x = x;					// x position of entity (lvl coords)
	this.y = y;					// y position of entity (lvl coords)
	this.vx = 0;
	this.vy = 0;
	this.lastvx = 0;
	this.lastvy = 0;
	this.xview = 0;
	this.yview = 0;
	this.runthresh = 0.01;
	
	// State Variables
	this.onground = false;		// True if entity is touching the ground
	this.direction = 1;			// Direction entity is facing
		
	// Life/Attack variables
	this.hp = 30;				// Health of entity
	this.fullhp = 30;			// Maximum health of entity
	this.cooldown = 0;			// Timer of cooldown. (When reached zero, entity can do another attack)
	this.stun = 0;				// Timer of stun. (When nonzero, entity cannot move)
	
	// Movement parameters
	this.groundacc = 0.2 + Math.random()*0.1;
	this.airacc = 0.1 + Math.random()*0.1;							// Acceleration in air in x-direction
	this.jumpspeed = 8 + Math.random()*2;
	
	// List of all dango's - choose a random one
	var dangos = [[images.dango_blue_walkleft,images.dango_blue_walkright,images.dango_blue_dieleft,images.dango_blue_dieright],[images.dango_yellow_walkleft,images.dango_yellow_walkright],[images.dango_red_walkleft,images.dango_red_walkright],[images.dango_orange_walkleft,images.dango_orange_walkright],[images.dango_lilac_walkleft,images.dango_lilac_walkright],[images.dango_green_walkleft,images.dango_green_walkright]];
	var dangoindex = Math.floor(Math.random()*6);
	
	this.spriteoptions = {
		images:dangos[dangoindex],
		speed:[5,5,5,5],
		stdSpriteIndex:0
	};

	// Physical Properties
	this.fall_factor = 1.4;
	this.air_drag_factor = 1.05;					// Air drag x-direction
	this.ground_drag_factor = 1.1;				//// MIGHT ADD MATERIAL SPECIFIC DRAG

	// Dimensions
	this.width = 60;
	this.height = 40;
	addfourcolpts(this);

	// Draw Entity
	this.draw = function(i){
		if(this.hp > 0){
			if(this.stun <= 0){						// Don't walk when stunned
				// Show walking animation
				if(this.direction == -1){
					this.sprite.changeAnim(0); 		// Walk left
				}else{
					this.sprite.changeAnim(1);		// Walk right
				}
				this.sprite.update();
			}
		} else {
			// Show dying animation
			if(this.direction == -1){
				this.sprite.changeAnim(2);		// Die left
			}else{
				this.sprite.changeAnim(3);		// Die right
			}
			this.sprite.update();
			
			// Check if dying animation is over
			var frameNumber = this.sprite.frameNumber;
			var totalframes = this.sprite.images[this.sprite.index].frames;
			if(frameNumber == totalframes-1){
				entities.splice(i,1);		// Remove entity if dying animation finishes
			}
		}
		
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
		
		if(this.stun > 0){
			this.stun--;		// Count down the stun timer
		}
	}
}
