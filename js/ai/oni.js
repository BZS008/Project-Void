"use strict";

ai.oni = {

	//--- Oni AI - initialization function ---//
	init:function(entity){
		entity.ai = {
			module:				'oni',
			mode:				'search',
			target_x: 			entity.x,
			target_y: 			entity.y,
			target_ent:			undefined,
			rand_walk_max_dist: 1000,
			arrive_dist: 		50,
			arrive_vdist:		40,					// Vertical distance regarding as arrived
			sight_dist:			250,				// Distance for seeing enemies
			sight_height:		100,				// Vertical sight distance
		};
		
		return entity;
	},


	//--- Oni AI - Search mode function ---//
	search:function(entity){
		
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
				
				var dir = Math.sign(delta);
				entity.direction = dir;

				var touch = (entity.lefttouch) || (entity.righttouch)
				
				if(entity.onground){
					if(touch){
						entity.vy = -entity.jumpspeed;
						entity.onground = false;
					}else{
						entity.vx -= entity.groundacc * dir;
						
						// The occasional random jump
						if(Math.random()<0.001 && entity.onground){
							entity.vy = -entity.jumpspeed;
							entity.onground = false;
						}
					}
				}else if(!touch){
					entity.vx -= entity.airacc * dir;
				}
				
				// Check for enemies
				var x1 = entity.x - entity.ai.sight_dist * (entity.direction == -1);
				var x2 = entity.x + entity.ai.sight_dist * (entity.direction ==  1);
				var y1 = entity.y;
				var y2 = y1 - entity.ai.sight_height;
				
				var nents = entities.length;
				for (var i = 0; i < nents; i++) {
					var targ = entities[i];
					var spotted = targ.x > x1 && targ.x < x2 && targ.y <= y1 && targ.y > y2;
					if ((targ.type == 'dango' || targ.type == 'angrydango') && spotted) {
						entity.ai.target_ent = targ;
						entity.ai.mode = 'approach';
						break;
					}
				}
			}
			
			attacks.act(entity,'touch1');	// Do damage upon touch
		}
	},
	
	
	//--- Oni AI - Roam mode function ---//
	approach:function(entity){
		
		if(entity.hp > 0 && entity.stun <= 0){		// Don't run during death animation or when stunned
			
			if (entity.ai.target_ent.hp > 0) {	// Check if target is still alive
			
				var delta = entity.x - entity.ai.target_ent.x;
				var deltay = entity.y - entity.ai.target_ent.y;
				
				// You have arived at your destination
				if(Math.abs(delta) < entity.ai.arrive_dist && Math.abs(deltay) < entity.ai.arrive_vdist){
					attacks.act(entity,'melee1');	// Attack!
				
				// Are we there yet? No!
				} else {
					
					var dir = Math.sign(delta);
					entity.direction = dir;

					var touch = (entity.lefttouch) || (entity.righttouch)
					
					if(entity.onground){
						if(touch){
							entity.vy = -entity.jumpspeed;
							entity.onground = false;
						}else{
							entity.vx -= entity.groundacc * dir;
							
							// The occasional random jump
							if(Math.random()<0.001 && entity.onground){
								entity.vy = -entity.jumpspeed;
								entity.onground = false;
							}
						}
					}else if(!touch){
						entity.vx -= entity.airacc * dir;
					}
					///////////////////////////////////////////////////////////// documentatie!!!
				}
			} else {
				entity.ai.mode = 'search';
			}
			
			attacks.act(entity,'touch1');	// Do damage upon touch
		}
	},
	
	onitouch:function(entity) {
		var nents = entities.length;
		for (var i = 0; i < nents; i++) {
			var targ = entities[i];
			var touched = targ.x > x1 && targ.x < x2 && targ.y <= y1 && targ.y > y2;
			if ((targ.type == 'dango' || targ.type == 'player') && touched) {
				entity.ai.target_ent = targ;
				entity.ai.mode = 'approach';
				break;
			}
		}
	}
}
