"use strict";

ai.nodeppo = {

	//--- Bat AI - initialization function ---//
	init:function(entity){
		entity.ai = {
			module:				'nodeppo',
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
			slowdown_h:			100,				// Height above target from which to start slowing down
			slowdown_v:			1.0,				// Max speed when slowing down
			
			// Attacking
			attack_width:		150,				// Width of space to fly in as attack
			attack_height:		60,					// Height of space to fly in as attack
			attack_arrive_dist:	20,					// Hori/vert distance for arriving at attack point
			// Bats target points around the top of the target in a space of
			// 1/3 attack_height below the top and 2/3 attack_height above
			
		};
		
		return entity;
	},


	//--- Bat AI - 'Search for target' mode function ---//
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
				
				// Check for collisions
				var touch = entity.lefttouch || entity.righttouch || entity.onground;
				
				// Collision!
				if (touch){
					entity.vy -= entity.airacc;			// In case of collision: fly up
					
					if (entity.lefttouch) {
						entity.vx += entity.airacc;		// Fly away from left wall
					} else if (entity.righttouch) {
						entity.vx -= entity.airacc;		// Fly away from right wall
					}
					
				// No collision, keep moving to search target
				} else {
					entity.vx += entity.airacc * dir;
					
					// Check for ground below an in front
					var xfront = entity.width * 2.5 * dir;
					var colcheckpts = [[0, entity.height * 2], [xfront, 0], [xfront, entity.height]];
					
					// If ground or wall is detected: fly up
					if (arrayOR(level.colcheck(entity, colcheckpts))) {
						entity.vy -= entity.airacc;
					}
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
	
	
	//--- Bat AI - 'Approach target' mode function ---//
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
				var deltay = entity.y - entity.ai.target_ent.y - entity.ai.target_ent.height/2;
				
				// You have arived at your destination
				if(Math.abs(delta) < entity.ai.arrive_dist && Math.abs(deltay) < entity.ai.arrive_vdist){
					entity.ai.mode = 'attack';		// Go and attack target
					var tx  = entity.ai.target_ent.x;
					var ty  = entity.ai.target_ent.y - entity.ai.target_ent.height / 2 - entity.ai.attack_height / 6;
					entity.ai.target_x = tx;
					entity.ai.target_y = ty;
				
				// Are we there yet? No!
				} else {
					if (entity.cooldown <= 0) {
						var bat = spawn('batdango', entity.x, entity.y);
						bat.vx = 30 * entity.direction;
						bat.direction = entity.direction;
						entity.cooldown = 8;
					} else {
						entity.cooldoen--;
					}
						
					
					var dir = -Math.sign(delta);
					entity.direction = dir;

					// Check for collisions
					var touch = entity.lefttouch || entity.righttouch || entity.onground;
					
					// Collision!
					if (touch){
						entity.vy -= entity.airacc;			// In case of collision: fly up
						
						if (entity.lefttouch) {
							entity.vx += entity.airacc;		// Fly away from left wall
						} else if (entity.righttouch) {
							entity.vx -= entity.airacc;		// Fly away from right wall
						}
						
					// No collision, keep moving to target entity!
					} else {
						
						// Fly towards target (x)
						entity.vx += entity.airacc * dir;
						
						// Check for ground below and in front
						var xfront = entity.width * 1.0 * dir;
						var colcheckpts = [[0, entity.height * 1.0], [xfront, 0], [xfront, entity.height]];
						
						// Ground or wall detected, fly up
						if (arrayOR(level.colcheck(entity, colcheckpts))) {
							entity.vy -= entity.airacc;
							
						// Not near ground or wall, no need to fly up
						} else {
							// If closing in on target: dive
							if (deltay < entity.ai.dive_dist) {
								
								// Accelerate vertically if high above target or if speed is slow
								if (Math.abs(deltay) > entity.ai.slowdown_h || entity.vy < entity.ai.slowdown_v) {
									entity.vy -= entity.airacc * Math.sign(deltay);
								}
							}
						}
					}
				}
			} else {
				// Target lost, search mode activated
				entity.ai.mode = 'search';
			}
		}
	},
	
	
	//--- Bat AI - 'Attack target' mode function ---//
	attack:function(entity){
		
		if(entity.hp > 0 && entity.stun <= 0){			// Don't run during death animation or when stunned
			if (entity.ai.target_ent.hp > 0) {			// Check if target is still alive
				
				// Calculate distance to target
				var tx  = entity.ai.target_ent.x;
				var ty  = entity.ai.target_ent.y - entity.ai.target_ent.height / 2 - entity.ai.attack_height / 6;
				var tdx = entity.x - tx;
				var tdy = entity.y - ty;
				
				// If target is close enough, commence attack
				if (entity.ai.arrive_dist > Math.abs(tdx) && entity.ai.arrive_vdist > Math.abs(tdy)) {
					attacks.act(entity, 'battouch');		// Do damage upon touch
					
					// Calculate distance to target attack point
					var dx = entity.x - entity.ai.target_x;
					var dy = entity.y - entity.ai.target_y;
					var invalidpt = level.colcheck(entity, [[-dx,-dy]])[0]; 	// Check if point is in ground tile
					
					// Arrived at target attack point OR invalid point: set new
					if((Math.abs(dx) < entity.ai.attack_arrive_dist && Math.abs(dy) < entity.ai.attack_arrive_dist) || invalidpt){
						entity.ai.target_x = tx + entity.ai.attack_width  * (Math.random() - 0.5);
						entity.ai.target_y = ty + entity.ai.attack_height * (Math.random() - 0.5);
					
					// Not arrived at attack point yet, fly towards attack point
					} else {
						// Face direction of attack point
						var dir = -Math.sign(dx);
						entity.direction = dir;				// Set facing direction of entity
						
						// Check for collisions
						var touch = entity.lefttouch || entity.righttouch || entity.onground;
						
						if (touch){
							entity.vy -= entity.airacc;			// In case of collision: fly up
							
						// No collision, keep moving to attack target
						} else {
							entity.vx += entity.airacc * dir;
							entity.vy -= entity.airacc * Math.sign(dy);
						}
					}
					
					
					///// gamelog
					var x1 = entity.x;
					var x2 = entity.ai.target_x;
					var y1 = entity.y;
					var y2 = entity.ai.target_y;
					
					var id = entities.indexOf(entity);
					gamelog.markline[id] = [x1, x2, y1, y2, 1];
					gamelog.marklinecolor[id] = 'orange';
					
					var x3 = tx - entity.ai.attack_width / 2;
					var x4 = tx + entity.ai.attack_width / 2;
					var y3 = ty - entity.ai.attack_height / 2;
					var y4 = ty + entity.ai.attack_height / 2;
					
					gamelog.markrect[id] = [x3, x4, y3, y4, 1];
					gamelog.markrectcolor[id] = 'purple';
					/////
					
					
					
				} else {
					// Target is too far away, re-approach target
					entity.ai.mode = 'approach';
				}
			} else {
				// Target is dead, search for new target
				entity.ai.mode = 'search';
			}
		}
	}
}
