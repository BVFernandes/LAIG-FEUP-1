/**
 * MyRectangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyRectangle(scene, leftTop, rightBottom) {
	CGFobject.call(this,scene);

	this.leftTop=leftTop;
	this.rightBottom=rightBottom;
	this.initBuffers();
};

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor=MyRectangle;

MyRectangle.prototype.initBuffers = function () {

	/*
	 *	3_____________4
	 *	 |					 |
	 *	 |					 |
	 *	1|___________|2
	 * */

	this.vertices = [
		this.leftTop[0], this.rightBottom[1],0,
		this.rightBottom[0], this.rightBottom[1],0,
		this.leftTop[0], this.leftTop[1],0,
		this.rightBottom[0], this.leftTop[1],0
		];

	this.indices = [
		0, 1, 2,
		3, 2, 1
		];

	this.primitiveType = this.scene.gl.TRIANGLES;

	this.normals = [
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
		0, 0, 1
		];


	this.maxS=(this.rightBottom[0]-this.leftTop[0]); // delta x
	this.maxT=(this.leftTop[1]-this.rightBottom[1]); // delta y

	this.texCoords = [
		0,0,
		this.maxS,0,
		0,this.maxT,
		this.maxS,this.maxT
		];

	this.initGLBuffers();
};


MyRectangle.prototype.updateTexCoords = function (amplif_factor_s, amplif_factor_t){
	let UmaxS=this.maxS/amplif_factor_s; // delta x
	let UmaxT=this.maxT/amplif_factor_t; // delta y

	this.texCoords = [
		0,0,
		UmaxS,0,
		0,UmaxT,
		UmaxS,UmaxT
		];

	this.updateTexCoordsGLBuffers();
}
