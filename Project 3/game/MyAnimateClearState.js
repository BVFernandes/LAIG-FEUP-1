MyAnimateClearState.state = {
		INIT: 					0,
		CLEAR_BOARD_SELF:		1,
		CHANGE_PLAYER:			2,
		CLEAR_BOARD_OPPONENT:	3,
		CHECK_GAME_OVER:		4,
}

/**
 * MyAnimateClearState
 * @constructor
 */
function MyAnimateClearState(game,scene) {
	this.game = game;
	this.scene = scene;
	this.state = MyAnimateClearState.state.INIT;

	this.surroundedPieces = [];

	this.updateGame();
}

MyAnimateClearState.prototype = Object.create(CGFobject.prototype);
MyAnimateClearState.prototype.constructor = MyAnimateClearState;

/**
 * Displays and registers objects for picking
 */
MyAnimateClearState.prototype.display = function (){

	this.scene.pushMatrix();

	let pieces = this.game.getPieces();

	for(let j = 0; j < pieces.length; j++){
		pieces[j].display();
	}

	this.scene.popMatrix();
}

/**
 * Updates state
 * @param currTime
 */
MyAnimateClearState.prototype.update = function (currTime){

	for(let i = 0; i < this.surroundedPieces.length; i++){
		this.surroundedPieces[i].update(currTime);
		if(this.surroundedPieces[i].getCleared()){
			this.surroundedPieces.splice(i,1);
			i--;
		}
	}

	if(this.surroundedPieces.length == 0){
		if(this.state == MyAnimateClearState.state.CLEAR_BOARD_SELF){
			this.game.setNextPlayer();
			this.updateState();
			this.updateGame();

		}
		else if(this.state == MyAnimateClearState.state.CLEAR_BOARD_OPPONENT){
			this.updateState();
			this.endOfGame();
		}
	}
}

/**
 * Updates current state
 */
MyAnimateClearState.prototype.updateState = function (){
	switch(this.state){
	case MyAnimateClearState.state.INIT:
		this.state = MyAnimateClearState.state.CLEAR_BOARD_SELF;
		break;

	case MyAnimateClearState.state.CLEAR_BOARD_SELF:
		this.state = MyAnimateClearState.state.CHANGE_PLAYER;
		break;

	case MyAnimateClearState.state.CHANGE_PLAYER:
		this.state = MyAnimateClearState.state.CLEAR_BOARD_OPPONENT;
		break;

	case MyAnimateClearState.state.CLEAR_BOARD_OPPONENT:
		this.state = MyAnimateClearState.state.CHECK_GAME_OVER;
		break;
	}
}

/**
 * Makes a request to the prolog server to find if the game has ended and who is the winner
 */
MyAnimateClearState.prototype.endOfGame = function () {
	let state = this;
	let gorogo = this.game;

	let encodedGame = gorogo.toPlString();

	let request = "endOfGame("+encodedGame+")";

	gorogo.client.makeRequest(request, function(data){
		let winner = data.target.response;
		if(winner != "none"){
			//TRATAR AQUI DO FINAL DE JOGO
			let winnerString = "Winner is "+winner+"!";
			alertify.alert('Winner',winnerString);
			gorogo.addMove(new MyMove(encodedGame,null,null,null));
			gorogo.setGameOver(true);
		}
		else{
			gorogo.setNextTurn();
			state.setNextState();
		}
	});
}

/**
 * Makes a request to the prolog server to update the game
 */
MyAnimateClearState.prototype.updateGame = function () {
	let state = this;
	let gorogo = this.game;

	let encodedGame = gorogo.toPlString();

	let request = "updateGameWithPoints("+encodedGame+")";

	gorogo.client.makeRequest(request, function(data){
		console.log(data.target.response);
		let res = state.parseUpdate(data.target.response);
		gorogo.setGame(res[0]);
		let pieces = gorogo.clearSurroundedPieces(res[1]);
		gorogo.getLatestMove().addSurroundedPieces(pieces);
		state.setSurroundedPieces(pieces);
		state.updateState();
	});
}

/**
 * Returns the parsed result of an enconded updated game response from the prolog server
 * @param encodedUpdate
 */
MyAnimateClearState.prototype.parseUpdate = function (encodedUpdate) {
	let res = encodedUpdate.split('!');
	let encodedGame = res[0].slice(0,-1);
	encodedGame += "]";

	let encodedPoints = (res[1].slice(0,-1)).split(']');
	let pointsLength = encodedPoints.length-1;
	let points = [];
	for(let i = 0; i < pointsLength; i++){
		points.push([parseInt(encodedPoints[i][2]), parseInt(encodedPoints[i][4])]);
	}

	return [encodedGame,points];
}

/**
 * Sets surrounded pieces to @param pieces
 * @param pieces
 */
MyAnimateClearState.prototype.setSurroundedPieces = function (pieces){
	this.surroundedPieces = pieces;
}

/**
 * Sets next state after the current is done
 * @param move
 */
MyAnimateClearState.prototype.setNextState = function () {
	this.game.setState(new MySelectState(this.game,this.scene));
}

/**
 * Selects a piece according to the picking
 */
MyAnimateClearState.prototype.logPicking = function () {

}

/**
 * Returns the next valid picking index to be used
 */
MyAnimateClearState.prototype.getPickingIdx = function () {
	return 1;
}
