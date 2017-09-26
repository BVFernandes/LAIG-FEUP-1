/**
 * MyTrap
 * @constructor
 */
function MyTrap(scene, base) {
	CGFobject.call(this,scene);

	this.base = base;
	this.middle = this.base/2;
	this.diff = 0.5-this.middle;
	this.h = Math.sqrt(this.diff*this.diff+1);
	this.cube = new MyUnitCubeQuad(this.scene);
	this.triR = new MyTriangle(this.scene,0,false);
	this.triL = new MyTriangle(this.scene,1,false);
	this.quad = new MyQuad(this.scene);

};

MyTrap.prototype = Object.create(CGFobject.prototype);
MyTrap.prototype.constructor = MyTrap;

MyTrap.prototype.display = function() {

	//Main Cube
	this.scene.pushMatrix();
	this.scene.scale(this.base,1,1);
	this.cube.display();
	this.scene.popMatrix();

	//Left Triangle
	//Front
	this.scene.pushMatrix();
	this.scene.translate(-this.middle,-0.5,0.5);
	this.scene.scale(this.diff,1,1);
	this.triL.display();
	this.scene.popMatrix();

	//Back
	this.scene.pushMatrix();
	this.scene.translate(-this.middle,-0.5,-0.5);
	this.scene.rotate(180*degToRad,0,1,0);
	this.scene.scale(this.diff,1,1);
	this.triR.display();
	this.scene.popMatrix();

	//Bottom Quad
	this.scene.pushMatrix();
	this.scene.translate(-this.middle-this.diff/2,-0.5,0);
	this.scene.rotate(90*degToRad,1,0,0);
	this.scene.scale(this.diff,1,1);
	this.quad.display();
	this.scene.popMatrix();

	//Other Quad
	this.scene.pushMatrix();
	this.scene.translate(-this.middle-this.diff/2,0,0);
	this.scene.rotate(Math.asin(1/this.h)+180*degToRad, 0,0,1);
	this.scene.rotate(90*degToRad,1,0,0);
	this.scene.scale(this.h,1,1);
	this.quad.display();
	this.scene.popMatrix();

	//Right Triangle
	//Front
	this.scene.pushMatrix();
	this.scene.translate(this.middle,-0.5,0.5);
	this.scene.scale(this.diff,1,1);
	this.triR.display();
	this.scene.popMatrix();

	//Back
	this.scene.pushMatrix();
	this.scene.translate(this.middle,-0.5,-0.5);
	this.scene.rotate(180*degToRad,0,1,0);
	this.scene.scale(this.diff,1,1);
	this.triL.display();
	this.scene.popMatrix();

	//Bottom Quad
	this.scene.pushMatrix();
	this.scene.translate(this.middle+this.diff/2,-0.5,0);
	this.scene.rotate(90*degToRad,1,0,0);
	this.scene.scale(this.diff,1,1);
	this.quad.display();
	this.scene.popMatrix();

	//Other Quad
	this.scene.pushMatrix();
	this.scene.translate(this.middle+this.diff/2,0,0);
	this.scene.rotate(-Math.asin(1/this.h)-180*degToRad, 0,0,1);
	this.scene.rotate(90*degToRad,1,0,0);
	this.scene.scale(this.h,1,1);
	this.quad.display();
	this.scene.popMatrix();	
};