// Linear Area Damage

"use strict";

attacks.LinArDam = {
	fof: 'area',
	hwidth: 100,
	hheight: 30,
	falloff: 'linear',
	basedamage: 80,
	type: 'direct',
	effects: ['fire'],
	cooldown: 30
};

//// Possible feature: custom attack properties per entity, making modifiers like potions easier...