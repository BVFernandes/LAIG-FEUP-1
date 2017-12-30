/**
 * MyStartMovie
 * @constructor
 */
function MyStartMovie(scene){
	CGFobject.call(this,scene);

	this.cube = new MyCube(scene);
	this.triangle = new MyTriangle(scene, true, [1, 0, 2],[2,0,0],[0, 0, 0]);

	this.blackMaterial = new CGFappearance(this.scene); //Floor
	this.blackMaterial.setAmbient(0,0,0,1);
	this.blackMaterial.setDiffuse(0,0,0,1);
	this.blackMaterial.setSpecular(0,0,0,0.5);
	this.blackMaterial.setShininess(1);

	this.greenMaterial = new CGFappearance(this.scene); //Floor
	this.greenMaterial.setAmbient(0,1,0,1);
	this.greenMaterial.setDiffuse(0,1,0,1);
	this.greenMaterial.setSpecular(0,1,0,1);
	this.greenMaterial.setShininess(50);

}

MyStartMovie.prototype = Object.create(CGFobject.prototype);
MyStartMovie.prototype.constructor=MyStartMovie;

MyStartMovie.prototype.display = function () {

	this.scene.pushMatrix();
	this.scene.translate(0,15,0);
	this.blackMaterial.apply();

	this.scene.pushMatrix();
	this.scene.rotate(10 * DEGREE_TO_RAD, 1, 0, 0);
	this.scene.translate(0,4,-0.5);
	this.scene.scale(2,2,10);
	this.cube.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.scale(2,5,10);
	this.cube.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(1.2,-1.5,1);
	this.scene.rotate(Math.PI, 0,1,0);
	this.scene.rotate(Math.PI/2, 0,0,1);
	this.scene.scale(1.5,1.5,1.5);
	this.greenMaterial.apply();
	this.triangle.display();
	this.scene.popMatrix();

	this.scene.popMatrix();
}
