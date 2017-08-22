// Linear Area Damage

"use strict";

attacks.LinArDam = {
	fof: 'area',			// Field of Fire: (area|forward)
	width: 300,				// Width of damage area
	height: 60,				// Height of damage area
	falloff: 'linear',		// Damage falloff: (none|linear|gauss)
	basedamage: 30,			// Base damage value (without the falloff)
	type: 'direct',			// Type (Not Yet Implemented)
	effects: ['fire'],		// Effects (Not Yet Implemented)
	cooldown: 30,			// Cooldown timer (in frames)
	knockbackx: 25,			// Knockback x-velocity (scales with falloff)
	knockbacky: -8,			// Knockback y-velocity (scales with falloff)
	knockbackrandom: 0.2,	// Randomness knockback fraction, e.g. 0.2 -> between 80% to 100%
};

//// Possible feature: custom attack properties per entity, making modifiers like potions easier...
