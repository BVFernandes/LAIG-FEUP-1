/**
 * MyCircularAnimation
 * @constructor
 **/
function MyCircularAnimation(id, velocity, center, radius, startang, rotang) {
	MyAnimation.call(this,id,velocity);

	this.centerx = center['x'];
	this.centery = center['y'];
	this.centerz = center['z'];

	this.radius = radius;

	this.startAng = startang*DEGREE_TO_RAD;
	this.endAng = this.startAng+(rotang*DEGREE_TO_RAD);

	if(this.endAng >= this.startAng)
		this.direction = 1;
	else
		this.direction = -1;

	this.angVelocity = this.velocity/this.radius*this.direction;

	this.deltaAng = this.startAng;
}

MyCircularAnimation.prototype = Object.create(MyAnimation.prototype);
MyCircularAnimation.prototype.constructor = MyCircularAnimation;

MyCircularAnimation.prototype.getMatrixTime = function(delta){
	let infoAnim = this.updatePos(delta);
	let end = infoAnim[0];
	let deltaAng = infoAnim[1];

	let circularTransforms = this.getMatrix(deltaAng);

	return [end,circularTransforms];
}

MyCircularAnimation.prototype.updatePos = function(delta) {
	let end = false;
	let deltaAng = this.startAng + this.angVelocity*delta;

	if(this.direction == 1){
		if(deltaAng >= this.endAng){
			end = true;
			deltaAng = this.endAng;
		}
	}
	else{
		if(deltaAng <= this.endAng){
			end = true;
			this.deltaAng = this.endAng;
		}
	}

	return [end,deltaAng];
}

MyCircularAnimation.prototype.getMatrix = function(deltaAng) {
	let circularTransforms = mat4.create();

	mat4.identity(circularTransforms);
	mat4.translate(circularTransforms, circularTransforms, vec3.fromValues(this.centerx, this.centery, this.centerz) );
	mat4.rotateY(circularTransforms, circularTransforms, deltaAng);
	mat4.translate(circularTransforms, circularTransforms, vec3.fromValues(this.radius, 0, 0) );
	mat4.rotateY(circularTransforms, circularTransforms, DEGREE_TO_RAD * (90 + 90 * this.direction));

	return circularTransforms;
}

MyCircularAnimation.prototype.update = function(currTime) {
	MyAnimation.prototype.update.call(this, currTime);
}
