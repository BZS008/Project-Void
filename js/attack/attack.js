// Attack System

"use strict";

var attacks = {
	// Function that executes attack for given entity
	act:function(entity,attackname){
		if(entity.cooldown==0){
			var attack = this[attackname];
			entity.cooldown = attack.cooldown;
			
			// Select rectangle in which damage is dealt
			var y1 = entity.y - attack.height/2;
			var y2 = entity.y + attack.height/2;
			
			if(attack.fof=='area'){
				var x1 = entity.x - attack.width/2;
				var x2 = entity.x + attack.width/2;
			}else{
				var x1 = entity.x;
				var x2 = entity.x + attack.width; //// +/- should depend on direction
			}
				
			var nents = entities.length;        // Get number of entities
			for(var eid=0; eid<nents; eid++){ 	// Loop over all entities
				var ent = entities[eid];		// Retrieve entity
				if(ent.x>x1 && ent.x<x2 && ent.y>y1 && ent.y<y2 && ent!==entity){ 	// If entity is in target area
				////// Selected area and damage position should be corrected with target entity width and height
					var damage;
					switch(attack.falloff){
						// Calculate attack damage for linear falloff
						case 'linear':
							damage = attack.basedamage * (1-(ent.x-entity.x)/attack.width);
							break;
						// Calculate attack damage for gaussian falloff
						case 'gauss':
							var x = (ent.x-entity.x)/attack.width;
							damage = attack.basedammage * (Math.exp(-4.605*x*x));
						// Calculate attack damage for flat falloff
						default:
							damage = attack.basedamage;
					}
					entities[eid].hp -= damage; ///// effects, potions, armor and such are not considered yet
				}
			}
		}
	}
};

// Matlab code for this graph:
// x=-1:0.01:1;ylin=1-abs(x);ycon=ones(1,length(x));ygauss=exp(log(0.01)*x.^2);close all; hold on; plot(x,ylin,'LineWidth',2); plot(x,ycon,'LineWidth',2); plot(x,ygauss,'LineWidth',2); hold off;xlabel('x / half width');ylabel('damage / basedamage');title('Falloff types')
