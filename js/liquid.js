// Liquid object
// contains general variables and functions for liquid physics
var liquid = {
	drops:[],									// Array for holding droplets
	
	// Function for adding droplets
	addDroplet:function(vtx,vty,vtvx,vtvy,area0,type){
		
		liquid.drops.push({
			vtx:vtx,							// x coord vertices
			vty:vty,							// y coord vertices
			vtvx:vtvx,							// x velocity vertices
			vtvy:vtvy,							// y velocity vertices
			area0:area0,						// Area (2D Volume) of droplet
			type:type							// Type of liquid
		});
	},
	
	// Function for drawing droplets
	drawDroplet:function(i){
		var d = liquid.drops[i];
		var nvt = d.vtx.length;
		ctx.beginPath();						// Start drawing droplet
		ctx.moveTo(xl2xv(d.vtx[0]), yl2yv(d.vty[0]));
		
		for(var vt=1; vt<nvt; vt++){			// Loop over droplet vertices
			ctx.lineTo(xl2xv(d.vtx[vt]), yl2yv(d.vty[vt]));
		}
		ctx.closePath();
		ctx.fillStyle = 'blue';					///// Get correct color using type!
		ctx.fill();
	},
	
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
		// Liquid Droplet Physics
		var nd = liquid.drops.length;
		for(var i=0; i<nd; i++){						// Loop over droplets
			var d = liquid.drops[i];
			
			// Compute Droplet Area (2D volume)
			var area = polyarea(d.vtx, d.vty);
			
			var nvt = d.vtx.length;						// Number of vertices
			for(var vt=0; vt<nvt; vt++){				// Loop over droplet vertices
				
				// Integrate vertex velocity
				d.vtx[vt] += d.vtvx[vt];
				d.vty[vt] += d.vtvy[vt];
				
				//--- Forces ---//
				var a = [0, 0];
				
				// Vertex difference vectors
				var nextvt = (vt+1) % nvt;				// Next vertex
				var prevvt = (vt-1+nvt) % nvt;			// Previous vertex
				var Dx1 = d.vtx[nextvt] - d.vtx[vt];	// Delta x 1
				var Dy1 = d.vty[nextvt] - d.vty[vt];	// Delta y 1
				var Dx2 = d.vtx[prevvt] - d.vtx[vt];	// Delta x 2
				var Dy2 = d.vty[prevvt] - d.vty[vt];	// Delta y 2
				
				var D1 = [Dx1, Dy1];
				var D2 = [Dx2, Dy2];
				var D  = add(D1, D2);

				// Gravity
				// d.vtvy[vt] += fall_acc;
				
				// Surface Tension and Internal Pressure
				var km = 0.002;							// Spring Constant over Mass ///// Get using liquid type!
				var pc = 0.4;							// Pressure Constant
				var area0 = d.area0;					// Equilibrium Area (2D volume)
				var Darea = (area0 - area)/area0;
				
				// Out pointing vector
				vout = rot90(subtract(unit(D2), unit(D1)));
				
				// Pressure
				a = add(a, scale(pc*Darea, vout));
				
				// Surface Tension
				a = add(a, scale(km, D));
				
				////
				// Draw Surface Tension and Pressure force vectors
				gamelog.vector.push([[d.vtx[vt], d.vty[vt]], D1, '#ff0', 200*km]);
				gamelog.vector.push([[d.vtx[vt], d.vty[vt]], D2, '#f80', 200*km]);
				gamelog.vector.push([[d.vtx[vt], d.vty[vt]], vout, '#0a0', 200*pc*Darea]);
				////
				
				// Damping
				var damp = 0.05;
				var ax = a[0];
				var ay = a[1];
				ax += -damp * d.vtvx[vt]
				ay += -damp * d.vtvy[vt]
				
				// Integrate Acceleration
				d.vtvx[vt] += ax;
				d.vtvy[vt] += ay;
			}
		}
		
		// Liquid Tile Physics
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
