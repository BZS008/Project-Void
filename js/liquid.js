"use strict";

// Liquid object
// contains general variables and functions for liquid physics
var liquid = {
	drops:[],									// Array for holding droplets
	
	// Function for adding droplets
	addDroplet:function(vt, vtv, area0, area, type){
		
		liquid.drops.push({
			vt: vt, 							// vertices coordinates
			vtv: vtv,							// vertices velocities
			area0: area0,						// Target Area (2D Volume) of droplet (without surface tension)
			area: area,							// Latest calculated area
			type: type							// Type of liquid
		});
	},
	
	// Function for drawing droplets
	drawDroplet:function(i){
		var d = liquid.drops[i];
		var nvt = d.vt.length;
		ctx.beginPath();						// Start drawing droplet
		ctx.moveTo(xl2xv(d.vt[0][0]), yl2yv(d.vt[0][1]));
		
		for(var vt=1; vt<nvt; vt++){			// Loop over droplet vertices
			var p = l2v(d.vt[vt]);
			ctx.lineTo(p[0], p[1]);
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
			var area = polyarea(d.vt);					// Current droplet area
			var darea = area - d.area;					// Area difference with prev iteration
			
			var nvt = d.vt.length;						// Number of vertices
			var vta = arrnum2D(nvt, 2, 0); 				// Initialize zero array
			var dist = d.dist;							// Initialize as previous distance
			
			//--- Compute Accelerations ---//
			for(var ivt=0; ivt<nvt; ivt++){				// Compute Acceleration per vertex
				
				var vt = d.vt;
				var vtv = d.vtv;
				var a = [0, 0];
				
				// Vertex difference vectors
				var nextivt = (ivt+1) % nvt;			// Next vertex
				var previvt = (ivt-1+nvt) % nvt;		// Previous vertex
				var D1 = subtract(vt[nextivt], vt[ivt]);
				var D2 = subtract(vt[previvt], vt[ivt]);
				var D  = add(D1, D2);
				var uD1 = unit(D1);
				var uD2 = unit(D2);

				// Gravity
				// d.vtvy[vt] += fall_acc;
				
				// Surface Tension and Internal Pressure
				var km = 0.001;							// Spring Constant over Mass ///// Get using liquid type!
				var pc = 1e-5;							// Pressure Constant		 ///// Get using liquid type!
				var area0 = d.area0;					// Equilibrium Area (2D volume)
				var Fexpand = pc*(area0 - area); 		// Expansion force
				
				// Out pointing vector
				var vout = rot90(subtract(uD2, uD1));
				
				// Pressure
				a = add(a, scale(Fexpand, vout));
				
				// Surface Tension
				a = add(a, scale(km, D));
				
				
				// Damping factors
				var areadamp = 0.0005;
				var surfdamp = 0.01;
				var angdamp  = 0.1;
				var damp = 0.001;
				// dist[ivt] = pytha(D1); 					// Store new distance
				
				// Vertex Distance and Angle calculation
				var D1last = lincom(1,D1, 1,vtv[ivt], -1,vtv[nextivt]);
				var D2last = lincom(1,D2, 1,vtv[ivt], -1,vtv[previvt]);
				var Ddist1 = pytha(D1) - pytha(D1last);
				var Ddist2 = pytha(D2) - pytha(D2last);
				var Dangle = angle(D1, D2) - angle(D1last, D2last);
				
				// Angle damping
				lincomto(vta[ivt], angdamp*Dangle, vout);
				
				// Angle damping, Surface damping and Air friction
				lincomto(a,  -areadamp*darea, vout,  surfdamp*Ddist1, uD1,  surfdamp*Ddist2, uD2,  -damp, vtv[ivt]);
				
				// Set computed accelration
				addto(vta[ivt], a);
				
				////
				var vector_scale = 200;
				var vector_scale_damp = 2000;
				// Draw Surface Tension and Pressure force vectors
				gamelog.vector.push([vt[ivt], D1, '#ff0', vector_scale*km]);
				gamelog.vector.push([vt[ivt], D2, '#f80', vector_scale*km]);
				gamelog.vector.push([vt[ivt], vout, '#090', vector_scale*Fexpand]);
				gamelog.vector.push([vt[ivt], vout, '#0f0', vector_scale_damp*-areadamp*darea])
				gamelog.vector.push([vt[ivt], uD1, '#fff', vector_scale_damp*surfdamp*Ddist1])
				gamelog.vector.push([vt[ivt], uD2, '#999', vector_scale_damp*surfdamp*Ddist2])
				gamelog.vector.push([vt[ivt], vout, '#0ff', vector_scale_damp*angdamp*Dangle])
				gamelog.vector.push([vt[ivt], vtv[ivt], '#faa', -vector_scale_damp*damp])
				////
			}
			
			//--- Integration ---//
			for(var ivt=0; ivt<nvt; ivt++){
				//// Leapfrog pls?
				addto(d.vt[ivt], d.vtv[ivt])
				addto(vtv[ivt], vta[ivt]);
			}
			
			// Set latest calculated area for next iteration
			d.area = area;
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
