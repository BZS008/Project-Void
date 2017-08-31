// Level Name
level.name="Random Level Test";

level.tilewidth=70;
level.tileheight=70;

var nxtiles = 180;
var nytiles = 13;
var nenm = 0;
var heightmultiplier = 0.7;

level.width = nxtiles*level.tilewidth;
level.height = nytiles*level.tileheight;

// Tileset
level.tileset="js/tiles/simpletiles.js";

// Generate random coefficients and frequencies
var freq1 = (0.5+Math.random())/40;
var freq2 = (2.5+Math.random())/20;
var freq3 = (4+Math.random())/20;
var freq4 = (6+Math.random())/20;
var freq5 = (8+Math.random())/20;

var amp1 = 0.15*heightmultiplier*Math.random();
var amp2 = 0.14*heightmultiplier*Math.random();
var amp3 = 0.12*heightmultiplier*Math.random();
var amp4 = 0.10*heightmultiplier*Math.random();
var amp5 = 0.09*heightmultiplier*Math.random();

var rockearthratio = Math.random();
var othergroundtile = 2;
if(Math.random()<0.3){othergroundtile = 3;}

// Generate Level Data
level.data = new Array(nytiles).fill(new Array(nxtiles));

for(var i=0;i<nytiles;i++){
	level.data[i] = [];
	
	for(var j=0;j<nxtiles;j++){
		
		var airlandvalue = 0.7*i/nytiles + amp1*Math.sin(freq1*j) + amp2*Math.cos(freq2*j) + amp3*Math.sin(freq3*j) + amp4*Math.cos(freq4*j) + amp5*Math.sin(freq5*j);
	
		if(airlandvalue<0.5){
			// Insert air or the occasional water tile
			var tiletype = 0;
			// if(Math.random()<0.4){tiletype=4;} // Water tile, enable to add random water tiles
			level.data[i][j] = tiletype;
			
		}else{
			// Insert rock or earth/sand tile
			var tiletype = 1;
			if(Math.random()>rockearthratio){tiletype=othergroundtile;}
			level.data[i][j] = tiletype;
		}
	}
}

// Initialise local tile properties
level.init_tileprops();

// Scan level for water tiles
for(var i=0;i<nytiles;i++){
	for(var j=0;j<nxtiles;j++){
		if(level.data[i][j]==4){
			// If a water tile is found, set the water properties
			// var waterheight = ;
			level.tileprops[i][j].height = Math.random();
			level.tileprops[i][j].dheight = 0;
		}
	}
}


levelspawns = [];
