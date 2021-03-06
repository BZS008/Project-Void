"use strict";

// Liquid object
// contains general variables and functions for liquid physics
var liquid = {
	drops:[],									// Array for holding droplets
	
	// Function for adding droplets
	addDroplet:function(vt, vtv, area0, area, circmf, type){
		
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
		var midpoints = arrnum2D(nvt, 2, 0);			// Initialize midpoint array
		
		// Build midpoint array
		for (var ivt = 0; ivt < nvt; ivt++) {
			var nextivt = (ivt+1) % nvt;				// Next vertex
			midpoints[ivt] = midpoint(d.vt[ivt], d.vt[nextivt]);
		}
		
		// Initialize path
		ctx.beginPath();								// Start drawing droplet
		ctx.moveTo(xl2xv(midpoints[0][0]), yl2yv(midpoints[0][1]));
		
		// Draw path
		for(var ivt=0; ivt<nvt; ivt++){					// Loop over droplet vertices
			var nextivt = (ivt+1) % nvt;				// Next vertex
			var p2 = l2v(d.vt[nextivt]);
			var p3 = l2v(midpoints[nextivt]);
			ctx.quadraticCurveTo(p2[0], p2[1], p3[0], p3[1]);
		}
		ctx.closePath();
		ctx.fillStyle = 'blue';							///// Get correct color using type!
		ctx.fill();

        //// Draw vertex indices
		for(var ivt=0; ivt<nvt; ivt++){					// Loop over droplet vertices
		    var p = l2v(d.vt[ivt]);
            gamelog.textmark(ivt, p[0], p[1], true);    //// Show vertex indices
        }
	},
	
	// Slices vertex array at given indices and returns largest slice
	dropslice:function(d, is) {
		// This function assumes 2 intersections and will ignore any other than is[0] and is[1]
		var n = d.vt.length;
		var vt1  = d.vt.slice((is[1]+1)%n,  n).concat(d.vt.slice(0,  is[0]));	// the slice including start/end
		var vt2  = d.vt.slice((is[0]+1)%n,  is[1]);								// the slice not including start/end
		var vtv1 = d.vtv.slice((is[1]+1)%n, n).concat(d.vtv.slice(0, is[0]));	// the slice including start/end
		var vtv2 = d.vtv.slice((is[0]+1)%n, is[1]);								// the slice not including start/end
		
		var slice1 = {vt: vt1, vtv: vtv1};
		var slice2 = {vt: vt2, vtv: vtv2};
		
        // Return largest slice
		if (vt1.length > vt2.length) {
			return slice1;
		} else {
			return slice2;
		}
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
		
		drop1loop:
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
				// dist[ivt] = mag(D1); 					// Store new distance
				
				// Vertex Distance and Angle calculation
				var D1last = lincom(1,D1, 1,vtv[ivt], -1,vtv[nextivt]);
				var D2last = lincom(1,D2, 1,vtv[ivt], -1,vtv[previvt]);
				var Ddist1 = mag(D1) - mag(D1last);
				var Ddist2 = mag(D2) - mag(D2last);
				var Dangle = angle(D1, D2) - angle(D1last, D2last);
				
				// Angle damping
				lincomto(vta[ivt], angdamp*Dangle, vout);
				
				// Angle damping, Surface damping and Air friction
				lincomto(a,  -areadamp*darea, vout,  surfdamp*Ddist1, uD1,  surfdamp*Ddist2, uD2,  -damp, vtv[ivt]);
				
				// Set computed accelration
				addto(vta[ivt], a);
				
				////
				var vector_scale = 450;
				var vector_scale_damp = 450;
				// Draw Surface Tension and Pressure force vectors
				//// gamelog.vector.push([vt[ivt], D1, '#ff0', vector_scale*km]);
				//// gamelog.vector.push([vt[ivt], D2, '#f80', vector_scale*km]);
				//// gamelog.vector.push([vt[ivt], vout, '#090', vector_scale*Fexpand]);
				//// gamelog.vector.push([vt[ivt], vout, '#0f0', vector_scale_damp*-areadamp*darea])
				//// gamelog.vector.push([vt[ivt], uD1, '#fff', vector_scale_damp*surfdamp*Ddist1])
				//// gamelog.vector.push([vt[ivt], uD2, '#999', vector_scale_damp*surfdamp*Ddist2])
				//// gamelog.vector.push([vt[ivt], vout, '#0ff', vector_scale_damp*angdamp*Dangle])
				//// gamelog.vector.push([vt[ivt], vtv[ivt], '#faa', -vector_scale_damp*damp])
				////
			}
			
			//--- Integration ---//
			for (var ivt=0; ivt<nvt; ivt++) {
				//// Leapfrog pls?
				addto(d.vt[ivt], d.vtv[ivt]);
				addto(vtv[ivt], vta[ivt]);
			}
			
			
			// Update circumference of droplet
			d.circmf = polycircmf(d.vt);
			gamelog.num[5] = d.circmf;
			gamelog.numstr[5] = 'circmf: ';
			
			
			//--- Droplet-Droplet Collision ---//
			// Note: In order to avoid constant looping over all droplet vertices,
			// it is first checked if the droplets are within each others proximity.
			// If any pair of the droplets vertices are farther away than
			// the average of the droplets circumferences, the droplets can't
			// ever collide, for any shape.
			
			for (var j=i+1; j<nd; j++) {						// Loop from current to last droplet
				var d2 = liquid.drops[j];
				var avgcircmf = (d.circmf + d2.circmf)/2;		// Average circumference
				
				if (avgcircmf > distance2Dvec(d.vt[0], d2.vt[0])) {
					// Droplets could collide
					if (i!==j) {gamelog.blink(i);} ///// Show if droplets are close together
					var intersections = [];						// Keep track of intersection coordinates
					var intersectivt1 = [];						// Keep track of intersecting vertex indices
					var intersectivt2 = [];						// Keep track of intersecting vertex indices
					var nvt2 = d2.vt.length;					// Number of vertices for droplet 2
					
					// Cross test all line segment pairs for intersection
					for (var ivt1=0; ivt1<nvt; ivt1++) {		// Loop over vertices of droplet 1
						var nextivt1 = (ivt1+1) % nvt;			// Next vertex
						var v1 = d.vt[ivt1];					// Droplet 1 vertex 1
						var v2 = d.vt[nextivt1];				// Droplet 1 vertex 2
						
						for (var ivt2=0; ivt2<nvt2; ivt2++) {	// Loop over vertices of droplet 2
							var nextivt2 = (ivt2+1) % nvt2;		// Next vertex
							var w1 = d2.vt[ivt2];				// Droplet 2 vertex 1
							var w2 = d2.vt[nextivt2];			// Droplet 2 vertex 2
							
							// Test line segment intersection
							var intersect = linesegments_intersect(v1, v2, w1, w2);

							if (intersect) {					// If an intersection has been found
								intersections.push(intersect);	// Add intersection to the list
								intersectivt1.push(ivt1); 		// Add vertex indices to the 1st list
								intersectivt2.push(ivt2); 		// Add vertex indices to the 2nd list
							}
						}
					}
					
					
					if (intersections.length > 1) {				// If intersections have been found
						
						// Slice droplet polygon at intersection
						var subdrop1 = this.dropslice(d, intersectivt1);
						var subdrop2 = this.dropslice(d2, intersectivt2);
						
						// Construct new droplet
						///// I suspect the intersection order is not the same every time
						///// and is responsible for some of the explosions
						///// This should be checked
						var vtnew = [intersections[1]].concat(subdrop1.vt).concat([intersections[0]]).concat(subdrop2.vt);
						var vtvnew = [[0,0]].concat(subdrop1.vtv).concat([[0,0]]).concat(subdrop2.vtv);
						
						// Remove original droplets (break! fix droplet loop iterator!)
						liquid.drops.splice(j, 1);				// Remove 2nd droplet
						liquid.drops.splice(i, 1);				// Remove 1st droplet
						
						// Add new droplet
						var area0 	= d.area0 + d2.area0;
						var area    = polyarea(vtnew);
						var circmf	= polycircmf(vtnew);
						var type 	= 0;
						
						liquid.addDroplet(vtnew, vtvnew, area0, area, circmf, type);
						break drop1loop;
					}
				}
			}
			
			// Set latest calculated area for next iteration
			d.area = area;
		}
		
		//--- Droplet Self Interaction ---//
		
		///// Note: In order to get more realistic droplet behaviour, it might
		///// be necessary to add local change-in-area dampening (2D volume).
		///// Or rather, dampening proportional to a calculated flow speed
		///// inside smaller droplet compartments. This should add some more
		///// viscous behaviour in cases where fluid inside the droplet is
		///// pushed to flowing very fast. Triangulation for this problem might
		///// be done with a Delaunay Triangulation algorithm.
		
		
		//--- Liquid Tile Physics ---//
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
					////// A velocity (dh/dt) component might add a more inertial kind
					////// of behaviour.
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
