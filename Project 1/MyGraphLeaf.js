/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
 **/

function MyGraphLeaf(graph, xmlelem, args) {
	this.graph = graph;
	this.xmlelem = xmlelem;
	this.args = args;
	this.model;

	this.create();
}

MyGraphLeaf.prototype.createRectangle=function() {
	let leftTop = [this.args[0],this.args[1]];
	let rightBottom = [this.args[2],this.args[3]];
	this.model = new MyRectangle(this.graph.scene,leftTop,rightBottom);
}

MyGraphLeaf.prototype.createCylinder=function() {
	let height = this.args[0];
	let bottom_radius = this.args[1];
	let top_radius = this.args[2];
	let stacks = this.args[3];
	let slices = this.args[4];
	let top_cap = this.args[5];
	let bottom_cap = this.args[6];

	this.model = new MyCylinder(this.graph.scene, height, bottom_radius, top_radius, stacks, slices, top_cap, bottom_cap);
}

MyGraphLeaf.prototype.createSphere=function() {
	let radius = this.args[0];
	let stacks = this.args[1];
	let slices = this.args[2];

	this.model = new MySphere(this.graph.scene, radius, stacks, slices);
}

MyGraphLeaf.prototype.createTriangle=function() {
	let p1 = [this.args[0], this.args[1], this.args[2]];
	let p2 = [this.args[3], this.args[4], this.args[5]];
	let p3 = [this.args[6], this.args[7], this.args[8]];

	this.model = new MyTriangle(this.graph.scene,true,p1,p2,p3);
}

MyGraphLeaf.prototype.createPatch=function() {
	let uDivisions = this.args[0];
	let vDivisions = this.args[1];
	let degree1 = this.args[2];
	let degree2 = this.args[3];
	let controlVertexes = this.args[4];

	this.model = new MyPatch(this.graph.scene, uDivisions, vDivisions, degree1, degree2, controlVertexes);
}

MyGraphLeaf.prototype.create=function() {
	switch(this.xmlelem){
	case 'rectangle':
		this.createRectangle();
		break;
	case 'cylinder':
		this.createCylinder();
		break;
	case 'sphere':
		this.createSphere();
		break;
	case 'triangle':
		this.createTriangle();
		break;
	case 'patch':
		this.createPatch();
		break;
	default:
		console.warn("Inexistent leaf!")
		break;
	}
}

MyGraphLeaf.prototype.display=function() {
	this.model.display();
}

MyGraphLeaf.prototype.updateTexCoords = function (amplif_factor_s, amplif_factor_t) {
	this.model.updateTexCoords(amplif_factor_s,amplif_factor_t);
}
