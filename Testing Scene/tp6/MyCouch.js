/**
 * MyCouch
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyCouch(scene) {
	CGFobject.call(this,scene);
	this.cube = new MyUnitCubeQuad(this.scene);
	this.cube.initBuffers();
};

MyCouch.prototype = Object.create(CGFobject.prototype);
MyCouch.prototype.constructor = MyCouch;

MyCouch.prototype.display  = function () {

  //top
	this.scene.pushMatrix();
	this.scene.scale(3, 1, 5);
	this.scene.couchAppearance.apply();
	this.cube.display();
	this.scene.popMatrix();

	//Back
	this.scene.pushMatrix();
	this.scene.translate(1,1,0);
	this.scene.scale(1, 2.5, 5);
	this.scene.couch_head.apply();
	this.cube.display();
	this.scene.popMatrix();

  //left
  this.scene.pushMatrix();
  this.scene.translate(0,1,2);
  this.scene.scale(3, 1.5, 1);
  this.scene.couchAppearance.apply();
  this.cube.display();
  this.scene.popMatrix();

  //right
  this.scene.pushMatrix();
  this.scene.translate(0,1,-2);
  this.scene.scale(3, 1.5, 1);
  this.scene.couchAppearance.apply();
  this.cube.display();
  this.scene.popMatrix();




};
