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
	let p1 = [this.args[0],this.args[1]];
	let p2 = [this.args[2],this.args[3]];
	this.model = new MyRectangle(this.graph.scene,p1,p2);
}

MyGraphLeaf.prototype.createCylinder=function() {
	let height = this.args[0];
	let bottom_radius = this.args[1];
	let top_radius = this.args[2];
	let slices = this.args[3];
	let stacks = this.args[4];
	let top_cap = this.args[5];
	let bottom_cap = this.args[6];

	this.model = new MyCylinder(this.graph.scene, height, bottom_radius, top_radius, slices, stacks, top_cap, bottom_cap);
}

MyGraphLeaf.prototype.createSphere=function() {
	let radius = this.args[0];
	let slices = this.args[1];
	let stacks = this.args[2];

	this.model = new MySphere(this.graph.scene, radius, slices, stacks);
}

MyGraphLeaf.prototype.createTriangle=function() {
	const p1 = [this.args[0], this.args[1], this.args[2]];
	const p2 = [this.args[3], this.args[4], this.args[5]];
	const p3 = [this.args[6], this.args[7], this.args[8]];
	this.model = new MyTriangle(this.graph.scene,true,p1,p2,p3);
}

MyGraphLeaf.prototype.create=function() {
	console.log(this.xmlelem);
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
	}
}

MyGraphLeaf.prototype.display=function() {
	this.model.display();
}

MyGraphLeaf.prototype.updateTexCoords = function (amplif_factor_s, amplif_factor_t) {
	this.model.updateTexCoords(amplif_factor_s,amplif_factor_t);
}
