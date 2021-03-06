// Viewport object

"use strict";

var viewport = {
	x:0,							        	// x position of viewport (lvl coords)
	y:0,										// y position of viewport (lvl coords)
	width:1024,
	height:768,
	dt:0.017,
	dt_timestamp:gamestarttime,
	goalFPS:60,
	followspeed:0.1,							// Move this fraction towards player (each tick)
	
	mousex:0,									// will be used to store cursor viewport coords
	mousey:0,
	mousedown: false,							// True if mouse is down (regulated by index.html)
	
	clear:function(){
		// clear canvas
		// ctx.clearRect(0,0,this.width,this.height);
		
		// Create gradient background
		var grd = ctx.createLinearGradient(0, 0, 0, this.height);
		grd.addColorStop(0, "rgb(30,15,70)");
		grd.addColorStop(1, "rgb(220,25,25)");

		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, this.width, this.height);
	},
	
	followPlayer:function(){					// Move viewport towards player
		this.x+=(player.x-this.x)*this.followspeed;
	},
	
	
	frametimer:function(){
		var newtimestamp = new Date().getTime();
		this.dt = newtimestamp-this.dt_timestamp;
		this.dt_timestamp = newtimestamp;
	},
	
	updatemousecoords:function(canvas,event){	// Update Mouse Coords
		var canvasrect = canvas.getBoundingClientRect();			// Get bounding rectangle for canvas
		this.mousex = Math.round(event.clientX - canvasrect.left);	// Calculate mouse x
		this.mousey = Math.round(event.clientY - canvasrect.top);	// Calculate mouse y
	}
}
