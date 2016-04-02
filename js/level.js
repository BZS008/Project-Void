// Level object
var level = {
	
	// Level Coordinates <-> Tile Indices
	x2j:function(x){
		return parseInt(x/this.tilewidth)
	},
	
	y2i:function(y){
		return parseInt(y/this.tileheight)
	},
	
	j2x:function(j){
		return this.tilewidth*j
	},
	
	i2y:function(i){
		return this.tileheight*i
	},
	
	xview2j:function(xview){
		return parseInt((xview-viewport.width/2+viewport.x)/this.tilewidth)
	},
	
	yview2i:function(yview){
		return parseInt((yview+viewport.y)/this.tileheight)
	},
	
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
		var jviewstart = this.xview2j(0)
		if(jviewstart<0){jviewstart=0}
		var jviewend = this.xview2j(viewport.width+this.tilewidth)
		if(jviewend>this.data[0].length){jviewend=this.data[0].length}
		
		// Loop over tiles for drawing
		for(var i=0;i<this.data.length;i++){
			for(var j=jviewstart;j<jviewend;j++){
				
				// Gather tile info
				var width=this.tilewidth
				var height=this.tileheight
				var tileindex=this.data[i][j]
				var color=tileset[tileindex][2]
				
				// Calculate tile position
				var x=this.j2x(j)
				var y=this.i2y(i)
				
				// Draw Tile
				ctx.beginPath()
				ctx.fillStyle=color
				ctx.rect(x-viewport.x+viewport.width/2,y-viewport.y,width+1,height)
				ctx.fill()
			}
		}
	},
	
	// Get property at coordinates
	getprop:function(pos,p){
		// Get tile indices
		var j=level.x2j(pos[0])
		var i=level.y2i(pos[1])
		
		// Check if coords are inside level data
		if(i>=0 && j>=0 && i<level.data.length && j<level.data[0].length){
			var tileindex=level.data[i][j]	// Fetch tiletype index
			return tileset[tileindex][p]		// Return property
		}
	},
	
	// Collision check
	colcheck:function(entity,pts){
		
		var collision=[];
		
		for(var n=0;n<pts.length;n++){		// Loop over collision points
			var pos = [entity.x+pts[n][0],entity.y+pts[n][1]];
			if(this.getprop(pos,1)!=0){					// Check solidness of tiletype
				collision[n]=true;							// If solidness!=0, there is a collision
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
	}
}
