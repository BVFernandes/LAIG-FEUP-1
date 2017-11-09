/**
* MyComboAnimation
* @constructor
**/

function MyComboAnimation(id) {
  this.id = id;
  this.animations=[];
  this.currAnimation = 0;

}

MyComboAnimation.prototype = Object.create(CGFobject.prototype);
MyComboAnimation.prototype.constructor = MyComboAnimation;

/**
* Adds the reference (ID) of another node to this node's children array.
*/
MyComboAnimation.prototype.addAnimation = function(animation) {
  this.animations.push(animation);
}

MyComboAnimation.prototype.updateAnimation = function(animation) {
  this.animations[this.currAnimation].update();

  if(this.animations[this.currAnimation].end()){
    if(this.currAnimation >= this.animations.length)
      this.currAnimation=0;
    else
      this.currAnimation++;

  }

}

MyComboAnimation.prototype.getMatrix = function() {

  this.circularTransforms = mat4.create();
  mat4.identity(this.circularTransforms);

  return this.circularTransforms;
}

MyComboAnimation.prototype.update = function(currTime) {
  MyAnimation.call(this,currTime);
	// console.log("update combo");
}
