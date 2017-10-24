/**
 * MyBezierAnimation
 * @constructor
 **/

function MyBezierAnimation(graph, velocity) {
  if (this.constructor === MyAnimation) {
       throw new Error("Can't instantiate abstract class!");
     }

}

MyBezierAnimation.prototype.constructor = MyBezierAnimation;

/**
 * Adds the reference (ID) of another node to this node's children array.
 */
MyBezierAnimation.prototype.addChild = function(nodeID) {
	this.children.push(nodeID);
}
