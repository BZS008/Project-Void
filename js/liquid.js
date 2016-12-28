// Liquid object
// contains general variables and functions for liquid physics
var liquid = {
	// Draws a liquid tile for the input tile indices
	drawtile:function(i,j){
		// Gather tile info
		var width = level.tilewidth;
		var height = level.tileheight;
		var tid = level.data[i][j];			// Get tile id
		var aircolor = tileset[0].color;
		var liqcolor = tileset[tid].color;
		var liqheight = level.tileprops[i][j].height;
		
		// Draw air part
		ctx.beginPath();
		ctx.fillStyle = aircolor;
		ctx.rect(j2xv(j), i2yv(i), width+1, height*(1-liqheight));
		ctx.fill();
		
		// Draw water part
		ctx.beginPath();
		ctx.fillStyle = liqcolor;
		ctx.rect(j2xv(j), i2yv(i+(1-liqheight)), width+1, height*liqheight);
		ctx.fill();
	},
	
	// Perform liquid physics
	flow:function(){
		var nvert = level.data.length;					// Get vertical number of tiles
		var nhori = level.data[0].length;				// Get horizontal number of tiles
		
		// Determine horizontal flows: loop over tile pairs
		for(var i=0;i<nvert;i++){						// Loop vertically
			for(var j=1;j<nhori;j++){					// Loop horizontally, skip first
				var tl = tileset[level.data[i][j-1]];	// Get tile properties of left tile
				var t = tileset[level.data[i][j]];		// Get tile properties of tile
				
				if(t.solid==2 && tl.solid==2){
					// Get water levels
					var tp = level.tileprops[i][j];
					var tpl = level.tileprops[i][j-1];
					var h = tp.height;
					var hl = tpl.height;
					
					// Set height differences
					var hflow = 0.02*Math.sign(h - hl) * Math.sqrt(Math.abs(h - hl));
					tpl.dheight += hflow;
					tp.dheight -= hflow;
				}
			}
		}
		
		// Apply calculated water height differences
		// Also check for adjacent air tiles for conversion
		for(var i=0;i<nvert;i++){						// Loop vertically
			for(var j=0;j<nhori;j++){					// Loop horizontally
				
				var t = tileset[level.data[i][j]];		// Get tile properties of tile
				
				if(t.solid==2){
					// Set water levels
					var tp = level.tileprops[i][j];
					tp.height += tp.dheight;
					tp.dheight = 0;						// Reset height difference
				}
			}
		}
		
		// Convert adjacent air tiles to water
		// Note: if multiple liquids are to be used, this part should be given a separate section for each liquid
		for(var i=0;i<nvert;i++){						// Loop vertically
			for(var j=1;j<nhori-1;j++){					// Loop horizontally
				var t = tileset[level.data[i][j]];		// Get tile properties of tile
				
				if(t.solid==2){
					var tl = tileset[level.data[i][j-1]];	// Get tile properties of left tile
					var tr = tileset[level.data[i][j+1]];	// Get tile properties of right tile
					
					if(tl.solid==0){
						level.data[i][j-1] = 4;				// Convert air tile to water tile
						level.tileprops[i][j-1].height = 0;
						level.tileprops[i][j-1].dheight = 0;
					}
					
					if(tr.solid==0){
						level.data[i][j+1] = 4;				// Convert air tile to water tile
						level.tileprops[i][j+1].height = 0;
						level.tileprops[i][j+1].dheight = 0;
					}
				}
			}
		}
		
	}
}




