/**
 * MyInfoMarker
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyInfoMarker(scene,game){
	CGFobject.call(this,scene);

	this.board = new MyCube(scene);
	this.rect = new MyRectangle(scene,[-0.5,0.5],[0.5,-0.5]);

	this.time = {hours : 0, minutes : 0, seconds : 0 };
	this.timeout = {hours : 0, minutes : 0, seconds : 0 };
	this.times = [this.time, this.timeout];

	this.defaultMaterial = new CGFappearance(this.scene);
	this.defaultMaterial.setAmbient(1,1,1,1);
	this.defaultMaterial.setDiffuse(1,1,1,1);
	this.defaultMaterial.setSpecular(1,1,1,1);
	this.defaultMaterial.setShininess(10);

	this.blackMaterial = new CGFappearance(this.scene);
	this.blackMaterial.setAmbient(0,0,0,1);
	this.blackMaterial.setDiffuse(0,0,0,1);
	this.blackMaterial.setSpecular(0,0,0,1);
	this.blackMaterial.setShininess(10);

	this.timeAppearance = new CGFtexture(this.scene,"./scenes/marker/time.png");
	this.timeoutAppearance = new CGFtexture(this.scene,"./scenes/marker/timeout.png");
	this.timesAppearance = [this.timeAppearance, this.timeoutAppearance];

	this.scoreAppearance = new CGFtexture(this.scene,"./scenes/marker/score.png");
	this.setAppearance = new CGFtexture(this.scene,"./scenes/marker/set.png");
	this.totalAppearance = new CGFtexture(this.scene,"./scenes/marker/total.png");

	this.twoDotsAppearance = new CGFtexture(this.scene,"./scenes/marker/twodots.png");

	this.whiteAppearance = new CGFtexture(this.scene,"./scenes/marker/white.png");
	this.whiteSelectedAppearance = new CGFtexture(this.scene,"./scenes/marker/white_selected.png");
	this.blackAppearance = new CGFtexture(this.scene,"./scenes/marker/black.png");
	this.blackSelectedAppearance = new CGFtexture(this.scene,"./scenes/marker/black_selected.png");

	this.playersAppearance = [this.whiteAppearance, this.blackAppearance];
	this.playersSelectedAppearance = [this.whiteSelectedAppearance, this.blackSelectedAppearance];


	this.numbersTextures = [];
	for(n=0; n<=9; n++){
		let number = new CGFtexture(this.scene,'./scenes/marker/'+n+'.png');
		this.numbersTextures.push(number);
	}

	this.game=game;
	this.initTime = null;
	this.lastCurrTime = null;
	this.delta = 0;
}

MyInfoMarker.prototype = Object.create(CGFobject.prototype);
MyInfoMarker.prototype.constructor = MyInfoMarker;

/**
 * Displays infomarker
 */
MyInfoMarker.prototype.display = function () {
	this.scene.pushMatrix();
	this.scene.translate(-25,8,0);
	this.scene.rotate(Math.PI/4,0,0,1);
	this.scene.rotate(Math.PI/2,0,1,0);

	this.scene.pushMatrix(); //board
	this.scene.scale(30,20,1);
	this.blackMaterial.apply();
	this.board.display();
	this.scene.popMatrix();

	this.defaultMaterial.apply();

	this.scene.pushMatrix(); //timeout
	this.scene.translate(0,8,0);
	this.displayClock(0);
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0,4,0.51);
	this.scene.scale(5,2,1);
	this.scoreAppearance.bind();
	this.rect.display();
	this.scene.popMatrix();

	this.scene.pushMatrix(); //p1 score
	this.scene.translate(-7,-1,0);
	this.displayScore(this.game.whitePlayer);
	this.scene.popMatrix();

	this.scene.pushMatrix(); //p2 score
	this.scene.translate(7,-1,0);
	this.displayScore(this.game.blackPlayer);
	this.scene.popMatrix();

	//Set
	this.scene.pushMatrix();
	this.scene.translate(0.1,-1.5,0.51);
	this.scene.scale(5,2.5,1);
	this.setAppearance.bind();
	this.rect.display();
	this.scene.popMatrix();

	//Total
	this.scene.pushMatrix();
	this.scene.translate(0.1,-3.5,0.51);
	this.scene.scale(5,2.5,1);
	this.totalAppearance.bind();
	this.rect.display();
	this.scene.popMatrix();


	this.scene.pushMatrix(); //timeout
	this.scene.translate(0.1,-7,0);
	this.displayClock(1);
	this.scene.popMatrix();


	this.scene.popMatrix();
}

MyInfoMarker.prototype.displayClock = function(timeIdx) {
	//this.scene.pushMatrix();

	// ------------------ "time" (on z+) ------------------
	this.scene.pushMatrix();
	this.scene.translate(-10,0,0.51);
	this.scene.scale(4,2,1);
	this.timesAppearance[timeIdx].bind();
	this.rect.display();
	this.scene.popMatrix();



	// ------------------ time (on z+) ------------------
	let offset=0;
	for(let i=0; i<6; i++){
		this.scene.pushMatrix(); //hours 1
		this.scene.translate(offset,0,0.51);
		this.scene.scale(1.5,1,1);
		this.applyNumber(i,timeIdx);
		this.rect.display();
		this.scene.popMatrix();
		offset+=2;
		if(i%2 == 1)
			offset+=1;
	}


	// ------------------ time points (on z+) ------------------
	for(let i=0; i<=1; i++) {
		this.scene.pushMatrix();
		this.scene.translate(3.5+5*i,0,0.51);
		this.scene.scale(0.5,1,1);
		this.twoDotsAppearance.bind();
		this.rect.display();
		this.scene.popMatrix();
	}

	//this.scene.popMatrix();
}

MyInfoMarker.prototype.displayScore = function(player){
	let number=1;
	if(player.getName() == 'whitePlayer')
		number = 0;
	// ------------------ "player score" (on z+) ------------------
	this.scene.pushMatrix();
	this.scene.translate(0,2,0.51);
	this.scene.scale(7,3,1);
	if(player.getName() == this.game.getCurrentPlayerStr())
		this.playersSelectedAppearance[number].bind();
	else
		this.playersAppearance[number].bind();
	this.rect.display();
	this.scene.popMatrix();

	// ------------------ score (on z+) ------------------
	let score = player.getScore();

	this.scene.pushMatrix();
	this.scene.translate(0,-0.5,0.51);
	this.scene.scale(1.5,1,1);
	this.numbersTextures[score].bind();
	this.rect.display();
	this.scene.popMatrix();


	this.scene.pushMatrix();
	this.scene.translate(0,-2.5,0.51);
	this.scene.scale(1.5,1,1);
	this.numbersTextures[score].bind();
	this.rect.display();
	this.scene.popMatrix();
}

MyInfoMarker.prototype.updateTime = function(time) {
	let timeS = Math.trunc(time);
	this.times[0].seconds = timeS % 60;

	let timeM = (timeS - this.times[0].seconds)/60;
	this.times[0].minutes = timeM % 60;

	this.times[0].hours=(timeM - this.times[0].minutes)/60;

	if(this.game.getTimeout() > 0){
		timeS = Math.trunc(this.game.getTimeout());
		this.times[1].seconds = timeS % 60;

		timeM = (timeS - this.times[1].seconds)/60;
		this.times[1].minutes = timeM % 60;

		this.times[1].hours=(timeM - this.times[1].minutes)/60;
	}
}

MyInfoMarker.prototype.applyNumber = function(n,timeIdx){

	let number;
	switch(n){
	case 0:
		number = Math.trunc(this.times[timeIdx].hours / 10);
		break;
	case 1:
		number = this.times[timeIdx].hours % 10;
		break;
	case 2:
		number = Math.trunc(this.times[timeIdx].minutes / 10);
		break;
	case 3:
		number = this.times[timeIdx].minutes % 10;
		break;
	case 4:
		number = Math.trunc(this.times[timeIdx].seconds / 10);
		break;
	case 5:
		number = this.times[timeIdx].seconds % 10;
		break;
	}
	this.numbersTextures[number].bind();
}
