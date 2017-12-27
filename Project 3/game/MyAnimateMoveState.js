/**
 * MyPlayer
 * @constructor
 */

function MyAnimateMoveState(game,scene,move) {
	this.game = game;
	this.scene = scene;
	this.move = move;
	this.selectedPiece = move.getPiece();

	this.game.addMove(move);

	this.selectedPiece.setMoveAnimation(this.move.getDstTile().getPos());
}

MyAnimateMoveState.prototype = Object.create(CGFobject.prototype);
MyAnimateMoveState.prototype.constructor = MyAnimateMoveState;



MyAnimateMoveState.prototype.display = function (){

	this.scene.pushMatrix();

	let pieces = this.game.getPieces();


	for(let j = 0; j < pieces.length; j++){
		pieces[j].display();
	}

	this.scene.popMatrix();
}


MyAnimateMoveState.prototype.update = function (currTime){
	if(this.selectedPiece){
		this.selectedPiece.update(currTime);
	}

	if(this.selectedPiece){
		if(this.selectedPiece.getPlaced()){
			this.selectedPiece = null;
			this.setNextState();
		}
	}
}

MyAnimateMoveState.prototype.setNextState = function () {
	this.game.setState(new MyAnimateClearState(this.game,this.scene));
}