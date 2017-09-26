/**
 * MyTriangle
 * @constructor
 */
function MyTriangle(scene,side,doubleface) {
	CGFobject.call(this,scene);
	this.side = side;
	this.doubleface=doubleface;

	this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor = MyTriangle;

MyTriangle.prototype.initBuffers = function() {

	if(this.side){
		this.vertices =[
			0,0,0,			
			0,1,0,
			-1,0,0];

		this.texCoords=[
			1,0,
			0,0,
			1,1];
	}
	else{
		this.vertices = [
			0,0,0,
			1,0,0,
			0,1,0];

		this.texCoords = [
			1,0,
			0,0,
			1,1];				
	}
	this.normals = [
		0,0,1,
		0,0,1,
		0,0,1];

	this.indices = [0,1,2];

	if(this.doubleface){
		this.indices.push(1,0,2);
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};