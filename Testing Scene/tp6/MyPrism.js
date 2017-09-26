/**
 * MyPrism
 * @constructor
 */
function MyPrism(scene, slices, stacks) {
	CGFobject.call(this,scene);

	this.slices = slices;
	this.stacks = stacks;

	this.initBuffers();
};

MyPrism.prototype = Object.create(CGFobject.prototype);
MyPrism.prototype.constructor = MyPrism;

MyPrism.prototype.initBuffers = function() {
	ang = 0;
	angnorm = Math.PI/this.slices;
	z = 1;
	zdelta = z/this.stacks; //Stack Height

	this.vertices = [];
	this.normals = [];
	this.indices = [];

	for(i = 0; i<this.stacks; i++){
		ad_index = i*2*this.slices;

		if(i == 0){
			for(j = 0; j < this.slices; j++){
				ang = j*2*Math.PI/this.slices;

				this.vertices.push(Math.cos(ang), Math.sin(ang), i*zdelta);
				this.vertices.push(Math.cos(ang), Math.sin(ang), i*zdelta);

				angnorma1 = ang+angnorm;
				angnorma2 = ang-angnorm;

				x1 = Math.cos(angnorma1);
				y1 = Math.sin(angnorma1);
				x2 = Math.cos(angnorma2);
				y2 = Math.sin(angnorma2);

				this.normals.push(x2, y2, 0);
				this.normals.push(x1, y1, 0);
			}
		}

		for(h = 0; h < this.slices; h++){
			ang = h*2*Math.PI/this.slices;

			this.vertices.push(Math.cos(ang), Math.sin(ang), (i+1)*zdelta);
			this.vertices.push(Math.cos(ang), Math.sin(ang), (i+1)*zdelta);

			angnorma1 = ang+angnorm;
			angnorma2 = ang-angnorm;

			x1 = Math.cos(angnorma1);
			y1 = Math.sin(angnorma1);
			x2 = Math.cos(angnorma2);
			y2 = Math.sin(angnorma2);

			this.normals.push(x2, y2, 0);
			this.normals.push(x1, y1, 0);
		}

		for(k = 0; k < this.slices-1; k++){
			this.indices.push(2*k+1+ad_index, 2*k+2+ad_index, 2*k+2*this.slices+1+ad_index);
			this.indices.push(2*k+2+ad_index, 2*k+2*this.slices+2+ad_index, 2*k+2*this.slices+1+ad_index);
		}

		this.indices.push(2*this.slices-1+ad_index, ad_index, 4*this.slices-1+ad_index);
		this.indices.push(ad_index, 2*this.slices+ad_index, 4*this.slices-1+ad_index);
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
