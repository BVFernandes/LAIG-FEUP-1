/**
 * MyAnimateMoveState
 * @constructor
 */
function MyAnimateMoveState(game,scene,move,replay) {
	this.game = game;
	this.scene = scene;
	this.move = move;
	this.selectedPiece = move.getPiece();

	this.replay = replay || false;

	if(!this.replay)
		this.game.addMove(move);

	this.selectedPiece.setMoveAnimation(this.move.getDstTile().getPos());
}

MyAnimateMoveState.prototype = Object.create(CGFobject.prototype);
MyAnimateMoveState.prototype.constructor = MyAnimateMoveState;

/**
 * Displays and registers objects for picking
 */
MyAnimateMoveState.prototype.display = function (){

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

/**
 * Sets next state after the current is done
 * @param move
 */
MyAnimateMoveState.prototype.setNextState = function () {
	if(this.replay)
		this.game.setState(new MyReplayClearState(this.game,this.scene));
	else
		this.game.setState(new MyAnimateClearState(this.game,this.scene));
}

/**
 * Selects a piece according to the picking
 */
MyAnimateMoveState.prototype.logPicking = function (){

}

/**
 * Returns the next valid picking index to be used
 */
MyAnimateMoveState.prototype.getPickingIdx = function (){
	return 1;
}
