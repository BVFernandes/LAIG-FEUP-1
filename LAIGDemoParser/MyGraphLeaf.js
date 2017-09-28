/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
**/

function MyGraphLeaf(graph, xmlelem, args) {
	this.graph = graph;
	this.xmlelem = xmlelem;
	this.args = args;
	this.model;
	
	/*
	switch(this.xlmelem){
		case 'rectangle':
			console.log("herro");
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
	*/
	if(this.xmlelem == 'rectangle')
		this.createRectangle();
	else if(this.xmlelem == 'cylinder')
		this.createCylinder();
	else if(this.xmlelem == 'sphere')
		this.createSphere();
	else if(this.xmlelem == 'triangle')
		this.createTriangle();
}

MyGraphLeaf.prototype.createRectangle=function() {	
	const p1 = [this.args[0],this.args[1]];
	const p2 = [this.args[2],this.args[3]];
	this.model = new MyRectangle(this.graph.scene,p1,p2);
}

MyGraphLeaf.prototype.createCylinder=function() {
	this.model = new MyCylinder(this.graph.scene, this.args[3], this.args[4]); 
}

MyGraphLeaf.prototype.createSphere=function() {
	this.model = new MySphere(this.graph.scene, this.args[0], this.args[1], this.args[2]);
}

MyGraphLeaf.prototype.createTriangle=function() {
	const p1 = [this.args[0], this.args[1], this.args[2]];
	const p2 = [this.args[3], this.args[3], this.args[4]];
	const p3 = [this.args[5], this.args[6], this.args[7]];
	this.model = new MyTriangle(this.graph.scene,false,p1,p2,p3);
}

MyGraphLeaf.prototype.create=function() {
	console.log("create");
	console.log(this.xlmelem);
	switch(this.xlmelem){
		case 'rectangle':
			this.createRectangle();
			console.log("herro");
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
