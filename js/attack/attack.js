// Attack System

"use strict";

var attacks = {
	// Function that executes attack for given entity
	act:function(entity,attackname){
		if(entity.cooldown == 0){					// Wait for attack cooldown timer
			var attack = this[attackname];
			entity.cooldown = attack.cooldown;
			
			// Select rectangle in which damage is dealt
			var y1 = entity.y - attack.height/2;
			var y2 = entity.y + attack.height/2;
			
			// Compute 'field of fire' border coordinates, according to setting
			if(attack.fof == 'area'){				// Attack in both directions
				var x1 = entity.x - attack.width/2;
				var x2 = entity.x + attack.width/2;
			}else{									// Attack in forward direction
				var x1 = entity.x - attack.width * (entity.direction == -1);
				var x2 = entity.x + attack.width * (entity.direction == 1);
			}
				
			var nents = entities.length;        	// Get number of entities
			for(var eid = 0; eid < nents; eid++){ 	// Loop over all entities
				var target = entities[eid];			// Retrieve entity
				
				if(target !== entity){				// Don't attack yourself!
					
					// Check if any collision point is within field of fire
					var inrange = false;
					for(var i = 0; i < target.colpts.length; i++){
						var cx = target.colpts[i][0] + target.x;
						var cy = target.colpts[i][1] + target.y;
						inrange = inrange || (cx > x1 && cx < x2 && cy > y1 && cy < y2);
					}
					
					if(inrange){ 					// If entity is in target area
						
						// Calculate damagefactor
						var Dx = target.x - entity.x;	// x-distance to target
						var damagefactor;
						switch(attack.falloff){
							case 'linear':			// Calculate attack damage for linear falloff
								var x = Dx / attack.width;
								damagefactor = 1 - Math.abs(x);
								break;
							case 'gauss':			// Calculate attack damage for gaussian falloff
								var x = Dx / attack.width;
								damagefactor = Math.exp(-4.605*x*x);
								break;
							default:				// Calculate attack damage for flat falloff
								damagefactor = 1;
						}
						
						// Apply damage and knockback
						entities[eid].hp -= damagefactor * attack.basedamage;
						var knockbackfactor = damagefactor * (1 - attack.knockbackrandom * Math.random());
						entities[eid].vx += attack.knockbackx * knockbackfactor * Math.sign(Dx);
						entities[eid].vy += attack.knockbacky * knockbackfactor;
						
						///// effects, potions, armor and such are not considered yet
					}
				}
			}
		}
	}
};

// Matlab code for this graph:
// x=-1:0.01:1;ylin=1-abs(x);ycon=ones(1,length(x));ygauss=exp(log(0.01)*x.^2);close all; hold on; plot(x,ylin,'LineWidth',2); plot(x,ycon,'LineWidth',2); plot(x,ygauss,'LineWidth',2); hold off;xlabel('x / half width');ylabel('damage / basedamage');title('Falloff types')
