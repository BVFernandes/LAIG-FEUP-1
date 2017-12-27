MyPlayer.types = [
	"human",
	"easyBot",
	"hardBot"
	]

/**
 * MyPlayer
 * @constructor
 */

function MyPlayer(name) {
	this.name = name;
	this.regularPieces = 10;
	this.hengePieces = 2;
	this.score = 0;
	this.typeIdx = 0;
	this.type = MyPlayer.types[this.typeIdx];
}

MyPlayer.prototype = Object.create(CGFobject.prototype);
MyPlayer.prototype.constructor = MyPlayer;

MyPlayer.prototype.setPlayer = function (encodedPlayer) {
	res = encodedPlayer.split(',');
	this.regularPieces = parseInt(res[0]);
	this.hengePieces = parseInt(res[1]);
	this.score = parseInt(res[2]);
}

/**
 * Returns player number of wins
 * @returns {*}
 */
MyPlayer.prototype.getScore = function () {
	return this.score;
}


MyPlayer.prototype.getName = function () {
	return this.name;
}


MyPlayer.prototype.decreasePieces = function (type) {
	if(type == "h")
		this.hengePieces--;
	else
		this.regularPieces--;
}

/**
 * Returns isBot value that defines if the player is a bot or not
 * @returns {*}
 */
MyPlayer.prototype.isBot = function () {
	return (this.type == "easyBot" || this.type == "hardBot");
}

/**
 * Sets type value
 * @param type
 */
MyPlayer.prototype.setType = function (type) {
	this.type = type;
}

MyPlayer.prototype.toggleType = function () {
	this.typeIdx++;
	if(this.typeIdx >= MyPlayer.types.length)
		this.typeIdx = 0;
	this.type = MyPlayer.types[this.typeIdx];
}

MyPlayer.prototype.toPlString = function () {
	return "[" + this.regularPieces + "," + this.hengePieces + "," + this.score + "," + this.type + "]";
}