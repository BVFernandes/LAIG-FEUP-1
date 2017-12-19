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
	this.loop = false;

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

	if(!this.initTime){
		this.initTime = currTime;
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

/**
 * Return true if a animation was ended, false otherwise
 */
MyAnimation.prototype.end = function() {
	return this.end;
}

/**
 * Reset the Inital time of animation to allows loop animation
 */
MyAnimation.prototype.resetInitTime = function() {
	this.initTime = this.lastCurrTime;
}

/**
 * Stop the animation
 */
MyAnimation.prototype.stopAnimation = function() {
	this.stop = true;
}

/**
 * Resume the animation, so after stop the animation restarts at the last position
 */
MyAnimation.prototype.resumeAnimation = function() {
	this.initTime = this.lastCurrTime-(this.delta*1000);
	this.stop = false;
}