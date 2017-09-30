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

	//Distance between p1 and p2
	this.a = Math.sqrt( Math.pow((this.p2[0] - this.p1[0]), 2) +
			Math.pow((this.p2[1] - this.p1[1]), 2) +
			Math.pow((this.p2[2] - this.p1[2]), 2));

	//Distance between p1 and p3
	this.b = Math.sqrt( Math.pow((this.p1[0] - this.p3[0]), 2) +
			Math.pow((this.p1[1] - this.p3[1]), 2) +
			Math.pow((this.p1[2] - this.p3[2]), 2));

	//Distance between p3 and p2
	this.c = Math.sqrt( Math.pow((this.p3[0] - this.p2[0]), 2) +
			Math.pow((this.p3[1] - this.p2[1]), 2) +
			Math.pow((this.p3[2] - this.p2[2]), 2));

	this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor = MyTriangle;

MyTriangle.prototype.initBuffers = function() {

	this.vertices =[
		this.p1[0],this.p1[1],this.p1[2],			
		this.p2[0],this.p2[1],this.p2[2],	
		this.p3[0],this.p3[1],this.p3[2]];

	this.indices = [0,1,2];

	if(this.doubleface){
		this.indices.push(1,0,2);
	}

	this.primitiveType = this.scene.gl.TRIANGLES;

	//Usar funções do math javascript?

	var vecA=[this.p2[0]-this.p1[0],this.p2[1]-this.p1[1],this.p2[2]-this.p1[2]]; // x y z 
	var vecB=[this.p3[0]-this.p1[0],this.p3[1]-this.p1[1],this.p3[2]-this.p1[2]];

	var vecProd=[vecA[1]*vecB[2]-vecA[2]*vecB[1],
		vecA[2]*vecB[0]-vecA[0]*vecB[2],
		vecA[0]*vecB[1]-vecA[1]*vecB[0]];

	this.normals =[
		vecProd[0], vecProd[1], vecProd[2],
		vecProd[0], vecProd[1], vecProd[2],
		vecProd[0], vecProd[1], vecProd[2]];


	//Bugs on texture, needed to review some trignometry
	/*
	 * Lei dos cossenos
	 * c² = a² + b² – 2ab.cos C
	 * a² = b² + c² – 2bc.cos A
	 * b² = a² + c² – 2ac.cos B
	 */
	var cosTeta = (Math.pow(this.c,2)-Math.pow(this.a,2)-Math.pow(this.b,2))/(-2*this.a*this.b);
	var Teta = Math.acos(cosTeta);

	
	this.texCoords = [
		(this.a/15.0),0,
		0,0,
		(Math.cos(Teta)*this.b /15.0 ),(Math.sin(Teta)*this.b/10.0)
		];
	
	
	/*
	  this.texCoords = [
			1,0,
			0,0,
			1,1];
	 */

	this.initGLBuffers();
};

MyTriangle.prototype.updateTexCoords = function (amplif_factor_s, amplif_factor_t){
	this.texCoords = [
		(this.c - this.a * Math.cos(this.b))/amplif_factor_s, this.a * Math.sin(this.b)/amplif_factor_t,
		0, 0,
		this.c/amplif_factor_s, 0
		];

	this.updateTexCoordsGLBuffers();
}