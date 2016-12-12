// Level object
"use strict";

var level = {
	
	// Get Tile from coords
	getTile:function(x,y){
		
		// Get Tile Indices
		var j=this.x2j(x)
		var i=this.y2i(y)
		
		// Check if player is outside level data
		if(i<0 || j<0 || i>=level.data.length || j>=level.data[0].length){
			return false
		}else{
			// return tiletype index
			return level.data[i][j]
		}
	},
	
	// Draw Level
	draw:function(){
		
		// Determine start and end tile for drawing
		var jviewstart = xv2j(0)
		if(jviewstart<0){jviewstart=0}
		var jviewend = xv2j(viewport.width+this.tilewidth)
		if(jviewend>this.data[0].length){jviewend=this.data[0].length}
		
		// Loop over tiles for drawing
		for(var i=0;i<this.data.length;i++){
			for(var j=jviewstart;j<jviewend;j++){
				var tid = level.data[i][j]; // Get tile id
				tileset[tid].draw(i,j); // Pass tile indices through to draw function for this tile
			}
		}
	},
	
	// Get global property at coordinates
	getglobprop:function(pos,p){
		// Get tile indices
		var j = xl2j(pos[0]);
		var i = yl2i(pos[1]);
		
		// Check if coords are inside level data
		if(i>=0 && j>=0 && i<level.data.length && j<level.data[0].length){
			var tileindex = level.data[i][j];	// Fetch tiletype index
			return tileset[tileindex][p];		// Return property
		}
	},
	
	// Collision check
	colcheck:function(entity,pts){
		
		var collision=[];
		
		for(var n=0;n<pts.length;n++){		// Loop over collision points
			var pos = [entity.x+pts[n][0],entity.y+pts[n][1]];
			if(this.getglobprop(pos,'solid')==1){	// Check solidness of tiletype
				collision[n]=true;					// If solidness!=0, there is a collision
			}else{
				collision[n]=false;
			}
		}
		
		return collision;
	},
	
	// Collision Detection with Level
	colcorrect:function(entity){
		
		// get points of current and previous gametick
		var p1=[entity.x-entity.vx,entity.y-entity.vy];
		var p2=[entity.x,entity.y];
		
		gamelog.num[0]=0;
		gamelog.numstr[0]='colits: '
		
		// converge to collision edge
		for(var i=0;manhatten(p1,p2)>colprecision && i<10;i++){		// Converge until satisfactory. No more than 10 convergence iterations
			var p3=midpoint(p1,p2);
			entity.x=p3[0];
			entity.y=p3[1];
			var col=this.colcheck(entity,entity.colpts);
			if(arrayOR(col)){
				p2=p3;
			}else{
				p1=p3;
			}
			
			gamelog.num[0]++;
			
		}
		
		return p1;
	},
	
	// Tile Props initialisation function
	init_tileprops:function(){
		// Get level data size (number of tiles in each direction)
		var nvert = this.data.length;
		var nhori = this.data[0].length;
		
		// Create empty 2D array of same dimensions as level.data and add to level
		var tileprops = new Array(nvert).fill(new Array(nhori));
		this.tileprops = tileprops;
	}
}
