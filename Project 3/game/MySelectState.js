/**
 * MyPlayer
 * @constructor
 */

function MySelectState(game,scene) {
	this.game = game;
	this.scene = scene;
	this.selectedPiece = null;
	this.validTiles = [];
	this.picking = true;

	if(this.game.getCurrentPlayer().isBot()){
		this.picking = false;
		this.getBotPlay();
	}
}

MySelectState.prototype = Object.create(CGFobject.prototype);
MySelectState.prototype.constructor = MySelectState;


MySelectState.prototype.logPicking = function ()
{
	if (this.scene.pickMode == false) {
		if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
			for (let i=0; i< this.scene.pickResults.length; i++) {
				let obj = this.scene.pickResults[i][0];
				if (obj)
				{
					let customId = this.scene.pickResults[i][1];
					if(obj instanceof MyTile){
						console.log("instanceof MyTile");
						if(this.selectedPiece != null){
							console.log("Selected Dest Tile");
							obj.setPiece(this.selectedPiece);
							this.game.getBoard().setElementAt(obj.getBoardPos(),this.game.getCurrentPlayerStr(), this.selectedPiece.getType());
							this.game.getCurrentPlayer().decreasePieces(this.selectedPiece.getType());
							let move = new MyMove(this.selectedPiece, this.selectedPiece.getPos(), obj);
							this.setNextState(move);
						}
					}

					if(obj instanceof MyPiece){
						console.log("instanceof MyPiece");
						if(this.selectedPiece == null){
							console.log("Selected Piece");
							this.selectedPiece = obj;
							this.getValidTiles();
						}
						else if(this.selectedPiece == obj){
							this.selectedPiece = null;
							this.validTiles = [];
						}

					}
					console.log("Picked object: " + obj + ", with pick id " + customId);
				}
			}
			this.scene.pickResults.splice(0,this.scene.pickResults.length);
		}
	}
}

MySelectState.prototype.display = function (){
	this.logPicking();
	this.scene.clearPickRegistration();

	this.scene.pushMatrix();

	let pieces = this.game.getPieces();

	let pickingIdx = 1;

	for(i = 0; i < this.validTiles.length; i++){
		this.scene.registerForPick(pickingIdx, this.validTiles[i]);
		this.validTiles[i].display();
		pickingIdx++;
		this.scene.clearPickRegistration();
	}

	for(let j = 0; j < pieces.length; j++){
		if(this.isPieceSelectable(pieces[j])){
			this.scene.registerForPick(pickingIdx, pieces[j]);
			pickingIdx++;
		}
		pieces[j].display();
		this.scene.clearPickRegistration();
	}


	this.scene.popMatrix();
}


MySelectState.prototype.update = function (currTime){

}

MySelectState.prototype.updateGame = function () {

	let gorogo = this.game;

	let encodedGame = gorogo.toPlString();
	let request = "updateGame("+encodedGame+")";


	gorogo.client.makeRequest(request, function(data){
		console.log(data.target.response);
	});
}

MySelectState.prototype.getValidTiles = function () {
	let state = this;
	let gorogo = this.game;

	let encodedGame = gorogo.toPlString();

	let request = "getValidPlays("+encodedGame+","+this.selectedPiece.getType()+","+this.game.getTurn()+")";

	gorogo.client.makeRequest(request, function(data){
		console.log(data.target.response);	
		state.setValidTiles(state.parsePlays(data.target.response));
	});
}


MySelectState.prototype.getBotPlay = function () {
	let state = this;
	let gorogo = this.game;

	let encodedGame = gorogo.toPlString();

	let request = "getPlay("+encodedGame+","+this.game.getTurn()+")";

	gorogo.client.makeRequest(request, function(data){
		console.log(data.target.response);	
		let play = state.parsePlay(data.target.response);
		let piece = gorogo.getPieceOfType(play[1]);
		let dstTile = gorogo.getTileAt(play[0]);
		dstTile.setPiece(piece);
		gorogo.getBoard().setElementAt(dstTile.getBoardPos(),gorogo.getCurrentPlayerStr(), play[1]);
		let move = new MyMove(piece, piece.getPos(), dstTile);
		state.setNextState(move);
	});
}

MySelectState.prototype.parsePlays = function (encodedPlays) {
	let plays  = encodedPlays.split(']');
	let playsLength = plays.length-2;
	let tiles = [];
	for(let i = 0; i < playsLength; i+=2){
		let pos = [parseInt(plays[i][3]),parseInt(plays[i][5])];
		tiles.push(this.game.getTileAt(pos));
	}

	return tiles;
}


MySelectState.prototype.parsePlay = function (encodedPlay) {
	let res = encodedPlay.split("|");
	let dest = [parseInt(res[0][2]),parseInt(res[0][4])];
	let type = res[1][res[1].length-1];
	return [dest,type];
}

MySelectState.prototype.isPieceSelectable = function (piece){

	let currentPlayer = this.game.getCurrentPlayerStr();

	if(this.picking){
		if(this.game.getTurn() == 1){
			return (piece.getType() == "h" && piece.getPlayer() == currentPlayer)
		}
		else {
			return (piece.getPlayer() == currentPlayer && !piece.getPlaced())
		}
	}

	return false;
}


MySelectState.prototype.setValidTiles = function (validTiles){
	this.validTiles = validTiles;
}

MySelectState.prototype.setNextState = function (move) {
	this.game.setState(new MyAnimateMoveState(this.game,this.scene,move));
}