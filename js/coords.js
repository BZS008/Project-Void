// Coordinate conversion

// Level Coordinates <-> Tile Indices
function xl2j(xl){
	return parseInt(xl/level.tilewidth);
}

function yl2i(yl){
	return parseInt(yl/level.tileheight);
}

function j2xl(j){
	return level.tilewidth*j;
}

function i2yl(i){
	return level.tileheight*i;
}

// Viewport Coordinates <-> Tile Indices
function xv2j(xv){
	return parseInt((xv - viewport.width/2 + viewport.x) / level.tilewidth);
}

function yv2i(yv){
	return parseInt((yv+viewport.y)/level.tileheight);
}

function j2xv(j){
	return level.tilewidth*j - viewport.x + viewport.width/2;
}

function i2yv(i){
	return level.tileheight*i - viewport.y;
}

// Level Coordinates <-> Viewport Coordinates
function xl2xv(xl){										// Convert level x coord to viewport x coord
	return xl - viewport.x + viewport.width/2;
}

function yl2yv(yl){										// Convert level y coord to viewport y coord
	return yl - viewport.y;
}

function xv2xl(xv){
	return xv + viewport.x - viewport.width/2;
}

function yv2yl(yv){
	return yv + viewport.y;
}


