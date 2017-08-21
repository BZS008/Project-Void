// Linear Area Damage

"use strict";

attacks.LinArDam = {
	fof: 'area',
	width: 300,
	height: 60,
	falloff: 'gauss',
	basedamage: 50,
	type: 'direct',
	effects: ['fire'],
	cooldown: 10
};

//// Possible feature: custom attack properties per entity, making modifiers like potions easier...
