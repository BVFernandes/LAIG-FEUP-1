MyTile.toBoardPos = {
		"-7": 	1,
		"-3.5": 2,
		"0": 	3,
		"3.5": 	4,
		"7": 	5,
}

/**
 * MyTile
 * @constructor
 */
function MyTile(scene, x, z) {
	CGFobject.call(this,scene);
	this.scene = scene;
	this.piece = null;   // reference to a piece or null

	this.x = x;
	this.z = z;

	this.highlight = false;

	this.object = new MyCircle(this.scene, 20);
}

MyTile.prototype = Object.create(CGFobject.prototype);
MyTile.prototype.constructor = MyTile;


/**
 * Displays MyTile and respective piece, if it exists
 * @param currentMove
 * @param pickingMode
 */
MyTile.prototype.display = function (currentMove, pickingMode) {
	this.scene.pushMatrix();

	this.scene.translate(this.x, 0.6, this.z);
	this.scene.rotate(-90*DEGREE_TO_RAD, 1, 0, 0);

	this.object.display();

	this.scene.popMatrix();
}

/******************** Getters and Setters *****************************/

/**
 * Sets current piece
 * @param piece
 */
MyTile.prototype.setPiece = function (piece) {
	this.piece = piece;
}

/**
 * Returns piece
 * @returns {*|null}
 */
MyTile.prototype.getPiece = function () {
	return this.piece;
}

/**
 * Returns MyTile's row
 * @returns {*}
 */
MyTile.prototype.getRow = function () {
	return this.row;
}

/**
 * Returns MyTile's col
 * @returns {*}
 */
MyTile.prototype.getCol = function () {
	return this.col;
}

MyTile.prototype.getPos = function () {
	return [this.x, this.z];
}

MyTile.prototype.getBoardPos = function () {
	return [MyTile.toBoardPos[this.z.toString()], MyTile.toBoardPos[this.x.toString()]];
}

/**
 * Returns coordinates as string in format: Row-Col
 * @returns {string}
 */
MyTile.prototype.getCoordinatesAsString = function () {
	return (this.row + "-" + this.col);
}

/**
 * Sets the highlight value.
 * @param value
 */
MyTile.prototype.setHighlight = function (value) {
	this.highlight = value;
}
