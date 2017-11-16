//---------------------//
//--- extra_math.js ---//
//                     //
// Creator: Daniël Cox //
//---------------------//

tau=Math.PI*2

function distance(p,q){
	// calculate 2D distance between two objects
	// objects should have x and y properties
	Dx=p.x-q.x; Dy=p.y-q.y
	return Math.sqrt(Dx*Dx+Dy*Dy)
}


// 2D Vector Operations

function pytha(p){
	// pythagoras
	return Math.sqrt(p[0]*p[0] + p[1]*p[1]);
}

function manhatten(p1, p2){
	// calculate manhatten distance between two 2D vectors
	return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}

function midpoint(p1,p2){
	// calculate midpoint vector of two 2D vectors
	return [(p1[0] + p2[0])/2, (p1[1] + p2[1])/2];
}

function rot90(p) {
	// Rotate a vector +90 degrees
	return [-p[1], p[0]];
}

function unit(p) {
	// Compute unit vector from vector
	// Returns [0, 0] if vector magnitude is 0
	var magnitude = pytha(p);
	if (magnitude == 0) {
		return [0, 0];
	} else {
		return [p[0]/magnitude, p[1]/magnitude];
	}
}

function add() {
	// Add any number of 2D vectors
	var narg = arguments.length;
	var v = [0,0];
	
	for (var i = 0; i < narg; i++) {	// Sum arguments elementwise
		v[0] += arguments[i][0];
		v[1] += arguments[i][1];
	}
	return v;
}

function subtract() {
	// Subtract any number of 2D vectors from the first argument
	var narg = arguments.length;
	
	if (narg === 0) {						// Argument list empty
		return 0;
	} else {
		var v = arguments[0].slice(0);
		
		for (var i = 1; i < narg; i++) {	// Subtract arguments elementwise
			v[0] -= arguments[i][0];
			v[1] -= arguments[i][1];
		}
		return v;
	}
}

function scale(s, p) {
	// Multiply a 2D vector with a scalar
	return [s*p[0], s*p[1]];
}

function innerprod() {
	// Inner product of any number of 2D vectors
	var narg = arguments.length;
	var v = [1,1];
	
	for (var i = 0; i < narg; i++) {	// Multiply arguments elementwise
		v[0] *= arguments[i][0];
		v[1] *= arguments[i][1];
	}
	return v;
}

function lincom() {
	// Linear combination of any number of scalars and 2D vectors
	// Usage: vector = lincom( scalar1, [x1,y1], scalar2, [x2,y2], ...)
	//   where vector == [scalar1*x1 + scalar2*x2 ..., scalar1*y1 + scalar2*y2 ...]
	var narg = arguments.length;
	if (narg % 2){return NaN;}
	var v = [0,0];
	
	for (var i = 0; i < narg; i+=2) {	// Add scaled vectors elementwise
		v[0] += arguments[i] * arguments[i+1][0];
		v[1] += arguments[i] * arguments[i+1][1];
	}
	return v;
}

function addlincom() {
	// Add Linear combination of any number of scalars and 2D vectors to first argument
	// Warning! This updates the referenced first array!
	// Usage: addlincom( [x0,y0], scalar1, [x1,y1], ...)
	//   where [x0,y0] becomes [x0 + scalar1*x1 ..., y0 + scalar1*y1 ...]
	// This is equal to lincom(1, [x0,y0], scalar1, [x1,y1], ...) except that
	// it modifies [x0, y0] instead of returning a value
	var narg = arguments.length;
	if (!(narg % 2)){return;}
	var v = arguments[0];
	
	for (var i = 1; i < narg; i+=2) {	// Add scaled vectors elementwise
		v[0] += arguments[i] * arguments[i+1][0];
		v[1] += arguments[i] * arguments[i+1][1];
	}
	return;
}

function polyarea(x, y){
	// Calculate unsigned area of non-selfintersecting closed polygon
	// (Using the sum of the cross products of the vertices)
	// x: x-coordinates of vertices
	// y: y-coordinates of vertices
	// x and y must be arrays of the same length containing only numbers
	
	var area2 = 0; 					// twice signed area
	var N = x.length;
	
	for (var i = 0; i < N; i++) {	// Loop over vertices
		var j = (i+1) % N; 			// Next vertex index (closed polygon)
		area2 += x[i] * y[j];		// Cross product (part 1)
		area2 -= y[i] * x[j];		// Cross product (part 2)
	}
	
	return Math.abs(0.5 * area2)
}


// Round Operations

function roundto(x,n){
	// x:		input number
	// n: 	number of decimals
	var factor=Math.pow(10,n)
	return Math.round(x*factor)/factor
}

function num2scistr(x,signif,sci) {
	// x:				input number (number)
	// signif:		number of significant numbers (number)
	// sci:			use scientific notation for x>=10^sci and x<=10^-sci
	
	// Fix negative numbers and zero
	if(x>0){
		var prestring=""
	}else if(x<0){
		x=-x
		var prestring="&#8211;"
	}else{
		return "0"
	}
	
	// Determine power of 10
	var exp=Math.floor(Math.log(x)/Math.LN10)
	
	if(Math.abs(exp)>=sci){
		// Use scientific notation
		var coef=x*Math.pow(10,-exp)
		var prefac=Math.pow(10,signif-exp-1)
		var sufdiv=Math.pow(10,signif-1)
		var coef_round=Math.round(x*prefac)/sufdiv
		
		return prestring+coef_round.toString()+"&middot;10<sup>"+exp.toString()+"</sup>"
	}else{
		// Use regular notation
		// note: numbers x>1 or x<-1 in regular notation won't be rounded to match the amount of significant numbers
		var fac=Math.pow(10,signif-exp-1)
		x=Math.round(x*fac)/fac
		return prestring+x.toString()
	}
}


// Compute the sum of a number array
function sum(a){
	var na = a.length;
	var total = 0;
	for(var i=0; i<na; i++){
		total += a[i];
	}
	return total;
}

// Compute the mean value of a number array
function mean(a){
	return sum(a)/a.length;
}

// Compute the standard deviation of a number array
function std(a){
	var na = a.length;
	var avg = mean(a);
	var vartotal = 0;
	for(var i=0; i<na; i++){
		var diff = a[i] - avg;
		vartotal += diff*diff;
	}
	return Math.sqrt(vartotal/na);
}


// Bool operations

function arrayOR(a){
	// OR operation over boolean array
	var any=false
	for(var i=0;i<a.length;i++){
		if(a[i]){
			any=true
			break
		}
	}
	return any
}


//------------ 2D Array functions ------------//
// Create 2D empty object array of size ni x nj
function arrob2D(ni, nj){
	var a = [];
	for(var i=0;i<ni;i++){
		a[i] = [];
		for(var j=0;j<nj;j++){
			a[i][j] = {};
		}
	}
	return a;
}

// Create 2D number array of size ni x nj
function arrnum2D(ni, nj, num){
	var a = [];
	for(var i=0;i<ni;i++){
		a[i] = [];
		for(var j=0;j<nj;j++){
			a[i][j] = num;
		}
	}
	return a;
}
