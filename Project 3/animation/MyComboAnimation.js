/**
 * MyComboAnimation
 * @constructor
 **/
function MyComboAnimation(id, loop) {
	MyAnimation.call(this,id,null,loop);

	this.animations=[];
	this.currAnimation = 0;

	this.currAnimationMatrix = mat4.create();
	mat4.identity(this.currAnimationMatrix);
}

MyComboAnimation.prototype = Object.create(MyAnimation.prototype);
MyComboAnimation.prototype.constructor = MyComboAnimation;

/**
 * Adds the reference (ID) of animation to animation's IDs array.
 */
MyComboAnimation.prototype.addAnimation = function(animation) {
	this.animations.push(animation);
}

/**
 * Set flag loop animation and restart animation to index 0
 */
MyComboAnimation.prototype.setLoopAnimation = function(loop) {
	if(this.end && loop)
		this.currAnimation=0;

	this.loop = loop;
}

/**
 * Set stop/resume animation
 */
MyComboAnimation.prototype.updateAnimationStop = function(stop) {
	if(stop)
		MyAnimation.prototype.stopAnimation.call(this);
	else
		MyAnimation.prototype.resumeAnimation.call(this);
}

/**
 * Function that manage and update animations
 */
MyComboAnimation.prototype.updateAnimation = function() {
	let infoAnim = this.animations[this.currAnimation].getMatrixTime(this.delta);

	let end = infoAnim[0];
	this.currAnimationMatrix = infoAnim[1];

	if(end) {
		if(this.currAnimation >= this.animations.length-1){
			this.end = true;
			if(this.loop)
				this.currAnimation=0;
		}
		else {
			this.currAnimation++;
			MyAnimation.prototype.resetInitTime.call(this);
		}
	}
}

/**
 * Get transformation matrix of actual animation
 */
MyComboAnimation.prototype.getMatrix = function() {
	return this.currAnimationMatrix;
}

/**
 * Function to handle the update of animations time
 */
MyComboAnimation.prototype.update = function(currTime) {
	MyAnimation.prototype.update.call(this,currTime);
	this.updateAnimation();
}
