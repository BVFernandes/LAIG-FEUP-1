/**
 * MyAnimation
 * @constructor
 **/

function MyAnimation(id, velocity) {
  if (this.constructor === MyAnimation) {
       throw new Error("Can't instantiate abstract class!");
     }
     this.id=id;
     this.velocity = velocity;
     this.delta = 0;
     this.lastCurrTime=0;
}

MyAnimation.prototype.constructor = MyAnimation;

/**
 * Adds the reference (ID) of another node to this node's children array.
 */
MyAnimation.prototype.update = function(currTime) {
  this.delta = currTime - this.lastCurrTime;
	this.lastCurrTime = currTime;
	// console.log("update");
}
