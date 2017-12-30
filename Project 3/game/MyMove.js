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

/**
 * Resets surrounded pieces to their correct position
 */
MyMove.prototype.resetPieces = function() {
	for(let i = 0; i < this.surroundedPieces.length; i++)
		this.surroundedPieces[i].resetCleared();
	
	this.piece.resetPos();
}

/**
 * Adds surrounded pieces
 * @param pieces
 */
MyMove.prototype.addSurroundedPieces = function(pieces) {
	for(let i = 0; i < pieces.length; i++)
		this.surroundedPieces.push(pieces[i]);
}

/***************** Getters and Setters ***********************/

/**
 * Returns the game state
 */
MyMove.prototype.getGame = function () {
	return this.game;
}

/**
 * Sets the piece that was played
 * @param piece
 */
MyMove.prototype.setPiece = function (piece) {
	this.piece = piece;
	this.srcTile = piece.getTile();
}

/**
 * Returns the piece that was played
 */
MyMove.prototype.getPiece = function () {
	return this.piece;
}

/**
 * Returns the pieces that were surrounded
 */
MyMove.prototype.getSurroundedPieces = function() {
	return this.surroundedPieces;
}

/**
 * Sets source position
 * @param srcPos
 */
MyMove.prototype.setSrcPos = function (srcPos) {
	this.srcPos = srcPos;
}

/**
 * Returns source position
 */
MyMove.prototype.getSrcPos = function () {
	return this.srcPos;
}

/**
 * Sets destination tile
 * @param dstTile
 */
MyMove.prototype.setDstTile = function (dstTile) {
	this.dstTile = dstTile;
}

/**
 * Returns the destination tile
 */
MyMove.prototype.getDstTile = function () {
	return this.dstTile;
}

/**
 * Returns the destination tile's position
 */
MyMove.prototype.getDstPos = function () {
	return this.dstTile.getPos();
}