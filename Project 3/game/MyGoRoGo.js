/**
 * MyGoRoGo
 * @constructor
 */
function MyGoRoGo(scene) {
	CGFobject.call(this, scene);
	this.scene = scene;
	this.client = new Client(8081);
	this.pieces = [];
	this.tiles = [];

	this.initVisualComponents();

	this.marker = new MyInfoMarker(scene, this);
	this.board = new MyBoard();
	this.startMovieObj = new MyStartMovie(scene);
	this.startGameObj = new MyStartGame(scene);
	this.tvScene = new MyTVScene(scene);
	this.christmasScene = new MyChristmasScene(scene);

	this.turn;
	this.gameOver = false;

	this.turnTimeout = 0;
	this.timeout = 0;

	this.initTime = null;
	this.lastCurrTime = null;
	this.delta = 0;

	this.moves = [];
	this.currMove = 0;

	this.initializePlayers();
	this.initializeBoard();
	this.togglePlayer1Obj = new MyTogglePlayer(scene,this.whitePlayer);
	this.togglePlayer2Obj = new MyTogglePlayer(scene,this.blackPlayer);

	this.state = null;
}

MyGoRoGo.prototype = Object.create(CGFobject.prototype);
MyGoRoGo.prototype.constructor = MyGoRoGo;

/**
 * Sets gorogo board and initializes all tiles and pieces accordingly to the board.
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

	for (let i = -5; i <= 5; i+=2.5) {
		for(let j = -16; j <= -13; j+=2.6){
			this.pieces.push(new MyPiece(this.scene, this.selectedPieceShader, "n", i, j, this.blackPlayer));
		}
	}

	for(let i = -1.75; i <= 1.75; i+=2.5)
		this.pieces.push(new MyPiece(this.scene, this.selectedPieceShader, "h", i, -18.8, this.blackPlayer));

	for (let i = -5; i <= 5; i+=2.5) {
		for(let j = 16; j >= 13; j-=2.6){
			this.pieces.push(new MyPiece(this.scene, this.selectedPieceShader, "n", i, j, this.whitePlayer));
		}
	}

	for(let i = -2.5; i <= 2.5; i+= 2.5)
		this.pieces.push(new MyPiece(this.scene, this.selectedPieceShader, "h", i, 18.8, this.whitePlayer));

}

/**
 * Initializes visual components such as shaders and materials
 */
MyGoRoGo.prototype.initVisualComponents = function() {
	this.selectedPieceShader = new CGFshader(this.scene.gl, "shaders/MyShader.vert", "shaders/MyShader.frag");
	this.selectedPieceShader.setUniformsValues({normScale: 1});
	this.selectedPieceShader.setUniformsValues({timeFactor: 0});
	this.selectedPieceShader.setUniformsValues({colour: vec3.fromValues(1,0,0)});

	this.selectablePieceShader = new CGFshader(this.scene.gl, "shaders/MyShader2.vert", "shaders/MyShader2.frag");

	this.goRoGoAppearance = new CGFtexture(this.scene,"./scenes/marker/gorogo.png");
	this.rect = new MyRectangle(this.scene,[-0.5,0.5],[0.5,-0.5]);

}
/**
 * Initializes the game accordingly to the user input and sets up a new board given by prolog via server request
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
		let res = gorogo.parseGame(data.target.response);
		gorogo.board.setBoard(res[0]);
		gorogo.whitePlayer.setPlayer(res[1]);
		gorogo.blackPlayer.setPlayer(res[2]);
		gorogo.setCurrentPlayer(res[3]);
		gorogo.setTurn(1);
		gorogo.state = new MySelectState(gorogo,scene);
	});
}

MyGoRoGo.prototype.initializePlayers = function () {
	this.whitePlayer = new MyPlayer("whitePlayer", -11, -12);
	this.blackPlayer = new MyPlayer("blackPlayer", 11, 12);
	this.currentPlayer = this.whitePlayer;
}

/**
 * Resets variables used in a gorogo game
 */
MyGoRoGo.prototype.resetPieces = function () {
	this.whitePlayer.resetStack();
	this.blackPlayer.resetStack();
	for(let i = 0; i < this.pieces.length; i++)
		this.pieces[i].resetPos();
}

/**
 * Displays and registers objects for picking
 */
MyGoRoGo.prototype.logPicking = function(){

	if(this.state)
		this.state.logPicking();

	if (this.scene.pickMode == false) {
		if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
			for (let i=0; i< this.scene.pickResults.length; i++) {
				let obj = this.scene.pickResults[i][0];
				if (obj)
				{
					let customId = this.scene.pickResults[i][1];
					if(obj instanceof MyTogglePlayer){
						console.log("MyTogglePlayer");
						if(obj.player == this.whitePlayer){
							this.whitePlayer.toggleType();
							this.scene.selectedPlayer1Type = this.whitePlayer.getTypeIdx();
						} else {
							this.blackPlayer.toggleType();
							this.scene.selectedPlayer2Type = this.blackPlayer.getTypeIdx();
						}
					}

					if(obj instanceof MyStartMovie){
						console.log("MyStartMovie");
						this.replayGame();
					}

					if(obj instanceof MyStartGame){
						console.log("MyStartGame");
						this.startGame();
					}

					if(obj instanceof MyTVScene){
						console.log("MyTVScene");
						if(this.scene.graphIdx != 1){
							this.scene.graphIdx = 1;
							this.scene.playSceneMusic();
							this.scene.interface.changeScene = true;
							this.scene.onGraphLoaded();
						}
					}

					if(obj instanceof MyChristmasScene){
						console.log("MyChristmasScene");
						if(this.scene.graphIdx != 2){
							this.scene.graphIdx = 2;
							this.scene.playSceneMusic();
							this.scene.interface.changeScene = true;
							this.scene.onGraphLoaded();
						}
					}

					console.log("Picked object: " + obj + ", with pick id " + customId);
				}
			}
			this.scene.pickResults.splice(0,this.scene.pickResults.length);
		}
	}
}

/**
 * Displays gorogo and all its elements
 */
MyGoRoGo.prototype.display = function(){
	this.logPicking();
	this.scene.clearPickRegistration();

	let pickingIdx = 1;

	if(this.state){
		this.state.display();
		pickingIdx = this.state.getPickingIdx();
	}

	this.scene.pushMatrix();
	this.marker.display();
	this.scene.popMatrix();

	this.displayObjects(pickingIdx);

	this.scene.pushMatrix();
	this.scene.translate(-46.7, 32, 20);
	this.scene.scale(40,10,40);
	this.scene.rotate(Math.PI,1,0,0);
	this.scene.rotate(Math.PI/2,0,1,0);
	this.goRoGoAppearance.bind();
	this.rect.display();
	this.goRoGoAppearance.unbind();
	this.scene.popMatrix();


}

/**
 * Displays interactable elements
 * @param pickingIdx
 */
MyGoRoGo.prototype.displayObjects = function (pickingIdx){

	this.scene.registerForPick(pickingIdx, this.tvScene);
	this.scene.pushMatrix();
	this.scene.translate(-35,20,5);
	this.scene.scale(3,3,3);
	this.tvScene.display();
	this.scene.popMatrix();
	pickingIdx++;

	this.scene.registerForPick(pickingIdx, this.christmasScene);
	this.scene.pushMatrix();
	this.scene.translate(-35,17.5,-5);
	this.scene.scale(4,4,4);
	this.christmasScene.display();
	this.scene.popMatrix();
	pickingIdx++;

	this.scene.registerForPick(pickingIdx, this.togglePlayer1Obj);
	this.scene.pushMatrix();
	this.scene.translate(-23,-2,20);
	this.togglePlayer1Obj.display();
	this.scene.popMatrix();
	pickingIdx++;

	this.scene.registerForPick(pickingIdx, this.togglePlayer2Obj);
	this.scene.pushMatrix();
	this.scene.translate(-23,-2,-20);
	this.togglePlayer2Obj.display();
	this.scene.popMatrix();
	pickingIdx++;


	this.scene.registerForPick(pickingIdx, this.startMovieObj);
	this.scene.pushMatrix();
	this.scene.translate(-23,4,20);
	this.scene.scale(1,0.8,0.8);
	this.startMovieObj.display();
	this.scene.popMatrix();
	pickingIdx++;

	this.scene.registerForPick(pickingIdx, this.startGameObj);
	this.scene.pushMatrix();
	this.scene.translate(-23,-8,-20);
	this.startGameObj.display();
	this.scene.clearPickRegistration();
}

/**
 * Updates gorogo accordingly to the current state
 * @param currTime
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

/**
 * Adds a move to saved moves
 * @param move
 */
MyGoRoGo.prototype.addMove = function (move) {
	this.moves.push(move);
}

/**
 * Returns the first piece found that belongs to the current player and is of a certain type
 * @param type
 */
MyGoRoGo.prototype.getPieceOfType = function (type) {
	for(let i = 0; i < this.pieces.length; i++){
		if(!this.pieces[i].getPlaced() && this.pieces[i].getPlayer().getName() == this.getCurrentPlayerStr() && this.pieces[i].getType() == type){
			this.getCurrentPlayer().decreasePieces(type);
			return this.pieces[i];
		}
	}
	return null;
}

/**
 * Sets clear animation to the surrounded pieces placed at board points
 * @param points
 */
MyGoRoGo.prototype.clearSurroundedPieces = function (points) {
	let pieces = [];
	for(let i = 0; i < points.length; i++){
		let piece = this.getTileAt(points[i]).getPiece();
		piece.setClearAnimation();
		pieces.push(piece);
	}

	return pieces;
}

/**
 * Returns the tile at board position
 * @param pos
 */
MyGoRoGo.prototype.getTileAt = function (pos) {
	let idx = (pos[1]-1)*this.board.getBoardLength()+pos[0]-1;
	return this.tiles[idx];
}

/**
 * Undoes the most recent move
 */
MyGoRoGo.prototype.undoMove = function () {
	if(this.state instanceof MySelectState && !this.getCurrentPlayer().isBot()){
		let move = this.getLatestMove();
		if(move){
			this.setGame(move.getGame());
			this.setPreviousTurn();
			move.resetPieces();
			this.moves.splice(this.moves.length-1,1);
			this.state = new MySelectState(this,this.scene);
		}
	}
}

/**
 * Starts the replay of the latest game played
 */
MyGoRoGo.prototype.replayGame = function () {
	if(this.gameOver){
		this.currMove = 0;
		this.resetPieces();
		let move = this.getCurrentMove();
		this.setGame(move.getGame());
		this.state = new MyAnimateMoveState(this, this.scene, move, true);
	}
}

/**
 * Returns saved moves
 */
MyGoRoGo.prototype.getMoves = function () {
	return this.moves;
}

/**
 * Returns the current move, pointed by currMove
 */
MyGoRoGo.prototype.getCurrentMove = function () {
	return this.moves[this.currMove];
}

/**
 * Returns the next move, increasing the move pointer
 */
MyGoRoGo.prototype.getNextMove = function () {
	this.currMove++;
	return this.moves[this.currMove];
}

/**
 * Returns the latest move saved
 */
MyGoRoGo.prototype.getLatestMove = function () {
	let movesNo = this.moves.length;
	if(movesNo)
		return this.moves[movesNo-1];
	else
		return null;
}

/**
 * Sets the state to a new state
 * @param state
 */
MyGoRoGo.prototype.setState = function (state) {
	this.state = state;
}

/**
 * Returns the parsed result of an enconded game response from the prolog server
 * @param encondedGame
 */
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

/**
 * Returns shader used when a piece is selected
 */
MyGoRoGo.prototype.getSelectedPieceShader = function () {
	return this.selectedPieceShader;
}

/**
 * Returns current player
 */
MyGoRoGo.prototype.getCurrentPlayer = function () {
	return this.currentPlayer;
}

/**
 * Returns current player's string
 */
MyGoRoGo.prototype.getCurrentPlayerStr = function () {
	return this.currentPlayer.getName();
}

/**
 * Sets current player according to player string
 * @param player
 */
MyGoRoGo.prototype.setCurrentPlayer = function (player) {
	if(player == "whitePlayer")
		this.currentPlayer = this.whitePlayer;
	else
		this.currentPlayer = this.blackPlayer;
}

/**
 * Sets next player
 */
MyGoRoGo.prototype.setNextPlayer = function () {
	if(this.currentPlayer == this.whitePlayer)
		this.currentPlayer = this.blackPlayer;
	else
		this.currentPlayer = this.whitePlayer;
}

/**
 * Returns enconded game in prolog format
 */
MyGoRoGo.prototype.toPlString = function () {
	return "[" + this.board.toPlString() + "," + this.whitePlayer.toPlString() + "," + this.blackPlayer.toPlString() + "," + this.getCurrentPlayerStr()+ "]";
}

/**
 * Returns enconded game in prolog format with current player's type overloaded to @param newType
 * @param newType
 */
MyGoRoGo.prototype.toPlStringTypeOvl = function (newType) {
	let previousType = this.currentPlayer.getType();

	this.currentPlayer.setType(newType);

	let encodedGame = "[" + this.board.toPlString() + "," + this.whitePlayer.toPlString() + "," + this.blackPlayer.toPlString() + "," + this.getCurrentPlayerStr()+ "]";

	this.currentPlayer.setType(previousType);

	return encodedGame;
}

/**
 * Sets game attributes according to @param encodedGame received from prolog server
 * @param encodedGame
 */
MyGoRoGo.prototype.setGame = function (encodedGame) {
	let res = this.parseGame(encodedGame);
	this.board.setBoard(res[0]);
	this.whitePlayer.setPlayer(res[1]);
	this.blackPlayer.setPlayer(res[2]);
	this.setCurrentPlayer(res[3]);
}

/**
 * Sets GameOver to @param state
 * @param state
 */
MyGoRoGo.prototype.setGameOver = function (state) {
	this.gameOver = state;
}

/****************************************** Getters and setters  ******************************************************/

/**
 * Returns board
 * @returns {Board}
 */
MyGoRoGo.prototype.getBoard = function(){
	return this.board;
}

/**
 * Returns tiles
 */
MyGoRoGo.prototype.getTiles = function(){
	return this.tiles;
}

/**
 * Returns pieces
 */
MyGoRoGo.prototype.getPieces = function(){
	return this.pieces;
}

/**
 * Returns current turn
 */
MyGoRoGo.prototype.getTurn = function(){
	return this.turn;
}

/**
 * Sets turn to @param turn
 * @param turn
 */
MyGoRoGo.prototype.setTurn = function(turn){
	this.turn = turn;
}

/**
 * Sets next turn
 */
MyGoRoGo.prototype.setNextTurn = function(){
	this.turn++;
}

/**
 * Sets previous turn
 */
MyGoRoGo.prototype.setPreviousTurn = function(){
	this.turn--;
}

/**
 * Returns timeout value
 */
MyGoRoGo.prototype.getTurnTimeout = function(){
	return this.turnTimeout;
}

/**
 * Returns time left until timeout to @param time
 * @param time
 */
MyGoRoGo.prototype.setTimeout = function(time){
	this.timeout = time;
}

/**
 * Returns time left until timeout
 */
MyGoRoGo.prototype.getTimeout = function(){
	return this.timeout;
}
