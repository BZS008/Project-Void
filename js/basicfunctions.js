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
	
	entity.xview = xl2xv(entity.x);
	entity.yview = yl2yv(entity.y);
	
}


function basicrectdraw(ent){
	ctx.beginPath();
	ctx.fillStyle = ent.color;
	ctx.rect(entity.xview, entity.yview, entity.width, entity.height);
	ctx.fill();
}

// Draws a tile as a colored rectangle
function basictiledraw(i,j){
	// Gather tile info
	var width = level.tilewidth;
	var height = level.tileheight;
	var tid = level.data[i][j];			// Get tile id
	var color = tileset[tid].color;
	
	// Calculate tile position
	var x = j2xl(j);
	var y = i2yl(i);
	
	// Draw Tile
	ctx.beginPath();
	ctx.fillStyle=color;
	ctx.rect(x-viewport.x+viewport.width/2,y-viewport.y,width+1,height);
	ctx.fill();
}

// Returns a random color (as canvas rgb() string)
function randomcolor(){
	var r = Math.round(50+150*Math.random());
	var g = Math.round(50+150*Math.random());
	var b = Math.round(50+150*Math.random());
	return 'rgb('+r+','+g+','+b+')';
}


// Compute the sum of a number array
function sum(a){
	var na = a.length;
	var total = 0;
	for(var i=0; i<na; i++){
		total += a[i];
	}
	return total;
}

// Compute the mean value of a number array
function mean(a){
	return sum(a)/a.length;
}

// Compute the standard deviation of a number array
function std(a){
	var na = a.length;
	var avg = mean(a);
	var vartotal = 0;
	for(var i=0; i<na; i++){
		var diff = a[i] - avg;
		vartotal += diff*diff;
	}
	return Math.sqrt(vartotal/na);
}






