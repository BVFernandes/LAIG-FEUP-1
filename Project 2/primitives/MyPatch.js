/**
 * MyPatch
 * @constructor
 */
function MyPatch(scene, uDivisions, vDivisions, degree1, degree2, controlVertexes) {
	CGFobject.call(this,scene);

	let knots1 = this.getKnotsVector(degree1);
	let knots2 = this.getKnotsVector(degree2);

	let nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlVertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	this.obj = new CGFnurbsObject(this.scene, getSurfacePoint, uDivisions, vDivisions );
}

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor =MyPatch;

MyPatch.prototype.display = function() {
	this.obj.display();
}

MyPatch.prototype.updateTexCoords = function (amplif_factor_s, amplif_factor_t){
	this.updateTexCoordsGLBuffers();
}

MyPatch.prototype.getKnotsVector = function(degree) {

	let v = new Array();
	for (let i=0; i<=degree; i++) {
		v.push(0);
	}
	for (let i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
}
