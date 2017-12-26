var MOVE_ANIMATION_SPEED = 10;
var CLEAR_ANIMATION_SPEED = 2;

/**
 * MyPiece
 * @constructor
 */
function MyPiece(scene, type, x, z, player) {
    CGFobject.call(this,scene);
    this.scene = scene;
	this.type = type;
    this.x = x;
    this.z = z;
	this.player = player;
	
	this.destCoords = null;

	if(this.type == "n")
		this.object = new MyRegularPiece(this.scene, this.player);
	else
		this.object = new MyHengePiece(this.scene);
	
	this.animation = null;
	
	this.animationReady = 0;
	
	this.animate = false;
	
	this.placed = false;
	
	this.cleared = false;

    this.isSelected = false;
}

MyPiece.prototype = Object.create(CGFobject.prototype);
MyPiece.prototype.constructor = MyPiece;



/**
 * Displays a MyPiece
 */
MyPiece.prototype.display = function () {
    this.scene.pushMatrix();
	
    
	
	if(this.animate){
		//console.log(this.animation.getMatrix());
		this.scene.multMatrix(this.animation.getMatrix());
	}
	else
		this.scene.translate(this.x, 0.5, this.z);
	
    // if(this.isSelected)
    //     this.scene.setActiveShader(this.scene.nodes.selectedShader);
    // if(this.animation != null){
    //     this.scene.multMatrix(this.animation.getMatrix(this.timer));
    // }
	if(!this.cleared)
		this.object.display();
    // if(this.isSelected)
    //     this.scene.setActiveShader(this.scene.defaultShader);
    this.scene.popMatrix();
}

MyPiece.prototype.update = function (currTime) {
	if(this.animation == null)
		return;
	
    this.animation.update(currTime);
	
	if(this.animationReady < 2){
		this.animationReady++;
		return;
	}
	
	if(this.animation != null && !this.animate){
		console.log("animate");
		this.animate = true;
	}
	
	if(this.animation.end){
		
		if(!this.placed){
			console.log("End");
			this.x = this.destCoords[0];
			this.z = this.destCoords[1];
			this.animate = false;
			this.animation = null;
			this.destCoords = null;
			this.placed = true;
		}
		else if(!this.cleared){
			console.log("End");
			this.animate = false;
			this.animation = null;
			this.cleared = true;
		}
	}
}

/**
 * Sets MyPiece actual tile
 * @param tile
 */
MyPiece.prototype.setTile = function (tile) {
    this.tile = tile;
}

/**
 * Returns actual tile
 * @returns {null|*}
 */
MyPiece.prototype.getTile = function () {
    return this.tile;
}


MyPiece.prototype.setPlayer = function (player) {
    this.player = player;
}


MyPiece.prototype.getPlayer = function () {
    return this.player;
}

/**
 * Returns MyPiece colour, blue or red
 * @returns {*}
 */
MyPiece.prototype.getColour = function () {
    return this.colour;
}

/**
 * Returns MyPiece type, Node or Unit
 * @returns {*}
 */
MyPiece.prototype.getType = function () {
    return this.type;
}

/**
 * Returns MyPiece name used in the board
 * @returns {*}
 */
MyPiece.prototype.getUnit = function () {
    return this.unit;
}

/**
 * Sets the selected value
 */
MyPiece.prototype.setSelected = function (value) {
    this.isSelected=value;
}

MyPiece.prototype.meanPoint = function(point1, point2){
	return [(point2[0]+point1[0])/2.0, (point2[1]+point1[1])/2.0, (point2[2]+point1[2])/2.0];
}

MyPiece.prototype.createMoveAnimation = function(coords) {
	
	let startPoint = [this.x, 0.5, this.z];
	let endPoint = [coords[0], 0.5, coords[1]];
	let meanPoint = this.meanPoint(startPoint, endPoint);
	let controlPoints = [startPoint, [meanPoint[0], 2, meanPoint[2]], endPoint]; 
	let animation = new MyLinearAnimation(0,MOVE_ANIMATION_SPEED,controlPoints);
	
	/*
	controlPoints = [[this.x, 0.5, this.z],
					 [this.x, 1, this.z],
					 [coords[0], 1, coords[1]],
					 [coords[0], 0.5, coords[1]]];
					 
	let animation = new MyBezierAnimation(0, ANIMATION_SPEED, controlPoints);
	*/
    let comboAnimation = new MyComboAnimation();
	comboAnimation.addAnimation(animation);
	return comboAnimation;
}

MyPiece.prototype.createClearAnimation = function() {
	let startPoint = [this.x, 0.5, this.z];
	let endPoint = [this.x, 10, this.z];
	let controlPoints = [startPoint, endPoint];
	console.log(controlPoints);
	let animation = new MyLinearAnimation(0,CLEAR_ANIMATION_SPEED,controlPoints);
    let comboAnimation = new MyComboAnimation();
	comboAnimation.addAnimation(animation);
	return comboAnimation;
}

/**
 * Sets MyPiece animation
 * @param animation
 */
MyPiece.prototype.setMoveAnimation = function(coords) {
    this.destCoords = coords;
	this.animation = this.createMoveAnimation(coords);
	this.animationReady = 0;
}

MyPiece.prototype.setClearAnimation = function() {
	let coords = [0,0];
	this.animation = this.createMoveAnimation(coords);
	//this.animation = this.createClearAnimation();
	this.animationReady = 0;
}

MyPiece.prototype.getPos = function () {
    return [this.x, this.z];
}

MyPiece.prototype.getAnimate = function() {
	return this.animate;
}

MyPiece.prototype.setAnimate = function(value) {
	this.animate = value;
}

MyPiece.prototype.getPlaced = function () {
    return this.placed;
}

MyPiece.prototype.getCleared = function () {
    return this.cleared;
}