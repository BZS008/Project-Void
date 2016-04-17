//-------------------------//
//---- GAME LOG OBJECT ----//
//-------------------------//
//
// An object to store and show info on canvas realtime.
// Creator: Daniël Cox
//-------------------------
// Input: canvas context
//
// Properties:
// - show
//    Boolean. Show/hide gamelog.
// - precision
//    Integer. Max precision of number to string conversion.
//
// - circ (default 4x undefined)
//    Booleans. Reset after drawing the gamelog.
//    Red/green/grey. Use blink(n) to quickly set to true.
//	  Usage: gamelog.circ[#] = boolean
// - sqr (default 4x undefined)
//    Booleans. Won't be reset. Red/green/grey.
//	  Usage: gamelog.sqr[#] = boolean
// - num
//    Number. Yellow.
//	  Usage: gamelog.num[#] = number
//    Hint: use gamelog.num[i]++ for quick increment.
// - numstr
//    Strings. Yellow.
//    Will be put in front of corresponding numbers. Left out if undefined.
//	  Usage: gamelog.numstr[#] = string
// - text
//    Strings. White text.
//	  Usage: gamelog.text[#] = string
// - markers
//    Integer array of length 2. Use to mark a location in the canvas.
//	  Usage: gamelog.mark[#] = [x,y]
// - markercolors
//    Strings. Use to change context fillStyle color of marker.
//    Undefined and false give red. True gives green. String is used as fillStyle.
//	  Usage: gamelog.markcolor[#] = undefined|boolean|string
// - graph
//    Number array.
//    All graphs will be plotted in the graph rectangle.
// - hist
//    Object array.
//    Each object contains info for plotting a histogram.
//    Usage: gamelog.hist.push({oblist:object array, prop:string, min:number, max:number})
//    max can also take the string 'auto', to automatically choose the maximum of the given set.
//
// Functions:
// - blink(n)
//    Sets nth circle var to true.
// - toggle()
//    Toggles gamelog visibility on/off.
// - draw()
//    Draws the gamelog for you
// - updateGraph(graphnumber, value [, min, max ])
//    Add new value to graph.
// - textmark(s,x,y)
//    Draws text at specified location. s is object with .toString() method.
//-------------------------


function createGameLog(ctx){
	var gamelog={
		show:true,
		precision:4,
		fps_timestamp:0,
		fps:0,
		logwidth:300,
		
		graphx:10,
		graphy:30,
		graphxarray:[],
		graphsamples:120,
		graphcolors:['#f11','#0ff','#0f0','#ff0','#f0f','#f80','#fff','#888','#00f'],
		graphwidth:280,	            // Width of graph/histogram
		graphheight:120,	        // Height of graph/histogram
		
		nhistbins:25,				// Number of histogram bins
		
		// circ, sqr, num, mark and graph
		circ:[undefined,undefined,undefined,undefined],
		sqr:[undefined,undefined,undefined,undefined],
		num:[0],
		numstr:[''],
		mark:[],
		markcolor:[],
		graph:[],
		graphstr:[],
		hist:[],
		
		// Quick true assignment for ticks
		blink:function(n){this.circ[n]=true},
		
		// text
		text:["hello world!"],
		
		// toggle show
		toggle:function(){
			if(this.show){
				this.show=false
			}else{
				this.show=true
			}
		},
		
		textmark:function(s,x,y){
			if(this.show){
				ctx.font='10pt Lucida Console';
				ctx.fillStyle='white';
				ctx.textAlign='center';
				ctx.fillText(s.toString(),x,y)
			}
		},
		
		// Add new value to graph
		updateGraph:function(g,v,gstr,vmin,vmax){
			if(arguments.length>2){			                            // If no graph string is set, don't use
				this.graphstr[g]=gstr;
			}
			if(arguments.length<5){			                            // If no min and max values are given, set to default
				var vmin=-10; var vmax=10;
			}
			if(this.graph[g]===undefined){								// If graph doesn't exist yet, create it
				this.graph[g]=[];
			}
			
			var y=(vmax-v)*this.graphheight/(vmax-vmin)+this.graphy;	// Calculate
			this.graph[g].push(y);										// Add new value
			if(this.graph[g].length>this.graphsamples){					// If number of graph samples is reached
				this.graph[g].shift();									// Cut off first value of array
			}
		},
		
		// Draw green/red/grey circle for true/false/undefined vars
		drawCircle:function(x,y,prop,index){
			ctx.beginPath()
			ctx.arc(x,y,10,0,Math.PI*2)
			if(prop){ctx.fillStyle='green'}
			else if(prop===undefined){ctx.fillStyle='grey'}
			else{ctx.fillStyle='red'}
			ctx.fill()
			ctx.stroke()
			
			if(prop!==undefined){								// Draw numbers on defined circle vars
				ctx.font='9pt Lucida Console'
				ctx.fillStyle='white'
				ctx.textAlign='center'
				ctx.fillText(index,x,y+4)
			}
		},
		
		// Draw green/red/grey square for true/false/undefined vars
		drawSquare:function(x,y,prop,index){
			ctx.beginPath()
			ctx.rect(x,y,20,20)
			if(prop){ctx.fillStyle='green'}
			else if(prop===undefined){ctx.fillStyle='grey'}
			else{ctx.fillStyle='red'}
			ctx.fill()
			ctx.stroke()
			
			if(prop!==undefined){								// Draw numbers on defined circle vars
				ctx.font='9pt Lucida Console'
				ctx.fillStyle='white'
				ctx.textAlign='center'
				ctx.fillText(index,x+10,y+14)
			}
		},
		
		// Draw line of graph
		drawGraphline:function(g,style,dx){
			graph = this.graph[g]
			ctx.beginPath()
			ctx.strokeStyle=style
			var graphlength = graph.length
			for(var i=0;i<graphlength;i++){						// Loop over graph samples
				var x=1+this.graphx+i*dx;						// Calculate x value
				var y=graph[i];									// Get y value
				if(y<this.graphy+2){							// Saturation at top
					y=this.graphy+2;
				}else if(y>this.graphy+this.graphheight-2){		// Saturation at bottom
					y=this.graphy+this.graphheight-2;
				}
				ctx.lineTo(x,y)									// Draw line segment
			}
			ctx.stroke()
		},
		
		
		// Draw all elements of the gamelog
		draw:function(){
			if(this.show){											// Draw gamelog if show==true
			
				// Draw markers
				for(var i=0;i<this.mark.length;i++){	        	// Loop over markers
					if(this.mark[i]!==undefined){		        	// If the marker is defined
						ctx.beginPath();
						ctx.lineWidth=1.6;
						ctx.arc(this.mark[i][0],this.mark[i][1],5,0,Math.PI*2);	// Draw circle as mark around the coords
						
						if(typeof(this.markcolor[i])==="string"){	// The markcolor is a string
							ctx.strokeStyle = this.markcolor[i];	// The markcolor is used as strokeStyle
						}else{
							if(this.markcolor[i]===undefined || this.markcolor[i]===false){
								ctx.strokeStyle='red';
							}else if(this.markcolor[i]===true){		// The markcolor===true
								ctx.strokeStyle='green';
							}
						}
						ctx.stroke();
					}
				}
				
				var nhist = this.hist.length; // Get number of histograms
				
				// Draw dark rectangle
				ctx.beginPath();
				ctx.fillStyle='rgba(0,0,0,0.6)';
				ctx.rect(0,0,this.logwidth,((this.graphheight+10)*nhist)+this.graphheight+95+(this.num.length+this.text.length)*20);
				ctx.fill();
				
				// Draw FPS
				var newtimestamp = new Date().getTime();
				var fps = 1000/(newtimestamp-this.fps_timestamp);
				this.fps = fps;										// Update FPS variable
				this.fps_timestamp = newtimestamp;
				ctx.font='11pt Lucida Console';
				ctx.fillStyle='#0ff';
				ctx.fillText(fps.toPrecision(2)+' FPS',30,20); //////////////// FPS is wrong??? Nope, wrong x-pos.
				
				// Draw graph rectangle
				ctx.beginPath()
				ctx.strokeStyle='#555'
				ctx.fillStyle='#000'
				ctx.rect(this.graphx,this.graphy,this.graphwidth,this.graphheight)
				ctx.fill()
				ctx.stroke()
				
				// Draw graph lines
				ctx.lineWidth=2
				ctx.lineJoin = 'round';
				var dx = this.graphwidth/this.graphsamples
				for(var g=0;g<this.graph.length;g++){
					if(this.graph[g]!==undefined){
						var style = this.graphcolors[g%this.graphcolors.length]
						this.drawGraphline(g,style,dx)
					}
				}
				
				// Draw graph strings rectangle
				ctx.textAlign='left';
				ctx.font='8pt Lucida Console'
				var ngraphstr = this.graphstr.length;
				var g=0;
				var maxwidth=0;
				for(var i=0;i<ngraphstr;i++){			// Loop over graph strings to find correct size
					if(this.graphstr[i]!==undefined){
						var strwidth=ctx.measureText(this.graphstr[i]).width;
						if(strwidth>maxwidth){
							maxwidth=strwidth;
						}
						g++;
					}
				}
				
				ctx.beginPath()
				ctx.fillStyle='rgba(0,0,0,0.7)'
				ctx.rect(this.graphx+1,this.graphy+1,maxwidth+5,g*11+5)
				ctx.fill()
				
				// Draw graph strings
				var g=1;
				for(var i=0;i<ngraphstr;i++){
					if(this.graphstr[i]!==undefined){
						ctx.fillStyle = this.graphcolors[i%this.graphcolors.length];
						ctx.fillText(this.graphstr[i],this.graphx+3,this.graphy+g*11)
						g++;
					}
				}
				
				// Draw histogram rectangle
				for(var h=0;h<nhist;h++){
					ctx.beginPath();
					ctx.strokeStyle='#555';
					ctx.fillStyle='#000';
					var histy = (1+h)*(this.graphheight+10)+this.graphy;
					ctx.rect(this.graphx,histy,this.graphwidth,this.graphheight);
					ctx.fill();
					ctx.stroke();
					
					// Gather values
					var H = this.hist[h];					// Get current histogram object
					var nobs = H.oblist.length;	   	        // Number of objects
					var bins = [];	                        // Initialize bins
					for(var b=0;b<this.nhistbins;b++){		// Loop over bins
						bins[b] = 0;						// And fill it with zeros
					}
					
					// Determine maximum
					if(H.max==='auto'){
						max = H.oblist[0][H.prop];	        // max starts at first item value
						for(var i=1;i<nobs;i++){            // Loop over oblist
							if(max<H.oblist[i][H.prop]){	// Determine maximum
								max = H.oblist[i][H.prop];
							}
						}
					}else{
						max = H.max;		                // Set maximum
					}
					
					var scope = max - H.min;	            // Calculate scope
					
					// Fill bins
					for(var i=0;i<nobs;i++){                // Loop over oblist
						var b = Math.floor(this.nhistbins * H.oblist[i][H.prop]/scope);
						if(b<this.nhistbins && b>=0){	    // Exclude stuff outside scope
							bins[b]++;                      // Add to bin
						}
					}
					
					// Determine maximum of bin
					var bmax = 0;
					for(var b=0;b<this.nhistbins;b++){	// Loop over bins
						if(bmax<bins[b]){	// Find maximum
							bmax = bins[b];
						}
					}
					
					// Draw histogram bars
					for(var b=0;b<this.nhistbins;b++){
						ctx.beginPath();
						var style = this.graphcolors[this.graph.length+h%this.graphcolors.length];
						ctx.fillStyle=style;
						//ctx.rect(this.graphx+b/this.nhistbins, histy, this.graphwidth/this.nhistbins, bins[b]/bmax*this.graphheight);
						var bx = this.graphx+b/this.nhistbins*this.graphwidth;
						var by = histy+this.graphheight*(1-bins[b]/bmax);
						var bw = this.graphwidth/this.nhistbins-1;
						var bh = this.graphheight*bins[b]/bmax;
						ctx.rect(bx,by,bw,bh);
						ctx.fill();
					}
					
					// Draw histogram text (and text rectangle)
					ctx.textAlign='left';
					ctx.font='11pt Lucida Console';
					var strwidth=ctx.measureText(H.prop).width;
					ctx.beginPath()
					ctx.fillStyle='rgba(0,0,0,0.7)'
					ctx.rect(this.graphx+1,histy+1,strwidth+10,20)
					ctx.fill()
					ctx.fillStyle='#fff';
					ctx.fillText(H.prop,this.graphx+5,histy+15);
				}
				
				// Draw booleans
				ctx.strokeStyle='black';
				ctx.lineWidth=2;
				
				// Boolean Circles (on frame resetting)
				for(var i=0;i<this.circ.length;i++){
					this.drawCircle(15+i*20,((this.graphheight+10)*nhist)+this.graphheight+50,this.circ[i],i);
				}
				
				// Boolean Squares (not on frame resetting)
				for(var i=0;i<this.sqr.length;i++){
					this.drawSquare(5+i*20,((this.graphheight+10)*nhist)+this.graphheight+65,this.sqr[i],i);
				}
				
				// Draw num
				ctx.font='11pt Lucida Console'
				for(var i=0;i<this.num.length;i++){
					ctx.textAlign='left'
					if(this.num[i]==undefined){
						ctx.fillStyle='grey'
						var snum="undefined"
					}else{
						ctx.fillStyle='#ff0'
						var precnum = this.num[i].toPrecision(this.precision)
						var strnum = this.num[i].toString()
						if(precnum.length<strnum.length){
							var snum = precnum
						}else{
							var snum = strnum
						}
					}
					
					// Get string corresponding with num
					if(this.numstr[i]==undefined){
						var snumstr = "";
					}else{
						var snumstr = this.numstr[i];
					}
					ctx.fillText(snumstr+snum,10,((this.graphheight+10)*nhist)+this.graphheight+105+i*18);
				}
				
				// Draw text
				for(var i=0;i<this.text.length;i++){
					ctx.textAlign='left'
					if(this.text[i]==undefined){ctx.fillStyle='grey'}
					else{ctx.fillStyle='white'}
					ctx.fillText(this.text[i],10,((this.graphheight+10)*nhist)+this.graphheight+110+(this.num.length+i)*18)
				}
				
				// Reset circ
				for(var i=0;i<this.circ.length;i++){
					this.circ=[undefined,undefined,undefined,undefined]
				}
			}
		}
	}
	
	return gamelog
}
