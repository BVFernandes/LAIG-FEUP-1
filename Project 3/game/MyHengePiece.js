/**
 * MyHengePiece
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyHengePiece(scene) {
	CGFobject.call(this,scene);

	this.sphere = new MySphere(this.scene, 1.2,20,20);
	this.cylinder = new MyCylinder(this.scene, 0.8,1.2,1.2,20,20,1,1);

	this.whiteMaterial = new CGFappearance(this.scene);
	this.whiteMaterial.setAmbient(0.3,0.3,0.3,1);
	this.whiteMaterial.setDiffuse(0.5,0.5,0.5,1);
	this.whiteMaterial.setSpecular(0.5,0.5,0.5,0.5);
	this.whiteMaterial.setShininess(255);

	this.blackMaterial = new CGFappearance(this.scene);
	this.blackMaterial.setAmbient(0,0,0,1);
	this.blackMaterial.setDiffuse(0,0,0,1);
	this.blackMaterial.setSpecular(1,1,1,1);
	this.blackMaterial.setShininess(255);
}

MyHengePiece.prototype = Object.create(CGFobject.prototype);
MyHengePiece.prototype.constructor = MyHengePiece;

/**
 * Displays henge piece
 */
MyHengePiece.prototype.display = function() {

	this.scene.pushMatrix();
	this.scene.rotate(-90*DEGREE_TO_RAD, 1, 0, 0);
	this.whiteMaterial.apply();
	this.cylinder.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0,0.8,0);
	this.scene.scale(1, 0.3, 1);
	this.whiteMaterial.apply();
	this.sphere.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0,1.1,0);
	this.scene.scale(0.5, 0.05, 0.5);
	this.blackMaterial.apply();
	this.sphere.display();
	this.scene.popMatrix();
}
