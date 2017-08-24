// Define player object
var width = 47;   // width of the bounding box
var height = 60;  // height of the bounding box
var player = {
	type: 'player',
	
	// Initial Spatial Properties
	x		: 355,	            // x position of player (lvl coords) ...x,y should be retrieved from level
	y		: 120,	            // y position of player (lvl coords)
	vx		: 4,
	vy		: -4,
	xview	: 0,
	yview	: 0,
	runthresh: 1.0,				// Threshold for showing running animation
	color	: 'yellow',
	width 	: width,
	height 	: height,
	
	// State Variables
	onground	: false,
	direction	: 1,			// Direction player is facing
	
	// Movement parameters
	groundacc	: 0.8,			// Acceleration on ground in x-direction
	airacc		: 0.4,			// Acceleration in air in x-direction
	jumpspeed	: 12,
	vmax 		: 3.3,			// Maximum self propelled speed
	
	// Life/Attack variables
	hp			: 100,
	fullhp		: 100,
	cooldown	: 0,			// Timer of cooldown. (When reached zero, player can do another attack)
	stun 		: 0,			// Timer of stun. (When nonzero, player cannot move)
	
	// Physical Properties
	fall_factor	: 1.4,
	air_drag_factor	: 1.1,		// Air drag x-direction
	ground_drag_factor : 1.2,	//// MIGHT ADD MATERIAL SPECIFIC DRAG
	
	// Collision Properties
	//  Important note: In order for
	//  the collision detection/correction to work
	//  correctly, the side points (top, bottom,
	//  left & right) should be next to, but not
	//  on the collision points. This has to do with
	//  The way position is corrected after collision.

	// Collision points: will be used for collision detection/correction
	colpts:[[0,0],[0,height],[width,0],[width,height],[0,width],[width,width]],
	// Bottom points: for ground checking
	bottompts:[[0,height+1],[width,height+1]],
	// Left points: for left wall checking
	leftpts:[[-1,0],[-1,width],[-1,height]],
	// Right points: for right wall checking
	rightpts:[[width+1,0],[width+1,width],[width+1,height]],
	toppts:[[0,-1],[width,-1]], // Top points: for ceiling checking
	
	//// x-center of entities should corrospond to x-coordinate, aka without offset
	
	// Draw Player
	draw:function(){
		if (this.onground == false){
			// Flying through air, facing left/right
			if(this.direction == 1){
				this.sprite.changeAnim(4);
			} else {
				this.sprite.changeAnim(5);
			}
		}
		else {
			// Determine if walking/standing and left/right animation
			var iani = 0;
			if (Math.abs(this.vx) > this.runthresh){iani = 2;}
			if (this.direction == -1){iani = iani+1}
			this.sprite.changeAnim(iani);
		}
		
		this.sprite.update();
		this.sprite.render(this.xview,this.yview);
	},
	
	// such movement, many physics
	movement:function(){
		basicmovement(this);
	},
	
	do_ai:function(){
		if(this.cooldown>0){
			this.cooldown--;	// Count down the cooldown timer for attacks
		}
		
		if(this.stun > 0){
			this.stun--;		// Count down the stun timer
		}
	}
}


//-------------------------------------------------------

var spd = 7;
var options = {images:[
		images.test1_standing_right,
		images.test1_standing_left,
		images.test1_running_right,
		images.test1_running_left,
		images.test1_jumping_right,
		images.test1_jumping_left
	], speed: [spd,spd,spd,spd,spd], stdSpriteIndex:0
};
player = animation(player,options);
var entities = [player];
