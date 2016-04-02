# Attack System notes:
I will add an attack system with multiple types of attacks. Attacks will have certain properties that define what kind of attack it will be. The damage dealt is instant

I will describe the properies in either of the following formats:
[#] Property Name 1: (option1|option2|option3)
[#] Property Name 2: datatype


[1] Field of fire: (forward|area)
Specifies on what area the attack is projected. 'forward' will be an area directly in front of the entity. 'area' will be set around the entity.

[2] Size: number
Size in pixels of the area in which damage is inflicted upon enemies.

[3] Falloff: (none|linear|gauss)
Type of falloff, aka the reduction in damage as a function of distance. Linear will go to 0 at the FoF edge. With gauss, the value at the FoF edge will be 4% of peak damage.

[4] Peak Damage: number
Amount of damage at peak.

[5] Type: (direct|particle)
Specifies the type of attack. 'direct' will inflict damage immediately. Particle will inflict damage when it touches anything.

[6] 