/**
 * MyGraphNode class, representing an intermediate node in the scene graph.
 * @constructor
 **/

function MyGraphNode(graph, nodeID) {
	this.graph = graph;
	this.scene = graph.scene;
	this.nodeID = nodeID;

	// IDs of child nodes.
	this.children = [];

	// IDs of child nodes.
	this.leaves = [];

	// The material ID.
	this.materialID = null ;

	// The texture ID.
	this.textureID = null ;

	// IDs of animations
	this.animationsID = [];
	this.animationIndex = -1;

	this.transformMatrix = mat4.create();
	mat4.identity(this.transformMatrix);
}

MyGraphNode.prototype = Object.create(CGFobject.prototype);
MyGraphNode.prototype.constructor = MyGraphNode;

/**
 * Adds the reference (ID) of another node to this node's children array.
 */
MyGraphNode.prototype.addChild = function(nodeID) {
	this.children.push(nodeID);
}

/**
 * Adds a leaf to this node's leaves array.
 */
MyGraphNode.prototype.addLeaf = function(leaf) {
	this.leaves.push(leaf);
}

/**
 * Adds the reference (ID) of another node to this node's children array.
 */
MyGraphNode.prototype.addAnimation = function(animationID) {
	this.animationsID.push(animationID);
}

/**
 * This function applies the transformation the respective node and all of its children.
 * Then inherit the father material and/or texture if that's the case.
 * After this the appearance with the right texutre and material is applied.
 * Then, each child primitive is displayed as well each child node.
 * By iterating each children nodes and starting with the root node, this function goes through
 * the scene graph and displays each object.
 * @param  {[Texture]} currTextureID father texture
 * @param  {[Material]} currMaterialID father material
 */
MyGraphNode.prototype.display = function(currTextureID, currMaterialID) {

	this.scene.pushMatrix();
	this.scene.multMatrix(this.transformMatrix);

	if(this.animationsID.length > 0){

		/*
		if(this.animationIndex != 1){
			console.log(this.graph.animations.length);
			console.log(this.graph.animations[this.animationsID[0]]);
			console.log(this.graph.animations[this.animationsID[0]].getMatrix());
		}
		*/
		this.animationIndex =1;
		let matrix = this.graph.animations[this.animationsID[0]].getMatrix();
		this.scene.multMatrix(matrix);
	}

	var newTextureID = this.textureID;
	var newMaterialID = this.materialID;

	if(newMaterialID == "null")
		newMaterialID = currMaterialID;

	if(newTextureID == "null"){
		if(currTextureID != "null"){
			newTextureID = currTextureID;
		}
	}

	this.displayLeaves(newTextureID,newMaterialID);

	for(var j=0;j < this.children.length; j++){
		this.graph.nodes[this.children[j]].display(newTextureID,newMaterialID);
	}

	this.scene.popMatrix();
}

MyGraphNode.prototype.displayLeaves = function(newTextureID, newMaterialID) {

	if(newMaterialID != null && newMaterialID != "null")
		this.graph.materials[newMaterialID].apply();

	if(newTextureID != "clear" && newTextureID != null)
		this.graph.textures[newTextureID][0].bind();

	for(var i=0;i < this.leaves.length;i++){
		if(newTextureID != "clear" && newTextureID != null){
			this.leaves[i].updateTexCoords(this.graph.textures[newTextureID][1],this.graph.textures[newTextureID][2]);
		}
		this.leaves[i].display();
	}
}
