/**
 * MyCylinderWrap
 * @constructor
 */
function MyCylinderWrap(scene, height, bradius, tradius, slices, stacks, interior) {
	CGFobject.call(this,scene);

	this.height = height;
	this.bradius = bradius;
	this.tradius = tradius;
	this.slices = slices;
	this.stacks = stacks;
	this.interior = interior | false;

	this.initBuffers();
};

MyCylinderWrap.prototype = Object.create(CGFobject.prototype);
MyCylinderWrap.prototype.constructor = MyCylinderWrap;

MyCylinderWrap.prototype.initBuffers = function() {
	let ang = 0;
	let angnorm = Math.PI/this.slices;
	let zdelta = this.height/this.stacks; // Stack Height
	let raddelta = (this.tradius-this.bradius)/this.stacks;
	let stepRad = this.bradius;

	this.vertices = [];
	this.normals = [];
	this.indices = [];
	this.texCoords=[];

	let stepS=0;
	let stepT=0;
	let x1=0;
	let y1=0;

	for(let i = 0; i<this.stacks; i++){
		let ad_index = i*(this.slices+1);

		if(i == 0){
			for(j = 0; j <= this.slices; j++){
				ang = j*2*Math.PI/this.slices;

				x1 = stepRad*Math.cos(ang);
				y1 = stepRad*Math.sin(ang);

				this.vertices.push(x1,y1, i*zdelta);
				this.normals.push(x1, y1, 0);
				this.texCoords.push(stepS, stepT);

				stepS+=1/this.slices;
			}
			stepS = 0;
			stepT+= 1/this.stacks;
			stepRad+= raddelta;
		}

		for(let h = 0; h <= this.slices; h++){
			ang = h*2*Math.PI/this.slices;

			x1 = stepRad*Math.cos(ang);
			y1 = stepRad*Math.sin(ang);

			this.vertices.push(x1,y1, (i+1)*zdelta);
			this.normals.push(x1, y1, 0);
			this.texCoords.push(stepS, stepT);
			stepS+=1/this.slices;
		}

		stepS = 0;
		stepT+= 1/this.stacks;
		stepRad+= raddelta;

		for(let k = 0; k < this.slices; k++){
			this.indices.push(k+ad_index, k+1+ad_index, k+(this.slices+1)+ad_index);
			this.indices.push(k+1+ad_index, k+(this.slices+1)+1+ad_index, k+(this.slices+1)+ad_index);

			if(this.interior){
				this.indices.push(k+(this.slices+1)+ad_index, k+1+ad_index, k+ad_index);
				this.indices.push(k+(this.slices+1)+ad_index, k+(this.slices+1)+1+ad_index, k+1+ad_index);
			}
		}
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyCylinderWrap.prototype.updateTexCoords = function (amplif_factor_s, amplif_factor_t){
	this.updateTexCoordsGLBuffers();
}
