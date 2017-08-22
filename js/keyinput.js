// Keyboard input events
function keyinput(){
	// left arrow
	if(keydown.left && !player.lefttouch){
		if(player.onground){
			player.vx-=player.groundacc;
		}else{
			player.vx-=player.airacc;
		}
		
		// Set facing direction
		player.direction = -1;
	}
	
	// right arrow
	if(keydown.right && !player.righttouch){
		if(player.onground){
			player.vx+=player.groundacc;
		}else{
			player.vx+=player.airacc;
		}
		
		// Set facing direction
		player.direction = 1;
	}
	
	// up arrow
	if(keydown.up && player.onground){
		player.vy=-player.jumpspeed;
		player.onground=false;
	}
	
	// space (attack)
	if(keydown.space && player.cooldown==0){
		attacks.act(player,'LinArDam');
	}
	
	// t (testkey)
	if(keydown.t){
		///// Test Droplet Physics by spawning droplet
		var x 		= player.x;
		var y 		= player.y-20;
		var vx 		= player.vx;
		var vy 		= player.vy;
		var vtx 	= [x,x+10,x+10,x,x-10,x-10];
		var vty 	= [y,y-5,y-15,y-20,y-15,y-5];
		var vtvx 	= [vx,vx,vx,vx,vx,vx+0.2];
		var vtvy 	= [vy,vy,vy,vy,vy-0.1,vy];
		var vol 	= 100;
		var type 	= 0;
		liquid.addDroplet(vtx,vty,vtvx,vtvy,vol,type);
	}
	
	// s (stop gameloop)
	if(keydown.s){
		clearInterval(gameloop);
	}
}
