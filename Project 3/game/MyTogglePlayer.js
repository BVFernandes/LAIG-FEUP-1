function MyTogglePlayer(scene){
	CGFobject.call(this,scene);

	this.rect = new MyRectangle(scene,[-0.5,0.5], [0.5,-0.5]);
	this.sphere = new MySphere(scene, 1, 20, 20);
}

MyTogglePlayer.prototype = Object.create(CGFobject.prototype);
MyTogglePlayer.prototype.constructor=MyTogglePlayer;

MyTogglePlayer.prototype.display = function () {

	this.scene.pushMatrix();
	this.scene.translate(0,5,0);

	this.scene.pushMatrix();
	this.scene.scale(5,5,5);
	this.scene.rotate(Math.PI/2,-1,0,0);
	this.rect.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0,2,0);
	this.scene.scale(2,2,2);
	this.sphere.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0,5,0);
	this.sphere.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0,3,-2);
	this.scene.scale(0.5,0.5,0.5);
	this.sphere.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0,3,2);
	this.scene.scale(0.5,0.5,0.5);
	this.sphere.display();
	this.scene.popMatrix();

	this.scene.popMatrix();
}
