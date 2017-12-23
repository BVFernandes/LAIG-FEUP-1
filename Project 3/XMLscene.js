var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 * @constructor
 */
function XMLscene(interface) {
	CGFscene.call(this);

	this.interface = interface;

	this.lightValues = {};
	this.selectedSelectableNode = 0;
	this.selectedExampleShader = 0;
	this.selectedColourShader = 0;
	this.animationStop = false;
	this.animationLoop = true;
	this.flagTFactor = false;
	this.scaleFactor = 10.0;

	this.redSelector = 0.0;
	this.greenSelector = 0.0;
	this.blueSelector = 0.0;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
 * @param  {[CGFapplication]} scene application
 */
XMLscene.prototype.init = function(application) {
	CGFscene.prototype.init.call(this, application);

	this.initCameras();

	this.enableTextures(true);

	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);

	this.axis = new CGFaxis(this);

	this.updatePeriod = 1 / 60 * 1000;	// update period in ms (1/60 * 1000 ms = 60 Hz)
	this.setUpdatePeriod(this.updatePeriod);

	this.testShaders=[
		new CGFshader(this.gl, "shaders/flat.vert", "shaders/flat.frag"),
		new CGFshader(this.gl, "shaders/MyShader.vert", "shaders/MyShader.frag"),
		new CGFshader(this.gl, "shaders/texture3.vert", "shaders/sepia.frag"),
		new CGFshader(this.gl, "shaders/texture3.vert", "shaders/convolution.frag")
		];

	this.game = new MyGoRoGo(this);

	this.coloursShaders=[vec3.fromValues(0,0,1),vec3.fromValues(1,0,0), vec3.fromValues(0,1,0), vec3.fromValues(1,1,0), vec3.fromValues(this.redSelector, this.greenSelector, this.blueSelector)];

	this.setPickEnabled(true);
	this.updateScaleFactor();
	this.updateColourShader();
}

/**
 * Handle changes in checkbox of animationStop and diffuse to all animations
 */
XMLscene.prototype.updateAnimationStop=function(v) {
	for(let id in this.graph.comboAnimations)
		this.graph.comboAnimations[id].updateAnimationStop(v);
}

/**
 * Handle changes in checkbox of animationLoop and diffuse to all animations
 */
XMLscene.prototype.updateAnimationLoop=function(v) {
	for(let id in this.graph.comboAnimations)
		this.graph.comboAnimations[id].setLoopAnimation(v);
}

/**
 * Handle changes in scalefactor on Interface and send to shaders
 */
XMLscene.prototype.updateScaleFactor=function(v) {
	this.testShaders[1].setUniformsValues({normScale: this.scaleFactor});
}

/**
 * Handle timeFactor to change shader according to a trignometric function
 */
XMLscene.prototype.updateTimeFactor=function(currTime) {
	let tFactor;
	if(this.flagTFactor){
		tFactor = Math.abs(Math.sin(currTime*Math.pow(10,-3)));
	}
	else {
		tFactor=1;
	}

	this.testShaders[1].setUniformsValues({timeFactor: tFactor});
}

/**
 * Handle colourShader to change shader according to a selected colour
 */
XMLscene.prototype.updateColourShader=function(){
	this.testShaders[1].setUniformsValues({colour: this.coloursShaders[this.selectedColourShader]});
}

XMLscene.prototype.updateRedSelector=function(v){
	this.redSelector=v;
	if(this.selectedColourShader == 4)
		this.testShaders[1].setUniformsValues({colour: vec3.fromValues(this.redSelector, this.greenSelector, this.blueSelector)});

}

XMLscene.prototype.updateGreenSelector=function(v){
	this.greenSelector=v;
	if(this.selectedColourShader == 4)
		this.testShaders[1].setUniformsValues({colour: vec3.fromValues(this.redSelector, this.greenSelector, this.blueSelector)});
}

XMLscene.prototype.updateBlueSelector=function(v){
	this.blueSelector=v;
	if(this.selectedColourShader == 4)
		this.testShaders[1].setUniformsValues({colour: vec3.fromValues(this.redSelector, this.greenSelector, this.blueSelector)});
}

XMLscene.prototype.updateCamera=function(currTime){

	if(!this.moveCam)
		return;

	let direction = 1;
	let deltaZ1 = this.camera.position[2]-this.cameraPos[this.cameraIdx][2];
	let deltaX = Math.abs(this.camera.position[0]-this.cameraPos[this.cameraIdx][0]);
	let deltaZ = Math.abs(this.camera.position[2]-this.cameraPos[this.cameraIdx][2]);

	if(deltaZ + deltaX > 1) {
		if(deltaZ1 < 0)
			direction = -1;

		this.camera.orbit("y", direction*10*DEGREE_TO_RAD);
	} else {
		this.moveCam = false;

		if(this.cameraIdx >= 3){
			this.cameraIdx=0;
		}else {
			this.cameraIdx++;
		}

	}

}

/**
 * Initializes the scene lights with the values read from the LSX file.
 */
XMLscene.prototype.initLights = function() {
	var i = 0;
	// Lights index.

	// Reads the lights from the scene graph.
	for (var key in this.graph.lights) {
		if (i >= 8)
			break;              // Only eight lights allowed by WebGL.

		if (this.graph.lights.hasOwnProperty(key)) {
			var light = this.graph.lights[key];

			this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
			this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
			this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
			this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);

			this.lights[i].setVisible(true);
			if (light[0])
				this.lights[i].enable();
			else
				this.lights[i].disable();

			this.lights[i].update();

			i++;
		}
	}

}

/**
 * Updates lights accordingly to the user input on the interface
 */
XMLscene.prototype.updateLights = function () {
	var i = 0;
	for (var key in this.lightValues) {
		if (this.lightValues.hasOwnProperty(key)) {
			if (this.lightValues[key]) {
				this.lights[i].setVisible(true);
				this.lights[i].enable();
			}
			else {
				this.lights[i].setVisible(false);
				this.lights[i].disable();
			}
			this.lights[i].update();
			i++;
		}
	}
}

/**
 * Initializes the scene cameras.
 */
XMLscene.prototype.initCameras = function() {
	this.camera = new CGFcamera(0.6,0.5,500,vec3.fromValues(15, 15, 15),vec3.fromValues(0, 0, 0));

	this.camera.orbit('y', 45*DEGREE_TO_RAD);

	this.cameraPos = [[21,15,0], [0,15,-21], [21,15,0], [0,15,21]];
	this.cameraIdx = 1;
}

/* Handler called when the graph is finally loaded.
 * As loading is asynchronous, this may be called already after the application has started the run loop
 */
XMLscene.prototype.onGraphLoaded = function()
{
	this.camera.near = this.graph.near;
	this.camera.far = this.graph.far;
	this.axis = new CGFaxis(this,this.graph.referenceLength);

	this.setGlobalAmbientLight(this.graph.ambientIllumination[0], this.graph.ambientIllumination[1],
			this.graph.ambientIllumination[2], this.graph.ambientIllumination[3]);

	this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

	this.initLights();

	// Adds lights group.
	this.interface.addLightsGroup(this.graph.lights);
	this.interface.addAnimationOption();
	this.interface.addShadersGroup();

}

/**
 * Displays the scene.
 */
XMLscene.prototype.display = function() {
	// ---- BEGIN Background, camera and axis setup

	// Clear image and depth buffer everytime we update the scene
	this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
	this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	this.pushMatrix();

	if (this.graph.loadedOk)
	{
		// Applies initial transformations.
		this.multMatrix(this.graph.initialTransforms);

		// Draw axis
		this.axis.display();

		// Update Lights
		this.updateLights();


		// Displays the scene.
		this.graph.displayScene();
		this.game.display();

	}
	else
	{
		// Draw axis
		this.axis.display();
	}


	this.popMatrix();

	// ---- END Background, camera and axis setup

}

/**
 * Update the scene - animations and shaders.
 */
XMLscene.prototype.update = function(currTime) {

	if(!this.graph.loadedOk)
		return;

	this.game.update(currTime);
	
	for(let id in this.graph.comboAnimations)
		this.graph.comboAnimations[id].update(currTime);

	this.updateTimeFactor(currTime);
	this.updateCamera(currTime);
	this.game.update(currTime);
};

/**
 * Set between defaultShader and selectedShader.
 */
XMLscene.prototype.setShader = function(shader){
	if(shader){
		this.setActiveShader(this.testShaders[this.selectedExampleShader]);
	}else{
		this.setActiveShader(this.defaultShader);
	}
}
