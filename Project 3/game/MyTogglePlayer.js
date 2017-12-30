/**
 * MyTogglePlayer
 * @constructor
 */
function MyTogglePlayer(scene, player){
	CGFobject.call(this,scene);

	this.scene = scene;
	this.player = player;

	this.redMaterial = new CGFappearance(this.scene);
	this.redMaterial.setAmbient(1,0,0,1);
	this.redMaterial.setDiffuse(1,0,0,1);
	this.redMaterial.setSpecular(0.5,0,0,0.5);
	this.redMaterial.setShininess(1);

	this.greenMaterial = new CGFappearance(this.scene);
	this.greenMaterial.setAmbient(0,1,0,1);
	this.greenMaterial.setDiffuse(0,1,0,1);
	this.greenMaterial.setSpecular(0,0.5,0,0.5);
	this.greenMaterial.setShininess(1);

	this.blackMaterial = new CGFappearance(this.scene);
	this.blackMaterial.setAmbient(0,0,0,1);
	this.blackMaterial.setDiffuse(0,0,0,1);
	this.blackMaterial.setSpecular(0,0,0,0.5);
	this.blackMaterial.setShininess(1);

	this.rect = new MyRectangle(scene,[-0.5,0.5], [0.5,-0.5]);
	this.sphere = new MySphere(scene, 1, 20, 20);
}

MyTogglePlayer.prototype = Object.create(CGFobject.prototype);
MyTogglePlayer.prototype.constructor=MyTogglePlayer;

MyTogglePlayer.prototype.display = function () {

	this.scene.pushMatrix();

	switch (parseInt(this.player.getName() == "whitePlayer" ? this.scene.selectedPlayer1Type : this.scene.selectedPlayer2Type)) {
	case 0:
		this.blackMaterial.apply();
		break;
	case 1:
		this.greenMaterial.apply();
		break;
	case 2:
		this.redMaterial.apply();
		break;
	default:
		this.blackMaterial.apply();
		break;
	}
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
