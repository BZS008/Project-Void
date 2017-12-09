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
		var vt 		= [[x,y+40], [x+50,y+30], [x+100,y+40], [x+150,y+50], [x+200,y+60], [x+200,y+70], [x+150,y+80], [x+100,y+70], [x+50,y+60]]
		var vtv 	= [[vx+0.2,vy+0.5], [vx+0.5,vy+0.3], [vx+0.5,vy+0.2], [vx+0.2,vy], [vx-0.2,vy], [vx-0.5,vy], [vx-0.5,vy], [vx-0.2,vy], [vx,vy]]
		var area0 	= 35000 * (0.5 + 0.5 * Math.random());
		var area    = polyarea(vt);
		var circmf	= polycircmf(vt);
		var type 	= 0;
		var nvts 	= Math.ceil(Math.random()*7+3);
				
		liquid.addDroplet(vt.slice(0,nvts), vtv.slice(0,nvts), nvts*area0/9, area, circmf, type);
		
		tkeydown = true;
	}
	
	if(!keydown.t){tkeydown = false;}
	
	// s (stop gameloop)
	if(keydown.s){
		clearInterval(gameloop);
	}
}
