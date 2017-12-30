var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 * @constructor
 */
function XMLscene(interface) {
	CGFscene.call(this);

	this.interface = interface;

	this.lightValues = {};

	this.game;

	this.doUndoMove = function() { if(this.game) this.game.undoMove();};
	this.doStartGame = function() { if(this.game) this.game.startGame();};
	this.doReplayGame = function() { if(this.game) this.game.replayGame();};

	this.selectedPlayer1Type = 0;
	this.selectedPlayer2Type = 0;

	this.graphs = [];
	this.graphIdx = 0;

	this.turnTimeout = 0;
	this.musicOn = true;
	this.zoomCamera = 0.3;
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

	this.initComponents();

	this.game = new MyGoRoGo(this);

	this.sceneSongs = [null,new Audio('./scenes/music/lionking.mp3'),new Audio('./scenes/music/christmas.mp3')];
	//this.audio.volume=0.2;

	this.setPickEnabled(true);
}

XMLscene.prototype.initComponents=function() {
	this.testShaders=[
		new CGFshader(this.gl, "shaders/flat.vert", "shaders/flat.frag"),
		new CGFshader(this.gl, "shaders/MyShader.vert", "shaders/MyShader.frag"),
		new CGFshader(this.gl, "shaders/texture3.vert", "shaders/sepia.frag"),
		new CGFshader(this.gl, "shaders/texture3.vert", "shaders/convolution.frag")
		];
}

XMLscene.prototype.updateTurnTimeout=function(v) {
	this.turnTimeout = v;
}

XMLscene.prototype.getTurnTimeout=function(v) {
	return this.turnTimeout;
}

XMLscene.prototype.zoomIn=function() {
	this.camera.zoom(1);
}

XMLscene.prototype.zoomOut=function() {
	this.camera.zoom(-1);
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

XMLscene.prototype.updateCamera=function(currTime){

	if(!this.moveCam)
		return;

	let delta = this.cameraPos[this.cameraIdx] - this.deltaCam;
	let direction = 1;

	if(Math.abs(delta) > 1) {
		if(delta < 0)
			direction = -1;
		this.deltaCam += direction*10;
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

	this.lightValues = {};
	let lights = this.graphs[this.graphIdx].lights;
	for (let key in lights) {
		if (lights.hasOwnProperty(key)) {
			this.lightValues[key] = lights[key][0];
		}
	}

	// Reads the lights from the scene graph.
	for (var key in this.graphs[this.graphIdx].lights) {
		if (i >= 8)
			break;              // Only eight lights allowed by WebGL.

		if (this.graphs[this.graphIdx].lights.hasOwnProperty(key)) {
			var light = this.graphs[this.graphIdx].lights[key];

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
	this.camera = new CGFcamera(0.6,0.5,500,vec3.fromValues(15, 15, 15),vec3.fromValues(0, 4, 0));

	this.camera.orbit('y', 45*DEGREE_TO_RAD);

	this.cameraPos = [0,90,0,-90];
	this.cameraIdx = 0;
	this.deltaCam = 0;
}

/* Handler called when the graph is finally loaded.
 * As loading is asynchronous, this may be called already after the application has started the run loop
 */
XMLscene.prototype.onGraphLoaded = function()
{
	if(!this.interface.changeScene && this.interface.firstTime != 0)
		return;

	this.camera.near = this.graphs[this.graphIdx].near;
	this.camera.far = this.graphs[this.graphIdx].far;
	this.axis = new CGFaxis(this,this.graphs[this.graphIdx].referenceLength);

	this.setGlobalAmbientLight(this.graphs[this.graphIdx].ambientIllumination[0], this.graphs[this.graphIdx].ambientIllumination[1],
			this.graphs[this.graphIdx].ambientIllumination[2], this.graphs[this.graphIdx].ambientIllumination[3]);

	this.gl.clearColor(this.graphs[this.graphIdx].background[0], this.graphs[this.graphIdx].background[1], this.graphs[this.graphIdx].background[2], this.graphs[this.graphIdx].background[3]);

	this.initLights();

	// Adds lights group.
	if(this.interface.changeScene){
		this.interface.addLightsGroup();
		this.interface.changeScene = false;
		return;
	}
	this.interface.addGameSettingsGroup();
	this.interface.addVisualSettingsGroup();
	this.interface.addStartGameOption();
	this.interface.addReplayGameOption();
	this.interface.addUndoOption();
	this.interface.firstTime++;
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

	if (this.graphs[this.graphIdx].loadedOk)
	{
		// Applies initial transformations.
		this.multMatrix(this.graphs[this.graphIdx].initialTransforms);

		// Draw axis
		this.axis.display();

		// Update Lights
		if(!this.interface.changeScene)
			this.updateLights();

		// Displays the scene.
		this.graphs[this.graphIdx].displayScene();

		if(this.game)
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

	if(!this.graphs[this.graphIdx].loadedOk)
		return;

	for(let id in this.graphs[this.graphIdx].comboAnimations)
		this.graphs[this.graphIdx].comboAnimations[id].update(currTime);

	this.updateTimeFactor(currTime);
	this.updateCamera(currTime);

	if(this.game)
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

XMLscene.prototype.updateSceneMusic = function(v){
	if(this.sceneSongs[this.graphIdx]){
		if(v){
			this.sceneSongs[this.graphIdx].loop = true;
			this.sceneSongs[this.graphIdx].play();
		}
		else
			this.sceneSongs[this.graphIdx].pause();

	}
}

XMLscene.prototype.unpauseSceneMusic = function(){
	if(this.sceneSongs[this.graphIdx])
		this.sceneSongs[this.graphIdx].play();
}


XMLscene.prototype.playSceneMusic = function(){
	
	if(!this.musicOn)
		return;

	for(let i = 0; i < this.sceneSongs.length; i++){
		if(this.sceneSongs[i]){
			this.sceneSongs[i].pause();
			this.sceneSongs[i].currentTime = 0;
		}
	}

	if(this.sceneSongs[this.graphIdx]){
		console.log("Change Music");
		this.sceneSongs[this.graphIdx].loop = true;
		this.sceneSongs[this.graphIdx].play();
	}
}