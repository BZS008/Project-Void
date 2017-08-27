"use strict";

ai.bat = {

	//--- Bat AI - initialization function ---//
	init:function(entity){
		entity.ai = {
			module:				'bat',
			mode:				'search',
			target_x: 			entity.x,
			target_y: 			entity.y,
			target_ent:			undefined,
			rand_walk_max_dist: 1000,
			
			// Searching
			sight_dist:			500,				// Distance for seeing enemies
			sight_height:		500,				// Vertical sight distance
			arrive_dist: 		100,
			arrive_vdist:		75,					// Vertical distance regarding as arrived
			
			// Approaching
			dive_dist:			350,				// Distance to start diving
			slowdown_h:			150,				// Height above target from which to start slowing down
			slowdown_v:			1.0,				// Max speed when slowing down
			
			// Attacking
			attack_width:		120,				// Width of space to fly in as attack
			attack_height:		50,					// Height of space to fly in as attack
			attack_arrive_dist:	20,					// Hori/vert distance for arriving at attack point
		};
		
		return entity;
	},


	//--- Bat AI - Search mode function ---//
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
				
				var dir = -Math.sign(delta);
				entity.direction = dir;

				var touch = (entity.lefttouch) || (entity.righttouch)
				
				if(entity.onground){
					if(touch){
						entity.vy = -entity.jumpspeed;
						entity.onground = false;
					}else{
						entity.vx += entity.groundacc * dir;
					}
				}else if(!touch){
					entity.vx += entity.airacc * dir;
				}
				
				// Check for enemies
				var x1 = entity.x - entity.ai.sight_dist * (entity.direction == -1);
				var x2 = entity.x + entity.ai.sight_dist * (entity.direction ==  1);
				var y1 = entity.y + entity.ai.sight_height/2;
				var y2 = y1 - entity.ai.sight_height;
				
				/////
				var id = entities.indexOf(entity);
				gamelog.markrect[id] = [x1, x2, y1, y2, 1];
				gamelog.markrectcolor[id] = 'yellow';
				/////
				
				var nents = entities.length;
				for (var i = 0; i < nents; i++) {		// Loop over entities
					var tg = entities[i];
					
					// Check if target is in sight, is alive and is a foe
					var spotted = tg.x > x1 && tg.x < x2 && tg.y <= y1 && tg.y > y2 && tg.hp > 0;
					if ((entity.enemies.indexOf(tg.type) > -1) && spotted) {
						entity.ai.target_ent = tg;		// Target this entity!
						entity.ai.mode = 'approach';	// Go and approach target
						break;
					}
				}
			}
		}
	},
	
	
	//--- Bat AI - Roam mode function ---//
	approach:function(entity){
		
		if(entity.hp > 0 && entity.stun <= 0){		// Don't run during death animation or when stunned
			
			if (entity.ai.target_ent.hp > 0) {	// Check if target is still alive
				
				///// gamelog
				var x1 = entity.x;
				var x2 = entity.ai.target_ent.x;
				var y1 = entity.y;
				var y2 = entity.ai.target_ent.y - entity.height;
				
				var id = entities.indexOf(entity);
				gamelog.markline[id] = [x1, x2, y1, y2, 1];
				gamelog.marklinecolor[id] = 'orange';
				/////
				
				var delta = entity.x - entity.ai.target_ent.x;
				var deltay = entity.y - entity.ai.target_ent.y - entity.height;
				
				// You have arived at your destination
				if(Math.abs(delta) < entity.ai.arrive_dist && Math.abs(deltay) < entity.ai.arrive_vdist){
					entity.ai.mode = 'attack';		// Go and attack target
					entity.ai.target_x = entity.ai.target_ent.x - entity.height;
					entity.ai.target_y = entity.ai.target_ent.y - entity.height;
				
				// Are we there yet? No!
				} else {
					
					var dir = -Math.sign(delta);
					entity.direction = dir;

					var touch = entity.lefttouch || entity.righttouch || entity.onground;
					
					if(!touch){				// Check for collisions
						entity.vx += entity.airacc * dir;
						
						// If closing in on target: dive
						if (deltay < entity.ai.dive_dist) {
							
							// var vertflyfac = deltay / entity.ai.slowdown_height;
							
							// Accelerate if high above target or if speed is slow
							if (Math.abs(deltay) > entity.ai.slowdown_h || entity.vy < entity.ai.slowdown_v) {
								// vertflyfac = Math.sign(vertflyfac);
								entity.vy -= entity.airacc * Math.sign(deltay);
							}
							
							// entity.vy -= entity.airacc * vertflyfac;
						}
					} else {
						entity. vy -= entity.airacc;
					}
					///////////////////////////////////////////////////////////// documentatie!!!
				}
			} else {
				entity.ai.mode = 'search';
			}
		}
	},
	
	
	attack:function(entity){
		
		if(entity.hp > 0 && entity.stun <= 0){			// Don't run during death animation or when stunned
			if (entity.ai.target_ent.hp > 0) {			// Check if target is still alive
				
				// Calculate distance to target
				var tdx = entity.x - entity.ai.target_ent.x;
				var tdy = entity.y - entity.ai.target_ent.y - entity.ai.target_ent.height/2;
				
				if (entity.ai.arrive_dist > Math.abs(tdx) && entity.ai.arrive_vdist > Math.abs(tdy)) {
					attacks.act(entity, 'battouch');		// Do damage upon touch
					
					var dx = entity.x - entity.ai.target_x;
					var dy = entity.y - entity.ai.target_y;
					
					if(Math.abs(dx) < entity.ai.attack_arrive_dist && Math.abs(dy) < entity.ai.attack_arrive_dist){
						// Arrived at target attack point, set new
						entity.ai.target_x = entity.ai.target_ent.x + entity.ai.attack_width  * (Math.random() - 0.5);
						entity.ai.target_y = entity.ai.target_ent.y - entity.ai.target_ent.height / 2 + entity.ai.attack_height * (Math.random() - 0.5);
					} else {
						
						// Fly towards attack point
						var dir = -Math.sign(dx);
						entity.direction = dir;				// Set facing direction of entity

						var touch = entity.lefttouch || entity.righttouch || entity.onground;
						
						if(!touch){				// Check for collisions
							entity.vx += entity.airacc * dir;
							entity.vy -= entity.airacc * Math.sign(dy);
						} else {
							entity. vy -= entity.airacc;
						}
					}
				} else {
					entity.ai.mode = 'approach';
				}
			} else {
				// Targets is dead, search for new target
				entity.ai.mode = 'search';
			}
			
			
			
			///// gamelog
			var x1 = entity.x;
			var x2 = entity.ai.target_x;
			var y1 = entity.y;
			var y2 = entity.ai.target_y - entity.height;
			
			var id = entities.indexOf(entity);
			gamelog.markline[id] = [x1, x2, y1, y2, 1];
			gamelog.marklinecolor[id] = 'orange';
			
			var x3 = entity.ai.target_ent.x - entity.ai.attack_width / 2;
			var x4 = entity.ai.target_ent.x + entity.ai.attack_width / 2;
			var y3 = entity.ai.target_ent.y - entity.ai.attack_height / 2 - entity.ai.target_ent.height / 2;
			var y4 = entity.ai.target_ent.y + entity.ai.attack_height / 2 - entity.ai.target_ent.height / 2;
			
			gamelog.markrect[id] = [x3, x4, y3, y4, 1];
			gamelog.markrectcolor[id] = 'purple';
			/////
		}
	}
}