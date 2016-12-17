// Viewport object

"use strict";

var viewport = {
	x:0,							                        // x position of viewport (lvl coords)
	y:0,										            // y position of viewport (lvl coords)
	width:1024,
	height:768,
	dt:0.017,
	dt_timestamp:gamestarttime,
	goalFPS:60,
	followspeed:0.1,						                // Move this fraction towards player (each tick)
	
	clear:function(){
		// clear canvas
		ctx.clearRect(0,0,this.width,this.height);
	},
	
	followPlayer:function(){								// Move viewport towards player
		this.x+=(player.x-this.x)*this.followspeed;
	},
	
	
	frametimer:function(){
		var newtimestamp = new Date().getTime();
		this.dt = newtimestamp-this.dt_timestamp;
		this.dt_timestamp = newtimestamp;
	}
}
