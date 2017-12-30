/**
 * MyTVScene
 * @constructor
 */
function MyTVScene(scene){
	CGFobject.call(this,scene);

	this.scene = scene;

	this.metalMaterial = new CGFappearance(this.scene);
	this.metalMaterial.setAmbient(0.3,0.3,0.3,1);
	this.metalMaterial.setDiffuse(0.6,0.6,0.6,1);
	this.metalMaterial.setSpecular(1,1,1,0.5);
	this.metalMaterial.setShininess(255);

	this.defaultMaterial = new CGFappearance(this.scene);
	this.defaultMaterial.setAmbient(0.4,0.4,0.4,1);
	this.defaultMaterial.setDiffuse(0.4,0.4,0.4,1);
	this.defaultMaterial.setSpecular(0,0,0,1);
	this.defaultMaterial.setShininess(1);

	this.blackMaterial = new CGFappearance(this.scene);
	this.blackMaterial.setAmbient(0.05,0.05,0.05,1);
	this.blackMaterial.setDiffuse(0,0,0,1);
	this.blackMaterial.setSpecular(0,0,0,1);
	this.blackMaterial.setShininess(1);

	this.lionkingTexture =new CGFtexture(this.scene,"./scenes/images_room/reileao1.jpg");

	this.rect = new MyRectangle(scene,[-0.5,0.5], [0.5,-0.5]);
	this.sphere = new MySphere(scene, 2, 5, 20);
  this.cube = new MyCube(scene);
  this.patch = new MyPatch(scene, 20, 20, 2, 1, [[[-0.9,-0.4,0,1],[-0.9,0.4,0,1]],[[0,-0.4,0.2,1],[0,0.4,0.2,1]],[[0.9,-0.4,0,1],[0.9,0.4,0,1]]]);
  this.cylinder = new MyCylinder(scene, 0.7, 0.01, 0.01, 5, 5, 0, 0);
	this.cylinder1 = new MyCylinder(scene, 0.5, 0.01, 0.01, 5, 5, 0, 0);
}

MyTVScene.prototype = Object.create(CGFobject.prototype);
MyTVScene.prototype.constructor=MyTVScene;

/**
 * Displays tvScene Object
 */
MyTVScene.prototype.display = function () {

	this.scene.pushMatrix();
  this.scene.rotate(Math.PI/2, 0, 1, 0);
  this.scene.scale(1.2,2,1);
	this.blackMaterial.apply();

	this.scene.pushMatrix();
	this.scene.scale(2,1,1);
	this.cube.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0,0,-0.65);
	this.scene.scale(1.8,0.8,0.3);
	this.cube.display();
	this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.translate(0,0,-1);
  this.scene.scale(1,0.6,0.4);
  this.cube.display();
  this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0,0,0.5);
	this.scene.rotate(Math.PI, 0, 0, 1);
	this.defaultMaterial.apply();
	this.lionkingTexture.bind();
	this.patch.display();
	this.lionkingTexture.unbind();
	this.scene.popMatrix();

	this.scene.pushMatrix();
  this.scene.translate(0.5,0.5025,0);
  this.scene.rotate(Math.PI/6, 0, -1, 0);
	this.metalMaterial.apply();

	this.scene.pushMatrix();
	this.scene.scale(0.15,0.005,0.15);
	this.sphere.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.rotate(20*DEGREE_TO_RAD, 0, 0, -1);
	this.scene.rotate(Math.PI/2, -1, 0, 0);
	this.cylinder.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.rotate(30*DEGREE_TO_RAD, 0, 0, 1);
	this.scene.rotate(Math.PI/2, -1, 0, 0);
	this.cylinder1.display();
	this.scene.popMatrix();

	this.scene.popMatrix();
	this.scene.popMatrix();
}
