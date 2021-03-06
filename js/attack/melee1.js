// Attack - Melee 1
"use strict";

attacks.melee1 = {
	fof: 'forward',			// Field of Fire: (area|forward)
    upontouch: false,       // Determine damage area by own width/height or separate
	width: 70,				// Width of damage area
	height: 50,				// Height of damage area
	falloff: 'linear',		// Damage falloff: (none|linear|gauss)
	basedamage: 25,			// Base damage value (without the falloff)
	type: 'direct',			// Type (Not Yet Implemented)
	effects: ['fire'],		// Effects (Not Yet Implemented)
	cooldown: 45,			// Cooldown timer (in frames)
    // When upontouch == true, knockback velocity is set instead of added
	doknockback: true,		// Specify if knockback should be used
	knockbackvx: 20,		// Knockback x-velocity (scales with falloff)
	knockbackvy: -8,		// Knockback y-velocity (scales with falloff)
	knockbackrandom: 0.2,	// Randomness knockback fraction, e.g. 0.2 -> between 80% to 100%
	stun: 30,				// Stun time (in frames)
	friendlyfire: false		// Hit everyone/only enemies
};

//// Possible feature: custom attack properties per entity, making modifiers like potions easier...
