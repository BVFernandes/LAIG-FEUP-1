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
MyInterface.prototype.addLightsGroup = function(lights) {

	var group = this.gui.addFolder("Lights");
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

MyInterface.prototype.addAnimationOption = function() {
	obj=this;
	this.gui.add(this.scene, 'animationStop').onChange(function(v)
			{ obj.scene.updateAnimationStop(v);	}).name('Stop Animation');

	this.gui.add(this.scene, 'animationLoop').onChange(function(v)
			{ obj.scene.updateAnimationLoop(v);	}).name('Animation Loop');


}

MyInterface.prototype.addShadersGroup = function(){
	this.addSelectableNodesGroup();

	this.addShadersList();

	obj=this;
	this.gui.add(this.scene, 'scaleFactor',-50,50).name('Shader Scale').onChange(function(v)
			{ obj.scene.updateScaleFactor(v); });

	this.addColoursGroup();

	this.gui.add(this.scene, 'flagTFactor').name('Shader Time');
}

MyInterface.prototype.addSelectableNodesGroup = function(){
	let selectablesList = {};

	for(let id in this.scene.graph.nodes){
		if(this.scene.graph.nodes[id].getSelectable()){
			selectablesList[id]=id;
		}
	}
	selectablesList['none']=null;

	this.gui.add(this.scene, 'selectedSelectableNode', selectablesList).name('Selectable List');
}

MyInterface.prototype.addShadersList = function(){

	this.gui.add(this.scene, 'selectedExampleShader', {
		'Flat Shading': 0,
		'My Shader': 1,
		'Sepia': 2,
		'Convolution': 3
	}).name('Shader List');
}

MyInterface.prototype.addColoursGroup = function(){
	obj=this;

	this.gui.add(this.scene, 'selectedColourShader', {
		'Default(Blue)': 0,
		'Red': 1,
		'Green': 2,
		'Yellow': 3,
		'Modified Colour' : 4,
	}).name('Colour Shader').onChange(function(v){ obj.scene.updateColourShader(v)});

	var colourGroup = this.gui.addFolder("Modified Colour");
	colourGroup.close();

	colourGroup.add(this.scene, 'redSelector',0,1).name('R').onChange(function(v)
			{ obj.scene.updateRedSelector(v); });

	colourGroup.add(this.scene, 'greenSelector',0,1).name('G').onChange(function(v)
			{ obj.scene.updateGreenSelector(v); });

	colourGroup.add(this.scene, 'blueSelector',0,1).name('B').onChange(function(v)
			{ obj.scene.updateBlueSelector(v); });
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
