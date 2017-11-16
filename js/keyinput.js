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
		// var vtx 	= [x,x+10,x+10,x,x-10,x-10];
		// var vty 	= [y,y-5,y-15,y-20,y-15,y-5];
		// var vtvx 	= [vx,vx,vx,vx,vx,vx+0.2];
		// var vtvy 	= [vy,vy,vy,vy,vy-0.1,vy];
		// var area0 	= 1000;
		var vtx = [x,x+50,x+100,x+150,x+200,x+200,x+150,x+100,x+50]
		var vty = [y,y,y+10,y,y,y+70,y+70,y+70,y+70]
		var vtvx 	= [vx,vx,vx,vx,vx,vx,vx,vx,vx,vx];
		var vtvy 	= [vy,vy,vy,vy,vy,vy,vy,vy,vy,vy];
		var area0 	= 25000;
		var type 	= 0;
		liquid.addDroplet(vtx, vty, vtvx, vtvy, area0, type);
		
		tkeydown = true;
	}
	
	if(!keydown.t){tkeydown = false;}
	
	// s (stop gameloop)
	if(keydown.s){
		clearInterval(gameloop);
	}
}
