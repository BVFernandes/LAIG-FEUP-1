/**
 * MyLinearAnimation
 * @constructor
 **/

function MyLinearAnimation(graph, nodeID) {
      Animation.call(this, id, span);


}

MyLinearAnimation.prototype = Object.create(MyAnimation.prototype);
MyLinearAnimation.prototype.constructor = MyLinearAnimation;

/**
 * Adds the reference (ID) of another node to this node's children array.
 */
MyLinearAnimation.prototype.addChild = function(nodeID) {
	this.children.push(nodeID);
}
