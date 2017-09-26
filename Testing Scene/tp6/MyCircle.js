/**
 * MyCircle
 * @constructor
 */
function MyCircle(scene, slices) {
	CGFobject.call(this,scene);

	this.slices = slices;

	this.initBuffers();
};

MyCircle.prototype = Object.create(CGFobject.prototype);
MyCircle.prototype.constructor = MyCircle;

MyCircle.prototype.initBuffers = function() {

	ang = 0;
	this.vertices = [];
	this.normals = [];
	this.indices = [];
	this.texCoords=[];

	for(h = 0; h <= this.slices; h++){
		ang = h*2*Math.PI/this.slices;

		this.vertices.push(Math.cos(ang), Math.sin(ang), 0);

		this.normals.push(0, 0, 1);

		this.texCoords.push((1+Math.cos(ang))/2,(1-Math.sin(ang))/2);
	}

	this.vertices.push(0,0,0);
	this.normals.push(0,0,1);
	this.texCoords.push(0.5,0.5);

	for(k = 0; k < this.slices; k++){
		this.indices.push(k, k+1, this.slices);
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
