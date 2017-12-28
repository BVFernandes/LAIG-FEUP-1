/**
 * MyGoRoGo
 * @constructor
 */
function MyGoRoGo(scene) {
	CGFobject.call(this, scene);
	this.scene = scene;
	this.client= new Client(8081);
	this.pieces = [];
	this.tiles = [];

	this.marker = new MyInfoMarker(scene, this);
	this.board = new MyBoard();
	this.togglePlayerObj = new MyTogglePlayer(scene);
	this.startMovieObj = new MyStartMovie(scene);
	this.startGameObj = new MyStartGame(scene);

  this.selectedPieceShader = new CGFshader(this.scene.gl, "shaders/MyShader.vert", "shaders/MyShader.frag");
	this.selectedPieceShader.setUniformsValues({normScale: 1});
	this.selectedPieceShader.setUniformsValues({timeFactor: 0});
	this.selectedPieceShader.setUniformsValues({colour: vec3.fromValues(1,0,0)});
	
	this.myShader2 = new CGFshader(this.scene.gl, "shaders/MyShader.vert", "shaders/MyShader.frag");
	// this.selectedShader = new CGFshader(this.scene.gl, "shaders/selected.vert", "shaders/selected.frag");

	this.turn;
	this.gameOver = false;
	this.turnTimeout = 0;
	this.initTime = null;
	this.lastCurrTime = null;
	this.delta = 0;
	this.requestStatus = null;

	this.moves = [];
	this.currMove = 0;

	this.initializePlayers();
	this.initializeBoard();

	this.state = null;
}

MyGoRoGo.prototype = Object.create(CGFobject.prototype);
MyGoRoGo.prototype.constructor = MyGoRoGo;

/**
 * Sets nodes board and initializes all tiles and pieces accordingly to the board.
 * @param data
 */
MyGoRoGo.prototype.initializeBoard = function () {
	this.pieces = [];
	this.tiles = [];

	for (let i = -7; i <= 7; i+=3.5) {
		for(let j = -7; j <= 7; j+=3.5){
			this.tiles.push(new MyTile(this.scene, j, i));
		}
	}


	for (let i = -6; i <= 6; i+=2.6) {
		for(let j = -16; j <= -13; j+=2.6){
			this.pieces.push(new MyPiece(this.scene, this.selectedPieceShader, "n", i, j, this.blackPlayer));
		}
	}


	for(let i = -1.75; i <= 1.75; i+=2.5)
		this.pieces.push(new MyPiece(this.scene, this.selectedPieceShader, "h", i, -18.5, this.blackPlayer));


	for (let i = -6; i <= 6; i+=2.6) {
		for(let j = 16; j >= 13; j-=2.6){
			this.pieces.push(new MyPiece(this.scene, this.selectedPieceShader, "n", i, j, this.whitePlayer));
		}
	}

	for(let i = -2.5; i <= 2.5; i+= 2.5)
		this.pieces.push(new MyPiece(this.scene, this.selectedPieceShader, "h", i, 18.5, this.whitePlayer));

}

/**
 * Initializes the game accordingly to the user input and sets up a new board given by prolog via server request
 * @param mode
 * @param difficulty
 */
MyGoRoGo.prototype.startGame = function () {
	/*
	if(!this.gameOver)
		return;
	*/

	this.resetPieces();
	this.moves = [];
	this.gameOver = false;
	this.turnTimeout = this.scene.getTurnTimeout();
	this.whitePlayer.setTypePlayer(this.scene.selectedPlayer1Type);
	this.blackPlayer.setTypePlayer(this.scene.selectedPlayer2Type);

	let gorogo = this;
	let scene = this.scene;
	this.client.makeRequest("initGame", function(data){
		console.log(data.target.response);
		let res = gorogo.parseGame(data.target.response);
		gorogo.board.setBoard(res[0]);
		gorogo.whitePlayer.setPlayer(res[1]);
		gorogo.blackPlayer.setPlayer(res[2]);
		gorogo.setCurrentPlayer(res[3]);
		gorogo.setTurn(1);
		console.log(gorogo.toPlString());
		gorogo.state = new MySelectState(gorogo,scene);
	});
}

MyGoRoGo.prototype.initializePlayers = function () {
	this.whitePlayer = new MyPlayer("whitePlayer", -11, -12);
	this.blackPlayer = new MyPlayer("blackPlayer", 11, 12);
	this.currentPlayer = this.whitePlayer;
}

/**
 * Accordingly to the picking, selects a piece
 * @param obj
 */
MyGoRoGo.prototype.selectPiece = function (obj) {
	var currentPiece = this.currentMove.getPiece();

	var pieceSelection = false;

	if(currentPiece == null){
		pieceSelection = true;
	} else if(obj != currentPiece){
		currentPiece.setSelected(false);
		pieceSelection = true;
	}

	if(pieceSelection)
	{
		obj.setSelected(true);
		this.currentMove.setPiece(obj);

		var tile = this.currentMove.getSrcTile();
		var own = this;
		own.highlightTiles(info);
	}
}

/**
 * Updates current move destiny tile, and then calls the function makeMove
 * @param dstTile
 */
MyGoRoGo.prototype.tryMovement = function (dstTile) {
	this.currentMove.setDstTile(dstTile);
	this.currentMove.makeMove(this.board, this);
}

/**
 * Adds current move to the game sequence and then creates a new Move
 */
MyGoRoGo.prototype.nextMove = function () {
	this.resetHighlights();

	var movedPiece = this.currentMove.getPiece();

	this.currentMove.getPiece().setSelected(false);

	this.currentMove = new Move(this.scene, null, null, null);
}

/**
 * Resets variables used in a nodes game
 */
MyGoRoGo.prototype.resetPieces = function () {
	this.whitePlayer.resetStack();
	this.blackPlayer.resetStack();
	for(let i = 0; i < this.pieces.length; i++)
		this.pieces[i].resetPos();
}

/**
 * Highlights tiles where it is possible to move the current selected piece
 * @param validMoves
 */
MyGoRoGo.prototype.highlightTiles = function (validMoves) {
	this.resetHighlights();

	for(var i = 0; i < validMoves.length; i++){
		var tile = this.getTileFromCoords(validMoves[i]);
		if(tile != false){
			tile.setHighlight(true);
			this.highlightedTiles.push(tile);
		}
	}
}

/**
 * Removes all highlights
 */
MyGoRoGo.prototype.resetHighlights = function () {
	for(tile of this.highlightedTiles){
		tile.setHighlight(false);
	}
	this.highlightedTiles = [];
}


/**
 * Displays nodes and all its elements
 */
MyGoRoGo.prototype.display = function(){
	if(this.state)
		this.state.display();

	this.scene.pushMatrix();
	this.marker.display();
	this.scene.translate(0,0,20);
	this.togglePlayerObj.display();
	this.startMovieObj.display();
	this.startGameObj.display();
	this.scene.popMatrix();
}


/**
 * Updates nodes accordingly to the current state
 * @param currTime
 * @param player1
 * @param player2
 */

MyGoRoGo.prototype.update = function(currTime) {
	this.lastCurrTime = currTime;

	if(!this.initTime){
		this.initTime = currTime;
	}

	this.delta = (currTime - this.initTime)/1000;

	if(this.state)
		this.state.update(currTime);

	this.marker.updateTime(this.delta);

}

/****************************************** Getters and setters  ******************************************************/

/**
 * Returns the current board in use
 * @returns {Board}
 */
MyGoRoGo.prototype.getBoard = function(){
	return this.board;
}

/**
 * Returns the current board in use
 * @returns {Board}
 */
MyGoRoGo.prototype.getTiles = function(){
	return this.tiles;
}

MyGoRoGo.prototype.getPieces = function(){
	return this.pieces;
}


MyGoRoGo.prototype.getTurn = function(){
	return this.turn;
}

MyGoRoGo.prototype.setTurn = function(turn){
	this.turn = turn;
}

MyGoRoGo.prototype.setNextTurn = function(){
	this.turn++;
}

MyGoRoGo.prototype.setPreviousTurn = function(){
	this.turn--;
}

MyGoRoGo.prototype.getTurnTimeout = function(){
	return this.turnTimeout;
}

/**
 * Given a string Row-Col, returns the tile in that position
 * @param coords
 * @returns {*}
 */
MyGoRoGo.prototype.getTileFromCoords = function (coords) {
	for(var i = 0; i < this.tiles.length; i++){
		if(this.tiles[i].getCoordinatesAsString() == coords)
			return this.tiles[i];
	}
	return false;
}


/**
 * Given a string Row-Col, returns the tile in that position
 * @param coords
 * @returns {*}
 */
MyGoRoGo.prototype.addMove = function (move) {
	this.moves.push(move);
}

MyGoRoGo.prototype.getPieceOfType = function (type) {
	for(let i = 0; i < this.pieces.length; i++){
		if(!this.pieces[i].getPlaced() && this.pieces[i].getPlayer().getName() == this.getCurrentPlayerStr() && this.pieces[i].getType() == type){
			this.getCurrentPlayer().decreasePieces(type);
			return this.pieces[i];
		}
	}
	return null;
}

MyGoRoGo.prototype.clearSurroundedPieces = function (points) {

	let pieces = [];
	for(let i = 0; i < points.length; i++){
		let piece = this.getTileAt(points[i]).getPiece();
		piece.setClearAnimation();
		pieces.push(piece);
	}

	return pieces;
}

MyGoRoGo.prototype.getTileAt = function (pos) {
	let idx = (pos[1]-1)*this.board.getBoardLength()+pos[0]-1;
	return this.tiles[idx];
}

MyGoRoGo.prototype.undoMove = function () {

	if(this.state instanceof MySelectState && !this.getCurrentPlayer().isBot()){
		let move = this.getLatestMove();
		if(move){
			//console.log(move);
			//console.log(move.getGame());
			this.setGame(move.getGame());
			this.setPreviousTurn();
			move.resetPieces();
			this.moves.splice(this.moves.length-1,1);
			this.state = new MySelectState(this,this.scene);
		}
	}
}

MyGoRoGo.prototype.replayGame = function () {
	if(this.gameOver){
		console.log("Replay Game");
		this.currMove = 0;
		this.resetPieces();
		let move = this.getCurrentMove();
		this.setGame(move.getGame());
		this.state = new MyAnimateMoveState(this, this.scene, move, true);
	}
}

MyGoRoGo.prototype.getMoves = function () {
	return this.moves;
}

MyGoRoGo.prototype.getCurrentMove = function () {
	return this.moves[this.currMove];
}

MyGoRoGo.prototype.getNextMove = function () {
	this.currMove++;
	return this.moves[this.currMove];
}

MyGoRoGo.prototype.getLatestMove = function () {
	movesNo = this.moves.length;
	if(movesNo)
		return this.moves[movesNo-1];
	else
		return null;
}

MyGoRoGo.prototype.setState = function (state) {
	this.state = state;
}


MyGoRoGo.prototype.parseGame = function (encondedGame) {
	let encodedBoard = encondedGame.slice(2,61);

	let start = 64;
	let i = start;
	while(encondedGame[i] != ']')
		i++;

	let encodedWhite = encondedGame.slice(start,i);

	i += 3;
	start = i;
	while(encondedGame[i] != ']')
		i++;

	let encodedBlack = encondedGame.slice(start,i);

	i += 2;
	start = i;
	while(encondedGame[i] != ']')
		i++;

	let curr = encondedGame.slice(start,i);

	return [encodedBoard,encodedWhite,encodedBlack,curr];
}

MyGoRoGo.prototype.getSelectedPieceShader = function () {
	return this.selectedPieceShader;
}

MyGoRoGo.prototype.getCurrentPlayer = function () {
	return this.currentPlayer;
}

MyGoRoGo.prototype.getCurrentPlayerStr = function () {
	return this.currentPlayer.getName();
}


MyGoRoGo.prototype.setCurrentPlayer = function (player) {
	if(player == "whitePlayer")
		this.currentPlayer = this.whitePlayer;
	else
		this.currentPlayer = this.blackPlayer;
}


MyGoRoGo.prototype.setNextPlayer = function () {
	if(this.currentPlayer == this.whitePlayer)
		this.currentPlayer = this.blackPlayer;
	else
		this.currentPlayer = this.whitePlayer;
}

MyGoRoGo.prototype.toPlString = function () {
	return "[" + this.board.toPlString() + "," + this.whitePlayer.toPlString() + "," + this.blackPlayer.toPlString() + "," + this.getCurrentPlayerStr()+ "]";
}

MyGoRoGo.prototype.toPlStringTypeOvl = function (newType) {
	let previousType = this.currentPlayer.getType();
	
	this.currentPlayer.setType(newType);
	
	let encodedGame = "[" + this.board.toPlString() + "," + this.whitePlayer.toPlString() + "," + this.blackPlayer.toPlString() + "," + this.getCurrentPlayerStr()+ "]";
	
	this.currentPlayer.setType(previousType);
	
	return encodedGame;
}

MyGoRoGo.prototype.setGame = function (encodedGame) {
	let res = this.parseGame(encodedGame);
	this.board.setBoard(res[0]);
	this.whitePlayer.setPlayer(res[1]);
	this.blackPlayer.setPlayer(res[2]);
	this.setCurrentPlayer(res[3]);
}

MyGoRoGo.prototype.setGameOver = function (state) {
	this.gameOver = state;
}

/**
 * This function removes the selection in all highlighted pieces
 */
MyGoRoGo.prototype.deselectPieces = function () {
	for(var i = 0; i < this.pieces.length; i++){
		this.pieces[i].setSelected(false);
	}
}
