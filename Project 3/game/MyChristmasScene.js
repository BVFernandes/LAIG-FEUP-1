/**
 * MyChristmasScene
 * @constructor
 */
function MyChristmasScene(scene){
	CGFobject.call(this,scene);

	this.scene = scene;

	this.glassMaterial = new CGFappearance(this.scene);
	this.glassMaterial.setAmbient(0.5,0.5,0.5,1);
	this.glassMaterial.setDiffuse(0,0,0,1);
	this.glassMaterial.setSpecular(1,1,1,0.5);
	this.glassMaterial.setShininess(255);

	this.plasticMaterial = new CGFappearance(this.scene);
	this.plasticMaterial.setAmbient(0.1,0.1,0.1,1);
	this.plasticMaterial.setDiffuse(0.1,0.1,0.1,1);
	this.plasticMaterial.setSpecular(0.1,0.1,0.1,1);
	this.plasticMaterial.setShininess(50);

	this.christmasSnowballTexture =new CGFtexture(this.scene,"./scenes/images/christmasSnowballTexture.jpg");

	this.sphere = new MySphere(scene, 0.8, 20, 20);
	this.sphere2 = new MySphere(scene, 2, 20, 20);
	this.cylinder = new MyCylinder(scene, 4, 1, 1, 20, 20, 0, 0);
}

MyChristmasScene.prototype = Object.create(CGFobject.prototype);
MyChristmasScene.prototype.constructor=MyChristmasScene;

MyChristmasScene.prototype.display = function () {

	this.scene.pushMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0,1.1,0);
	this.scene.rotate(Math.PI,0,1,0);
	this.scene.rotate(Math.PI/2,1,0,0);
	this.glassMaterial.apply();
	this.christmasSnowballTexture.bind();
	this.sphere.display();
	this.christmasSnowballTexture.unbind();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.scale(0.1,0.1,0.1);
	this.scene.rotate(Math.PI/2,-1,0,0);
	this.plasticMaterial.apply();
	this.cylinder.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.scale(0.3,0.05,0.3);
	this.scene.rotate(Math.PI/2,-1,0,0);
	this.plasticMaterial.apply();
	this.sphere2.display();
	this.scene.popMatrix();

	this.scene.popMatrix();
}
