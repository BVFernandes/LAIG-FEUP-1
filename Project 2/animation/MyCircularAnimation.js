/**
* MyCircularAnimation
* @constructor
**/

function MyCircularAnimation(id, velocity, center, radius, startang, rotang) {
  MyAnimation.call(this,id,velocity);

  this.centerx=center['x'];
  this.centery=center['y'];
  this.centerz=center['z'];

  this.radius=radius;
  this.startang=startang;
  this.rotang=rotang;

  this.angVelocity = this.velocity/this.radius;
  this.deltaAng=0;
}

MyCircularAnimation.prototype = Object.create(MyAnimation.prototype);
MyCircularAnimation.prototype.constructor = MyCircularAnimation;

MyCircularAnimation.prototype.getMatrix = function() {

  this.circularTransforms = mat4.create();
  mat4.identity(this.circularTransforms);
  mat4.translate(this.circularTransforms, this.circularTransforms, [this.centerx, this.centery, this.centerz]);
  mat4.rotateY(this.circularTransforms, this.circularTransforms, DEGREE_TO_RAD * this.deltaAng);
  mat4.translate(this.circularTransforms, this.circularTransforms, [this.radius, 0, 0]);
  mat4.rotateY(this.circularTransforms, this.circularTransforms, DEGREE_TO_RAD * 90);

  return   this.circularTransforms;
}

MyCircularAnimation.prototype.updatePos = function(dt) {
  this.deltaAng = this.startang + this.angVelocity*dt;
}

MyCircularAnimation.prototype.update = function(currTime) {
  MyAnimation.prototype.update.call(this, currTime);
	this.updatePos(currTime);
}
