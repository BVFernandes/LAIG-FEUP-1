/**
 * Move
 * @constructor
 */

function MyMove(game,piece,src,dst) {
	this.game = game;
	this.piece = piece;
	this.srcPos = src;
	this.dstTile = dst;
	this.surroundedPieces = [];
	this.timer = 0;
	this.gameOver=false;
}

MyMove.prototype = Object.create(CGFobject.prototype);
MyMove.prototype.constructor = MyMove;

/**
 * Tries to make a move by requesting prolog to check if it valid
 * @param board
 * @param player
 * @param client
 * @param nodes

MyMove.prototype.makeMove = function (board, player, client, nodes) {
    if(this.dstTile.getPiece() != null || this.srcTile.getPiece() == null)
        return;

    var plBoard = board.toPrologStruct();
    var team = player.getTeam();
    var own = this;
    var request = "move("+plBoard+"," + team + "," + "Piece,"+ "FinalBoard,"+
        this.srcTile.row + "-" + this.srcTile.col + "," +
        this.dstTile.row + "-" + this.dstTile.col + ")";

    client.makeRequest(request, function(data) {
        var response = data.target.response;
        if(response=="false"){
            console.log("Move.js says: Move failed!");
            return false;
        }

        var gameOver = response.slice(-2,-1);
        var plBoard = response.slice(1,-3);
        if(gameOver=="t"){
            own.gameOver=true;
        }
        board.setBoard(plBoard);
        own.setMoveAnimation(nodes);
    });
}
 */

/**
 * Chooses an animation -> move or jump
MyMove.prototype.chooseAnimation = function(){
    var xDif = this.dstTile.row - this.srcTile.row; //offset to move in X
    var zDif = this.dstTile.col - this.srcTile.col; //offset to move in Z

    var type;
    if(Math.abs(xDif)+Math.abs(zDif) == 2)
        type="jump";
    else type="move";

    var direction;
    if(xDif==0){ //move Z
        if(zDif<0)
            direction="Z+";
        else direction="Z-";
    } else { //move X
        if(xDif<0)
            direction="X+";
        else direction="X-";
    }

    var id = type+direction;
    var index = this.scene.graph.checkIfExists(this.scene.graph.animations, id);
    if (index == -1) {
        console.log("No animation found for this movement!");
    } else this.animation=this.scene.graph.animations[index];

}
 */

/**
 * displays the move animation
 * @param currTime

MyMove.prototype.display = function (currTime) {
    this.scene.pushMatrix();
    this.piece.timer=currTime;
    this.scene.popMatrix();
}
 */

/**
 * Moves a piece from source tile to destiny tile

MyMove.prototype.movePiece = function() {
    this.srcTile.setPiece(null);
    this.dstTile.setPiece(this.piece);
    this.piece.setTile(this.dstTile);
};
 */

/**
 * Switch source and destiny tiles

MyMove.prototype.switchTiles = function () {
    var aux = this.srcTile;
    this.srcTile = this.dstTile;
    this.dstTile = aux;
    this.piece.setSelected(true);
}
 */
 
 MyMove.prototype.resetPieces = function() {
	this.piece.resetPos();
	for(let i = 0; i < this.surroundedPieces.length; i++)
		this.surroundedPieces[i].setCleared(false);
}
 
 MyMove.prototype.addSurroundedPieces = function(pieces) {
	this.surroundedPieces = this.surroundedPieces.concat(pieces);
}

/***************** Getters and Setters ***********************/

/**
 * Checks if occurred game over with this move
 * @returns {boolean}
 */
MyMove.prototype.isGameOver = function() {
	return this.gameOver;
}


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

/**
 * Sets move animation
 * @param nodes
 */
MyMove.prototype.setMoveAnimation = function (nodes) {
	this.chooseAnimation();
	this.piece.setAnimation(this.animation);
	nodes.playState = Nodes.playState.MOVE_ANIMATION;
	this.timer = nodes.elapsedTime;
}

/**
 * Returns the animation used in this move
 * @returns {*|null}

MyMove.prototype.getAnimation = function () {
    return this.animation;
}
 */

/**
 * Returns initial animation time
 * @returns {*|number}

MyMove.prototype.getInitialTime = function () {
    return this.timer;
}
 */