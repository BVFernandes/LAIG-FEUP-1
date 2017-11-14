/**
 * MyAnimation
 * @constructor
 **/
function MyAnimation(id, velocity) {
	if (this.constructor === MyAnimation) {
		throw new Error("Can't instantiate abstract class!");
	}

	this.end = false;
	this.loop = true;
	this.resetInit = false;

	this.id=id;
	this.velocity = velocity;

	this.initTime = null;
	this.delta = 0;
}

MyAnimation.prototype.constructor = MyAnimation;

/**
 * Update the time in each interruption
 */
MyAnimation.prototype.update = function(currTime) {
	if(!this.initTime || this.resetInit){
		this.initTime = currTime;
		this.resetInit = false;
	}

	if(this.end){
		if(this.loop){
			this.end = false;
			this.initTime = currTime;
		}
		else
			return;
	}

	this.delta = (currTime - this.initTime)/1000;
}

MyAnimation.prototype.end = function() {
	return this.end;
}

MyAnimation.prototype.resetInitTime = function() {
	this.resetInit = true;
}
