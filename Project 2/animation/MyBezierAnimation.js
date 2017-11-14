/**
 * MyBezierAnimation
 * @constructor
 **/
function MyBezierAnimation(id, velocity, controlPoints) {
	MyAnimation.call(this,id,velocity);

	this.controlPoints = controlPoints;

	this.curveDist = this.curveDistance();
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
		dCurve[i] = 3*Math.pow(1-t,2)*this.controlPoints[0][i] +
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

MyBezierAnimation.prototype.curveDistance = function() {
	let p12 = this.meanPoint(this.controlPoints[0],this.controlPoints[1]);
	let p23 = this.meanPoint(this.controlPoints[1],this.controlPoints[2]);
	let p34 = this.meanPoint(this.controlPoints[2],this.controlPoints[3]);
	let p123 = this.meanPoint(p12,p23);
	let p234 = this.meanPoint(p23,p34);
	let p1234 = this.meanPoint(p123,p234);

	let distance = this.distanceBetweenPoints(this.controlPoints[0],p12) +
	this.distanceBetweenPoints(p12,p123) +
	this.distanceBetweenPoints(p123,p1234) +
	this.distanceBetweenPoints(p1234,p234)+
	this.distanceBetweenPoints(p234, p34)+
	this.distanceBetweenPoints(p34, this.controlPoints[3]);

	return distance;
}

MyBezierAnimation.prototype.update = function(currTime) {
	MyAnimation.prototype.update.call(this, currTime);
}
