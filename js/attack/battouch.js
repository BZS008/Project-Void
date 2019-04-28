// Attack - Bat Touch
"use strict";

attacks.battouch = {
	fof: 'area',			// Field of Fire: (area|forward)
    upontouch: true,        // Determine damage area by own width/height or separate
	width: 0,				// Width of damage area
	height: 0,				// Height of damage area
	falloff: 'none',		// Damage falloff: (none|linear|gauss)
	basedamage: 1,			// Base damage value (without the falloff)
	type: 'melee',			// Type (Not Yet Implemented)
	effects: ['fire'],		// Effects (Not Yet Implemented)
	cooldown: 5,			// Cooldown timer (in frames)
    // When upontouch == true, knockback velocity is set instead of added
	doknockback: false,		// Specify if knockback should be used
	knockbackvx: 0,			// Knockback x-velocity (scales with falloff)
	knockbackvy: 0,			// Knockback y-velocity (scales with falloff)
	knockbackrandom: 0,		// Randomness knockback fraction, e.g. 0.2 -> between 80% to 100%
	stun: 0,				// Stun time (in frames)
	friendlyfire: false		// Hit everyone/only enemies
};

//// Possible feature: custom attack properties per entity, making modifiers like potions easier...
