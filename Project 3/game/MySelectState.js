/**
 * MySelectState
 * @constructor
 */
function MySelectState(game,scene) {
	this.game = game;
	this.scene = scene;

	this.selectedPiece = null;
	this.validTiles = [];

	this.pickingIdx = 0;
	this.picking = true;

	this.timeout = false;

	this.initTime = null;

	if(this.game.getCurrentPlayer().isBot()){
		this.picking = false;
		this.getBotPlay();
	}
}

MySelectState.prototype = Object.create(CGFobject.prototype);
MySelectState.prototype.constructor = MySelectState;

/**
 * Selects a piece according to the picking
 */
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
							let move = new MyMove(this.game.toPlString(),this.selectedPiece, this.selectedPiece.getPos(), obj);
							this.game.getBoard().setElementAt(obj.getBoardPos(),this.game.getCurrentPlayerStr(), this.selectedPiece.getType());
							this.game.getCurrentPlayer().decreasePieces(this.selectedPiece.getType());
							this.setNextState(move);
							this.selectedPiece.setSelected(false);
						}
					}

					if(obj instanceof MyPiece){
						console.log("instanceof MyPiece");
						if(this.selectedPiece == null){
							console.log("Selected Piece");
							this.selectedPiece = obj;
							this.selectedPiece.setSelected(true);
							this.getValidTiles();
						}
						else if(this.selectedPiece == obj){
							this.selectedPiece.setSelected(false);
							this.selectedPiece = null;
							this.validTiles = [];
						}

					}
					console.log("Picked object: " + obj + ", with pick id " + customId);
				}
			}
		}
	}
}


/**
 * Displays and registers objects for picking
 */
MySelectState.prototype.display = function (){
	
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
			this.scene.setActiveShader(this.game.selectablePieceShader);
		}
		pieces[j].display();
		if(this.isPieceSelectable(pieces[j])){
			this.scene.setActiveShader(this.scene.defaultShader);
		}
		this.scene.clearPickRegistration();
	}

	this.scene.popMatrix();

	this.pickingIdx = pickingIdx;
}

/**
 * Updates state
 * @param currTime
 */
MySelectState.prototype.update = function (currTime){
	let tFactor = Math.abs(Math.sin(currTime*Math.pow(10,-3)));
	this.game.getSelectedPieceShader().setUniformsValues({timeFactor: tFactor});

	if(this.game.getTurnTimeout() == 0 || this.timeout)
		return;

	if(!this.initTime)
		this.initTime =currTime;

	this.game.setTimeout(this.game.getTurnTimeout() - (currTime-this.initTime)/1000);
	if(this.game.getTimeout() < 0){
		console.log("Time's up");
		this.picking = false;
		this.timeout = true;
		if(this.selectedPiece != null)
			this.selectedPiece.setSelected(false);
		this.getBotPlay();
	}
}

/**
 * Makes a request to the prolog server to find what tiles are valid
 */
MySelectState.prototype.getValidTiles = function () {
	let state = this;
	let gorogo = this.game;

	let encodedGame = gorogo.toPlString();

	let request = "getValidPlays("+encodedGame+","+this.selectedPiece.getType()+","+this.game.getTurn()+")";

	gorogo.client.makeRequest(request, function(data){
		state.setValidTiles(state.parsePlays(data.target.response));
	});
}

/**
 * Makes a request to the prolog server to find a bot play
 */
MySelectState.prototype.getBotPlay = function () {
	let state = this;
	let gorogo = this.game;

	let encodedGame;
	if(this.timeout)
		encodedGame = gorogo.toPlStringTypeOvl("easyBot");				//Same as a random play
	else
		encodedGame = gorogo.toPlString();

	let request = "getPlay("+encodedGame+","+this.game.getTurn()+")";

	gorogo.client.makeRequest(request, function(data){
		let play = state.parsePlay(data.target.response);
		let piece = gorogo.getPieceOfType(play[1]);
		let dstTile = gorogo.getTileAt(play[0]);
		dstTile.setPiece(piece);
		gorogo.getBoard().setElementAt(dstTile.getBoardPos(),gorogo.getCurrentPlayerStr(), play[1]);
		let move = new MyMove(encodedGame, piece, piece.getPos(), dstTile);
		state.setNextState(move);
	});
}

/**
 * Makes a request to the prolog server to find what tiles are valid
 */
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

/**
 * Returns the parsed result of an enconded play response from the prolog server
 * @param encodedPlay
 */
MySelectState.prototype.parsePlay = function (encodedPlay) {
	let res = encodedPlay.split("|");
	let dest = [parseInt(res[0][2]),parseInt(res[0][4])];
	let type = res[1][res[1].length-1];
	return [dest,type];
}

/**
 * Returns if a piece is selectable
 * @param piece
 */
MySelectState.prototype.isPieceSelectable = function (piece){
	let currentPlayer = this.game.getCurrentPlayerStr();

	if(this.picking){
		if(this.game.getTurn() == 1){
			return (piece.getType() == "h" && piece.getPlayer().getName() == currentPlayer)
		}
		else {
			return (piece.getPlayer().getName() == currentPlayer && !piece.getPlaced())
		}
	}

	return false;
}

/**
 * Sets valid tiles to @param validTiles
 * @param validTiles
 */
MySelectState.prototype.setValidTiles = function (validTiles){
	this.validTiles = validTiles;
}

/**
 * Sets next state after the current is done
 * @param move
 */
MySelectState.prototype.setNextState = function (move) {
	this.game.setState(new MyAnimateMoveState(this.game,this.scene,move));
}

/**
 * Returns the next valid picking index to be used
 */
MySelectState.prototype.getPickingIdx = function (){
	return this.pickingIdx;
}
