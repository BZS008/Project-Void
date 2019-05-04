// Attack System

"use strict";

var attacks = {
	// Function that executes attack for given entity
	act:function(entity,attackname){
		
		if(entity.cooldown == 0){					// Wait for attack cooldown timer
			
			var attack = this[attackname];
			entity.cooldown = attack.cooldown;
			
			if(attack.upontouch){					// If toucharea==true then
				var width 	= entity.width;			//   width/height will be
				var height 	= entity.height;		//   determined by entity width/height
			} else {
				var width 	= attack.width;
				var height 	= attack.height;
			}
			
			// Select rectangle in which damage is dealt
			var y1 = entity.y - height/2;
			var y2 = entity.y + height/2;
			
			// Compute 'field of fire' border coordinates, according to setting
			if(attack.fof == 'area'){				// Attack in both directions
				var x1 = entity.x - width/2;
				var x2 = entity.x + width/2;
			}else{									// Attack in forward direction
				var x1 = entity.x - width * (entity.direction == -1);
				var x2 = entity.x + width * (entity.direction ==  1);
			}
			
			///// gamelog
			var id = entities.indexOf(entity) + 250;
			gamelog.markrect[id] = [x1, x2, y1, y2, 12];
			gamelog.markrectcolor[id] = 'red';
			/////
				
			var nents = entities.length;        	// Get number of entities
			for(var eid = 0; eid < nents; eid++){ 	// Loop over all entities
				var target = entities[eid];			// Retrieve entity
				
				var isenemy = (entity.enemies.indexOf(target.type) > -1);	// Check if target is enemy
				
				// Only attack enemies if friendly fire is off, never attack self
				if(target !== entity && (attack.friendlyfire || isenemy)){
					
					// Check if any collision point is within field of fire
					var inrange = false;
					var cxinrange = 0;

					for(var i = 0; i < target.colpts.length; i++){
						var cx = target.colpts[i][0] + target.x;
						var cy = target.colpts[i][1] + target.y;
						var colptinrange = (cx > x1 && cx < x2 && cy > y1 && cy < y2)
						inrange = inrange || colptinrange;
						if (colptinrange) {cxinrange = cx;}
					}
					
					if(inrange){ 						// If entity is in target area
						
						// Calculate damagefactor
						var Dx = cxinrange - entity.x;	// x-distance to target
						var damagefactor;
						switch(attack.falloff){
							case 'linear':				// Calculate attack damage for linear falloff
								var x = Dx / width;
								damagefactor = 1 - Math.abs(x)/2;
								break;
							case 'gauss':				// Calculate attack damage for gaussian falloff
								var x = Dx / width;
								damagefactor = Math.exp(-4.605*x*x);
								break;
							default:					// Calculate attack damage for flat falloff
								damagefactor = 1;
						}
						
						// Apply damage, knockback and stun
                        console.log(entities[eid].typedamagefactor)
                        var typedamagefactor = entities[eid].typedamagefactor[attack.type];
						entities[eid].hp -= damagefactor * typedamagefactor * attack.basedamage;
						entities[eid].stun = damagefactor * attack.stun;
						
						if (attack.doknockback) {
							var knockbackfactor = damagefactor * (1 - attack.knockbackrandom * Math.random());
							entities[eid].vx = attack.knockbackvx * knockbackfactor * Math.sign(Dx);
							entities[eid].vy = attack.knockbackvy * knockbackfactor;
						}
						
						///// effects, potions, armor and such are not considered yet
                        
                        // Set onfire timer on target
                        entities[eid].onfire = attack.setonfire;
					}
				}
			}
		}
	}
};

// Matlab code for this graph:
// x=-1:0.01:1;ylin=1-abs(x)/2;ycon=ones(1,length(x));ygauss=exp(log(0.01)*x.^2);close all; hold on; plot(x,ylin,'LineWidth',2); plot(x,ycon,'LineWidth',2); plot(x,ygauss,'LineWidth',2); hold off;xlabel('x / half width');ylabel('damage / basedamage');title('Falloff types')
