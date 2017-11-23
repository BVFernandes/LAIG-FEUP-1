/**
 * MyBezierAnimation
 * @constructor
 **/
function MyBezierAnimation(id, velocity, controlPoints) {
	MyAnimation.call(this,id,velocity);

	this.controlPoints = controlPoints;

	this.curveDist = this.curveDistanceRecursive(this.controlPoints,10);
	this.totalTime = this.curveDist/this.velocity;
}

MyBezierAnimation.prototype = Object.create(MyAnimation.prototype);
MyBezierAnimation.prototype.constructor = MyBezierAnimation;

MyBezierAnimation.prototype.getMatrixTime = function(delta){
	let infoAnim = this.updatePos(delta);

	let end = infoAnim[0];
	let bezierTransforms = this.getMatrix(infoAnim[1], infoAnim[2], infoAnim[3]);

	return [end,bezierTransforms];
}

MyBezierAnimation.prototype.updatePos = function(delta) {
	let end = false;
	let t = delta/this.totalTime;

	if(t >= 1){
		end = true;
		t = 1;
	}

	let newPos = [];
	for(i = 0; i < 3; i++){
		newPos[i] = Math.pow(1-t,3)*this.controlPoints[0][i] + 3*t*Math.pow(1-t,2)*this.controlPoints[1][i] + 3*Math.pow(t,2)*(1-t)*this.controlPoints[2][i] + Math.pow(t,3)*this.controlPoints[3][i];
	}

	let point = vec3.fromValues(newPos[0],newPos[1],newPos[2]);

	let dCurve = this.derivateCurve(t);
	
	let angXZ = Math.atan(dCurve[0]/dCurve[2])+(dCurve[2] < 0 ? Math.PI : 0);
	let angY = -Math.atan(dCurve[1]/vec3.length(dCurve));

	return [end, point, angXZ, angY];
}

MyBezierAnimation.prototype.getMatrix = function(point, angXZ, angY) {
	let bezierTransforms = mat4.create();

	mat4.identity(bezierTransforms);
	mat4.translate(bezierTransforms, bezierTransforms, point);
	mat4.rotateY(bezierTransforms, bezierTransforms, angXZ);
	mat4.rotateX(bezierTransforms, bezierTransforms, angY);

	return bezierTransforms;
}

MyBezierAnimation.prototype.derivateCurve = function(t){
	let dCurve = [];

	for(let i = 0; i < 3; i++) {
		dCurve[i] = -3*Math.pow(1-t,2)*this.controlPoints[0][i] +
		(3*Math.pow(1-t,2)-6*t*(1-t))*this.controlPoints[1][i] +
		(6*t*(1-t)-3*Math.pow(t,2))*this.controlPoints[2][i] +
		3*Math.pow(t,2)*this.controlPoints[3][i];
	}
	

	return dCurve;
}

MyBezierAnimation.prototype.meanPoint = function(point1, point2){
	return [(point2[0]+point1[0])/2.0, (point2[1]+point1[1])/2.0, (point2[2]+point1[2])/2.0];
}

MyBezierAnimation.prototype.distanceBetweenPoints = function(point1, point2){
	let vec1 = vec3.fromValues(point2[0]-point1[0], point2[1]-point1[1], point2[2]-point1[2]);
	return vec3.length(vec1);
}

MyBezierAnimation.prototype.curveDistanceRecursive = function(points, depth) {
	depth--;
	let left = [];
	let right = [];
	
	//console.log(points.length);
	while(points.length > 1){
		left.push(points[0]);
		right.unshift(points[points.length-1]);
		
		let pointsAux = [];
		for(let i = 0; i < points.length-1; i++)
			pointsAux.push(this.meanPoint(points[i],points[i+1]));
		
		points = pointsAux;
	}
	
	points = left.concat(points);
	points = points.concat(right);
	
	if(depth)
		return this.curveDistanceRecursive(points,depth);
	else {
		let distance = 0;
		
		for(let i = 0; i < points.length-1; i++){
			distance += this.distanceBetweenPoints(points[i],points[i+1]);
		}
		
		return distance;
	}
}

MyBezierAnimation.prototype.update = function(currTime) {
	MyAnimation.prototype.update.call(this, currTime);
}
