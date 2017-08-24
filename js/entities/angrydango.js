"use strict";

// First simple enemy entity
entitytypes.angrydango = function(x,y,id){
	this.type = 'angrydango';
	this.ai_init = 'oni';
	this.id = id;
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
	this.hp = 40;				// Health of entity
	this.fullhp = 40;			// Maximum health of entity
	this.cooldown = 0;			// Timer of cooldown. (When reached zero, entity can do another attack)
	this.stun = 0;				// Timer of stun. (When nonzero, entity cannot move)
	
	// Movement parameters
	this.groundacc = 0.22 + Math.random()*0.1;
	this.airacc = 0.11 + Math.random()*0.1;							// Acceleration in air in x-direction
	this.jumpspeed = 8 + Math.random()*2;
	
	this.spriteoptions = {
		images			: [images.dango_blue_walkleft, images.dango_blue_walkright,
							images.dango_blue_dieleft, images.dango_blue_dieright,
							images.angrydango_blue_walkleft, images.angrydango_blue_walkright,
							images.angrydango_blue_attackleft, images.angrydango_blue_attackright],
		speed			: [5,5,5,5,5,5],
		stdSpriteIndex 	: 0
	};

	// Physical Properties
	this.fall_factor = 1.4;
	this.air_drag_factor = 1.05;					// Air drag x-direction
	this.ground_drag_factor = 1.1;				//// MIGHT ADD MATERIAL SPECIFIC DRAG

	// Collision Properties
	//  Important note: In order for
	//  the collision detection/correction to work
	//  correctly, the side points (top, bottom,
	//  left & right) should be next to, but not
	//  on the collision points. This has to do with
	//  The way position is corrected after collision.
	
	this.width = 60;
	this.height = 40;
	this.colpts = [[0,0],[0,40],[60,0],[60,40]];// Collision points =  will be used for collision detection/correction
	this.bottompts = [[0,41],[60,41]];			// Bottom points =  for ground checking
	this.leftpts = [[-1,0],[-1,40]];			// Left points =  for left wall checking
	this.rightpts = [[61,0],[61,40]];			// Right points =  for right wall checking
	this.toppts = [[0,-1],[40,-1]];				// Top points =  for ceiling checking
	
	// this.width = 30;
	// this.height = 60;
	// this.colpts = [[0,0],[0,60],[30,0],[30,60],[0,30],[30,30]];	// Collision points =  will be used for collision detection/correction
	// this.bottompts = [[0,61],[30,61]];			// Bottom points =  for ground checking
	// this.leftpts = [[-1,0],[-1,30],[-1,60]];	// Left points =  for left wall checking
	// this.rightpts = [[31,0],[31,30],[31,60]];	// Right points =  for right wall checking
	// this.toppts = [[0,-1],[30,-1]];				// Top points =  for ceiling checking

	// Draw Entity
	this.draw = function(i){
		if(this.hp > 0){
			if(this.stun <= 0){							// Don't walk when stunned
				// Show approaching animation
				if (this.ai.mode == 'approach') {
					if (this.cooldown > 0) {
						// Show intense face
						if(this.direction == 1){
							this.sprite.changeAnim(6);	// Intense right
						}else{
							this.sprite.changeAnim(7); 	// Intense left
						}
					} else {
						// Show walking/searching animation
						if(this.direction == 1){
							this.sprite.changeAnim(4);	// Approach right
						}else{
							this.sprite.changeAnim(5);	// Approach left
						}
					}
				} else {
					// Show walking/searching animation
					if(this.direction == 1){
						this.sprite.changeAnim(0);		// Walk right
					}else{
						this.sprite.changeAnim(1);		// Walk left
					}
				}
			} else {
				// Show intense face
				if(this.direction == -1){
					this.sprite.changeAnim(7);			// Ouch left
				}else{
					this.sprite.changeAnim(6); 			// Ouch right
				}
			}
			this.sprite.update();
		} else {
			// Show dying animation
			if(this.direction == -1){
				this.sprite.changeAnim(3);		// Die left
			}else{
				this.sprite.changeAnim(2);		// Die right
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
