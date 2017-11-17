// Keyboard input events
function keyinput(){
	// left arrow
	if(keydown.left && !player.lefttouch && player.stun <= 0){
		if(player.onground){
			player.vx-=player.groundacc;
		}else{
			player.vx-=player.airacc;
		}
		
		// Set facing direction
		player.direction = -1;
	}
	
	// right arrow
	if(keydown.right && !player.righttouch && player.stun <= 0){
		if(player.onground){
			player.vx+=player.groundacc;
		}else{
			player.vx+=player.airacc;
		}
		
		// Set facing direction
		player.direction = 1;
	}
	
	// up arrow
	if(keydown.up && player.onground && player.stun <= 0){
		player.vy =- player.jumpspeed;
		player.onground = false;
	}
	
	// space (attack)
	if(keydown.space){
		attacks.act(player,'melee1');
	}
	
	// t (testkey)
	if(keydown.t && !tkeydown){
		///// Test Droplet Physics by spawning droplet
		var x 		= player.x;
		var y 		= player.y-20;
		var vx 		= player.vx;
		var vy 		= player.vy;
		var vt = [[x,y], [x+50,y], [x+100,y+10], [x+150,y], [x+200,y+70], [x+200,y+70], [x+150,y+80], [x+100,y+80], [x+50,y+80]]
		var vtv = [[vx,vy], [vx,vy], [vx,vy], [vx,vy], [vx,vy], [vx,vy], [vx,vy], [vx,vy], [vx,vy]]
		var area0 	= 25000 * (0.5 + 0.5 * Math.random());
		var type 	= 0;
		liquid.addDroplet(vt, vtv, area0, type);
		
		tkeydown = true;
	}
	
	if(!keydown.t){tkeydown = false;}
	
	// s (stop gameloop)
	if(keydown.s){
		clearInterval(gameloop);
	}
}
