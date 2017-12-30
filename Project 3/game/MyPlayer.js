MyPlayer.types = [
	"human",
	"easyBot",
	"hardBot"
	]

/**
 * MyPlayer
 * @constructor
 */
function MyPlayer(name, x, z) {
	this.name = name;

	this.regularPieces = 10;
	this.hengePieces = 2;

	this.score = 0;
	this.stackPos = [x,z];
	this.stackHeight = 0;

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
 * Returns current score
 */
MyPlayer.prototype.getScore = function () {
	return this.score;
}

/**
 * Returns name
 */
MyPlayer.prototype.getName = function () {
	return this.name;
}

/**
 * Decreases the current number of pieces according to @param type
 * @param type
 */
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
 * Returns type value
 */
MyPlayer.prototype.getType = function () {
	return this.type;
}

/**
 * Returns type pointer
 */
MyPlayer.prototype.getTypeIdx = function () {
	return this.typeIdx;
}

/**
 * Sets type value
 * @param type
 */
MyPlayer.prototype.setType = function (type) {
	this.type = type;
}

/**
 * Sets type value and type pointer
 * @param type
 */
MyPlayer.prototype.setTypePlayer = function (type) {
	this.type = MyPlayer.types[type];
	this.typeIdx = type;
}

/**
 * Toggle between player types
 */
MyPlayer.prototype.toggleType = function () {
	this.typeIdx++;
	if(this.typeIdx >= MyPlayer.types.length)
		this.typeIdx = 0;
}

/**
 * Returns available stack position
 */
MyPlayer.prototype.getStackPos = function () {
	let pos = [this.stackPos[0], this.stackPos[1], this.stackHeight];
	this.stackHeight += 1;
	return pos;
}

/**
 * Decreases stack height
 */
MyPlayer.prototype.decStack = function () {
	this.stackHeight -= 1;
}

/**
 * Resets stack to initial height
 */
MyPlayer.prototype.resetStack = function () {
	this.stackHeight = 0;
}

/**
 * Returns enconded player in prolog format
 */
MyPlayer.prototype.toPlString = function () {
	return "[" + this.regularPieces + "," + this.hengePieces + "," + this.score + "," + this.type + "]";
}
