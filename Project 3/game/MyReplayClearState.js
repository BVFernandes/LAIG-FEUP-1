
/**
 * MyReplayClearState
 * @constructor
 */

function MyReplayClearState(game,scene) {
	
	this.game = game;
	this.scene = scene;
	this.replayEnded = false;

	let previousMove = this.game.getCurrentMove();
	
	this.nextMove = this.game.getNextMove();
	
	this.game.setGame(this.nextMove.getGame());
	
	this.surroundedPieces = previousMove.getSurroundedPieces();
	
	for(let i = 0; i < this.surroundedPieces.length; i++){
		this.surroundedPieces[i].setClearAnimation();
	}
}

MyReplayClearState.prototype = Object.create(CGFobject.prototype);
MyReplayClearState.prototype.constructor = MyReplayClearState;



MyReplayClearState.prototype.display = function (){

	this.scene.pushMatrix();

	let pieces = this.game.getPieces();

	for(let j = 0; j < pieces.length; j++){
		pieces[j].display();
	}

	this.scene.popMatrix();
}


MyReplayClearState.prototype.update = function (currTime){
	
	if(this.replayEnded)
		return;
	
	let cleared = 0;
	
	for(let i = 0; i < this.surroundedPieces.length; i++){
		this.surroundedPieces[i].update(currTime);
		if(this.surroundedPieces[i].getCleared()){
			cleared++;
		}
	}

	if(this.surroundedPieces.length == cleared){
		this.setNextState();
	}
	
}

MyReplayClearState.prototype.setNextState = function () {
	if(this.nextMove.getPiece() == null){
		alert("End of replay");
		this.replayEnded = true;
	}
	else
		this.game.setState(new MyAnimateMoveState(this.game,this.scene,this.nextMove, true));
}