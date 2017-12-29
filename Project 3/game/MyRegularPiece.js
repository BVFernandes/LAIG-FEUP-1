/**
 * MyRegularPiece
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyRegularPiece(scene, color) {
	CGFobject.call(this,scene);

	this.material = new CGFappearance(this.scene);

	if(color == "whitePlayer"){
		this.material.setAmbient(0.3,0.3,0.3,1);
		this.material.setDiffuse(0.5,0.5,0.5,1);
		this.material.setSpecular(0.5,0.5,0.5,0.5);
		this.material.setShininess(255);
	}
	else if(color == "blackPlayer"){
		this.material.setAmbient(0,0,0,1);
		this.material.setDiffuse(0,0,0,1);
		this.material.setSpecular(1,1,1,1);
		this.material.setShininess(255);
	}

	this.sphere = new MySphere(this.scene, 1.2,20,20);
	this.cylinder = new MyCylinder(this.scene, 0.8,1.2,1.2,20,20,1,1);
}

MyRegularPiece.prototype = Object.create(CGFobject.prototype);
MyRegularPiece.prototype.constructor =MyRegularPiece;

MyRegularPiece.prototype.display = function() {
	this.scene.pushMatrix();
	this.scene.rotate(-90*DEGREE_TO_RAD, 1, 0, 0);
	this.material.apply();
	this.cylinder.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0,0.8,0);
	this.scene.scale(1, 0.3, 1);
	this.material.apply();
	this.sphere.display();
	this.scene.popMatrix();
}
