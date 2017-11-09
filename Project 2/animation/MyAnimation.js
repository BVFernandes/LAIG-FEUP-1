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
}

MyAnimation.prototype.constructor = MyAnimation;

/**
 * Adds the reference (ID) of another node to this node's children array.
 */
MyAnimation.prototype.addChild = function(nodeID) {
	this.children.push(nodeID);
}
