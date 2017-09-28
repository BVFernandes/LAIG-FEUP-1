/**
 * MyTriangle
 * @constructor
 */
function MyTriangle(scene,doubleface,p1,p2,p3) {
	CGFobject.call(this,scene);
	this.doubleface=doubleface;
	this.p1=p1;
	this.p2=p2;
	this.p3=p3;

	this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor = MyTriangle;

MyTriangle.prototype.initBuffers = function() {
	this.vertices =[
		this.p1[0],this.p1[1],this.p1[2],			
		this.p2[0],this.p2[1],this.p2[2],	
		this.p3[0],this.p3[1],this.p3[2]];
	
	
	this.texCoords = [
			1,0,
			0,0,
			1,1];
	
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