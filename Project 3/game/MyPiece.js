var MOVE_ANIMATION_SPEED = 10;
var CLEAR_ANIMATION_SPEED = 15;

/**
 * MyPiece
 * @constructor
 */
function MyPiece(scene, shader, type, x, z, player) {
	CGFobject.call(this,scene);
	this.scene = scene;
	this.shader = shader;
	this.type = type;

	this.x = x;
	this.y = 0.5;
	this.z = z;

	this.player = player;
	this.initCoords = [x,this.y,z];
	this.placedCoords = null;
	this.destCoords = null;

	if(this.type == "n")
		this.object = new MyRegularPiece(this.scene, this.player.getName());
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

	if(this.animate)
		this.scene.multMatrix(this.animation.getMatrix());
	else
		this.scene.translate(this.x, this.y, this.z);

	if(this.isSelected)
		this.scene.setActiveShader(this.shader);

	this.object.display();

	if(this.isSelected)
		this.scene.setActiveShader(this.scene.defaultShader);

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
		this.animate = true;
	}

	if(this.animation.end){
		if(!this.placed){
			this.x = this.destCoords[0];
			this.z = this.destCoords[1];
			this.animate = false;
			this.animation = null;
			this.destCoords = null;
			this.placed = true;
		}
		else if(!this.cleared){
			this.x = this.destCoords[0];
			this.z = this.destCoords[1];
			this.y = this.destCoords[2];
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
 * Returns MyPiece type
 * @returns {*}
 */
MyPiece.prototype.getType = function () {
	return this.type;
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
	
	controlPoints = [[this.x, 0.5, this.z],
					 [this.x, 4, this.z],
					 [coords[0], 2, coords[1]],
					 [coords[0], 0.5, coords[1]]];

	let animation = new MyBezierSelfRotAnimation(0, MOVE_ANIMATION_SPEED, controlPoints, 360);

	let comboAnimation = new MyComboAnimation();
	comboAnimation.addAnimation(animation);
	return comboAnimation;
}

MyPiece.prototype.createClearAnimation = function() {
	this.destCoords = this.player.getStackPos();
	let startPoint = [this.x, 0.5, this.z];
	let endPoint = [this.destCoords[0], this.destCoords[2], this.destCoords[1]];
	let meanPoint = this.meanPoint(startPoint, endPoint);
	let controlPoints = [startPoint, [meanPoint[0], 3, meanPoint[2]], endPoint];
	let animation = new MyLinearAnimation(null, CLEAR_ANIMATION_SPEED, controlPoints);

	let comboAnimation = new MyComboAnimation(null,false);
	comboAnimation.addAnimation(animation);
	return comboAnimation;
}

/**
 * Sets MyPiece animation
 * @param animation
 */
MyPiece.prototype.setMoveAnimation = function(coords) {
	this.destCoords = coords;
	this.placedCoords = coords;
	this.animation = this.createMoveAnimation(coords);
	this.animationReady = 0;
}

MyPiece.prototype.setClearAnimation = function() {
	this.animation = this.createClearAnimation();
	this.animationReady = 0;
}

MyPiece.prototype.getPos = function () {
	return [this.x, this.z];
}

MyPiece.prototype.resetPos = function () {
	this.x = this.initCoords[0];
	this.y = this.initCoords[1];
	this.z = this.initCoords[2];
	this.placed = false;
	this.cleared = false;
}

MyPiece.prototype.resetCleared = function () {
	this.player.decStack();
	this.x = this.placedCoords[0];
	this.y = 0.5;
	this.z = this.placedCoords[1];
	this.cleared = false;
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

MyPiece.prototype.setCleared = function (cleared) {
	this.cleared = cleared;
}