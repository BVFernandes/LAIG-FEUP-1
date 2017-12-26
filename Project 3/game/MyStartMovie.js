function MyStartMovie(scene){
	CGFobject.call(this,scene);

	this.cube = new MyCube(scene);
	this.sphere = new MySphere(scene, 1, 20, 20);

	this.blackMaterial = new CGFappearance(this.scene); //Floor
	this.blackMaterial.setAmbient(0,0,0,1);
	this.blackMaterial.setDiffuse(0,0,0,1);
	this.blackMaterial.setSpecular(1,1,1,1);
	this.blackMaterial.setShininess(255);

}

MyStartMovie.prototype = Object.create(CGFobject.prototype);
MyStartMovie.prototype.constructor=MyStartMovie;

MyStartMovie.prototype.display = function () {

	this.scene.pushMatrix();
	this.scene.translate(0,15,0);

	this.scene.pushMatrix();
	this.scene.rotate(10 * DEGREE_TO_RAD, 1, 0, 0);
	this.scene.translate(0,4,-0.5);
	this.scene.scale(2,2,10);
	this.cube.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.scale(2,5,10);
	this.blackMaterial.apply();
	this.cube.display();
	this.scene.popMatrix();

	this.scene.popMatrix();
}
