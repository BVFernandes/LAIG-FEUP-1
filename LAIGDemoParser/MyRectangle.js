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
	this.vertices = [
				this.leftTop[0], 0, this.leftTop[1],
				this.rightBottom[0], 0, this.leftTop[1],
				this.leftTop[0], 0, this.rightBottom[1],
				this.rightBottom[0], 0, this.rightBottom[1]
			];

	this.indices = [
           0,1,2,
		   1,3,2
        ];
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};