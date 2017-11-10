/**
 * MyAnimation
 * @constructor
 **/

function MyAnimation(id, velocity) {
  if (this.constructor === MyAnimation) {
       throw new Error("Can't instantiate abstract class!");
     }
	 this.end = false;
	 this.loop = true;
     this.id=id;
     this.velocity = velocity;
     this.delta = 0;
	 this.initTime = null;
}

MyAnimation.prototype.constructor = MyAnimation;

/**
 * Adds the reference (ID) of another node to this node's children array.
 */
MyAnimation.prototype.update = function(currTime) {
	if(!this.initTime)
		this.initTime = currTime;
	
	if(this.end){
		if(this.loop){
			this.end = false;
			this.initTime = currTime;
		}
		else
			return;
	}
	
	this.delta = (currTime - this.initTime)/1000;
}

MyAnimation.prototype.end = function() {
	return this.end;
}