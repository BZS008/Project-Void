// Attack - Touch 1
"use strict";

attacks.touch1 = {
	fof: 'area',			// Field of Fire: (area|forward)
    upontouch: true,        // Determine damage area by own width/height or separate
	width: 0,				// Width of damage area
	height: 0,				// Height of damage area
	falloff: 'none',		// Damage falloff: (none|linear|gauss)
	basedamage: 3,			// Base damage value (without the falloff)
	type: 'melee',			// Type
    setonfire: 120,         // Sets the target on fire for this many frames
	cooldown: 0,			// Cooldown timer (in frames)
    // When upontouch == true, knockback velocity is set instead of added
	doknockback: true,		// Specify if knockback should be used
	knockbackvx: 12,		// Knockback x-velocity (scales with falloff)
	knockbackvy: -7,		// Knockback y-velocity (scales with falloff)
	knockbackrandom: 0.2,	// Randomness knockback fraction, e.g. 0.2 -> between 80% to 100%
	stun: 8,				// Stun time (in frames)
	friendlyfire: false		// Hit everyone/only enemies
};

//// Possible feature: custom attack properties per entity, making modifiers like potions easier...
