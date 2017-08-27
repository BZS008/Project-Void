# Attack System notes:
I will add an attack system with multiple types of attacks. Attacks will have certain properties that define what kind of attack it will be. The damage dealt is instant. But effects such as fire can cause extra damage over a period of time.

1. `fof: (forward|area)`
Field of fire specifies on what area the attack is projected. 'forward' will be an area directly in front of the entity. 'area' will be set around the entity (left and right).

2. `width, height: number`
Size in pixels of the area in which damage is inflicted upon enemies.

3. `upontouch: boolean`
Ignores set width and height and uses attacker width and height when true.

4. `falloff: (none|linear|gauss)`
Type of falloff, aka the reduction in damage as a function of distance. Linear will go to 0.5 at the FoF edge. With gauss, the value at the FoF edge will be 1% of peak damage. Equation for `gauss`: $e^{-4.605x^2}$ for $x=1$ as FoF edge.
![Falloff Graphs](falloff.png)

5. `basedamage: number`
Amount of damage at peak.

6. `type: (direct|particle)`
Specifies the type of attack. 'direct' will inflict damage immediately. Particle will inflict damage when it touches anything.

7. `effects: string array`
Effects applied to the targets, such as fire.

8. `cooldown: number`
Amount of ticks for attack to be available again.

9. `doknockback: boolean` Specify if knockback should be applied.

10. `knockbackvx, knockbackvy: number` Knockback x- and y-velocity. Hit entities will fly off with this speed away from the attacker. Scales with falloff.

11. `knockbackrandom: number` Randomness knockback fraction. Knockback can be reduced with a fraction up to this value.

12. `stun: number` Target stun time in frames. Scales with falloff. Target can't move/attack while stunned.
