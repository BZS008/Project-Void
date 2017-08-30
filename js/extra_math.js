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
	return Math.sqrt(p[0]*p[0]+p[1]*p[1])
}

function manhatten(p1,p2){
	// calculate manhatten distance between two 2D vectors
	return Math.abs(p1[0]-p2[0])+Math.abs(p1[1]-p2[1])
}

function midpoint(p1,p2){
	// calculate midpoint vector of two 2D vectors
	return [(p1[0]+p2[0])/2,(p1[1]+p2[1])/2]
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
