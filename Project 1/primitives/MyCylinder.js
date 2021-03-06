/**
 * MyCylinder
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyCylinder(scene, height, bradius, tradius, stacks, slices, tcap, bcap) {
	CGFobject.call(this,scene);

	this.height = height;
	this.bradius = bradius;
	this.tradius = tradius;
	this.tcap = tcap;
	this.bcap = bcap;
	this.circle = new MyCircle(this.scene, slices);
	this.cylinderWrap = new MyCylinderWrap(this.scene, height, bradius, tradius, slices, stacks);
}

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor =MyCylinder;

MyCylinder.prototype.display = function() {

	//Bottom Circle
	if(this.bcap){
		this.scene.pushMatrix();
		this.scene.rotate(180*DEGREE_TO_RAD, 0, 1, 0);
		this.scene.scale(this.bradius, this.bradius, 1);
		this.circle.display();
		this.scene.popMatrix();
	}

	//Top Circle
	if(this.tcap){
		this.scene.pushMatrix();
		this.scene.translate(0,0,this.height);
		this.scene.scale(this.tradius, this.tradius, 1);
		this.circle.display();
		this.scene.popMatrix();
	}

	this.cylinderWrap.display();
}

MyCylinder.prototype.updateTexCoords = function (amplif_factor_s, amplif_factor_t){
	this.updateTexCoordsGLBuffers();
}
