/**
 * MyMove
 * @constructor
 */
function MyMove(game,piece,src,dst) {
	this.game = game;
	this.piece = piece;

	this.srcPos = src;
	this.dstTile = dst;

	this.surroundedPieces = [];
}

MyMove.prototype = Object.create(CGFobject.prototype);
MyMove.prototype.constructor = MyMove;

 MyMove.prototype.resetPieces = function() {
	this.piece.resetPos();
	for(let i = 0; i < this.surroundedPieces.length; i++)
		this.surroundedPieces[i].setCleared(false);
}

 MyMove.prototype.addSurroundedPieces = function(pieces) {
	for(let i = 0; i < pieces.length; i++)
		this.surroundedPieces.push(pieces[i]);
}

/***************** Getters and Setters ***********************/

/**
 * Returns the piece to be moved
 * @returns {*|*|null}
 */
MyMove.prototype.getGame = function () {
	return this.game;
}

/**
 * Sets the piece to be moved
 * @param piece
 */
MyMove.prototype.setPiece = function (piece) {
	this.piece = piece;
	this.srcTile = piece.getTile();
}

/**
 * Returns the piece to be moved
 * @returns {*|*|null}
 */
MyMove.prototype.getPiece = function () {
	return this.piece;
}

 MyMove.prototype.getSurroundedPieces = function() {
	return this.surroundedPieces;
}

/**
 * Sets move source tile
 * @param srcTile
 */
MyMove.prototype.setSrcPos = function (srcPos) {
	this.srcPos = srcPos;
}

/**
 * Returns source tile
 * @returns {*|null|null|*}
 */
MyMove.prototype.getSrcPos = function () {
	return this.srcPos;
}

/**
 * Changes move destiny tile
 * @param dest
 */
MyMove.prototype.setDstTile = function (dstTile) {
	this.dstTile = dstTile;
}

/**
 * Returns the destiny tile
 * @returns {*|null}
 */
MyMove.prototype.getDstTile = function () {
	return this.dstTile;
}

/**
 * Returns the destiny tile
 * @returns {*|null}
 */
MyMove.prototype.getDstPos = function () {
	return this.dstTile.getPos();
}
