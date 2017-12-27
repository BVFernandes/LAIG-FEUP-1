/**
 * MyInterface class, creating a GUI interface.
 * @constructor
 */
function MyInterface() {
	//call CGFinterface constructor
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * Initializes the interface.
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);

	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui

	this.gui = new dat.GUI();

	// add a group of controls (and open/expand by defult)

	return true;
};

/**
 * Adds a folder containing the IDs of the lights passed as parameter.
 */
MyInterface.prototype.addLightsGroup = function(lights, group) {

	group = this.gui.addFolder("Lights");
	//group.open();
	group.close();
	// add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
	// e.g. this.option1=true; this.option2=false;

	for (var key in lights) {
		if (lights.hasOwnProperty(key)) {
			this.scene.lightValues[key] = lights[key][0];
			group.add(this.scene.lightValues, key);
		}
	}
}

MyInterface.prototype.addGameSettingsGroup = function(){
	let group = this.gui.addFolder("Game Settings");
	group.open();

	this.addGameModeList(group);

	this.addDifficultyList(group);

	obj=this;
	group.add(this.scene, 'turnTimeout',0,60).name('Turn Timeout').onChange(function(v)
			{ obj.scene.updateTurnTimeout(v); });
}

MyInterface.prototype.addVisualSettingsGroup = function(lights){
	let group = this.gui.addFolder("Visual Settings");
	group.open();

	this.addScenesList(group);

	this.addPerspectiveList(group);

	obj=this;
	group.add(this.scene, 'zoomCamera',0,1).name('Zoom Camera').onChange(function(v)
			{ obj.scene.updateZoomCamera(v); });

	this.addLightsGroup(this.scene.graph.lights, group);
}

MyInterface.prototype.addUndoOption = function(){
	this.gui.add(this.scene, 'doUndoMove').name('Undo Move');
}

MyInterface.prototype.addDifficultyList = function(group){

	group.add(this.scene, 'selectedDifficultyGame', {
		'Easy': 0,
		'Hard': 1,
	}).name('Difficulty');
}

MyInterface.prototype.addGameModeList = function(group){

	group.add(this.scene, 'selectedGameMode', {
		'CPU vs CPU': 0,
		'CPU vs Human': 1,
		'Human vs Human': 2,
	}).name('Game Mode');
}

MyInterface.prototype.addScenesList = function(group){

	group.add(this.scene, 'selectedScene', {
		'Default': 0,
	}).name('Scene');
}

MyInterface.prototype.addPerspectiveList = function(group){

	group.add(this.scene, 'selectedPerspective', {
		'Center': 0,
		'Left': 1,
		'Right': 2,
	}).name('Perspective');
}

/**
 * processKeyboard
 * @param event {Event}
 */
MyInterface.prototype.processKeyboard = function(event) {
	// call CGFinterface default code (omit if you want to override)
	//CGFinterface.prototype.processKeyboard.call(this,event);

	// Check key codes e.g. here: http://www.asciitable.com/
	// or use String.fromCharCode(event.keyCode) to compare chars

	// for better cross-browser support, you may also check suggestions on using event.which in http://www.w3schools.com/jsref/event_key_keycode.asp
	var test = event.keycode | event.which;

	switch (test)	{

	case (86):
	case (118):
		console.log("Key 'V' pressed");
	this.scene.moveCam = true;
	break;

	case (65):
	case (97):
		console.log("Key 'A' pressed");
	break;

	case (68):
	case (100):
		console.log("Key 'D' pressed");
	break;

	case (83):
	case (115):
		console.log("Key 'S' pressed");
	break;

	case (87):
	case (119):
		console.log("Key 'W' pressed");
	break;

	case (113):
	case (81):
		console.log("Key 'Q' pressed");
	break;

	case (69):
	case (101):
		console.log("Key 'E' pressed");
	break;

	case (80):
	case (112):
		console.log("Key 'P' pressed");
	break;

	case (76):
	case (108):
		console.log("Key 'L' pressed");
	break;

	case (70):
	case (102):
		console.log("Key 'F' pressed");
	break;

	case(82):
	case(114):
		console.log("Key 'R' pressed");
	break;


	};
};
