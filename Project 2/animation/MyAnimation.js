/**
 * MyAnimation
 * @constructor
 **/
function MyAnimation(id, velocity) {
	if (this.constructor === MyAnimation) {
		throw new Error("Can't instantiate abstract class!");
	}

	this.end = false;
	this.stop = false;
	//this.resume = false;
	this.loop = true;
	this.resetInit = false;

	this.id=id;
	this.velocity = velocity;

	this.initTime = null;
	this.lastCurrTime = null;
	this.delta = 0;
}

MyAnimation.prototype.constructor = MyAnimation;

/**
 * Update the time in each interruption
 */
MyAnimation.prototype.update = function(currTime) {
	this.lastCurrTime = currTime;
	
	if(!this.initTime || this.resetInit){
		this.initTime = currTime;
		this.resetInit = false;
	}

	if(this.end){
		if(this.loop){
			this.initTime = currTime;
			this.delta = 0;
			this.end = false;
		}
		else
			return;
	}
	
	if(this.stop)
		return;

	this.delta = (currTime - this.initTime)/1000;
}

MyAnimation.prototype.end = function() {
	return this.end;
}

MyAnimation.prototype.resetInitTime = function() {
	this.resetInit = true;
}

MyAnimation.prototype.stopAnimation = function() {
	this.stop = true;
}

MyAnimation.prototype.resumeAnimation = function() {
	this.initTime = this.lastCurrTime-(this.delta*1000);
	this.stop = false;
}
