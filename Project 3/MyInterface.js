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

	let lightsGroup = group.addFolder("Lights");
	//group.open();
	lightsGroup.close();
	// add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
	// e.g. this.option1=true; this.option2=false;

	for (var key in lights) {
		if (lights.hasOwnProperty(key)) {
			this.scene.lightValues[key] = lights[key][0];
			lightsGroup.add(this.scene.lightValues, key);
		}
	}
}

MyInterface.prototype.addGameSettingsGroup = function(){
	let group = this.gui.addFolder("Game Settings");
	group.open();

	this.addGameModeList(group);

	obj=this;
	group.add(this.scene, 'turnTimeout',0,60).name('Turn Timeout').onChange(function(v)
			{ obj.scene.updateTurnTimeout(v); });
}

MyInterface.prototype.addVisualSettingsGroup = function(lights){
	let group = this.gui.addFolder("Visual Settings");
	group.open();

	this.addScenesList(group);

	this.addPerspectiveList(group);

	group.add(this.scene, 'zoomIn').name('Zoom In');

	group.add(this.scene, 'zoomOut').name('Zoom out');

	this.addLightsGroup(this.scene.graph.lights, group);
}

MyInterface.prototype.addStartGameOption = function(){
	this.gui.add(this.scene, 'doStartGame').name('Start Game');
}

MyInterface.prototype.addUndoOption = function(){
	this.gui.add(this.scene, 'doUndoMove').name('Undo Move');
}

MyInterface.prototype.addGameModeList = function(group){

	group.add(this.scene, 'selectedPlayer1Type', {
		'Human': 0,
		'Easy CPU': 1,
		'Hard CPU': 2,
	}).name('Player 1');

	group.add(this.scene, 'selectedPlayer2Type', {
		'Human': 0,
		'Easy CPU': 1,
		'Hard CPU': 2,
	}).name('Player 2');
}

MyInterface.prototype.addScenesList = function(group){

	group.add(this.scene, 'selectedScene', {
		'Default': 0,
	}).name('Scene');
}

MyInterface.prototype.addPerspectiveList = function(group){

	group.add(this.scene, 'cameraIdx', {
		'Center': 0,
		'Left': 3,
		'Right': 1,
	}).name('Perspective').onChange(function()
			{ obj.scene.moveCam = true; });
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

	case (43):
		console.log("Key '+' pressed");
		this.scene.zoomIn();
	break;

	case (45):
		console.log("Key '-' pressed");
		this.scene.zoomOut();
	break;


	};
};
