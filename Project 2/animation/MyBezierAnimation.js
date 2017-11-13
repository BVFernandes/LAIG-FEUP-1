/**
* MyBezierAnimation
* @constructor
**/

function MyBezierAnimation(id, velocity, controlPoints) {
  MyAnimation.call(this,id,velocity);

  this.controlPoints = controlPoints;
  console.log(this.controlPoints);
  this.deltaAng = 0;
  this.curveDist = this.curveDistance();
  this.totalTime = this.curveDist/this.velocity;
  
  console.log(this.totalTime);
  
  this.posX = controlPoints[0][0];
  this.posY = controlPoints[0][1];
  this.posZ = controlPoints[0][2];
  
  this.t=0;
}

MyBezierAnimation.prototype = Object.create(MyAnimation.prototype);
MyBezierAnimation.prototype.constructor = MyBezierAnimation;

/**
* Adds the reference (ID) of another node to this node's children array.
*/

MyBezierAnimation.prototype.derivateCurve = function(){

  return 3*Math.pow(1-this.t,2)*this.controlPoints[0] +
        (3*Math.pow(1-this.t,2)-6*this.t*(1-this.t))*this.controlPoints[2] +
        (6*this.t*(1-this.t)-3*Math.pow(this.t,2))*this.controlPoints[3] +
        3*Math.pow(this.t,2)*this.controlPoints[4];
}


MyBezierAnimation.prototype.meanPoint = function(point1, point2){
  return [(point2[0]+point1[0])/2.0, (point2[1]+point1[1])/2.0, (point2[2]+point1[2])/2.0];
}

MyBezierAnimation.prototype.distanceBetweenPoints = function(point1, point2){
  let vec1 = vec3.fromValues(point2[0], point2[1], point2[2]);
  let vec2 = vec3.fromValues(point1[0], point1[1], point1[2]);
  return vec3.distance(vec1,vec2);
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

MyBezierAnimation.prototype.getMatrix = function() {

  let bezierTransforms = mat4.create();
  mat4.identity(bezierTransforms);
  mat4.translate(bezierTransforms, bezierTransforms, [this.posX, this.posY, this.posZ]);
  mat4.rotateY(bezierTransforms, bezierTransforms, DEGREE_TO_RAD * this.deltaAng);

  return bezierTransforms;
}

MyBezierAnimation.prototype.updatePos = function(dt) {
	
  if(this.end)
	  return;
  
  this.t = this.delta/this.totalTime;

  newPos = [];
  for(i = 0; i < 3; i++){
    newPos[i] = Math.pow(1-this.t,3)*this.controlPoints[0][i] + 3*this.t*Math.pow(1-this.t,2)*this.controlPoints[1][i] + 3*Math.pow(this.t,2)*(1-this.t)*this.controlPoints[2][i] + Math.pow(this.t,3)*this.controlPoints[3][i];
  }

  this.posX = newPos[0];
  this.posY = newPos[1];
  this.posZ = newPos[2];

  /*
  let dist = this.derivateCurve();
  let ang = (dist-this.posY)/Math.abs(dist);
  this.deltaAng = Math.atan(ang);
  */

  //this.angXZ= Math.atan(x/z)+ (z < 0 ? Math.PI : 0);
  //this.angY=  Math.atan(y/Math.sqrt(x*x+y*y+z*z));

  if(this.t >= 1){
    this.end = true;
  }
};

MyBezierAnimation.prototype.update = function(currTime) {
  MyAnimation.prototype.update.call(this, currTime);
  this.updatePos();
	// console.log("update bezier");
}
