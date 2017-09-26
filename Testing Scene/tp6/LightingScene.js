var degToRad = Math.PI / 180.0;

var BOARD_WIDTH = 6.0;
var BOARD_HEIGHT = 4.0;

var BOARD_A_DIVISIONS = 30;
var BOARD_B_DIVISIONS = 100;

function LightingScene() {
	CGFscene.call(this);
}

LightingScene.prototype = Object.create(CGFscene.prototype);
LightingScene.prototype.constructor = LightingScene;

LightingScene.prototype.init = function(application) {
	CGFscene.prototype.init.call(this, application);

	this.Light0 = true;

	this.initCameras();

	this.initLights();

	this.gl.clearColor(0.0, 0.0, 0.7, 1.0);
	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);

	this.axis = new CGFaxis(this);
	this.enableTextures(true);

	// Scene elements
	this.floor = new MyQuad(this, 0, 10, 0, 12);
	this.table = new MyCylinder(this,8,20,true);
	this.couch = new MyCouch(this);
	this.table = new MyUnitCubeQuad(this);
	this.lamp = new MyLamp(this,8	,100);

	// Materials
	this.materialDefault = new CGFappearance(this);

	this.metalMaterial = new CGFappearance(this); //Metal
	this.metalMaterial.setAmbient(0.3,0.3,0.3,1);
	this.metalMaterial.setDiffuse(0.6,0.6,0.6,1);
	this.metalMaterial.setSpecular(1,1,1,0.5);
	this.metalMaterial.setShininess(200);

	this.floorMaterial = new CGFappearance(this); //Floor
	this.floorMaterial.setAmbient(0.3,0.3,0.3,1);
	this.floorMaterial.setDiffuse(0,0,0,1);
	this.floorMaterial.setSpecular(0.5,0.5,0.5,0.5);
	this.floorMaterial.setShininess(50);

	this.wallMaterial = new CGFappearance(this); //Floor
	this.wallMaterial.setAmbient(0.3,0.3,0.3,1);
	this.wallMaterial.setDiffuse(0,0,0,1);
	this.wallMaterial.setSpecular(1,1,1,1);
	this.wallMaterial.setShininess(50);

	// TEXTURES


	this.table_legs = new CGFappearance(this);
	this.table_legs.loadTexture("../resources/images/marmore.jpg");
	this.table_legs.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
	this.table_legs.setSpecular(0.5, 0.5, 0.5, 1);
	this.table_legs.setShininess(100);
	this.table_legs.setDiffuse(0.3, 0.3, 0.3, 1);

	this.couchAppearance = new CGFappearance(this);
	this.couchAppearance.loadTexture("../resources/images/rust.jpg");
	this.couchAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
	this.couchAppearance.setSpecular(0.8, 0.8, 0.8, 1);
	this.couchAppearance.setShininess(10000);
	this.couchAppearance.setDiffuse(0.3, 0.3, 0.3, 1);

	this.couch_head = new CGFappearance(this);
	this.couch_head.loadTexture("../resources/images/rock.jpg");
	this.couch_head.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
	this.couch_head.setSpecular(0.3, 0.3, 0.3, 1);
	this.couch_head.setShininess(10);
	this.couch_head.setDiffuse(0.8, 0.8, 0.8, 1);

	this.setUpdatePeriod(1);
};

LightingScene.prototype.initCameras = function() {
	this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
};

LightingScene.prototype.initLights = function() {
	this.setGlobalAmbientLight(0.2,0.2,0.2,1);

	// Positions for one lights
	this.lights[0].setPosition(7.5, 5.0, 7.5, 1.0);
	this.lights[0].setVisible(true); // show marker on light position (different from enabled)

	this.lights[0].setAmbient(0.5,0.5, 0.5, 1);
  this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[0].setSpecular(0.5,1,1,1);
	this.lights[0].setLinearAttenuation(0);

	this.lights[0].enable();


};

LightingScene.prototype.updateLights = function() {
	for (i = 0; i < this.lights.length; i++)
		this.lights[i].update();
};


LightingScene.prototype.display = function() {
	for(var i = 0; i < 5; i++){
		if(this["Light"+i] === true)
			this.lights[i].enable();
		else
			this.lights[i].disable();
	}


	// ---- BEGIN Background, camera and axis setup

	// Clear image and depth buffer everytime we update the scene
	this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation)
	this.updateProjectionMatrix();
	this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Update all lights used
	this.updateLights();

	// Draw axis
	this.axis.display();

	this.materialDefault.apply();

	// ---- END Background, camera and axis setup

	// ---- BEGIN Geometric transformation section

	// ---- END Geometric transformation section


	// ---- BEGIN Primitive drawing section

	// Floor
	this.pushMatrix();
	this.translate(7.5, 0, 7.5);
	this.rotate(-90 * degToRad, 1, 0, 0);
	this.scale(15, 15, 0.2);
	this.floorMaterial.apply();
	this.floor.display();
	this.popMatrix();

	// Wall1
	this.pushMatrix();
	this.translate(7.5, 2.5, 0);
	this.scale(15, 5, 0.2);
	this.wallMaterial.apply();
	this.floor.display();
	this.popMatrix();


	// Wall2
	this.pushMatrix();
	this.translate(0, 2.5, 7.5);
	this.rotate(90 * degToRad, 0, 1, 0);
	this.scale(15, 5, 0.2);
	this.wallMaterial.apply();
	this.floor.display();
	this.popMatrix();


	//lamp
	this.pushMatrix();
	this.translate(7.5, 5.0, 7.5);
	this.rotate(90 * degToRad, 1, 0, 0);
	this.couch_head.apply();
	this.lamp.display();
	this.popMatrix();

	//table
	this.pushMatrix();
	this.translate(1.5, 0.5, 7.5);
	this.scale(2.5, 1, 5);
	this.couch_head.apply();
	this.table.display();
	this.popMatrix();

	//couch
	this.pushMatrix();
	this.translate(12, 0.5, 7.5);
	//this.scale(2.5, 1, 5);
	//this.couch_head.apply();
	this.couch.display();
	this.popMatrix();

	// ---- END Primitive drawing section
};


LightingScene.prototype.update = function(currTime) {

};

LightingScene.prototype.Options = function (){
	console.log("Doing something...");
};
