//---------------------//
//--- extra_math.js ---//
//                     //
// Creator: Daniël Cox //
//---------------------//

var tau = Math.PI*2;

function distance(p,q){
	// calculate 2D distance between two objects
	// objects should have x and y properties
	Dx=p.x-q.x; Dy=p.y-q.y;
	return Math.sqrt(Dx*Dx+Dy*Dy);
}

function saturate(a, k) {
	// Return value saturated at +k/-k
	if (Math.abs(a) < k) {
		return a;
	} else {
		return k*Math.sign(a);
	}
}


// 2D Vector Operations

function equals(v, w) {
	// Equals operator for 2D vectors
	return (v[0]===w[0] && v[1]===w[1]);
}

function mag(p){
	// Magnitude of vector
	return Math.sqrt(p[0]*p[0] + p[1]*p[1]);
}

function distance2Dvec(p1, p2) {
	// Calculate Euclidean distance between two 2D vectors
	return mag(subtract(p1, p2));
}

function manhatten(p1, p2){
	// Calculate manhatten distance between two 2D vectors
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

function rot270(p) {
	// Rotate a vector +90 degrees
	return [p[1], -p[0]];
}

function angle(v, w) {
	// Compute the unsigned angle between two vectors (between 0 and 2 pi)
	return (Math.atan2(w[1], w[0]) - Math.atan2(v[1], v[0]) + tau) % tau;
}

function unit(v) {
	// Compute unit vector from vector
	// Returns [0, 0] if vector magnitude is 0
	var magnitude = mag(v);
	if (magnitude == 0) {
		return [0, 0];
	} else {
		return [v[0]/magnitude, v[1]/magnitude];
	}
}

function add() {
	// Add any number of 2D vectors
	var narg = arguments.length;
	var v = [0, 0];
	
	for (var i = 0; i < narg; i++) {	// Sum arguments elementwise
		v[0] += arguments[i][0];
		v[1] += arguments[i][1];
	}
	return v;
}

function addto() {
	// Add any number of 2D vectors to the first argument
	// N.B. This modifies the first reference array!
	var narg = arguments.length;
	
	if (narg === 0) {						// Argument list empty
		return;
	} else {
		var v = arguments[0];
		
		for (var i = 1; i < narg; i++) {	// Add arguments elementwise
			v[0] += arguments[i][0];
			v[1] += arguments[i][1];
		}
		return;
	}
}

function subtract() {
	// Subtract any number of 2D vectors from the first argument
	var narg = arguments.length;
	
	if (narg === 0) {						// Argument list empty
		return [0, 0];
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

function crossprod(v, w) {
	// 2D cross product of two 2D vectors (returns a scalar)
	return v[0]*w[1] - v[1]*w[0];
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

function lincomto() {
	// Add Linear combination of any number of scalars and 2D vectors to first argument
	// N.B. This updates the referenced first array!
	// Usage: lincomto( [x0,y0], scalar1, [x1,y1], ...)
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

function polyarea(vt) {
	// Calculate unsigned area of non-selfintersecting closed polygon
	// (Using the sum of the cross products of the vertices)
	// vt: coordinates of vertices as (array of 2D vectors)
	
	var area2 = 0; 						// twice signed area
	var N = vt.length;
	
	for (var i = 0; i < N; i++) {		// Loop over vertices
		var j = (i+1) % N; 				// Next vertex index (closed polygon)
		area2 += crossprod(vt[i], vt[j]);
	}
	
	return Math.abs(0.5 * area2)
}

function polycircmf(vt) {
	// Calculate the circumference of a closed polygon
	
	var circmf = 0;
	var N = vt.length;
	
	// Sum all line segments of polygon
	for (var i = 0; i < N; i++) {		// Loop over vertices
		var j = (i+1) % N; 				// Next vertex index (closed polygon)
		circmf += distance2Dvec(vt[j], vt[i]);
	}
	
	return circmf;
}

function linesegments_intersect(v1, v2, w1, w2) {
	// Calculate intersection of two line segments
	// v1:	line segment v start
	// v2:	line segment v end
	// w1:	line segment w start
	// w2:	line segment w end
	// Returns false if intersection is outside either line section
	
	// Check if line segments have length > 0
	if (equals(v1, v2) || (equals(w1, w2))) {
		return false;
	}
	
	// Calculate intersection variables:  intersection P = W1 + t*(W2-W1)
	//     (capitals are vectors)         intersection P = V1 + s*(V2-V1)
	var Dv = subtract(v2, v1);
	var Dw = subtract(w2, w1);
	var s = ( Dw[0]*(v1[1]-w1[1]) - Dw[1]*(v1[0]-w1[0]) ) / ( Dw[1]*Dv[0] - Dw[0]*Dv[1] );
	var t = ( Dv[0]*(w1[1]-v1[1]) - Dv[1]*(w1[0]-v1[0]) ) / ( Dv[1]*Dw[0] - Dv[0]*Dw[1] );
	
    // Checks and intersection calculation
	if ( isNaN(s) || isNaN(t) || !isFinite(s) || !isFinite(t) ) { // Check s and t for NaN and Inf
		return false;
	} else {
		if (s>1 || s<0 || t>1 || t<0) {		// Check whether intersection is outside line segments
			return false;
		} else {
			// Compute and return intersection point
			var P = lincom(1, v1, s, Dv);
			return P;
		}
	}
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
