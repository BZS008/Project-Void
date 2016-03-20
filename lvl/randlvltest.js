// Level Name
level.name="Random Level Test";

level.tilewidth=60;
level.tileheight=60;

var nxtiles = 180;
var nytiles = 13;
var nenm = 0;
var heightmultiplier = 0.7;

level.width = nxtiles*level.tilewidth;
level.height = nytiles*level.tileheight;

// Tileset
level.tileset="tiles/simpletiles.js";

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

// Generate Level Data
level.data=[];

for(var i=0;i<nytiles;i++){
	level.data[i] = [];
	
	for(var j=0;j<nxtiles;j++){
		
		var airlandvalue = 0.7*i/nytiles + amp1*Math.sin(freq1*j) + amp2*Math.cos(freq2*j) + amp3*Math.sin(freq3*j) + amp4*Math.cos(freq4*j) + amp5*Math.sin(freq5*j);
	
		if(airlandvalue<0.5){
			level.data[i][j] = 0;
		}else{
			var tiletype = 1;
			if(Math.random()>rockearthratio){tiletype=2;}
			level.data[i][j] = tiletype;
		}
	}
}


// Spawn enemies
for(var i=0;i<nenm;i++){
	var ent = spawn('enemy1',Math.random()*nxtiles*level.tilewidth,0);
	entities[ent].color = randomcolor();
}

