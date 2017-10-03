/**
 * MySphere
 * @constructor
 */
function MySphere(scene, radius, slices, stacks) {
	CGFobject.call(this,scene);

	this.slices = slices;
	this.stacks = stacks;
	this.radius = radius;

	this.initBuffers();
};

MySphere.prototype = Object.create(CGFobject.prototype);
MySphere.prototype.constructor = MySphere;

MySphere.prototype.initBuffers = function() {
	this.vertices = [];
	this.normals = [];
	this.texCoords = [];
	this.indices = [];
	for (var latNumber = 0; latNumber <= this.stacks; latNumber++) {
		var theta = latNumber * Math.PI / this.stacks;
		var sinTheta = Math.sin(theta);
		var cosTheta = Math.cos(theta);

		for (var longNumber = 0; longNumber <= this.slices; longNumber++) {
			var phi = longNumber * 2 * Math.PI / this.slices;
			var sinPhi = Math.sin(phi);
			var cosPhi = Math.cos(phi);

			var x = sinPhi*sinTheta;
			var z = cosPhi*sinTheta;
			var y = cosTheta;

			var u = 1 - (longNumber / this.slices);
			var v = 1 - (latNumber / this.stacks);

			this.normals.push(x);
			this.normals.push(y);
			this.normals.push(z);
			this.texCoords.push(u);
			this.texCoords.push(v);
			this.vertices.push(this.radius * x);
			this.vertices.push(this.radius * y);
			this.vertices.push(this.radius * z);
		}
	}

	for (var latNumber = 0; latNumber < this.stacks; latNumber++) {
		for (var longNumber = 0; longNumber < this.slices; longNumber++) {
			var first = (latNumber * (this.slices + 1)) + longNumber;
			var second = first + this.slices + 1;
			this.indices.push(first);
			this.indices.push(second);
			this.indices.push(first + 1);

			this.indices.push(second);
			this.indices.push(second + 1);
			this.indices.push(first + 1);
		}
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MySphere.prototype.updateTexCoords = function (length_s, length_t){}

/*
function MySphere(scene,radius,slices,stacks) {
	CGFobject.call(this,scene);

	this.radius = radius;
	this.hSphere = new MyHalfSphere(this.scene,slices, stacks);
}

MySphere.prototype = Object.create(CGFobject.prototype);
MySphere.prototype.constructor =MySphere;

MySphere.prototype.display = function() {

	//Front Half Sphere
	this.scene.pushMatrix();
	this.scene.scale(this.radius, this.radius, this.radius);
	this.hSphere.display();
	this.scene.popMatrix();

	//Back Half Sphere
	this.scene.pushMatrix();
	this.scene.rotate(180*DEGREE_TO_RAD,0,1,0);
	this.scene.scale(this.radius, this.radius, this.radius);
	this.hSphere.display();
	this.scene.popMatrix();	
}

MySphere.prototype.updateTexCoords = function (amplif_factor_s, amplif_factor_t){
	//this.hSphere.updateTexCoords(amplif_factor_s,amplif_factor_t);
	this.updateTexCoordsGLBuffers();
}
 */