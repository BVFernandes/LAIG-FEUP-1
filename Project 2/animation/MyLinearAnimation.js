/**
 * MyLinearAnimation
 * @constructor
 **/
function MyLinearAnimation(id, velocity, controlPoints) {
	MyAnimation.call(this, id, velocity);

	this.controlPoints = controlPoints;

	// [ [dx,dy,dz,total,angXZ],....]
	this.pointsInf = [];
	this.totalDistance=0;

	this.fillPointsInf();
}

MyLinearAnimation.prototype = Object.create(MyAnimation.prototype);
MyLinearAnimation.prototype.constructor = MyLinearAnimation;

MyLinearAnimation.prototype.getMatrixTime = function(delta) {

	let infoAnim = this.updatePos(delta);
	let end = infoAnim[0];

	let linearTransforms = this.getMatrix(infoAnim[1],infoAnim[2]);

	return [end,linearTransforms];
}

MyLinearAnimation.prototype.updatePos = function(delta) {
	let end  = false;
	let currDist = this.velocity*delta;

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

	let currDX = currPhaseInf[0]+mod*this.pointsInf[currPhaseIndex][0];
	let currDY = currPhaseInf[1]+mod*this.pointsInf[currPhaseIndex][1];
	let currDZ = currPhaseInf[2]+mod*this.pointsInf[currPhaseIndex][2];

	let point = vec3.fromValues(currDX, currDY, currDZ);
	let angleY = this.pointsInf[currPhaseIndex][4];

	return [end, point, angleY];
}

MyLinearAnimation.prototype.getMatrix = function(point, angleY) {
	let linearTransforms = mat4.create();

	mat4.identity(linearTransforms);
	mat4.translate(linearTransforms, linearTransforms, point);
	mat4.rotateY(linearTransforms, linearTransforms, angleY);

	return linearTransforms;
}

MyLinearAnimation.prototype.fillPointsInf = function() {
	for(let i = 0; i < this.controlPoints.length-1; i++){
		let ptr1 = this.controlPoints[i];
		let ptr2 = this.controlPoints[i+1];
		let dx = ptr2[0]-ptr1[0];
		let dy = ptr2[1]-ptr1[1];
		let dz = ptr2[2]-ptr1[2];
		let angXZ =  Math.atan(dx/dz)+(dz < 0 ? Math.PI : 0);
		let distance = this.calculateDistanceBetweenPoints(ptr1,ptr2);
		this.pointsInf.push(new Array(dx, dy, dz, distance,angXZ));
		this.totalDistance += distance;
	}
}

MyLinearAnimation.prototype.calculateDistanceBetweenPoints = function(point1, point2) {
	let vec1 = vec3.fromValues(point2[0]-point1[0], point2[1]-point1[1], point2[2]-point1[2]);
	return vec3.length(vec1);
}

MyLinearAnimation.prototype.update = function(currTime) {
	MyAnimation.prototype.update.call(this, currTime);
}
