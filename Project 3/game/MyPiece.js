var ANIMATION_SPEED = 2;

/**
 * MyPiece
 * @constructor
 */
function MyPiece(scene, x, z) {
    CGFobject.call(this,scene);
    this.scene = scene;

    this.x = x;
    this.z = z;
	
	this.destCoords = null;

    this.object = new MyRegularPiece(this.scene);
	
	this.animation = null;
	
	this.animationReady = 0;
	
	this.animate = false;

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
		this.scene.multMatrix(this.animation.getMatrix());
	}
	else
		this.scene.translate(this.x, 0.5, this.z);
	
    // if(this.isSelected)
    //     this.scene.setActiveShader(this.scene.nodes.selectedShader);
    // if(this.animation != null){
    //     this.scene.multMatrix(this.animation.getMatrix(this.timer));
    // }
    this.object.display();
    // if(this.isSelected)
    //     this.scene.setActiveShader(this.scene.defaultShader);
    this.scene.popMatrix();
}

/**
 * Sets MyPiece actual tile
 * @param tile
 */
MyPiece.prototype.setTile = function (tile) {
    this.tile = tile;
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
		console.log("End");
		this.x = this.destCoords[0];
		this.z = this.destCoords[1];
		this.animate = false;
		this.animation = null;
		this.destCoords = null;
	}
}

/**
 * Returns actual tile
 * @returns {null|*}
 */
MyPiece.prototype.getTile = function () {
    return this.tile;
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

MyPiece.prototype.createAnimation = function(coords) {
	
	let startPoint = [this.x, 0.5, this.z];
	let endPoint = [coords[0], 0.5, coords[1]];
	let meanPoint = this.meanPoint(startPoint, endPoint);
	let controlPoints = [startPoint, [meanPoint[0], 2, meanPoint[2]], endPoint]; 
	let animation = new MyLinearAnimation(0,ANIMATION_SPEED,controlPoints);
	
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

/**
 * Sets MyPiece animation
 * @param animation
 */
MyPiece.prototype.setAnimation = function(coords) {
    this.destCoords = coords;
	this.animation = this.createAnimation(coords);
	this.animationReady = 0;
}


MyPiece.prototype.getAnimate = function() {
	return this.animate;
}

MyPiece.prototype.setAnimate = function(value) {
	this.animate = value;
}
