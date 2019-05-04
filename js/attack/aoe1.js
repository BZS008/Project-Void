// Attack - Area of Effect 1
"use strict";

attacks.aoe1 = {
	fof: 'area',			// Field of Fire: (area|forward)
    upontouch: false,       // Determine damage area by own width/height or separate
	width: 360,				// Width of damage area
	height: 120,			// Height of damage area
	falloff: 'gauss',		// Damage falloff: (none|linear|gauss)
	basedamage: 0.3,		// Base damage value (without the falloff)
	type: 'melee',			// Type
    setonfire: 0,           // Sets the target on fire for this many frames
	cooldown: 0,			// Cooldown timer (in frames)
    // When upontouch == true, knockback velocity is set instead of added
	doknockback: 0,			// Specify if knockback should be used
	knockbackvx: 0,			// Knockback x-velocity (scales with falloff)
	knockbackvy: 0,			// Knockback y-velocity (scales with falloff)
	knockbackrandom: 0.0,	// Randomness knockback fraction, e.g. 0.2 -> between 80% to 100%
	stun: 0,				// Stun time (in frames)
	friendlyfire: false		// Hit everyone/only enemies
};

//// Possible feature: custom attack properties per entity, making modifiers like potions easier...
