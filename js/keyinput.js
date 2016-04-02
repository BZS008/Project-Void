// Keyboard input events
function keyinput(){
	// left arrow
	if(keydown.left && !player.lefttouch){
		if(player.onground){
			player.vx-=player.groundacc
		}else{
			player.vx-=player.airacc
		}
		
	}
	
	// right arrow
	if(keydown.right && !player.righttouch){
		if(player.onground){
			player.vx+=player.groundacc
		}else{
			player.vx+=player.airacc
		}
		
	}
	
	// up arrow
	if(keydown.up && player.onground){
		player.vy=-player.jumpspeed
		player.onground=false
		
	}
}

