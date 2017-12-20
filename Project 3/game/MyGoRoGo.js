/**
 * MyGoRoGo
 * @constructor
 */
function MyGoRoGo(scene) {
    CGFobject.call(this, scene);
    this.scene = scene;
    //this.client= new Client(8081);
    this.pieces = [];
    this.tiles = [];

    this.initializeBoard();
	
	this.selectedPiece = null;
	
    this.marker = new MyInfoMarker(scene);

    //this.highlightedTiles = [];

    // this.cellAppearance = new CGFappearance(this.scene);
    // this.cellAppearance.loadTexture('../res/transparent.png');
    //
    // this.highlightAppearance = new CGFappearance(this.scene);
    // this.highlightAppearance.loadTexture('../res/ice.jpg');
    //
    // this.cellShader = new CGFshader(this.scene.gl, "shaders/transparent.vert", "shaders/transparent.frag");
    // this.cellShader.setUniformsValues({
    //     uSampler2: 1,
    // });
    //
    // this.selectedShader = new CGFshader(this.scene.gl, "shaders/selected.vert", "shaders/selected.frag");
    this.initTime = null;
  	this.lastCurrTime = null;
  	this.delta = 0;
}

MyGoRoGo.prototype = Object.create(CGFobject.prototype);
MyGoRoGo.prototype.constructor = MyGoRoGo;

/**
 * Sets nodes board and initializes all tiles and pieces accordingly to the board.
 * @param data
 */
 MyGoRoGo.prototype.initializeBoard = function () {
   for (let i = -7; i <= 7; i+=3.5) {
     for(let j = -7; j <= 7; j+=3.5){
       this.tiles.push(new MyTile(this.scene, i, j));
     }
   }


   for (let i = -6; i <= 6; i+=2.6) {
     for(let j = -16; j <= -13; j+=2.6){
       this.pieces.push(new MyPiece(this.scene, i, j));
     }
   }

   for (let i = -6; i <= 6; i+=2.6) {
     for(let j = 16; j >= 13; j-=2.6){
       this.pieces.push(new MyPiece(this.scene, i, j));
     }
   }

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
MyGoRoGo.prototype.resetGame = function () {
    this.pieces = [];
    this.tiles = [];
    this.resetHighlights();

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

MyGoRoGo.prototype.logPicking = function ()
{
	if (this.scene.pickMode == false) {
		if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
			for (var i=0; i< this.scene.pickResults.length; i++) {
				var obj = this.scene.pickResults[i][0];
				if (obj)
				{
					var customId = this.scene.pickResults[i][1];
					if(obj instanceof MyTile){
						console.log("instanceof MyTile");
						if(this.selectedPiece != null){
							console.log("Selected Dest Tile");
							this.selectedPiece.setAnimation(obj.getCoords());
						}
					}
					
					if(obj instanceof MyPiece){
						console.log("instanceof MyPiece");
						if(this.selectedPiece == null){
							console.log("Selected Piece");
							this.selectedPiece = obj;
							console.log(this.selectedPiece);
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
 * Displays nodes and all its elements
 */
MyGoRoGo.prototype.display= function(){
        this.logPicking();
        this.scene.clearPickRegistration();
        this.scene.pushMatrix();

		let i = 0;
        for(i = 0; i < this.tiles.length; i++){
			this.scene.registerForPick(i+1, this.tiles[i]);
            this.tiles[i].display();
        }

        for(let j = 0; j < this.pieces.length; j++){
			this.scene.registerForPick(j+i+1, this.pieces[j]);
            this.pieces[j].display();
        }

        this.marker.display();
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
	
	if(this.selectedPiece){
		this.selectedPiece.update(currTime);
	}
	
	
	/*
    if (this.initialTime == 0) {
        this.initialTime = currTime;
    }
    this.elapsedTime = (currTime - this.initialTime)/1000;

        var diff = this.elapsedTime - this.currentMove.getInitialTime();
        if(diff > this.currentMove.getAnimation().getSpan()) {
            this.currentMove.getPiece().setAnimation(null);
            this.currentMove.movePiece();
            this.nextMove();
		} else {
            this.currentMove.display(diff);
    }
	*/
		
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
 * This function removes the selection in all highlighted pieces
 */
MyGoRoGo.prototype.deselectPieces = function () {
    for(var i = 0; i < this.pieces.length; i++){
        this.pieces[i].setSelected(false);
    }
}
