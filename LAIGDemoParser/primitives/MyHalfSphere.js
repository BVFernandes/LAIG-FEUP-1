/**
 *MyHalfSphere
 * @constructor
 */
function MyHalfSphere(scene, slices, stacks, texTop) {
	CGFobject.call(this,scene);

	this.slices = slices;
	this.stacks = stacks;
	this.texTop = texTop | false;

	this.initBuffers();
};

MyHalfSphere.prototype = Object.create(CGFobject.prototype);
MyHalfSphere.prototype.constructor =MyHalfSphere;

MyHalfSphere.prototype.initBuffers = function() {

	ang = 0;
	ang_aux=0;
	angnorm = Math.PI/this.slices;
	z = 1;
	zdelta = z/this.stacks; // Stack Height

	this.vertices = [];
	this.normals = [];
	this.indices = [];
	this.texCoords = [];

	var stepS=0;
	var stepT=0;

	for(i = 0; i<=this.stacks; i++){
		ad_index = i*(this.slices+1);
		ang_aux = i*(Math.PI/2)/this.stacks;

		if(i == 0){
			for(j = 0; j <= this.slices; j++){
				ang = j*2*Math.PI/this.slices;

				this.vertices.push(Math.cos(ang)*Math.cos(ang_aux), Math.sin(ang)*Math.cos(ang_aux), Math.sin(ang_aux));
				this.normals.push(Math.cos(ang)*Math.cos(ang_aux), Math.sin(ang)*Math.cos(ang_aux),Math.sin(ang_aux));

				if(!this.texTop){
					this.texCoords.push(stepS, stepT);
					stepS+=1/this.slices;
				}
				else{
					this.texCoords.push((1+Math.cos(ang)*Math.cos(ang_aux))/2, (1-Math.sin(ang)*Math.cos(ang_aux))/2);
				}
			}

			if(!this.texTop){
				stepS = 0;
				stepT+= 1/this.stacks;
			}
		}

		for(h = 0; h <= this.slices; h++){
			ang = h*2*Math.PI/this.slices;

			this.vertices.push(Math.cos(ang)*Math.cos(ang_aux), Math.sin(ang)*Math.cos(ang_aux), Math.sin(ang_aux));
			this.normals.push(Math.cos(ang)*Math.cos(ang_aux), Math.sin(ang)*Math.cos(ang_aux),Math.sin(ang_aux));

			if(!this.texTop){
				this.texCoords.push(stepS, stepT);
				stepS+=1/this.slices;
			}
			else{
				this.texCoords.push((1+Math.cos(ang)*Math.cos(ang_aux))/2, (1-Math.sin(ang)*Math.cos(ang_aux))/2);
			}
		}

		if(!this.texTop){
			stepS = 0;
			stepT+= 1/this.stacks;
		}

		for(k = 0; k < this.slices; k++){
			this.indices.push(k+ad_index, k+1+ad_index, k+(this.slices+1)+ad_index);
			this.indices.push(k+1+ad_index, k+(this.slices+1)+1+ad_index, k+(this.slices+1)+ad_index);
		}
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyHalfSphere.prototype.updateTexCoords = function (amplif_factor_s, amplif_factor_t){}