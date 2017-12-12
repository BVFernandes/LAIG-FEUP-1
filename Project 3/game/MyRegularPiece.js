/**
 * MyRegularPiece
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyRegularPiece(scene) {
	CGFobject.call(this,scene);

	this.sphere = new MySphere(this.scene, 1.2,20,20);
	this.cylinder = new MyCylinder(this.scene, 0.8,1.2,1.2,20,20,1,1);
}

MyRegularPiece.prototype = Object.create(CGFobject.prototype);
MyRegularPiece.prototype.constructor =MyRegularPiece;

MyRegularPiece.prototype.display = function() {
		this.scene.pushMatrix();
		this.scene.rotate(-90*DEGREE_TO_RAD, 1, 0, 0);
		this.cylinder.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0,0.8,0);
		this.scene.scale(1, 0.3, 1);
		this.sphere.display();
		this.scene.popMatrix();

}
