MyBoard.toSymbol = {
		"clear":		0,
		"blackPlayer": 	1,
		"whitePlayer":  2,
}

/**
 * MyBoard
 * @constructor
 */
function MyBoard() {
	this.board = [];
	this.length = 5;
}

MyBoard.prototype = Object.create(CGFobject.prototype);
MyBoard.prototype.constructor = MyBoard;

/**
 * Puts a js board in a pl struct
 * @returns {void|XML}
 */
MyBoard.prototype.toPlString = function () {
	let encodedBoard = "[";
	for(let i = 0; i < this.length; i++){
		encodedBoard += "["+this.board[i].toString()+"]";
		if(i != this.length-1)
			encodedBoard += ",";
	}
	encodedBoard += "]";
	return encodedBoard;
}

/**
 * Returns the board matrix
 * @returns {Array}
 */
MyBoard.prototype.getBoard = function () {
	return this.board;
}

/**
 * Sets the board matrix
 * @param encodedBoard
 */
MyBoard.prototype.setBoard = function (encodedBoard) {
	this.board = [];

	let tempBoard = '[' + encodedBoard + ']';

	this.board = JSON.parse(tempBoard);
}

/**
 * Returns board length
 * @returns {Number|*}
 */
MyBoard.prototype.getBoardLength = function () {
	return this.length;
}

/**
 * Sets the element at the given coordinates
 * @param pos
 * @param player
 * @param element
 */
MyBoard.prototype.setElementAt = function (pos, player, type) {
	let symbol;

	if(type == "h")
		symbol = 3;
	else
		symbol = MyBoard.toSymbol[player];
		
	this.board[pos[0]-1][pos[1]-1] = symbol;
}
