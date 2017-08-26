"use strict";

ai.neutral1 = {

	//--- Neutral 1 AI - initialization function ---//
	init:function(entity){
		entity.ai = {
			module:				'neutral1',
			mode:				'roam',
			target_x: 			entity.x,
			target_y: 			entity.y,
			rand_walk_max_dist: 1000,
			arrive_dist: 		50
		};
		
		return entity;
	},


	//--- Neutral 1 AI - Roam mode function ---//
	roam:function(entity){
		
		if(entity.hp > 0 && entity.stun <= 0){		// Don't run during death animation or when stunned
			
			var delta = entity.x - entity.ai.target_x;
			
			// You have arived at your destination
			if(Math.abs(delta) < entity.ai.arrive_dist){
				entity.ai.target_x += (Math.random()-0.5) * entity.ai.rand_walk_max_dist; // Set new random location
				if(entity.ai.target_x < 0){
					entity.ai.target_x = entity.ai.arrive_dist;
				}else if(entity.ai.target_x > level.width - level.tilewidth){
					entity.ai.target_x = level.width - level.tilewidth - entity.ai.arrive_dist;
				}
			
			// Are we there yet? No!
			}else{
				
				var dir = -Math.sign(delta);
				entity.direction = dir;

				var touch = (entity.lefttouch) || (entity.righttouch)
				
				if(entity.onground){
					if(touch){
						entity.vy = -entity.jumpspeed;
						entity.onground = false;
					}else{
						entity.vx += entity.groundacc * dir;
						
						// The occasional random jump
						if(Math.random()<0.001 && entity.onground){
							entity.vy = -entity.jumpspeed;
							entity.onground = false;
						}
					}
				}else if(!touch){
					entity.vx += entity.airacc * dir;
				}
				///////////////////////////////////////////////////////////// documentatie!!!
			}
		}
	}
}
