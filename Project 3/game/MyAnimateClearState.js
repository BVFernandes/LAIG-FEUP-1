MyAnimateClearState.state = {
	INIT: 					0,
	CLEAR_BOARD_SELF:		1,
	CHANGE_PLAYER:			2,
	CLEAR_BOARD_OPPONENT:	3,
}

/**
 * MyPlayer
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



MyAnimateClearState.prototype.display = function (){
	
    this.scene.pushMatrix();
	
	let pieces = this.game.getPieces();

    for(let j = 0; j < pieces.length; j++){
		pieces[j].display();
    }
    
    this.scene.popMatrix();
}


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
			//console.log("Change Player");
			this.game.setNextPlayer();
			this.updateState();
			this.updateGame();
			
		}
		else if(this.state == MyAnimateClearState.state.CLEAR_BOARD_OPPONENT){
			//console.log("Update");
			this.game.setNextTurn();
			this.setNextState();
		}
	}
}

MyAnimateClearState.prototype.setSurroundedPieces = function (pieces){
	this.surroundedPieces = pieces;
}

MyAnimateClearState.prototype.updateState = function (){
	switch(this.state){
		case MyAnimateClearState.state.INIT:
			//console.log("update CLEAR_BOARD_SELF");
			this.state = MyAnimateClearState.state.CLEAR_BOARD_SELF;
			break;
			
			
		case MyAnimateClearState.state.CLEAR_BOARD_SELF:
			//console.log("update CHANGE_PLAYER");
			this.state = MyAnimateClearState.state.CHANGE_PLAYER;
			break;
			
		
		case MyAnimateClearState.state.CHANGE_PLAYER:
			//console.log("update CLEAR_BOARD_OPPONENT");
			this.state = MyAnimateClearState.state.CLEAR_BOARD_OPPONENT;
			break;
	}
}


MyAnimateClearState.prototype.updateGame = function () {
	let state = this;
	let gorogo = this.game;
	
	let encodedGame = gorogo.toPlString();
	//console.log(encodedGame);
	
	let request = "updateGameWithPoints("+encodedGame+")";
	
    gorogo.client.makeRequest(request, function(data){
        console.log(data.target.response);
		let res = state.parseUpdate(data.target.response);
		gorogo.setGame(res[0]);
		let pieces = gorogo.clearSurroundedPieces(res[1]);
		//console.log(pieces);
		state.setSurroundedPieces(pieces);
		state.updateState();
    });
}


MyAnimateClearState.prototype.parseUpdate = function (encodedUpdate) {
	let res = encodedUpdate.split('!');
	let encodedGame = res[0].slice(0,-1);
	encodedGame += "]";
	
	let encodedPoints = (res[1].slice(0,-1)).split(']');
	//console.log(encodedPoints);
	let pointsLength = encodedPoints.length-1;
	let points = [];
	for(let i = 0; i < pointsLength; i++){
		points.push([parseInt(encodedPoints[i][2]), parseInt(encodedPoints[i][4])]);
	}
	
	//console.log(points);
	return [encodedGame,points];
}

MyAnimateClearState.prototype.setNextState = function () {
    this.game.setState(new MySelectState(this.game,this.scene));
}