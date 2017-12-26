/**
 * MyPlayer
 * @constructor
 */

function MySelectState(game,scene) {
	this.game = game;
	this.scene = scene;
	this.selectedPiece = null;
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
							/*console.log(this.selectedPiece);*/
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
	
	let tiles = this.game.getTiles();
	let pieces = this.game.getPieces();
	let currentPlayer = this.game.getCurrentPlayerStr();
	
	let pickingIdx = 1;
	for(i = 0; i < tiles.length; i++){
		if(this.picking){
			this.scene.registerForPick(pickingIdx, tiles[i]);
			pickingIdx++;
		}
        tiles[i].display();
		this.scene.clearPickRegistration();
    }

    for(let j = 0; j < pieces.length; j++){
		if(this.picking && pieces[j].getPlayer() == currentPlayer && !pieces[j].getPlaced()){
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


MySelectState.prototype.getBotPlay = function () {
	let state = this;
	let gorogo = this.game;
	
	let encodedGame = gorogo.toPlString();
	/*console.log(encodedGame);*/
	
	let request = "getPlay("+encodedGame+","+this.game.getTurn()+")";
	
    gorogo.client.makeRequest(request, function(data){
        console.log(data.target.response);	
		let play = state.parsePlay(data.target.response);
		let piece = gorogo.getPieceOfType(play[1]);
		let dstTile = gorogo.getTileAt(play[0]);
		/*console.log(piece);
		console.log(dstTile);*/
		dstTile.setPiece(piece);
		gorogo.getBoard().setElementAt(dstTile.getBoardPos(),gorogo.getCurrentPlayerStr(), play[1]);
		let move = new MyMove(piece, piece.getPos(), dstTile);
		state.setNextState(move);
    });
}

MySelectState.prototype.parsePlay = function (encodedPlay) {
	let res = encodedPlay.split("|");
	let dest = [parseInt(res[0][2]),parseInt(res[0][4])];
	let type = res[1][res[1].length-1];
	return [dest,type];
}

MySelectState.prototype.setNextState = function (move) {
	this.game.setState(new MyAnimateMoveState(this.game,this.scene,move));
}