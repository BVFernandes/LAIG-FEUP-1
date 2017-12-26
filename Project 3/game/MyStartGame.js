function MyStartGame(scene){
	CGFobject.call(this,scene);

	this.triangle = new MyTriangle(scene, true, [1, 0, 2],[2,0,0],[0, 0, 0]);
	this.sphere = new MySphere(scene, 1, 20, 20);

	this.whiteMaterial = new CGFappearance(this.scene); //Floor
	this.whiteMaterial.setAmbient(0.3,0.3,0.3,1);
	this.whiteMaterial.setDiffuse(0.5,0.5,0.5,1);
	this.whiteMaterial.setSpecular(0.5,0.5,0.5,0.5);
	this.whiteMaterial.setShininess(255);
}

MyStartGame.prototype = Object.create(CGFobject.prototype);
MyStartGame.prototype.constructor=MyStartGame;

MyStartGame.prototype.display = function () {

	this.scene.pushMatrix();
	this.scene.translate(0,22,0);

	this.scene.pushMatrix();
	this.scene.translate(0.12,1,0.7);
	this.scene.rotate(Math.PI, 0,1,0);
	this.scene.rotate(Math.PI/2, 0,0,1);
	this.scene.scale(1,1,1);
	this.triangle.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0,2,0);
	this.scene.scale(0.1,2,2);
	this.whiteMaterial.apply();
	this.sphere.display();
	this.scene.popMatrix();


	this.scene.popMatrix();
}
