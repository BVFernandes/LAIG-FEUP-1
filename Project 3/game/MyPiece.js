/**
 * MyPiece
 * @constructor
 */
function MyPiece(scene, x, z) {
    CGFobject.call(this,scene);
    this.scene = scene;

    this.x = x;
    this.z = z;

    this.object = new MyRegularPiece(this.scene);

    this.isSelected = false;
}

MyPiece.prototype = Object.create(CGFobject.prototype);
MyPiece.prototype.constructor = MyPiece;

/**
 * Displays a MyPiece
 */
MyPiece.prototype.display = function () {
    this.scene.pushMatrix();
    this.scene.translate(this.x, 0.5, this.z);
    // if(this.isSelected)
    //     this.scene.setActiveShader(this.scene.nodes.selectedShader);
    // if(this.animation != null){
    //     this.scene.multMatrix(this.animation.getMatrix(this.timer));
    // }
    this.object.display();
    // if(this.isSelected)
    //     this.scene.setActiveShader(this.scene.defaultShader);
    this.scene.popMatrix();
}

/**
 * Sets MyPiece actual tile
 * @param tile
 */
MyPiece.prototype.setTile = function (tile) {
    this.tile = tile;
}

/**
 * Returns actual tile
 * @returns {null|*}
 */
MyPiece.prototype.getTile = function () {
    return this.tile;
}

/**
 * Returns MyPiece colour, blue or red
 * @returns {*}
 */
MyPiece.prototype.getColour = function () {
    return this.colour;
}

/**
 * Returns MyPiece type, Node or Unit
 * @returns {*}
 */
MyPiece.prototype.getType = function () {
    return this.type;
}

/**
 * Returns MyPiece name used in the board
 * @returns {*}
 */
MyPiece.prototype.getUnit = function () {
    return this.unit;
}

/**
 * Sets the selected value
 */
MyPiece.prototype.setSelected = function (value) {
    this.isSelected=value;
}

/**
 * Sets MyPiece animation
 * @param animation
 */
MyPiece.prototype.setAnimation = function(animation) {
    this.animation = animation;
    if (animation==null)
        this.timer=null;
}
