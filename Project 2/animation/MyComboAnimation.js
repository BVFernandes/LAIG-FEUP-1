/**
 * MyComboAnimation
 * @constructor
 **/
function MyComboAnimation(id) {
	MyAnimation.call(this,id,null);

	this.animations=[];
	this.currAnimation = 0;

	this.currAnimationMatrix = mat4.create();
	mat4.identity(this.currAnimationMatrix);
}

MyComboAnimation.prototype = Object.create(MyAnimation.prototype);
MyComboAnimation.prototype.constructor = MyComboAnimation;

/**
 * Adds the reference (ID) of another node to this node's children array.
 */
MyComboAnimation.prototype.addAnimation = function(animation) {
	this.animations.push(animation);
}

MyComboAnimation.prototype.setLoopAnimation = function(loop) {
	this.loop = loop;
}

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

MyComboAnimation.prototype.getMatrix = function() {
	return this.currAnimationMatrix;
}

MyComboAnimation.prototype.update = function(currTime) {
	MyAnimation.prototype.update.call(this,currTime);
	this.updateAnimation();
}
