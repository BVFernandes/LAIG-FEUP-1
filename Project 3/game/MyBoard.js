/**
 * MyBoard
 * @constructor
 */

function MyBoard(scene, encoded_board) {
    CGFobject.call(this,scene);
    this.scene = scene;
    this.board = [];

    this.parseBoard(encoded_board);
    this.length = this.board.length;
}

MyBoard.prototype = Object.create(CGFobject.prototype);
MyBoard.prototype.constructor = MyBoard;

/**
 * Parse pl board to js
 * @param board_encoded
 */
MyBoard.prototype.parseBoard = function (board_encoded) {
    let startIndex=2;
    this.board=[];

    while(board_encoded.length > 1) {
        let finalIndex= board_encoded.indexOf("]");
        let lineStr = board_encoded.substring(startIndex,finalIndex);
        let lineArray = lineStr.split(",");
        this.board.push(lineArray);
        board_encoded = board_encoded.substring(finalIndex+1);
    }
};

/**
 * Puts a js board in a pl struct
 * @returns {void|XML}
 */
MyBoard.prototype.boardToProlog = function () {
    let string = JSON.stringify(this.board);
    let boardPL = string.replace(/['"]+/g, '');
    return boardPL;
}

/**
 * Check if the given coordinates are valid
 * @param Row
 * @param Col
 * @returns {boolean}
 */
MyBoard.prototype.checkValidPosition = function (Row, Col) {
    if(Row < 0 || Col <  0 || Col >= this.length || Row >= this.length)
        return false;
    return true;
}

/**
 * Updates board positions
 * @param srcRow
 * @param srcCol
 * @param dstRow
 * @param dstCol
 * @param element
 */
MyBoard.prototype.updatePiecePosition = function (dstRow, dstCol, element) {
    this.setElementAt(dstRow, dstCol, element);
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
 * @param encoded_board
 */
MyBoard.prototype.setBoard = function (encoded_board) {
    this.parseBoard(encoded_board);
    this.length = this.board.length;
}

/**
 * Returns board length
 * @returns {Number|*}
 */
MyBoard.prototype.getBoardLength = function () {
    return this.length;
}

/**
 * Returns current element at the given coordinates
 * @param Row
 * @param Col
 * @returns {*}
 */
MyBoard.prototype.getElementAt = function (Row, Col) {
    if(!this.checkValidPosition(Row, Col))
        return "Invalid Position";
    return this.board[Row][Col];
}

/**
 * Sets the element at the given coordinates
 * @param Row
 * @param Col
 * @param element
 * @returns {string}
 */
MyBoard.prototype.setElementAt = function (Row, Col, element) {
    if(!this.checkValidPosition(Row, Col))
        return "Invalid Position";
    this.board[Row][Col] = element;
}
