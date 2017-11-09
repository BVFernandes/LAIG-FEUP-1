/**
* MyLinearAnimation
* @constructor
**/
function MyLinearAnimation(id, velocity, controlPoints) {
  MyAnimation.call(this, id, velocity);
  this.controlPoints = controlPoints;

  // [ [dx,dy,dz,total],....]
  // this.pointsInf = [];
  // this.totalDistance=0;
  //
  // //this.fillPointsInf();
  //
  // this.currDX = 0;
  // this.currDY = 0;
  // this.currDZ = 0;
  // this.currPhaseIndex = 0;
  // this.currPhaseInf = [0,0,0,0];
}

MyLinearAnimation.prototype.constructor = MyLinearAnimation;

MyLinearAnimation.prototype.fillPointsInf = function() {
  for(var i = 0; i < controlPoints.length-1; i++){
    var ptr1 = controlPoints[i];
    var ptr2 = controlPoints[i+1];
    this.pointsInf.push(new Array(ptr2[0]-ptr1[0], ptr2[1]-ptr1[1], ptr2[2]-ptr1[2], this.calculateDistanceBetweenPoints(ptr1,ptr2)));
  }
}

MyLinearAnimation.prototype.getMatrix = function() {
  let linearTransforms = mat4.create();
  mat4.identity(linearTransforms);
  mat4.translate(linearTransforms, linearTransforms, vec3.fromValues(5,5,5));
  // console.log(linearTransforms);
  // console.log("Aqui");
  return linearTransforms;
}


MyLinearAnimation.prototype.updatePos = function(dt) {
  var currDist = this.velocity*dt;

  for(var i = this.currPhaseIndex; i < this.pointsInf.length; i++){
    if((this.currPhaseInf[3]+this.pointsInf[i][3]) > currDist){
      break;
    }
    else {
      this.currPhaseInf[0] += this.pointsInf[i][0];
      this.currPhaseInf[1] += this.pointsInf[i][1];
      this.currPhaseInf[2] += this.pointsInf[i][2];
      this.currPhaseInf[3] += this.pointsInf[i][3];
      this.currPhaseIndex++;
    }
  }

  if(currDist > this.totalDistance){
    this.end = true;
    currDist = this.totalDistance;
  }

  var deltaDist = currDist-this.currPhaseInf[3];

  var mod = deltaDist / this.pointsInf[this.pointsInfIndex];

  this.currDX = this.currPhaseInf[0]+mod*this.pointsInf[this.pointsInfIndex][0];
  this.currDY = this.currPhaseInf[1]+mod*this.pointsInf[this.pointsInfIndex][1];
  this.currDZ = this.currPhaseInf[2]+mod*this.pointsInf[this.pointsInfIndex][2];
}

MyLinearAnimation.prototype.addControlPoint = function() {

}

MyLinearAnimation.prototype.calculateDistanceBetweenPoints = function() {

}

MyLinearAnimation.prototype.addChild = function(nodeID) {
  this.children.push(nodeID);
}

MyLinearAnimation.prototype.update = function(currTime) {
  MyAnimation.prototype.update.call(this, currTime);
  // console.log("update linear");
}
