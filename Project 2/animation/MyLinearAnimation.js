/**
* MyLinearAnimation
* @constructor
**/
function MyLinearAnimation(id, velocity, controlPoints) {
  MyAnimation.call(this, id, velocity);
  this.end = false;
  this.controlPoints = controlPoints;

  // [ [dx,dy,dz,total,angXZ],....]
  this.pointsInf = [];
  this.totalDistance=0;
 
  for(let i = 0; i < controlPoints.length-1; i++){
    let ptr1 = controlPoints[i];
    let ptr2 = controlPoints[i+1];
	let dx = ptr2[0]-ptr1[0];
	let dy = ptr2[1]-ptr1[1];
	let dz = ptr2[2]-ptr1[2];
	let angXZ =  Math.atan(dx/dz)+(dz < 0 ? Math.PI : 0);
	let distance = this.calculateDistanceBetweenPoints(ptr1,ptr2);
    this.pointsInf.push(new Array(dx, dy, dz, distance,angXZ));
	this.totalDistance += distance;
  }
 
  this.currDX = 0;
  this.currDY = 0;
  this.currDZ = 0;
  this.currPhaseIndex = 0;
  this.currPhaseInf = [this.controlPoints[0][0],this.controlPoints[0][1],this.controlPoints[0][2],0];
  
  this.flagForReset = false;
}

MyLinearAnimation.prototype = Object.create(MyAnimation.prototype);
MyLinearAnimation.prototype.constructor = MyLinearAnimation;

MyLinearAnimation.prototype.fillPointsInf = function() {
  for(let i = 0; i < controlPoints.length-1; i++){
    let ptr1 = controlPoints[i];
    let ptr2 = controlPoints[i+1];
	let distance = this.calculateDistanceBetweenPoints(ptr1,ptr2);
    this.pointsInf.push(new Array(ptr2[0]-ptr1[0], ptr2[1]-ptr1[1], ptr2[2]-ptr1[2], distance));
  }
}

MyLinearAnimation.prototype.calculateDistanceBetweenPoints = function(point1, point2) {
	let vec1 = vec3.fromValues(point2[0]-point1[0], point2[1]-point1[1], point2[2]-point1[2]);
	return vec3.length(vec1);
}

MyLinearAnimation.prototype.getMatrix = function() {
  let linearTransforms = mat4.create();
  mat4.identity(linearTransforms);
  mat4.translate(linearTransforms, linearTransforms, vec3.fromValues(this.currDX, this.currDY, this.currDZ));
  mat4.rotateY(linearTransforms, linearTransforms, this.pointsInf[this.currPhaseIndex][4]);
  return linearTransforms;
}

MyLinearAnimation.prototype.updatePos = function() {
  if(this.end)
	return;

  if(this.flagForReset){
	  this.resetValues();
	  this.flagForReset = true;
  }

  let currDist = this.velocity*this.delta;
  

  for(let i = this.currPhaseIndex; i < this.pointsInf.length-1; i++){
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
	if(this.loop)
		this.flagForReset = true;
  }

  let deltaDist = currDist-this.currPhaseInf[3];

  let mod = deltaDist / this.pointsInf[this.currPhaseIndex][3];
  
  this.currDX = this.currPhaseInf[0]+mod*this.pointsInf[this.currPhaseIndex][0];
  this.currDY = this.currPhaseInf[1]+mod*this.pointsInf[this.currPhaseIndex][1];
  this.currDZ = this.currPhaseInf[2]+mod*this.pointsInf[this.currPhaseIndex][2];  
  
}

MyLinearAnimation.prototype.getMatrixTime = function(delta) {
  
  let end  = false;
  let currDist = this.velocity*delta;
  
  let currDX = 0;
  let currDY = 0;
  let currDZ = 0;
  let currPhaseIndex = 0;
  let currPhaseInf = [this.controlPoints[0][0],this.controlPoints[0][1],this.controlPoints[0][2],0];
  

  for(let i = 0; i < this.pointsInf.length-1; i++){
    if((currPhaseInf[3]+this.pointsInf[i][3]) > currDist){
      break;
    }
    else {
      currPhaseInf[0] += this.pointsInf[i][0];
      currPhaseInf[1] += this.pointsInf[i][1];
      currPhaseInf[2] += this.pointsInf[i][2];
      currPhaseInf[3] += this.pointsInf[i][3];
      currPhaseIndex++;
    }
  }
  
  if(currDist > this.totalDistance){
    end = true;
    currDist = this.totalDistance;
  }

  let deltaDist = currDist-currPhaseInf[3];

  let mod = deltaDist / this.pointsInf[currPhaseIndex][3];
  
  currDX = currPhaseInf[0]+mod*this.pointsInf[currPhaseIndex][0];
  currDY = currPhaseInf[1]+mod*this.pointsInf[currPhaseIndex][1];
  currDZ = currPhaseInf[2]+mod*this.pointsInf[currPhaseIndex][2];
  
  let linearTransforms = mat4.create();
  mat4.identity(linearTransforms);
  mat4.translate(linearTransforms, linearTransforms, vec3.fromValues(currDX, currDY, currDZ));
  mat4.rotateY(linearTransforms, linearTransforms, this.pointsInf[currPhaseIndex][4]);
  
  return [end,linearTransforms];
}

MyLinearAnimation.prototype.update = function(currTime) {
  MyAnimation.prototype.update.call(this, currTime);
  this.updatePos();
  
}


MyLinearAnimation.prototype.resetValues = function() {
	this.currDX = 0;
	this.currDY = 0;
    this.currDZ = 0;
	this.currPhaseIndex = 0;
	this.currPhaseInf = [this.controlPoints[0][0],this.controlPoints[0][1],this.controlPoints[0][2],0];
}
