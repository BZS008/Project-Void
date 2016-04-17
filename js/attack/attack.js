// Attack System

"use strict";

var attacks = {
	// Function that executes attack for given entity
	act:function(entity,attackname){
		if(entity.cooldown==0){
			var attack = this[attackname];
			entity.cooldown = attack.cooldown;
			
			// Select rectangle in which damage is dealt
			var y1 = entity.y - attack.hheight;
			var y2 = entity.y + attack.hheight;
			
			if(attack.fof=='area'){
				var x1 = entity.x - attack.hwidth;
				var x2 = entity.x + attack.hwidth;
				
				var nents = entities.length;        // Get number of entities
				for(var eid=0; eid<nents; eid++){ 	// Loop over all entities
					var ent = entities[eid];		// Retrieve entity
					if(ent.x>x1 && ent.x<x2 && ent.y>y1 && ent.y<y2 && ent!==entity){
						var damage = attack.basedamage * (1-(ent.x-entity.x)/attack.hwidth);/////
						entities[eid].hp -= damage; /////
					}
				}
			}else{
				var x1 = entity.x;
				var x2 = entity.x + attack.hwidth*2; //// +/- should depend on direction
			}
		}
	}
};
