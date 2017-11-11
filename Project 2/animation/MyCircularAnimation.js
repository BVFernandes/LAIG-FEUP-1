/**
* MyCircularAnimation
* @constructor
**/

function MyCircularAnimation(id, velocity, center, radius, startang, rotang) {
  MyAnimation.call(this,id,velocity);

  this.centerx=center['x'];
  this.centery=center['y'];
  this.centerz=center['z'];
  

  this.radius= radius;
  this.startAng= startang*DEGREE_TO_RAD;
  //this.rotang= rotang;
  this.endAng = this.startAng+(rotang*DEGREE_TO_RAD);
  
  if(this.endAng >= this.startAng)
	  this.direction = 1;
  else
	  this.direction = -1;

  this.angVelocity = this.velocity/this.radius*this.direction;
  
  this.deltaAng= this.startAng;
}

MyCircularAnimation.prototype = Object.create(MyAnimation.prototype);
MyCircularAnimation.prototype.constructor = MyCircularAnimation;

MyCircularAnimation.prototype.getMatrix = function() {

  this.circularTransforms = mat4.create();
  mat4.identity(this.circularTransforms);
  mat4.translate(this.circularTransforms, this.circularTransforms, vec3.fromValues(this.centerx, this.centery, this.centerz) );
  mat4.rotateY(this.circularTransforms, this.circularTransforms, this.deltaAng);
  mat4.translate(this.circularTransforms, this.circularTransforms, vec3.fromValues(this.radius, 0, 0) );
  mat4.rotateY(this.circularTransforms, this.circularTransforms, DEGREE_TO_RAD * 90);

  return this.circularTransforms;
}

MyCircularAnimation.prototype.updatePos = function() {
  this.deltaAng = this.startAng + this.angVelocity*this.delta;

  if(this.direction == 1){
	if(this.deltaAng >= this.endAng){
	  this.end = true;
	  this.deltaAng = this.endAng;
	}
  }
  else{
	if(this.deltaAng <= this.endAng){
	  this.end = true;
	  this.deltaAng = this.endAng;
	}
  }
}

MyCircularAnimation.prototype.update = function(currTime) {
  MyAnimation.prototype.update.call(this, currTime);
  this.updatePos();
}
