// Define player object
var width = 36;   // width of the bounding box
var height = 60;  // height of the bounding box

var player = {
	type: 'player',
	
	enemies : ['angrydango', 'batdango','nodeppodango'],
	
	// Initial Spatial Properties
	x		: 1250,	            // x position of player (lvl coords) ...x,y should be retrieved from level
	y		: 120,	            // y position of player (lvl coords)
	vx		: 4,
	vy		: -4,
	xview	: 0,
	yview	: 0,
	runthresh: 1.0,				// Threshold for showing running animation
	shawlthresh: .1,			// Threshold for adjusting shawl animation
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
	hp			: 1500,			//400,
	fullhp		: 1500,			//400,
	cooldown	: 0,			// Timer of cooldown. (When reached zero, player can do another attack)
	stun 		: 0,			// Timer of stun. (When nonzero, player cannot move)
	
	// Physical Properties
	fall_factor	: 1.4,
	airdragx	: 1.1,			// Air drag factor x-direction
	airdragy	: 1,			// Air drag factor y-direction
	ground_drag_factor : 1.2,	//// MIGHT ADD MATERIAL SPECIFIC DRAG

	shawl		: { offset : [0,0] },

	// this.shawl 	: animation(this.shawl, this.options_player),
	
	// Draw Player
	draw:function(){
		// Debug
		// this.onground = false;
		if(this.direction == 1){ 							// facing right
			if (this.onground == false){					// in air
				if (this.vy < 0){							// going up
					this.sprite.changeAnim( 4 );
					this.shawl.sprite.changeAnim( 0 );
					this.shawl.offset = [-17,-1];
				}
				else{										// going down
					this.sprite.changeAnim( 4 );
					this.shawl.sprite.changeAnim( 1 );
					this.shawl.offset = [-16,-24];
				}
			}
			else{											// on ground
				if (Math.abs(this.vx) > this.runthresh){	// running
					this.sprite.changeAnim( 2 );
					this.shawl.sprite.changeAnim( 2 );
					this.shawl.offset = [-10,-6];
				}
				else{										// standing
					this.sprite.changeAnim( 0 );
					this.shawl.sprite.changeAnim( 2 );
					this.shawl.offset = [-22,-12];
				}
			}
		}
		else{ // facing left
			if (this.onground == false){					// in air
				if (this.vy < 0){			// going up
					this.sprite.changeAnim( 5 );
					this.shawl.sprite.changeAnim( 3 );
					this.shawl.offset = [20,-1];
				}
				else{										// going down
					this.sprite.changeAnim( 5 );
					this.shawl.sprite.changeAnim( 4 );
					this.shawl.offset = [20,-24];
				}
			}
			else{											// on ground
				if (Math.abs(this.vx) > this.runthresh){	// running
					this.sprite.changeAnim( 3 );
					this.shawl.sprite.changeAnim( 5 );
					this.shawl.offset = [10,-6];
				}
				else{										// standing
					this.sprite.changeAnim( 1 );
					this.shawl.sprite.changeAnim( 2 );
					this.shawl.offset = [-22,-12];
				}
			}
		}
		
		this.sprite.update();
		this.sprite.render(this.xview,this.yview);
		this.shawl.sprite.update();
		this.shawl.sprite.render(this.xview+this.shawl.offset[0],
			this.yview+this.shawl.offset[1]);
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
var options_player = {images:[
		images.player_standing_right,
		images.player_standing_left,
		images.player_running_right,
		images.player_running_left,
		images.player_jumping_right,
		images.player_jumping_left,
		// images.test1_standing_right,
		// images.test1_standing_left,
		// images.test1_running_right,
		// images.test1_running_left,
		// images.test1_jumping_right,
		// images.test1_jumping_left
	], speed: [5*spd,5*spd,1,1,spd,spd], stdSpriteIndex:0
};

spd = 7;
var options_shawl = {images:[
		images.shawl_down_left,
		images.shawl_up_left,
		images.shawl_straight_left,
		images.shawl_down_right,
		images.shawl_up_right,
		images.shawl_straight_right,
	], speed: [spd,spd,spd,spd,spd,spd], stdSpriteIndex:2
};

addfourcolpts(player);
player = animation(player, options_player);
player.shawl = animation(player.shawl, options_shawl);
var entities = [player];
