function MyCylinder(scene, height, bradius, tradius, slices, stacks) {
	CGFobject.call(this,scene);

	this.height = height;
	this.bradius = bradius;
	this.traduis = tradius;
	this.circle = new MyCircle(this.scene, slices);
	this.cylinderWrap = new MyCylinderWrap(this.scene, height, bradius, tradius, slices, stacks);
}

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor =MyCylinder;

MyCylinder.prototype.display = function() {

	//Bottom Circle
	this.scene.pushMatrix();
	this.scene.rotate(180*DEGREE_TO_RAD, 0, 1, 0);
	this.scene.scale(this.bradius, this.bradius, 1);
	this.circle.display();
	this.scene.popMatrix();

	//Top Circle
	this.scene.pushMatrix();
	this.scene.translate(0,0,this.height);
	this.scene.scale(this.bradius, this.bradius, 1);
	this.circle.display();
	this.scene.popMatrix();

	this.cylinderWrap.display();
}

MyCylinder.prototype.updateTexCoords = function (amplif_factor_s, amplif_factor_t){
	//this.hSphere.updateTexCoords(amplif_factor_s,amplif_factor_t);
	this.updateTexCoordsGLBuffers();
}