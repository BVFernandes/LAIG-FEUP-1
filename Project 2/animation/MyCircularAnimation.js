/**
* MyCircularAnimation
* @constructor
**/

function MyCircularAnimation(graph, id, velocity, centerx, centery centerz, radius, startang, rotang) {
  MyAnimation.call(this,id,velocity);

  this.centerx=centerx;
  this.centery=centery;
  this.centerz=centerz;
  this.radius=radius;
  this.startang=startang;
  this.rotang=rotang;
  ​
  this.angVelocity = this.velocity/this.radius;
  this.deltaAng=0;

}

MyCircularAnimation.prototype.constructor = MyCircularAnimation;

MyCircularAnimation.prototype.getMatrix = function() {

  this.circularTransforms = mat4.create();
  mat4.identity(this.circularTransforms);
  mat4.translate(this.circularTransforms, this.circularTransforms, [centerx, centery, centerz]);
  mat4.rotateY(this.circularTransforms, this.circularTransforms, DEGREE_TO_RAD * this.deltaAng);
  mat4.translate(this.circularTransforms, this.circularTransforms, [this.radius, 0, 0]);
  mat4.rotateY(this.circularTransforms, this.circularTransforms, DEGREE_TO_RAD * 90);

  return mat4;
}

MyLinearAnimation.prototype.updatePos = function(dt) {
  this.deltaAng = this.startang+this.angVelocity*dt;
}
