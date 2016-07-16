// Linear Area Damage

"use strict";

attacks.LinArDam = {
	fof: 'forward',
	width: 200,
	height: 60,
	falloff: 'gauss',
	basedamage: 80,
	type: 'direct',
	effects: ['fire'],
	cooldown: 45
};

//// Possible feature: custom attack properties per entity, making modifiers like potions easier...