/**
 * MyCircularAnimation
 * @constructor
 **/

function MyCircularAnimation(graph, velocity) {
  if (this.constructor === MyAnimation) {
       throw new Error("Can't instantiate abstract class!");
     }

}

MyCircularAnimation.prototype.constructor = MyCircularAnimation;

/**
 * Adds the reference (ID) of another node to this node's children array.
 */
MyCircularAnimation.prototype.addChild = function(nodeID) {
	this.children.push(nodeID);
}
