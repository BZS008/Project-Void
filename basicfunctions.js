// Contains basic functions which are used multiple times
"use strict";

function basicmovement(entity){
	// Position update
	
	entity.x += entity.vx;
	entity.y += entity.vy;
	entity.lastvx = entity.vx;
	entity.lastvy = entity.vy;
	
	var levcols = level.colcheck(entity,entity.colpts);		// Contains level collisions
	var anycol = arrayOR(levcols);
	
	// Correct when colliding
	if(anycol){
		var p1=level.colcorrect(entity);
		entity.x=p1[0];
		entity.y=p1[1];
	}
	
	// Check for touching
	var bottomtouches = level.colcheck(entity,entity.bottompts);
	var lefttouches = level.colcheck(entity,entity.leftpts);
	var righttouches = level.colcheck(entity,entity.rightpts);
	var headbumps = level.colcheck(entity,entity.toppts);
	
	entity.onground = arrayOR(bottomtouches);
	entity.lefttouch = arrayOR(lefttouches);
	entity.righttouch = arrayOR(righttouches);
	entity.headbump = arrayOR(headbumps);
	
	// Correct speed after collision, but only when that direction is still touching
	if(anycol){
		if(entity.onground || entity.headbump){
			entity.vy = 0;
		}
		if(entity.lefttouch || entity.righttouch){
			entity.vx = 0;
		}
	}
	
	if(entity.onground){
		entity.vx/=entity.ground_drag_factor;
	}else{
		// in mid air, obey gravity!
		entity.vx/=entity.air_drag_factor;
		entity.vy+=fall_acc*entity.fall_factor;
	}
	
	entity.xview = viewport.xlvl2view(entity.x);
	entity.yview = viewport.ylvl2view(entity.y);
	
}


function basicrectdraw(entity){
	ctx.beginPath();
		ctx.fillStyle=entity.color;
		ctx.rect(entity.xview,entity.yview,entity.width,entity.height);
		ctx.fill();
}


function randomcolor(){
	var r = Math.round(50+150*Math.random());
	var g = Math.round(50+150*Math.random());
	var b = Math.round(50+150*Math.random());
	return 'rgb('+r+','+g+','+b+')';
}


