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

	this.indices = [0,1,2];

	if(this.doubleface){
		this.indices.push(1,0,2);
	}

	this.primitiveType = this.scene.gl.TRIANGLES;

	//Calculate two vectors and made the product vectorial to obtain a perpendicular vector
	let vecA=[this.p2[0]-this.p1[0],this.p2[1]-this.p1[1],this.p2[2]-this.p1[2]]; // x y z
	let vecB=[this.p3[0]-this.p1[0],this.p3[1]-this.p1[1],this.p3[2]-this.p1[2]];

	let vecProd=[vecA[1]*vecB[2]-vecA[2]*vecB[1],
		vecA[2]*vecB[0]-vecA[0]*vecB[2],
		vecA[0]*vecB[1]-vecA[1]*vecB[0]];

	this.normals =[
		vecProd[0], vecProd[1], vecProd[2],
		vecProd[0], vecProd[1], vecProd[2],
		vecProd[0], vecProd[1], vecProd[2]];

	//Distance between p1 and p2
	this.dp1p2 = Math.sqrt( Math.pow((this.p2[0] - this.p1[0]), 2) +
			Math.pow((this.p2[1] - this.p1[1]), 2) +
			Math.pow((this.p2[2] - this.p1[2]), 2));

	//Distance between p1 and p3
	this.dp1p3 = Math.sqrt( Math.pow((this.p1[0] - this.p3[0]), 2) +
			Math.pow((this.p1[1] - this.p3[1]), 2) +
			Math.pow((this.p1[2] - this.p3[2]), 2));

	//Distance between p3 and p2
	this.dp2p3 = Math.sqrt( Math.pow((this.p3[0] - this.p2[0]), 2) +
			Math.pow((this.p3[1] - this.p2[1]), 2) +
			Math.pow((this.p3[2] - this.p2[2]), 2));


	this.cos = ((this.p3[0]-this.p1[0])*(this.p2[0]-this.p1[0])+(this.p3[1]-this.p1[1])*(this.p2[1]-this.p1[2])+(this.p3[2]-this.p1[2])*(this.p2[2]-this.p1[2]))/(this.dp1p2*this.dp1p3);

	this.s_coord = this.cos*this.dp1p3;
	this.t_coord = -Math.sqrt(Math.pow(this.dp1p3,2)-Math.pow(this.s_coord,2));

	this.texCoords = [
		0, 0,
		this.dp1p2, 0,
		this.s_coord,this.t_coord,
		];


	this.initGLBuffers();
};

MyTriangle.prototype.updateTexCoords = function (amplif_factor_s, amplif_factor_t){

	this.texCoords = [
		0, 0,
		this.dp1p2/amplif_factor_s, 0,
		this.s_coord/amplif_factor_s,this.t_coord/amplif_factor_t,
		];

	this.updateTexCoordsGLBuffers();
}
