/**
 * MySphere
 * @constructor
 */
function MySphere(scene,radius,slices,stacks) {
	CGFobject.call(this,scene);

	this.radius = radius;
	this.hSphere = new MyHalfSphere(this.scene,slices, stacks);
}

MySphere.prototype = Object.create(CGFobject.prototype);
MySphere.prototype.constructor =MySphere;

MySphere.prototype.display = function() {

	//Main Cube
	this.scene.pushMatrix();
	this.scene.scale(this.radius, this.radius, this.radius);
	this.hSphere.display();
	this.scene.popMatrix();

	//Left Triangle
	//Front
	this.scene.pushMatrix();
	this.scene.rotate(180*DEGREE_TO_RAD,0,1,0);
	this.scene.scale(this.radius, this.radius, this.radius);
	this.hSphere.display();
	this.scene.popMatrix();	
}

MySphere.prototype.updateTexCoords = function (amplif_factor_s, amplif_factor_t){
	

	this.updateTexCoordsGLBuffers();
}