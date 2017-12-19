/**
 * Player
 * @constructor
 */

function Player(type) {
	this.hengePieces = 3;
	this.regularPieces = 10;
	this.score = 0;
	this.type = type;
}

Player.prototype = Object.create(CGFobject.prototype);
Player.prototype.constructor = Player;


Player.prototype.toPlString = function () {
    return "[" + this.regularPieces + "," + this.hengePieces + "," + this.score + "," + this.type + "]";
}

/**
 * Returns player number of wins
 * @returns {*}
 */
Player.prototype.getScore = function () {
    return this.score;
}

/**
 * Returns isBot value that defines if the player is a bot or not
 * @returns {*}
 */
Player.prototype.getIsBot = function () {
    return (this.type == "easyBot" || type == "hardBot");
}

/**
 * Sets type value
 * @param type
 */
Player.prototype.setType = function (type) {
    this.type = type;
}