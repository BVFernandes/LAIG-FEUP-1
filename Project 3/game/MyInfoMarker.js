function MyInfoMarker(scene){
	CGFobject.call(this,scene);

	this.rect = new MyRectangle(scene,[-3,3],[3,-3]);
	this.time = {hours : 0, minutes : 0, seconds : 0 };

	this.timeAppearance = new CGFappearance(this.scene);
	this.timeAppearance.loadTexture("scenes/marker/time.png");
	this.scoreAppearance = new CGFappearance(this.scene);
	this.scoreAppearance.loadTexture("scenes/marker/player_score.png");
	this.twoDotsAppearance = new CGFappearance(this.scene);
	this.twoDotsAppearance.loadTexture("scenes/marker/twodots.png");

	this.numbersTextures = [];
	for(n=0; n<=9; n++){
		let number = new CGFappearance(this.scene);
		number.loadTexture('scenes/marker/'+n+'.png');
		this.numbersTextures.push(number);
	}

	this.initTime = null;
	this.lastCurrTime = null;
	this.delta = 0;
}

MyInfoMarker.prototype = Object.create(CGFobject.prototype);
MyInfoMarker.prototype.constructor=MyInfoMarker;

MyInfoMarker.prototype.display = function () {

	this.scene.pushMatrix();
	this.scene.translate(-65,10,0);
	this.scene.rotate(Math.PI,-1,0,0);
	this.scene.rotate(Math.PI/2,0,-1,0);

	this.scene.pushMatrix(); //time
	this.scene.translate(0,6,0);
	this.displayClock();
	this.scene.popMatrix();

	this.scene.pushMatrix(); //p1 score
	this.displayScore();
	this.scene.popMatrix();

	this.scene.pushMatrix(); //p2 score
	this.scene.translate(0,-6,0);
	this.displayScore();
	this.scene.popMatrix();


	this.scene.popMatrix();
}

MyInfoMarker.prototype.displayClock = function() {
	// ------------------ "time" (on z+) ------------------
	this.scene.pushMatrix();
	this.scene.scale(3,1,1);
	this.scene.translate(-5,0,3);
	this.scene.rotate(Math.PI,0,1,0);
	this.timeAppearance.apply();
	this.rect.display();
	this.scene.popMatrix();

	// ------------------ time (on z+) ------------------
	let offset=0;
	for(let i=0; i<6; i++){
		this.scene.pushMatrix(); //hours 1
		this.scene.scale(2/5,1,1);
		this.scene.translate(3+offset,0,3);
		this.scene.rotate(Math.PI,0,1,0);
		this.applyNumber(i);
		this.rect.display();
		this.scene.popMatrix();
		offset+=6;
		if(i%2 == 1)
			offset+=4;
	}

	// ------------------ time points (on z+) ------------------
	this.twoDotsAppearance.apply();
	for(let i=0; i<=1; i++) {
		this.scene.pushMatrix();
		this.scene.scale(.25,1,1);
		this.scene.translate(23+25*i,0,3);
		this.scene.rotate(Math.PI,0,1,0);
		this.rect.display();
		this.scene.popMatrix();
	}
}

MyInfoMarker.prototype.displayScore = function(){
	// ------------------ "player score" (on z+) ------------------
	this.scene.pushMatrix();
	this.scene.scale(5,1,1);
	this.scene.translate(-.5,0,3);
	this.scene.rotate(Math.PI,0,1,0);
	this.scoreAppearance.apply();
	this.rect.display();
	this.scene.popMatrix();

	// ------------------ player number (on z+) ------------------
	this.scene.pushMatrix();
	this.scene.scale(.5,.5,1);
	this.scene.translate(-6,0,3.01);
	this.scene.rotate(Math.PI,0,1,0);
	this.numbersTextures[1].apply();
	this.rect.display();
	this.scene.popMatrix();

	// ------------------ score (on z+) ------------------
	let score=0;

	this.scene.pushMatrix();
	this.scene.scale(.5,.5,1);
	this.scene.translate(30,0,3.01);
	this.scene.rotate(Math.PI,0,1,0);
	this.numbersTextures[score].apply();
	this.rect.display();
	this.scene.popMatrix();
}

MyInfoMarker.prototype.updateTime = function(time) {
	let timeS = Math.trunc(time);
	this.time.seconds = timeS % 60;

	let timeM = (timeS - this.time.seconds)/60;
	this.time.minutes = timeM % 60;

	this.time.hours=(timeM - this.time.minutes)/60;
}

MyInfoMarker.prototype.applyNumber = function(n){
	let number;
	switch(n){
	case 0:
		number = Math.trunc(this.time.hours / 10);
		break;

	case 1:
		number = this.time.hours % 10;
		break;

	case 2:
		number = Math.trunc(this.time.minutes / 10);
		break;

	case 3:
		number = this.time.minutes % 10;
		break;

	case 4:
		number = Math.trunc(this.time.seconds / 10);
		break;

	case 5:
		number = this.time.seconds % 10;
		break;
	}
	this.numbersTextures[number].apply();
	this.rect.updateTexCoords(-6,-6);
}
