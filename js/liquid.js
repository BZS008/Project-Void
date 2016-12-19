// Liquid object
// contains general variables and functions for liquid physics
liquid = {
	drawtile:function(i,j){
		// Gather tile info
		var width = level.tilewidth;
		var height = level.tileheight;
		var tid = level.data[i][j];			// Get tile id
		var liqcolor = tileset[tid].color;
		
		// Calculate tile position
		var x = level.j2x(j);
		var y = level.i2y(i);
		
		// Draw Tile
		ctx.beginPath();
		ctx.fillStyle = liqcolor;
		ctx.rect(x-viewport.x+viewport.width/2,y-viewport.y,width+1,height);
		ctx.fill();
	}
}